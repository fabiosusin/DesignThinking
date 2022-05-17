import { AppCommonModule } from '../core/modules/app-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { LoanPage } from './components/list/loan.page';
import { LoanRoutingModule } from './loan.routing';
import { LoanDialog } from './components/dialogs/loan-dialog/loan.dialog';
import { DevolutionDialog } from './components/dialogs/devolution-dialog/devolution.dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoanRoutingModule,
    AppMaterialModule,
    AppCommonModule
  ],
  exports: [LoanDialog, DevolutionDialog],
  declarations: [LoanPage, LoanDialog, DevolutionDialog],
  entryComponents: [LoanDialog, DevolutionDialog]
})
export class CustomerPageModule { }
