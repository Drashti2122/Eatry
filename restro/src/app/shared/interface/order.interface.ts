
import { itemData } from "./item.interface";
import { otpUserData } from "./otpUser.interface";
import { tableData } from "./table.interface";

export interface orderData {
    _id: number,
    itemId: itemData,
    quantity: number,
    totalPrice: number,
    dishStatus: string,
    tableNo: tableData,
    payment_status: string,
    otpuserId: otpUserData
}
