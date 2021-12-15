import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDocComponent } from './components/list-doc/list-doc.component';

const routes: Routes = [
{
  path:"",
  pathMatch:"full", 
  component:ListDocComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
