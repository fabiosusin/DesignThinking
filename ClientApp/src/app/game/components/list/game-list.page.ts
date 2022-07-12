import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { UserData } from 'src/app/core/models/output/session-output';
import { IntraGameOutput } from '../../models/output/game-list-output';
import { GameFiltersInput } from '../../models/input/employee-list-input';
import { GameFilters } from '../../models/input/employee-filters-input';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-list-page',
  templateUrl: './game-list.page.html',
  styleUrls: ['./game-list.page.scss']
})
export class GameListPage implements OnInit {
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
  displayedColumns: string[] = ['username', 'playerOneName', 'playerTwoName', 'scoreboard'];
  dataSource: IntraGameOutput[] = [];
  filters: GameFiltersInput = new GameFiltersInput();

  name?: string;

  ngOnInit(): void {
    this.pageTitleService.changePageTitle('Jogos');
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

      const result = await this.gameService.getList(this.filters)
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

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      username: [''],
      playerName: ['']
    });
  };
}
