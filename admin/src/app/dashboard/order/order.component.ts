import { OrderService } from './../../shared/service/order/order.service';
import { Component, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { io } from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';
import { orderData } from 'src/app/shared/interface/orderData.interface';
import { combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith } from 'rxjs';
import { FilterService } from 'src/app/shared/service/filter/filter.service';

const SOCKET_ENDPOINT = 'http://localhost:5000';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  getAllOrders!: any;
  errorMsg: any;
  socket: any;
  url: String;

  //pagination
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'Order',
    url: '',
  };
  p: number = 1; // Initialize p with a default value
  count: any = 10;

  constructor(
    private toastr: ToastrService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {
    this.url = route.snapshot.url.join('');
    //console.log(this.url);
  }

  ngOnInit() {
    this.filterObj.url = String(this.url);
    this.onSearch();
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('newOrders', (order: any) => {
      this.onSearch();
    });
  }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString(), 10);
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInput');
    const pageSizeSelect = document.getElementById('searchPage');
    const pageNumber = this.filterObj.pageNumber;

    if (search && pageSizeSelect) {
      const search$ = fromEvent<String>(search, 'keyup').pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        startWith(this.filterObj.searchName.toString()) // Initial value for search term
      );

      const pageSize$ = fromEvent<Number>(pageSizeSelect, 'change').pipe(
        map((event: any) => event.target.value),
        startWith(this.filterObj.pageSize.toString()), // Initial value for page size
        distinctUntilChanged(), // Only emit when the value changes
        filter(pageSize => pageSize !== 'Event'), // Filter out initial event value
      );

      combineLatest([search$, pageSize$]).subscribe(([searchTerm, pageSize]) => {
        this.filterObj.searchName = searchTerm;
        this.filterObj.pageSize = pageSize;

        // Check if search term or page size is present
        if (searchTerm || pageSize || this.filterObj.pageNumber) {
          this.callSearchApi(this.filterObj)
        }
      });
    }
  }

  callSearchApi(filterObj: object) {
    //console.log(this.filterObj);
    this.orderService.searchFilter(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          //console.log(resData);
          this.getAllOrders = resData?.data;
          this.count = resData?.count;
          // //console.log("count"+resData.count)
        },
        (error: any) => {
          //console.log(error);
          this.errorMsg = error;
          this.toastr.error(this.errorMsg);
        }
      );
  }

  getAllOrder() {
    this.orderService.getOrder(this.url).subscribe(
      (getData) => {
        this.getAllOrders = getData?.data;
        //console.log(this.getAllOrders);
      },
      (error) => {
        //console.log(error);
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      }
    );
  }

  upOrderStatus(id: number) {
    // //console.log(id)
    this.orderService.updateStatus(id).subscribe(
      (getData: any) => {
        this.getAllOrders = getData?.data;
        //console.log(this.getAllOrders);
        // this.getAllOrder();
        this.onSearch();
      },
      (error: any) => {
        //console.log(error);
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      }
    );
  }
}
