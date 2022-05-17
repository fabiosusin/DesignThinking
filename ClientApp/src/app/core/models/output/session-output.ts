export class SessionData {
  user?: UserData;
  token?: TokenInfo;
}

export class UserData {
  userId?: string;
  name?: string;
  email?: string;
  isMasterUser?: boolean;
}

export class TokenInfo {
  token?: string;
  tokenExpiration?: Date;
}
