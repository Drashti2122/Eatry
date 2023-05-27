import { itemData } from "./itemData.interface";
import { otpUserData } from "./otpUserData.interface";
import { tableData } from "./table.interface";

export interface notificationData {
  _id: number;
  description: string;
  status: string;
  otpUserId: otpUserData;
  tableId:tableData;
  itemId:itemData;
}
