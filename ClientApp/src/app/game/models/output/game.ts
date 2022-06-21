import { BaseDataOutput } from "src/app/core/models/output/base-data-output";

export class Game extends BaseDataOutput {
  userId?: string;
  playerOneId?: string;
  playerTwoId?: string;
  sets?: GameSet[]
}
export class GameSet {
  constructor(set: number) {
    this.setNumber = set;
    this.playerOnePoints = 0;
    this.playerTwoPoints = 0
  }
  setNumber: number
  playerOnePoints: number
  playerTwoPoints: number
}
