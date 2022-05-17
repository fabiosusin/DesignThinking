import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentPage } from './components/list/equipment.page';

const routes: Routes = [{ path: '', component: EquipmentPage }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EquipmentRoutingModule { }
