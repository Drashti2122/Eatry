import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith, tap } from 'rxjs';
import { FilterService } from 'src/app/shared/service/filter/filter.service';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css']
})
export class LikeComponent {
  getAllLikes!: any;
  errorMsg!: any;
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'Like'
  };
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  constructor(
    private toastr: ToastrService,
    private filterService: FilterService) {
    this.onSearch();
  }

  ngOnInit(): any {
    this.onSearch();
  }

  // ngOnChanges() {
  //   this.onSearch();
  // }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString());
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputLikes');
    const pageSizeSelect = document.getElementById('searchPageLikes');
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
    this.filterService.likesFilter(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          //console.log(resData);
          this.getAllLikes = resData?.data;
          this.count = resData?.count;
        },
        (error: any) => {
          this.errorMsg = error;
          this.toastr.error(this.errorMsg);
        }
      );
  }

}
