import { BookReservationService } from './../shared/service/bookReservation/book-reservation.service';
import { DataStorageService } from './../data-storage.service';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { PaymentService } from '../shared/service/payment/payment.service';
import { tableReservationData } from '../shared/interface/bookReservation.interface';
import { MyResponse } from '../shared/interface/responseData.interface';
import { io } from 'socket.io-client';
import { config } from "../shared/config";
const SOCKET_ENDPOINT = config.SOCKET_ENDPOINT;
@Component({
  selector: 'app-book-reservation',
  templateUrl: './book-reservation.component.html',
  styleUrls: ['./book-reservation.component.css'],
  providers: [DatePipe]
})
export class BookReservationComponent {
  reservationForm: FormGroup;
  getReservedUserData!: any;
  reservationState: boolean = false;
  errorMsg!: string;
  minDate: string | null;
  maxDate: string | null;
  handler: any = null;
  upcomingReservations: any[] = [];
  otherReservations: any[] = [];
  socket: any;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private bookReservationService: BookReservationService,
    private toastr: ToastrService,
    private paymentService: PaymentService) {

    let today = new Date();
    let todays = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    this.minDate = this.datePipe.transform(todays, 'yyyy-MM-dd');
    // console.log(this.minDate)
    let threeDaysLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);
    this.maxDate = this.datePipe.transform(threeDaysLater, 'yyyy-MM-dd');
    // console.log(this.maxDate)

    this.reservationForm = this.formBuilder.group({
      reserveDate: new FormControl('', Validators.required),
      reserveInTime: new FormControl('', [Validators.required, Validators.pattern("^1[0-9]|2[0-1](:[0-5][0-9])?$")]),
      reserveOutTime: new FormControl('', [Validators.required, Validators.pattern("^1[1-9]|2[0-1](:[0-5][0-9])?$")]),
      reserveCNo: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.getTableReservation()

    // this.socket = io(SOCKET_ENDPOINT);
    // this.socket.on(' bookingCancel', (data: string) => {
    //   this.getTableReservation()
    // })
  }

  getTableReservation() {
    const currentTime = new Date();
    let authObs!: Observable<MyResponse<tableReservationData>>;
    authObs = this.bookReservationService.getBookReservation()

    authObs.subscribe((reservations) => {
      const currentTime = new Date();
      const currentTimePlusFourHours = currentTime.getTime() + (4 * 60 * 60 * 1000);

      // Separate reservations into two arrays based on the booking time condition
      for (let reservation of reservations.data as any) {
        const bookingTime = new Date(reservation.bookingDate + ' ' + reservation.bookingInTime).getTime();

        if (bookingTime > currentTimePlusFourHours) {
          this.upcomingReservations.push(reservation);
        } else {
          this.otherReservations.push(reservation);
        }
      }
    })
  }

  pay(id: number) {
    var handler = (<any>window).StripeCheckout.configure({
      key: config.publishableKey,
      locale: 'auto',
      token: (token: string) => {
        // console.log(token)
        this.payment(token, id)
      }
    })

    handler.open({
      name: 'PAYMENT',
      // description: 'Payment',
      currency: 'inr',
      amount: 100 * 100
    });
  }

  payment(token: string, id: number) {
    // Make the API call using the HttpClient module
    let authObs!: Observable<MyResponse>;
    const obj = {
      token,
      amount: 100,
      id: id
    };
    authObs = this.paymentService.payme_table(obj);
    authObs.subscribe(resData => {
      this.toastr.success(resData.message);
      this.getTableReservation()
      this.onReservation()
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });

  }

  get reserveDate() {
    return this.reservationForm.get('reserveDate');
  }
  get reserveInTime() {
    return this.reservationForm.get('reserveInTime');
  }
  get reserveOutTime() {
    return this.reservationForm.get('reserveOutTime');
  }
  get reserveCNo() {
    return this.reservationForm.get('reserveCNo');
  }


  onReservation() {

    // console.log(this.reservationForm.value)

    let postData: any = this.reservationForm.value;
    if (postData.reserveOutTime && postData.reserveInTime) {
      // if (postData.reserveDate)
      if (this.minDate !== null && this.maxDate !== null) {
        let minDateObj = new Date(this.minDate);
        let maxDateObj = new Date(this.maxDate);
        let reserveDateObj = new Date(postData.reserveDate);
        if (reserveDateObj < minDateObj || reserveDateObj > maxDateObj) {
          this.toastr.error('Date should be valid!');
          return;
        }
      }
      if (postData.reserveOutTime <= postData.reserveInTime) {
        this.toastr.error('Out time should be greater than in time!');
        return;
      }
      const formData = new FormData();

      formData.append("bookingDate", postData.reserveDate)
      formData.append("bookingInTime", postData.reserveInTime)
      formData.append("bookingOutTime", postData.reserveOutTime)
      formData.append("contactNo", postData.reserveCNo)

      let authObs!: Observable<MyResponse>;
      authObs = this.bookReservationService.bookReservation(formData)

      authObs.subscribe(resData => {
        // this.toastr.success(resData.message);
        // this.getTableReservation()
        this.pay(resData.data._id);
        this.reservationState = true;
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.reservationForm.reset();
    }
  }

  onRefund(id: number) {
    // alert(id)
    let authObs!: Observable<MyResponse>;
    authObs = this.paymentService.refundTable(id);
    authObs.subscribe(resData => {
      this.toastr.success(resData.message);
      // this.getTableReservation()
      this.getReservedUserData = this.getReservedUserData.filter((record: any) => record._id !== id);
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });
  }
}
