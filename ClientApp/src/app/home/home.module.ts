import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './components/home.page';
import { HomeRoutingModule } from './home.routing';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { AppCommonModule } from '../core/modules/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule, 
    AppMaterialModule,
    AppCommonModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
