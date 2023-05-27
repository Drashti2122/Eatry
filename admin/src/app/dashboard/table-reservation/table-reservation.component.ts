import { TableReservationService } from './../../shared/service/table-reservation/table-reservation.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, of, startWith, switchMap } from 'rxjs';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { tableReservationData } from 'src/app/shared/interface/table-Reservation.interface';
import { ToastrService } from 'ngx-toastr';
import { io } from 'socket.io-client';
import { config } from '../../shared/config'

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.css']
})
export class TableReservationComponent {
  errorMsg!: string;
  searchState: boolean = false;
  getAllTableReservation!: tableReservationData[];
  socket: any;

  //filtering
  pageSize: number = 10;
  filterObj = {
    searchTName: '',
    searchDate: '',
    pageNumber: 1,
    pageSize: 10,
  }
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  @ViewChild('searchTable') searchTable!: ElementRef;
  @ViewChild('searchDate') searchDate!: ElementRef;

  constructor(private tableReservationService: TableReservationService, private toastr: ToastrService) {
    // this.getAllTabReservation()
  }

  ngOnInit(): void {
    //console.log(this.filterObj)
    this.onSearch()
    this.socket = io(config.url);
    this.socket.on('tableReservation', (tableReserve: any) => {
      this.onSearch();
    });
    this.socket.on('bookingCancel', (tableReserve: any) => {
      this.onSearch();
    });
  }

  onPageChange(event: any) {
    this.onSearch();
    this.filterObj.pageNumber = parseInt(event.toString(), 10);
    this.p = this.filterObj.pageNumber;
    this.callSearchApi(this.filterObj)
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputTableName');
    const searchDate = document.getElementById('searchInputTableDate');
    const pageSizeSelect = document.getElementById('searchPageTableStatus');
    const pageNumber = this.filterObj.pageNumber;

    if (search && pageSizeSelect && searchDate) {
      const search$ = fromEvent<String>(search, 'keyup').pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        startWith('') // Initial value for search term
      );

      const searchingDate$ = fromEvent<Number>(searchDate, 'change').pipe(
        map((event: any) => event.target.value),
        startWith(''), // Initial value for page size
        distinctUntilChanged(), // Only emit when the value changes
        filter(pageSize => pageSize !== 'Event'), // Filter out initial event value
      );

      const pageSize$ = fromEvent<Number>(pageSizeSelect, 'change').pipe(
        map((event: any) => event.target.value),
        startWith(this.filterObj.pageSize.toString()), // Initial value for page size
        distinctUntilChanged(), // Only emit when the value changes
        filter(pageSize => pageSize !== 'Event'), // Filter out initial event value
      );

      combineLatest([search$, searchingDate$, pageSize$]).subscribe(([searchTerm, searchDate, pageSize]) => {
        this.filterObj.searchTName = searchTerm;
        this.filterObj.searchDate = searchDate;
        this.filterObj.pageSize = pageSize;

        // Check if search term or page size is present
        if (searchTerm || pageSize || searchDate || this.filterObj.pageNumber) {
          this.callSearchApi(this.filterObj)
        }
      });
    }
  }

  callSearchApi(filterObj: object) {
    //console.log(this.filterObj);
    this.tableReservationService.searchBoth(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          //console.log("hii" + JSON.stringify(resData.data));
          this.getAllTableReservation = resData?.data;
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
}
