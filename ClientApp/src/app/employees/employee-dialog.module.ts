import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '../core/modules/app-common.module';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { EmployeeDialog } from './components/edit/employee.dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AppCommonModule
  ],
  exports: [EmployeeDialog],
  declarations: [EmployeeDialog],
  entryComponents: [EmployeeDialog]
})
export class EmployeeDialogPageModule { }
