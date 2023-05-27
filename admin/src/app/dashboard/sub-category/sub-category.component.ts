import { FilterService } from './../../shared/service/filter/filter.service';
import { SubCategoryService } from '../../shared/service/sub-category/sub-category.service';
import { CategoryService } from '../../shared/service/category/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, debounceTime, distinctUntilChanged, fromEvent, startWith, combineLatest, filter, tap, Subscription } from 'rxjs';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { subCategoryData } from 'src/app/shared/interface/subCategoryData.interface';
import { categoryData } from 'src/app/shared/interface/categoryData.interface';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit, OnDestroy {
  getAllSubCategory!: subCategoryData[] |any;
  getAllCategory!: categoryData[];
  errorMsg!: string;
  editState: boolean = false;
  getSubCategory!: any;
  private subscriptions: Subscription[] = [];
  //filtering
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 10,
    model: 'SubCategory'
  };
  p: number = 1; // Initialize p with a default value
  count: any = 10;

  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private toastr: ToastrService,
    private filterService: FilterService) { this.onSearch(); }

  subCategoryForm = new FormGroup({
    subCategoryName: new FormControl('', Validators.required),
    categoryName: new FormControl('selectCategory', Validators.required)
  })

  ngOnInit(): void {
    this.getCategory();
    this.onSearch();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onPageChange(event: any) {
    this.onSearch();
    this.filterObj.pageNumber = parseInt(event.toString(), 10);
    this.p = this.filterObj.pageNumber;
    this.callSearchApi(this.filterObj)
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputSubCategory');
    const pageSizeSelect = document.getElementById('searchPageSubCategory');
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
          //console.log(resData.data);
          this.getAllSubCategory = resData?.data;
          this.count = resData?.count;
          //console.log("count" + resData?.data)
        },
        (error: any) => {
          //console.log(error);
          this.errorMsg = error;
          this.toastr.error(this.errorMsg);
        }
      );
  }

  getCategory() {
    this.categoryService.getCategorys()
      .subscribe(
        (resData) => {
          //console.log(resData.data);
          this.getAllCategory = resData?.data;
          //console.log(resData?.data)
          // this.count = resData?.count;
          // //console.log("count"+resData.count)
        },
        (error: any) => {
          //console.log(error);
          this.errorMsg = error;
          this.toastr.error(this.errorMsg);
        }
      );
  }
  // Validation methods for all form fields
  get subCategoryName() {
    return this.subCategoryForm.get('subCategoryName');
  }

  get categoryName() {
    return this.subCategoryForm.get('categoryName');
  }

  // getAllSubcategory() {
  //   this.subCategoryService.getSubCategory().subscribe(getData => {
  //     this.getAllSubCategory = getData?.data;
  //     // //console.log("subcategory" + this.getAllSubCategory)
  //   }, error => {
  //     //console.log(error)
  //     this.errorMsg = error;
  //     this.toastr.error(this.errorMsg);
  //   })
  // }

  onsubCategory() {
    // //console.log(this.subCategoryForm.value)
    const postData: any = this.subCategoryForm.value;
    const formData = new FormData();
    formData.append('subCategoryName', postData.subCategoryName);
    formData.append('categoryId', postData.categoryName);

    if (this.editState == false) {
      let authObs!: Observable<MyResponse<subCategoryData>>;
      authObs = this.subCategoryService.addSubCategory(formData)
      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        this.onSearch();
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
    } else {
      //console.log(this.getSubCategory._id, postData.subCategoryName, postData.categoryName)
      let authObs!: Observable<MyResponse<subCategoryData>>;
      authObs = this.subCategoryService.updateSubCategory(this.getSubCategory._id, postData.subCategoryName, postData.categoryName)
      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        this.onSearch();
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
    }
    this.subCategoryForm.reset();
  }

  onDelSubCategory(id: number) {
    let authObs!: Observable<MyResponse<subCategoryData>>;
    authObs = this.subCategoryService.delSubCategory(id)
    authObs.subscribe(resData => {
      this.toastr.success(resData?.message);
      this.getAllSubCategory = this.getAllSubCategory.filter((record: any) => record._id !== id);
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      // this.toastService.info(this.errorMsg);
      this.toastr.error(this.errorMsg);
    })
  }

  onEditSubCategory(id: number) {
    let authObs!: Observable<MyResponse>;
    authObs = this.subCategoryService.editSubCategory(id)
    authObs.subscribe(resData => {
      this.getSubCategory = resData?.data
      //console.log("editCategory", resData?.data)
      //console.log("subcategory" + JSON.stringify(this.getSubCategory))
      this.editState = true
      this.subCategoryForm.patchValue({
        categoryName: this.getSubCategory.categoryId
      })
      this.subCategoryForm.get('subCategoryName')?.setValue(this.getSubCategory.subCategoryName);
      this.toastr.success(resData.message);
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
