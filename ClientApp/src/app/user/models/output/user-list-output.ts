import { User } from './user';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';

export class UserListOutput extends BaseApiOutput {
  users?: User[];
}