import { AppCommonModule } from '../core/modules/app-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipmentRoutingModule } from './equipment.routing';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { EquipmentPage } from './components/list/equipment.page';
import { EquipmentDialog } from './components/edit/equipment.dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EquipmentRoutingModule,
    AppMaterialModule,
    AppCommonModule
  ],
  exports: [EquipmentDialog],
  declarations: [EquipmentPage, EquipmentDialog],
  entryComponents: [EquipmentDialog]
})
export class EquipmentPageModule { }
