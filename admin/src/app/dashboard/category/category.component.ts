import { FilterService } from './../../shared/service/filter/filter.service';
import { CategoryService } from '../../shared/service/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith, tap } from 'rxjs';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { categoryData } from 'src/app/shared/interface/categoryData.interface';
import { MyResponse } from 'src/app/shared/interface/responseData.interface'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  errorMsg!: string;
  getAllcategory!: categoryData[];
  private subscriptions: Subscription[] = [];
  getCategory!: categoryData;
  editState: boolean = false;
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'Category'
  };
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private filterService: FilterService) {
    this.onSearch();
  }

  ngOnInit(): void {
    this.onSearch();
  }
  ngOnDestroy(): void {
    // Unsubscribe from the subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString());
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputCategory');
    const pageSizeSelect = document.getElementById('searchPageCategory');
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
    this.filterService.searchFilter(JSON.stringify(filterObj))
      .subscribe(
        (resData) => {
          //console.log(resData);
          this.getAllcategory = resData?.data;
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

  categoryForm = new FormGroup({
    categoryName: new FormControl('', Validators.required)
  })

  // Validation methods for all form fields
  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  // getAllCategory() {
  //   this.categoryService.getCategorys().subscribe(getData => {
  //     this.getAllcategory = getData?.data;
  //     //console.log(this.getAllcategory)
  //   }, error => {
  //     //console.log(error)
  //     this.errorMsg = error;
  //     this.toastr.error(this.errorMsg);
  //   })
  // }

  onCategory() {
    const postData: any = this.categoryForm.value;
    const formData = new FormData();
    formData.append('categoryName', postData.categoryName);
    if (this.editState == false) {
      let authObs!: Observable<MyResponse<categoryData>>;
      authObs = this.categoryService.addCategory(postData.categoryName)
      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        this.onSearch();
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
    } else {
      let authObs!: Observable<MyResponse<categoryData>>;
      authObs = this.categoryService.updateCategory(this.getCategory._id, postData.categoryName)
      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        this.onSearch();
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
    }
    this.categoryForm.reset();
  }

  onDelCategory(id: number) {
    let authObs!: Observable<MyResponse<categoryData>>;
    authObs = this.categoryService.delCategory(id)
    authObs.subscribe(resData => {
      this.toastr.success(resData?.message);
      this.getAllcategory = this.getAllcategory.filter((record: any) => record._id !== id);
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  onEditCategory(id: number) {
    let authObs!: Observable<MyResponse>;
    authObs = this.categoryService.editCategory(id)
    authObs.subscribe(resData => {
      this.getCategory = resData?.data
      this.editState = true
      this.categoryForm.get('categoryName')?.setValue(this.getCategory.categoryName);
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
