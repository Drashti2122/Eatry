export class User {
  constructor(
    public userId: string,
    public token: string
    // private _tokenExpirationDate: Date
  ) {
    if (!userId && !token) {
      let userData = JSON.parse(localStorage.getItem('userData') as string);
      this.userId = userData.userId;
      this.token = userData.token;
    }
  }
}
