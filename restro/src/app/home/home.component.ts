import { ReportsService } from './../shared/service/reports/reports.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { config } from "../shared/config";
const SOCKET_ENDPOINT = config.SOCKET_ENDPOINT;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  socket: any;
  currentUser!: string;
  errorMsg!: string;
  bestSellerItemList: any;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private reportsService: ReportsService) {

  }

  ngOnInit(): void {

    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('join-me', (data: string) => {
      //console.log(data)
    })

    this.socket.on('userStatus', (status: string) => {
      //console.log("user status:" + status)
      // const data = { status }
      // const status = "active"
      localStorage.setItem('status', JSON.stringify(status));
    });

  }

  getOtpUser() {
    // let authObs!: Observable<any>;
    // authObs = this.authService.getCurrentUser()

    // authObs.subscribe(resData => {
    //   //console.log("Hiii" + resData.data)
    //   this.currentUser = resData?.data;
    //   localStorage.setItem('status', JSON.stringify(resData.status));
    // }, error => {
    //   this.errorMsg = error;
    //   this.toastr.error(this.errorMsg);
    // })
  }


}
