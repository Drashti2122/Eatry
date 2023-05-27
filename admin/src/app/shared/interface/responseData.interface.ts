export interface MyResponse<T = any> {
  type: string;
  message: string;
  data?: T;
  token:string,
  email:string,
  count:number
}
