import { NotificationService } from './../shared/service/notification/notification.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { io } from 'socket.io-client';
import { MyResponse } from '../shared/interface/responseData.interface';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const SOCKET_ENDPOINT = 'http://localhost:5000';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  current!: any;
  ex: any;
  socket: any;
  errorMsg!: string;
  getNotification!: any;
  colors = ['bg-success', 'bg-primary', 'bg-danger', 'bg-warning'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private toastr: ToastrService) {
    this.authService.getAdmin().subscribe(data => {
      this.current = data.data;
      this.ex = this.current[0]
    });
    this.getAllNotification();
  }

  ngOnInit(): void {
    this.getAllNotification();
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('newNotification', (notification: any) => {
      this.getAllNotification();
    });
    // this.socket.on('deleteNotification', (notification: any) => {
    //   this.getAllNotification();
    // });
    this.socket.on('deleteNotifications', (notification: any) => {
      this.getAllNotification();
    });

  }

  onLogout() {
    this.authService.removeToken();
    this.router.navigate(['/auth'])
  }

  getAllNotification() {
    let authObs!: Observable<MyResponse>;
    authObs = this.notificationService.getNotification()
    authObs.subscribe(resData => {
      const destructure = resData?.data;
      // console.log(resData.data)
      this.getNotification = destructure
    }, error => {
      console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
