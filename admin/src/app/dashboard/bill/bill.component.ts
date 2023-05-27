import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BillService } from 'src/app/shared/service/bill/bill.service';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { billData } from 'src/app/shared/interface/billData.iterface';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { FilterService } from 'src/app/shared/service/filter/filter.service';
import { config } from "../../shared/config";

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent {
  errorMsg!: string;
  getAllBillData!: billData[] | any;
  socket: any;

  //pagination
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'Bill'
  };
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  constructor(
    private numbertoastr: ToastrService,
    private billService: BillService,
    private filterService: FilterService,
    private toastr: ToastrService) {
    // this.getBill();
  }

  ngOnInit(): void {
    // this.getBill()
    this.onSearch();
    this.socket = io(config.url);
    this.socket.on('join-me', (order: any) => {
      // this.getBill();
      this.onSearch();
    });
    this.socket.on('checkout', (order: any) => {
      // this.getBill();
      this.onSearch();
    });

  }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString());
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputBill');
    const pageSizeSelect = document.getElementById('searchPageBill');
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
        tap(pageSize => this.filterObj.pageSize = pageSize) // Update filterObj.pageSize value
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
    this.billService.searchFilter(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          this.getAllBillData = resData?.data;
          this.count = resData?.count;
          //console.log(this.getAllBillData)
        },
        (error: string) => {
          //console.log(error);
          this.errorMsg = error;
          this.toastr.error(this.errorMsg);
        }
      );
  }

  getBill() {
    this.billService.getBill().subscribe(getData => {
      this.getAllBillData = getData?.data;
      // //console.log(this.getAllBillData)
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  // this.billService.updateBillStatus
  onBill(id: number) {
    let authObs!: Observable<MyResponse>;
    authObs = this.billService.updateBillStatus(id)

    authObs.subscribe(resData => {
      //console.log(resData.message)
      // this.toastr.success(resData.message);
      // this.getBill()
      this.onSearch()
      // this.checkOutStatus = true;
    }, error => {
      this.toastr.error(this.errorMsg);
      this.errorMsg = error;
    })
  }
}
