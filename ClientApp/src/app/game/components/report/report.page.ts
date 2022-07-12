import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { UserData } from 'src/app/core/models/output/session-output';
import { IntraGameOutput } from '../../models/output/game-list-output';
import { GameFiltersInput } from '../../models/input/employee-list-input';
import { GameFilters } from '../../models/input/employee-filters-input';
import { GameService } from '../../services/game.service';
import { GameReportData } from '../../models/output/game-report-output';
import { HelperService } from 'src/app/core/services/helper/helper.service';

@Component({
  selector: 'app-report-page',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss']
})
export class ReportPage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService,
    private pageTitleService: PageTitleService,
    private providerService: ProviderService) {
  }

  form?: FormGroup;
  userSession?: UserData;
  isMasterUser: boolean = false;
  isLoading: boolean = false;
  displayedColumns: string[] = ['username', 'playerName', 'totalGames', 'totalWins', 'totalLoses', 'totalShots', 'totalHits', 'totalErrors', 'hitsPercentual'];
  dataSource: GameReportData[] = [];
  filters: GameFiltersInput = new GameFiltersInput();

  name?: string;

  ngOnInit(): void {
    this.pageTitleService.changePageTitle('Relatório');
    this.getData();
    this.assignForm();
  }

  submit = async (input: GameFilters) => {
    this.filters.filters = input
    this.getData();
  }

  getData = async () => {
    try {
      this.userSession = this.providerService.sessionService.getSession().user;
      this.isMasterUser = this.userSession?.isMasterUser ?? false;
      this.isLoading = true;

      if (!this.filters.filters)
        this.filters.filters = {};

      const result = await this.gameService.report(this.filters)
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Clientes!')

      this.dataSource = result?.games ?? [];
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar buscar os Clientes!')
    }
    finally {
      this.isLoading = false;
    }
  }

  generateReportPdf = (el: string, name: string) => HelperService.generatePDF(el, name);

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      username: [''],
      playerName: ['']
    });
  };
}
