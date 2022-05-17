import { BaseDataOutput } from "src/app/core/models/output/base-data-output";

export class User extends BaseDataOutput {
  isMasterAdmin?: boolean;
  name?: string;
  email?: string;
  allyId?: string;
  password?: string;
  username?: string;
  tempPassword?: string;
}