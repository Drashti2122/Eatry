import { Component } from '@angular/core';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { ToastrService } from 'ngx-toastr';
import 'firebase/messaging';
import { AuthService } from './auth/auth.service';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:5000';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'af-notification';
  message: any = null;
  errorMsg: any;
  socket: any;
  constructor(private toastr: ToastrService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.socket = io(SOCKET_ENDPOINT);

    this.socket.on('newOrders', (order: any) => {
      this.toastr.success(order);
    });
  }
}

