import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { EquipmentHistory } from './equipment-history';

export class EquipmentHistoryListOutput extends BaseApiOutput {
  equipmentsHistory?: EquipmentHistory[];
}
