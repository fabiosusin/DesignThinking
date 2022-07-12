import { ProviderService } from '../../../core/services/provider/provider.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Employee } from 'src/app/employees/models/output/employee';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { EmployeeFiltersInput } from 'src/app/employees/models/input/employee-list-input';
import { Game, GameSet, IntraPlayerGame } from '../../models/output/game';
import { GamePlayerEnum } from '../../models/enum/game-player-enum';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private gameService: GameService,
    private providerService: ProviderService
  ) {}

  currentSet?: GameSet;
  currentSetNumber: number = 1;
  allSets: GameSet[] = [];
  data: Game = new Game();
  form?: FormGroup;
  players?: Employee[];
  observablePlayerOne?: Observable<string[]>;
  observablePlayerTwo?: Observable<string[]>;
  employees: Employee[] = [];
  isLoading?: boolean;

  async ngOnInit() {
    this._assignForm();
    this.getData();
    this.data.userId = this.providerService.sessionService.getLoggedUser()?.userId;

    for (let i = 0; i < 5; i++) this.allSets.push(new GameSet(i + 1));

    this.currentSet = this.allSets[0];
  }

  getData = async () => {
    const result = await this.employeeService.getList(
      new EmployeeFiltersInput()
    );
    if (!result.success) {
      this.providerService.toast.warningMessage(
        result?.message ?? 'Ocorreu um erro ao tentar buscar os Jogadores!'
      );
      return;
    }

    this.players = result.employees ?? [];
    this.observablePlayerOne = this.form!.get(
      'playerOneName'
    )?.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
    this.observablePlayerTwo = this.form!.get(
      'playerTwoName'
    )?.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
  };

  onClickPoint = (player: GamePlayerEnum, zone: number) => {
    if (!this.data.sets) this.data.sets = [];

    this.currentSet = this.allSets.find((x) => x.setNumber == this.currentSetNumber)!;
    if (player == GamePlayerEnum.PlayerOne) {
      this.currentSet.playerOne.points++;
      this._setPlayerZonePoint(zone == 7 ? this.currentSet.playerTwo : this.currentSet.playerOne, zone);

      if (this.currentSet.playerOne.points == 30)
        this._endSet();
    }

    if (player == GamePlayerEnum.PlayerTwo) {
      this.currentSet.playerTwo.points!++;
      this._setPlayerZonePoint(zone == 7 ? this.currentSet.playerOne : this.currentSet.playerTwo, zone);

      if (this.currentSet.playerTwo.points == 30)
        this._endSet();
    }

    if (this.currentSet.playerOne.points < 21 && this.currentSet.playerTwo.points < 21) return;

    if (this._diff(this.currentSet.playerOne.points, this.currentSet.playerTwo.points) >= 2)
      this._endSet();
  };

  private _endSet = () => {
    this.currentSetNumber++;
    this.data.sets!.push(this.currentSet!);
    this.currentSet = this.allSets.find((x) => x.setNumber == this.currentSetNumber)!;
  }

  private _setPlayerZonePoint = (player: IntraPlayerGame, zone: number) => {
    switch (zone) {
      case 1:
        player.shotChart.first++;
        break;
      case 2:
        player.shotChart.second++;
        break;
      case 3:
        player.shotChart.third++;
        break;
      case 4:
        player.shotChart.fourth++;
        break;
      case 5:
        player.shotChart.fifth++;
        break;
      case 6:
        player.shotChart.sixth++;
        break;
      case 7:
        player.shotChart.errors++;
        break;
    }
  };

  private _diff = (points: number, points2: number) =>
    points > points2 ? points - points2 : points2 - points;

  onSubmit = async () => {
    if (!this.form?.valid) {
      this.providerService.toast.warningMessage(
        'Informe os campos corretamente!'
      );
      return;
    }

    try {
      this.data.playerOneId = this.players!.find(
        (x) => x.name == this.form!.get('playerOneName')?.value
      )?.id;
      this.data.playerTwoId = this.players!.find(
        (x) => x.name == this.form!.get('playerTwoName')?.value
      )?.id;

      this.isLoading = true;
      const result = await this.gameService.finishGame(this.data);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar salvar o Jogo!');
        return;
      }
      else{
        this.providerService.toast.successMessage('Jogo Finalizado com Sucesso!');
        this.providerService.route.navigateByUrl('/home');
      }
    } catch (e) {
      console.error('e => ', e);
      this.providerService.toast.errorMessage(
        'Ocorreu um erro ao tentar salvar o Jogo!'
      );
    } finally {
      this.isLoading = false;
    }
  };

  private _filter = (value: string): string[] =>
    this.players!.filter((option) =>
      option.name?.toLowerCase().includes(value.toLowerCase())
    ).map((x) => x.name ?? '');

  private _assignForm = async () => {
    this.form = this.formBuilder.group({
      playerOneName: [],
      playerTwoName: [],
    });
  };
}
