import { Equipment } from './equipment';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';

export class EquipmentListOutput extends BaseApiOutput {
  equipments?: Equipment[];
}