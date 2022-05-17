import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanPage } from './components/list/loan.page';

const routes: Routes = [{ path: '', component: LoanPage }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
