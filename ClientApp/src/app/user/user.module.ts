import { AppCommonModule } from '../core/modules/app-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user.routing';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { UserPage } from './components/list/user.page';
import { UserDialog } from './components/edit/user.dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    AppMaterialModule,
    AppCommonModule
  ],
  exports: [UserDialog],
  declarations: [UserPage, UserDialog],
  entryComponents: [UserDialog]
})
export class UserPageModule { }
