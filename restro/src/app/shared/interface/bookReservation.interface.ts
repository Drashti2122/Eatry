import { tableData } from "./table.interface"

export interface tableReservationData {
    _id: number;
    tableId: number;
    bookingDate: string;
    bookingInTime: string;
    bookingOutTime: string;
    contactNo: string;
    payment_status: string;
    payment_intent: string;
}
