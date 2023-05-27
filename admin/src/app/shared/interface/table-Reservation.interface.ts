import { tableData } from './table.interface';
import { userData } from './userData.interface';

export interface tableReservationData {
  _id:number,
  tableId: tableData |null;
  customerId: userData |null,
  tableName:string,
  bookingDate: string;
  bookingInTime: string;
  bookingOutTime: string;
  contactNo: string;
}
