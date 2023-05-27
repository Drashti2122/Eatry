import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, map, distinctUntilChanged, startWith, filter, combineLatest, fromEvent } from 'rxjs';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { userData } from 'src/app/shared/interface/userData.interface';
import { FilterService } from 'src/app/shared/service/filter/filter.service';
import { UserService } from 'src/app/shared/service/users/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  errorMsg!: string;
  getAllUser!: userData[];

  //pagination
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'User'
  };
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private filterService: FilterService) {
    // this.getUser()
  }
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
    const search = document.getElementById('searchInputUser');
    const pageSizeSelect = document.getElementById('searchPageUser');
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
          //console.log(resData.data);
          this.getAllUser = resData?.data;
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

  getUser() {
    let authObs!: Observable<MyResponse>;
    authObs = this.userService.getUser()
    authObs.subscribe(resData => {
      // //console.log(resData.data)
      this.getAllUser = resData.data
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
