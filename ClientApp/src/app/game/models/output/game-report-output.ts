import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';

export class GameReportOutput extends BaseApiOutput {
  games?: GameReportData[];
}

export class GameReportData {
  username?: string;
  playerName?: string;
  totalGames?: number;
  totalWins?: number;
  totalLoses?: number;
  totalShots?: number;
  totalHits?: number;
  totalErrors?: number;
  hitsPercentual?: number;
}
