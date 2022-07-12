import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePage } from './components/edit/game.page';
import { GameListPage } from './components/list/game-list.page';
import { ReportPage } from './components/report/report.page';

const routes: Routes = [{ path: '', component: GameListPage }, { path: 'report', component: ReportPage }, { path: 'new', component: GamePage }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GameRoutingModule { }
