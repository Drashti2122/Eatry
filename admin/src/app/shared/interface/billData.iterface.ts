import { otpUserData } from "./otpUserData.interface";
import { tableData } from "./table.interface";

export interface billData {
  _id: number,
  otpUserId: otpUserData,
  tableId: tableData,
  total: number,
  status: string
}
