import { DataStorageService } from './../../data-storage.service';
import { MenuService } from './../../shared/service/menu/menu.service';
import { ReportsService } from './../../shared/service/reports/reports.service';
import { AfterViewInit, Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { OrderService } from 'src/app/shared/service/order/order.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  errorMsg!: string;
  bestSellerItemList!: any[]; // Populate this with your data
  selectedSubcategoryId!: string;

  popoverOpened = false;

  togglePopover() {
    this.popoverOpened = !this.popoverOpened;
  }

  selectSubCategory(subcategory: string) {

  }
  constructor(
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private menuService: MenuService,
    private dataStorageService: DataStorageService,
    private orderService: OrderService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.getBestSellerItemList();
    this.chkOrder();
  }

  ngAfterViewInit() {
    this.ngZone.run(() => {
      // Your code here
    });
  }

  ngOnDestroy(): void {
    this.orderService.orderExists.next(false);
  }

  selectTab(subcategory: string) {
    //console.log(subcategory)
    this.selectedSubcategoryId = subcategory;
  }

  getBestSellerItemList() {
    let authObs!: Observable<any>;
    authObs = this.reportsService.getBestSeller();

    authObs.subscribe(resData => {
      this.bestSellerItemList = resData?.data;
      //console.log(this.bestSellerItemList)
      this.selectedSubcategoryId = this.bestSellerItemList[0]?.subCategoryId;
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });
  }

  chkOrder() {
    let authObs!: Observable<MyResponse>;
    authObs = this.menuService.chkOrder();

    authObs.subscribe(resData => {
      this.orderService.orderExists.next(true);
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });
  }
}
