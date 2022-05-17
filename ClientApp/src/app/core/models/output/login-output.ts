import { BaseApiOutput } from "src/app/core/models/output/base-api-output";

export class LoginOutput extends BaseApiOutput {
  id?: string;
  name?: string;
  allyId?: string;
  email?: string;
  password?: string;
  tempPassword?: string;
  accessToken?: string;
  accessTokenExpiration?: Date;
}