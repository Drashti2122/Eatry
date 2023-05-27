import { Observable } from 'rxjs';
import { DashPanelService } from './../../shared/service/dash-panel/dash-panel.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dash-panel',
  templateUrl: './dash-panel.component.html',
  styleUrls: ['./dash-panel.component.scss']
})
export class DashPanelComponent {
  countCategory!: number;
  countSubCategory!: number;
  countItem!: number;
  countOrders!: number;
  countCustomers!: number;
  countTable!: number;
  countUsers!: number;
  countTableReserve!: number;
  countLikes!: number;
  errorMsg!: string;
  model = {
    modelName: ''
  }

  constructor(
    private dashPanelService: DashPanelService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.totalCategory()
    this.totalSubCategory()
    this.totalItem()
    this.totalOrders()
    this.totalCustomers()
    this.totalTable()
    this.totalUsers()
    this.totalTableReserve()
    this.totalLikes()
  }

  totalCategory() {
    this.model.modelName = "Category";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countCategory = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalSubCategory() {
    this.model.modelName = "SubCategory";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countSubCategory = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalItem() {
    this.model.modelName = "Item";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countItem = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalOrders() {
    this.model.modelName = "Order";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countOrders = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalTable() {
    this.model.modelName = "Table";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countTable = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalCustomers() {
    this.model.modelName = "OtpUser";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countCustomers = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalUsers() {
    this.model.modelName = "User";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countUsers = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalTableReserve() {
    this.model.modelName = "TableReservation";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countTableReserve = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  totalLikes() {
    this.model.modelName = "Like";
    let authObs!: Observable<any>;
    authObs = this.dashPanelService.getTotal(JSON.stringify(this.model))
    authObs.subscribe(resData => {
      this.countLikes = resData?.data;
      // //console.log("count : " + resData?.data)
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
