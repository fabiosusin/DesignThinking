import { AppCommonModule } from '../core/modules/app-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameRoutingModule } from './game.routing';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { GamePage } from './components/edit/game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GameRoutingModule,
    AppMaterialModule,
    AppCommonModule
  ],
  declarations: [GamePage]
})
export class GamePageModule { }
