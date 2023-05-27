import { DataStorageService } from './../../data-storage.service';
import { OrderService } from './../../shared/service/order/order.service';
import { BillService } from './../../shared/service/bill/bill.service';
import { PaymentService } from '../../shared/service/payment/payment.service';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { config } from '../.././shared/config';
import { io } from 'socket.io-client';
import { orderData } from 'src/app/shared/interface/order.interface';

const SOCKET_ENDPOINT = config.SOCKET_ENDPOINT;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {

  @ViewChild('cardInfo') cardInfo!: ElementRef;
  errorMsg!: string;
  getAllOrders!: orderData[];
  allOverCompleteTotal!: number;
  allOverPendingTotal!: number;
  gst!: number;
  totalWithGst!: number;
  gst1!: number;
  totalWithGst1!: number;
  checkOutStatus: boolean = false;
  ans = 0;
  handler: any = null;
  socket: any;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private billService: BillService,
    private dataStorageService: DataStorageService
  ) {
    // this.aboutBill();
    this.chkCheckout();
  }

  ngOnInit(): void {
    this.dataStorageService.orderExists.next(true);
    this.aboutBill()
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('updateOrders', (status: any) => {
      this.aboutBill();
    });
    this.socket.on('billUpdates', (status: any) => {
      this.aboutBill();
    });
    // this.socket.on('paidUpdate', (status: any) => {
    //   this.aboutBill();
    // });
    // BillPdf
  }

  ngOnDestroy(): void {
    //   this.dataStorageService.orderExists.next(false);
  }

  pay(amount: any) {
    var handler = (<any>window).StripeCheckout.configure({
      key: config.publishableKey,
      locale: 'auto',
      token: (token: any) => {
        this.payment(token)
      }
    })
    handler.open({
      name: 'PAYMENT',
      currency: 'inr',
      amount: amount * 100
    });

  }

  payment(token: any) {
    // Make the API call using the HttpClient module
    let authObs!: Observable<any>;
    const obj = {
      token,
      amount: this.totalWithGst
    };
    authObs = this.paymentService.payme(obj);
    authObs.subscribe(resData => {
      this.toastr.success(resData.message);
      this.onBill()
      this.aboutBill()
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });

  }

  aboutBill() {
    let authObs!: Observable<any>;
    authObs = this.orderService.getAllOrders();

    authObs.subscribe(resData => {
      this.getAllOrders = resData?.data;
      //console.log(this.getAllOrders)
      // this.toastr.success(resData.message);

      this.allOverPendingTotal = this.getAllOrders.reduce((total: number, order: any) => {
        if (order.payment_status === 'pending') {
          return total + order.totalPrice;
        }
        return total;
      }, 0);

      this.allOverCompleteTotal = this.getAllOrders.reduce((total: number, order: any) => {
        if (order.payment_status === 'completed') {
          return total + order.totalPrice;
        }
        return total;
      }, 0);

      let roundGst = (this.allOverPendingTotal * 0.1);
      this.gst = parseFloat(roundGst.toFixed(2));
      this.totalWithGst = this.allOverPendingTotal + this.gst;
      let roundGst1 = (this.allOverCompleteTotal * 0.1);
      this.gst1 = parseFloat(roundGst1.toFixed(2));
      this.totalWithGst1 = this.allOverCompleteTotal + this.gst1;
      // this.checkOutStatus = false;
      // this.chkCheckout();
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });
  }


  chkCheckout() {
    const formData = new FormData();

    // formData.append("total", this.totalWithGst);

    let authObs!: Observable<any>;
    authObs = this.billService.chkCheckout()

    authObs.subscribe(resData => {
      // //console.log(resData.message)
      // this.toastr.success(resData.message);
      // this.checkOutStatus = true;
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  onBill() {
    const formData = new FormData();
    // //console.log("gst" + this.totalWithGst)
    // //console.log("gst1" + this.totalWithGst1)
    formData.append("total", (this.totalWithGst1 + this.totalWithGst).toString());

    let authObs!: Observable<any>;
    authObs = this.billService.billPlaced(formData)

    authObs.subscribe(resData => {
      this.aboutBill()
      // this.chkCheckout();
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);

    })
  }

  onBillPdf() {
    var pdf = new jsPDF.default();
    pdf.addImage("../../../assets/images/dinner.png", 'PNG', 14, 10, 15, 15);
    pdf.setFontSize(20);
    pdf.text('Eatry', 29, 20);
    pdf.setFontSize(20);
    pdf.text('Thank you for coming...', 14, 40);

    // Add date
    pdf.setFontSize(14);
    pdf.text('Date: ' + new Date().toLocaleDateString(), 14, 50);

    (pdf as any).autoTable({
      startY: 60,
      head: [['Product', 'Quantity', 'Price', 'Total']],
      body: this.getAllOrders
        .filter((order: any) => order.payment_status === 'completed')
        .map((order: any) => [
          order.itemId.itemName,
          order.itemId.itemPrice,
          order.quantity,
          order.totalPrice
        ]),
      theme: 'plain',
      tableLineColor: 200,
      tableLineWidth: 0.2,
      didDrawCell: (data: { column: { index: any; }; }) => {
      },
      tableWidth: 'auto',
      styles: {
        font: 'helvetica',
        fontSize: 12,
        cellPadding: 5,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
      },
      margin: { top: 10 },
    });

    // pdf.output('dataurlnewwindow')

    // pdf.save('eatry.pdf')
    // Add total
    // const total = this.products.reduce((acc, cur) => acc + (cur.quantity * cur.price), 0);

    pdf.text('Gst(10%): ' + this.gst1, 160, (pdf as any).autoTable.previous.finalY + 10);
    pdf.text('Total: ' + this.totalWithGst1, 160, (pdf as any).autoTable.previous.finalY + 20);
    pdf.save('eatry.pdf');
  }
}
