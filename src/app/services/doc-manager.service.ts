import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocManagerService {

  constructor(private http:HttpClient) {
   }

  getAllPendingDocs(): Observable<any>{
    return this.http.get<any>(`api/`);
  }

  // Search Filter Functionality starts

  getRecordsBySearchFilterCriteria(payload:any): Observable<any> {
    return this.http.post(`api/criteria`,payload);
  }

  // Search Filter Functionality ends

  updateDocumentStatus(id:any,doc:any): Observable<any>{
  	return this.http.put(`api/document/${id}`,doc);
  }

  viewImageDocument(id:any): Observable<any>{
  	return this.http.get<any>(`api/view/image/${id}`);
  }


}
