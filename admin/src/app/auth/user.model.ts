export class User {
  constructor(
    public adminId: string,
    public token: string,
    // private _tokenExpirationDate: Date
  ) {
    if (!adminId && !token) {
      const adminData = JSON.parse(localStorage.getItem('adminData') as string);
      this.adminId = adminData.adminId;
      this.token = adminData.token;
    }
  }
}
