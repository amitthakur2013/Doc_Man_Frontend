import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocManagerService } from 'src/app/services/doc-manager.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-doc',
  templateUrl: './list-doc.component.html',
  styleUrls: ['./list-doc.component.scss']
})
export class ListDocComponent implements OnInit {

  data:Array<any>;
  page:any=1;
  size:any=5;

  curr_document:any;
  curr_status:any;
  curr_doc_id:any;
  reject_reasons:any;

  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  //Search Filter Functionality payload Starts
  payload={
    customerId:null,
    status:"wip",
    docType:"udyam",
    fromDate:null,
    toDate:null
  }
  todayDate=new Date().toISOString().split('T')[0];
  //Search Filter Functionality payload Ends

  constructor(private dms:DocManagerService, private modalService: NgbModal) {
    this.data=new Array<any>();

   }

  ngOnInit(): void {
    this.getRecords();
  }

  // search filter starts

  exportToExcel() {

    const readyToExport = [];

    this.data.map((d) => {
      var data_format={
        "Customer Id":d['customerId'],
        "Document Type":d['docType'].toUpperCase(),
        "Document No":d['docCorrespondingNumber'],
        "Uploaded On":new Date(d['uploadTime']).toLocaleDateString(),
        "Status":d['status'].toUpperCase(),
        "Remarks":d['rejectReasons']
      }
      readyToExport.push(data_format);
    });

    const workBook = XLSX.utils.book_new(); 
    const workSheet = XLSX.utils.json_to_sheet(readyToExport);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); 
    XLSX.writeFile(workBook, 'msme_doc_report.xlsx');
  }

  resetSearchFilterForm(){
    this.payload={
      customerId:null,
      status:"wip",
      docType:"udyam",
      fromDate:null,
      toDate:null
    }
    this.getRecords();
  }

  preventSpaceKey(e) { 
    var e = window.event || e;
     if (e.keyCode == 32) {
      e.preventDefault();
     }      
  }

  disableManual(){
    return false;
  }
 
  getRecords(){
    this.dms.getRecordsBySearchFilterCriteria(this.payload).subscribe(res => {
    this.data=res;
  },err => {console.log(err)})  
}

// search filter ends

  updateStatus(status:any,id:any,doc:any,updateStatusModal:any){
    this.curr_status=status;
    this.curr_doc_id=id;
    this.curr_document=doc;
    this.reject_reasons="";
    this.open(updateStatusModal);
  }

  changeStatus() {
    if (this.curr_status == "wip"){
      return;
    }
    this.curr_document.status=this.curr_status;
    this.curr_document.rejectReasons=this.reject_reasons;
    this.dms.updateDocumentStatus(this.curr_doc_id,this.curr_document).subscribe((res)=>{
      this.getRecords();
    },(err) => {
      console.log(err);
    },()=>{
      this.curr_status="wip";
      this.reject_reasons="";
    })
  }

  viewDocument(id:any,ftype:any) {
    var ftype=ftype.split(".").pop();
    if(ftype == "jpeg" || ftype == "jpg" || ftype == "png" || ftype == "bmp"){
      this.dms.viewImageDocument(id).subscribe(
        res => {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.imgByte;
          //this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
          this.retrievedImage = `data:image/${ftype};base64,` + this.base64Data;
          var win = window.open();
          win.document.write("<img src='"+this.retrievedImage+"'/>");
        }
      );
    } 
    else if(ftype == "pdf"){
      window.open(`api/view/pdf/${id}`,"_blank");
    } else {
      window.open(`api/download/file/${id}`,"_blank");  // For downloading other file types like zip which cannot be viewed
    }
  }


  downloadDocument(id:any) {
    window.open(`api/download/file/${id}`,"_blank");  // For downloading other file types like zip  
  }

  closeResult = '';

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.changeStatus();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
