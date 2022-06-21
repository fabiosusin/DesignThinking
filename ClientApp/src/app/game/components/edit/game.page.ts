import { ProviderService } from '../../../core/services/provider/provider.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Employee } from 'src/app/employees/models/output/employee';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { EmployeeFiltersInput } from 'src/app/employees/models/input/employee-list-input';
import { Game, GameSet } from '../../models/output/game';
import { GamePlayerEnum } from '../../models/enum/game-player-enum';

@Component({
  selector: 'app-game-page',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss']
})
export class GamePage implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private gameService: GameService,
    private providerService: ProviderService
  ) {
  }

  currentSet: number = 1;
  allSets: GameSet[] = []
  data: Game = new Game();
  form?: FormGroup;
  players?: Employee[]
  observablePlayerOne?: Observable<string[]>;
  observablePlayerTwo?: Observable<string[]>;
  employees: Employee[] = [];
  isLoading?: boolean;

  async ngOnInit() {
    this._assignForm();
    this.getData();

    for (let i = 0; i < 5; i++)
      this.allSets.push(new GameSet(i + 1))
  }

  getData = async () => {
    const result = await this.employeeService.getList(new EmployeeFiltersInput())
    if (!result.success) {
      this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Jogadores!')
      return;
    }

    this.players = result.employees ?? [];
    this.observablePlayerOne = this.form!.get('playerOneName')?.valueChanges.pipe(startWith(''), map((value: any) => this._filter(value)));
    this.observablePlayerTwo = this.form!.get('playerTwoName')?.valueChanges.pipe(startWith(''), map((value: any) => this._filter(value)));
  }

  onClickPoint = (player: GamePlayerEnum) => {
    if (!this.data.sets)
      this.data.sets = [];

    let set = this.allSets.find(x => x.setNumber == this.currentSet);
    if (player == GamePlayerEnum.PlayerOne && set?.playerOnePoints == 29) {
      set!.playerOnePoints!++;
      this.currentSet++;
      this.data.sets.push(set);
      set = this.allSets.find(x => x.setNumber == this.currentSet);
      set!.playerOnePoints!++;
    }

    if (player == GamePlayerEnum.PlayerTwo && set?.playerTwoPoints == 29) {
      set!.playerTwoPoints!++;
      this.currentSet++;
      this.data.sets.push(set);
      set = this.allSets.find(x => x.setNumber == this.currentSet);
      set!.playerTwoPoints!++;
    }

    if (player == GamePlayerEnum.PlayerOne)
      set!.playerOnePoints!++;

    if (player == GamePlayerEnum.PlayerTwo)
      set!.playerTwoPoints!++;

    if (set?.playerOnePoints! < 21 && set?.playerTwoPoints! < 21)
      return;

    if (this._diff(set?.playerOnePoints!, set?.playerTwoPoints!) >= 2) {
      this.currentSet++;
      this.data.sets.push(set!);
      set = this.allSets.find(x => x.setNumber == this.currentSet);
    }
  }

  private _diff = (points: number, points2: number) => points > points2 ? points - points2 : points2 - points;

  onSubmit = async () => {
    if (!this.form?.valid) {
      this.providerService.toast.warningMessage('Informe os campos corretamente!')
      return;
    }

    try {
      this.data.playerOneId = this.players!.find(x => x.name == this.form!.get('playerOneName')?.value)?.id;
      this.data.playerTwoId = this.players!.find(x => x.name == this.form!.get('playerTwoName')?.value)?.id;

      this.isLoading = true;
      const result = await this.gameService.finishGame(this.data);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar salvar o Jogo!')
        return;
      }


    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar salvar o Jogo!')
    }
    finally {
      this.isLoading = false;
    }
  }

  private _filter = (value: string): string[] => this.players!.filter(option => option.name?.toLowerCase().includes(value.toLowerCase())).map(x => x.name ?? '');

  private _assignForm = async () => {
    this.form = this.formBuilder.group({
      playerOneName: [],
      playerTwoName: []
    });
  };
}
