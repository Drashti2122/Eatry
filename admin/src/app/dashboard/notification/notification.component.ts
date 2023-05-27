import { Component } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { Observable } from 'rxjs';
import { notificationData } from 'src/app/shared/interface/notification.interface';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { NotificationService } from 'src/app/shared/service/notification/notification.service';
import { io } from 'socket.io-client';
const SOCKET_ENDPOINT = 'http://localhost:5000';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  errorMsg!: string;
  getAllNotification!: notificationData[] | any;
  socket: any;

  constructor(private notificationService: NotificationService, private toastr: ToastService) {
    this.getNotification();
  }

  ngOnInit() {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('newNotification', (order: any) => {
      this.getNotification();
    });
  }

  getNotification() {
    let authObs!: Observable<MyResponse>;
    authObs = this.notificationService.getNotificationWithDetails()
    authObs.subscribe(resData => {
      // console.log(resData.data)
      this.getAllNotification = resData?.data
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  delNotification(id: number) {
    //console.log(id)
    let authObs!: Observable<MyResponse>;
    authObs = this.notificationService.delNotification(id)
    authObs.subscribe(resData => {
      //console.log(resData.data)
      this.getNotification();
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
