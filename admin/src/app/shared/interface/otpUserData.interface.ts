import { tableData } from "./table.interface";


export interface otpUserData {
  _id: number,
  otpEmail: string,
  groupName: string,
  tableKey: string,
  tableNo: tableData,
  otp: string,
}
