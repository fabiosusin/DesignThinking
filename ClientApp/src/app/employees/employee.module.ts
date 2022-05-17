import { AppCommonModule } from '../core/modules/app-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { EmployeePage } from './components/list/employee.page';
import { EmployeeDialogPageModule } from './employee-dialog.module';
import { EmployeeRoutingModule } from './employee.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeRoutingModule,
    AppMaterialModule,
    AppCommonModule,
    EmployeeDialogPageModule
  ],
  declarations: [EmployeePage]
})
export class EmployeePageModule { }
