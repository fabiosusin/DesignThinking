import { BaseDataOutput } from 'src/app/core/models/output/base-data-output';

export class Game extends BaseDataOutput {
  userId?: string;
  playerOneId?: string;
  playerTwoId?: string;
  sets?: GameSet[];
}
export class GameSet {
  constructor(set: number) {
    this.setNumber = set;
    this.playerOne = new IntraPlayerGame();
    this.playerTwo = new IntraPlayerGame();
  }
  setNumber: number;
  playerOne: IntraPlayerGame;
  playerTwo: IntraPlayerGame;
}

export class IntraPlayerGame {
  constructor() {
    this.points = 0;
    this.shotChart = new IntraGameSetShotChart();
  }
  points: number;
  shotChart: IntraGameSetShotChart;
}

export class IntraGameSetShotChart {
  constructor() {
    this.first = 0;
    this.second = 0;
    this.third = 0;
    this.fourth = 0;
    this.fifth = 0;
    this.sixth = 0;
    this.errors = 0;
  }

  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
  sixth: number;
  errors: number;
}
