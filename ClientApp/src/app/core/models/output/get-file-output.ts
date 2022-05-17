import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
export class GetFileOutput extends BaseApiOutput {
  constructor(scs: boolean, errorMessage: string, base64: string) {
    super();
    this.success = scs;
    this.message = errorMessage;
    this.base64 = base64;
  }
  
  base64?: string;
}