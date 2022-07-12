import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';

export class GameListOutput extends BaseApiOutput {
  games?: IntraGameOutput[];
}

export class IntraGameOutput {
  username?: string;
  playerOneName?: string;
  playerTwoName?: string;
  scoreboard?: string;
}
