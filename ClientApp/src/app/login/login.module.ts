import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './components/login.page';
import { LoginRoutingModule } from './login.routing';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { AppCommonModule } from '../core/modules/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    AppMaterialModule,
    AppCommonModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule { }
