import { FilterService } from './../../shared/service/filter/filter.service';
import { TableService } from './../../shared/service/table/table.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, debounceTime, distinctUntilChanged, fromEvent, startWith, combineLatest, filter, tap } from 'rxjs';
import { tableData } from 'src/app/shared/interface/table.interface';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  errorMsg!: string;
  getAllTable!: tableData[];
  getEditTable: any;
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
    private tableService: TableService,
    private toastr: ToastrService,
    private filterService: FilterService) { }

  ngOnInit(): void {
    // this.getAllTables();
    this.onSearch();
  }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString(), 10);
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputTable');
    const pageSizeSelect = document.getElementById('searchPageTable');
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
    this.filterService.searchFilter(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          //console.log(resData);
          this.getAllTable = resData?.data;
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

  get tableName() {
    return this.tableForm.get('tableName');
  }
  get tableNo() {
    return this.tableForm.get('tableNo');
  }
  getAllTables() {
    this.tableService.getTable().subscribe(getData => {
      this.getAllTable = getData?.data;
      //console.log(this.getAllTable)
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  tableForm = new FormGroup({
    tableName: new FormControl('', Validators.required),
    tableNo: new FormControl('', Validators.required)
  })

  onTable() {
    const postData: any = this.tableForm.value
    const formData = new FormData();

    formData.append("tableName", postData.tableName)
    formData.append("tableNo", postData.tableNo)

    if (!this.getEditTable) {
      let authObs!: Observable<MyResponse<tableData>>;
      authObs = this.tableService.addTable(formData)
      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        // this.getAllTables();
        this.onSearch();
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.tableForm.reset();
    } else {
      let authObs!: Observable<MyResponse<tableData>>;
      authObs = this.tableService.updateTable(this.getEditTable._id, formData)
      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        // this.getAllTables();
        this.onSearch();
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.tableForm.reset();
    }
  }

  onDeleteTable(id: number) {
    let authObs!: Observable<MyResponse>;
    authObs = this.tableService.delTable(id)
    authObs.subscribe(resData => {
      this.toastr.success(resData?.message);
      this.getAllTables();
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  onEditTable(id: number) {
    let authObs!: Observable<MyResponse<tableData>>;
    authObs = this.tableService.editTable(id)
    authObs.subscribe(resData => {
      this.getEditTable = resData.data
      this.toastr.success(resData?.message);
      this.tableForm.get('tableName')?.setValue(this.getEditTable.tableName);
      this.tableForm.get('tableNo')?.setValue(this.getEditTable.tableNo);
      this.getAllTables();
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
    this.tableForm.reset();
  }
}
