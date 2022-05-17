import { ImageFormat } from '../../../core/models/output/image-format';
import { BaseDataOutput } from "src/app/core/models/output/base-data-output";

export class Equipment extends BaseDataOutput {
  code?: string;
  name?: string;
  note?: string;
  userId?: string;
  damageNote?: string;
  loaned?: boolean;
  images?: ImageFormat[];

  //usado soment no front
  imagesBase64?: string[];
}