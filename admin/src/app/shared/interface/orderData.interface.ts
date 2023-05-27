import { itemData } from './itemData.interface';
import { tableData } from './table.interface';
import { userData } from './userData.interface';

export interface orderData {
  _id:number,
  itemId: itemData;
  customerId: userData;
  quantity: number;
  totalPrice: number;
  dishStatus: string;
  status: string;
  tableNo: tableData;
}
