export class UserRefreshResponse {
  accessToken: string;
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
