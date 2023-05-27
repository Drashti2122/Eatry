import { FilterService } from './../../shared/service/filter/filter.service';
import { TableService } from './../../shared/service/table/table.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith } from 'rxjs';
import { io } from 'socket.io-client';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { tableData } from 'src/app/shared/interface/table.interface';
import { config } from 'src/app/shared/config';

@Component({
  selector: 'app-table-status',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.css']
})
export class TableStatusComponent {
  errorMsg!: string;
  getAllTables!: tableData[];
  socket: any;

  //filtering
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'Table'
  };
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  constructor(
    private toastr: ToastrService,
    private tableService: TableService,
    private filterService: FilterService) {
    this.onSearch();
  }

  ngOnInit() {
    // this.getAllTable();
    this.onSearch();
    this.socket = io(config.url);

    this.socket.on('activestatus', (status: any) => {
      this.onSearch();
      this.toastr.success(status);
    });

  }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString(), 10);
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputTableStatus');
    const pageSizeSelect = document.getElementById('searchPageTableStatus');
    const pageNumber = this.filterObj.pageNumber;

    if (search && pageSizeSelect) {
      const search$ = fromEvent<String>(search, 'keyup').pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        startWith('') // Initial value for search term
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
    this.filterService.searchFilter(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          //console.log(resData);
          this.getAllTables = resData?.data;
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

  // getAllTable() {
  //   this.tableService.getTable().subscribe(getData => {
  //     this.getAllTables = getData?.data;
  //     //console.log(this.getAllTables)
  //   }, error => {
  //     //console.log(error)
  //     this.errorMsg = error;
  //     this.toastr.error(this.errorMsg);
  //   })
  // }

  onUpdateStatus(id: number) {
    let authObs!: Observable<MyResponse<tableData>>;
    authObs = this.tableService.editTableStatus(id)
    authObs.subscribe(resData => {
      // this.getAllTable();
      this.onSearch();
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
