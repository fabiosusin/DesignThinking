import { RouteType } from 'src/app/core/models/enum/route-type';
import { User } from './../output/user';
export class AddUserInput {
  constructor(data: User) {
    this.permissions = RouteType.Unknown;

    if (!data)
      return;

      this.userId = data.id;
      this.isMasterAdmin = data.isMasterAdmin;
      this.name = data.name;
      this.username = data.username;
      this.email = data.email;
      this.password = data.password;
  }
  isMasterAdmin?: boolean;
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  passwordValidation?: string;
  username?: string;
  tempPassword?: string;
  permissions: RouteType;
}