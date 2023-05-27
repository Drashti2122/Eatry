import { FilterService } from './../../shared/service/filter/filter.service';
import { categoryData } from 'src/app/shared/interface/categoryData.interface';
import { SubCategoryService } from '../../shared/service/sub-category/sub-category.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, startWith, tap } from 'rxjs';
import { config } from '../../shared/config'
import { ItemService } from 'src/app/shared/service/item/item.service';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { itemData } from 'src/app/shared/interface/itemData.interface';
import { subCategoryData } from 'src/app/shared/interface/subCategoryData.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  getAllSubCategory!: subCategoryData[];
  itemPictures!: File;
  errorMsg!: string;
  getItem!: any;
  editItem!: any;
  itemForm!: FormGroup;
  editState: boolean = false;

  //pagination
  pageSize: number = 10;
  filterObj = {
    searchName: '',
    pageNumber: 1,
    pageSize: 5,
    model: 'Item'
  };
  p: number = 1; // Initialize p with a default value
  count: number = 10;

  constructor(

    private toastr: ToastrService,
    private itemService: ItemService,
    private subCategoryService: SubCategoryService,
    private filterService: FilterService,
    private http: HttpClient) {
    // this.onSearch();
    this.subCategoryService.getSubCategory().subscribe(resData => {
      this.getAllSubCategory = resData?.data;
    })
    // this.getItems()
    this.onSearch()
  }

  ngOnInit(): void {
    this.onSearch();

    this.itemForm = new FormGroup({
      itemName: new FormControl('', Validators.required),
      itemPrice: new FormControl('', Validators.required),
      itemPicture: new FormControl('', Validators.required),
      subCategoryName: new FormControl('selectSubCategory', Validators.required),
      foodType: new FormControl('selectFoodType', Validators.required),
      subCategoryAdd: new FormControl(''),
      subCategoryEdit: new FormControl(''),
    })
  }

  onPageChange(event: any) {
    this.filterObj.pageNumber = parseInt(event.toString());
    this.p = this.filterObj.pageNumber;
    this.onSearch();
  }

  onSearch() {
    //console.log(this.filterObj)
    const search = document.getElementById('searchInputItem');
    const pageSizeSelect = document.getElementById('searchPageItem');
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
          this.getItem = resData?.data;
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

  get itemName() {
    return this.itemForm.get('itemName');
  }
  get itemPrice() {
    return this.itemForm.get('itemPrice');
  }
  get itemPicture() {
    return this.itemForm.get('itemPicture');
  }
  get foodType() {
    return this.itemForm.get('foodType');
  }

  getItems() {
    // this.editState = false;
    this.itemService.getItem().subscribe(resData => {

      this.getItem = resData?.data;
      //console.log(resData?.data)
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  onChange(event: any) {
    this.itemPictures = event.target.files[0];
    //console.log(this.itemPictures)
  }

  onItem() {
    //console.log(this.itemForm.value)
    if (!this.editItem) {
      const postData: any = this.itemForm.value;
      const formData = new FormData();

      //console.log(this.itemForm.value)
      formData.append('itemName', postData.itemName);
      formData.append('itemPrice', postData.itemPrice);
      formData.append('itemPicture', this.itemPictures);
      formData.append('subCategoryName', postData.subCategoryName)
      formData.append('foodType', postData.foodType)

      let authObs!: Observable<MyResponse>;
      authObs = this.http.post<MyResponse>(config.url + 'api/v1/item', formData)


      authObs.subscribe(resData => {
        this.toastr.success(resData?.message);
        this.onSearch()
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.itemForm.reset();
    } else {
      const postData: any = this.itemForm.value;
      // //console.log(this.itemForm.value)

      const formData = new FormData();

      // //console.log(this.itemForm.value)
      formData.append('itemName', postData.itemName);
      formData.append('itemPrice', postData.itemPrice);
      if (this.itemPictures) {
        formData.append('itemPicture', this.itemPictures);
      } else {
        formData.append('itemPicture', this.editItem.itemPicture);
      }
      formData.append('subCategoryName', postData.subCategoryName)
      formData.append('foodType', postData.foodType)

      let authObs!: Observable<MyResponse>;
      authObs = this.http.patch<MyResponse>(config.url + 'api/v1/item/' + this.editItem._id, formData)


      authObs.subscribe(resData => {
        this.toastr.success(JSON.stringify(resData?.message));
        this.onSearch()
      }, error => {
        //console.log(error)
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.itemForm.reset();
    }
  }

  onDeleteItem(id: number) {
    let authObs!: Observable<MyResponse>;
    authObs = this.http.delete<MyResponse>(config.url + 'api/v1/item/' + id)

    authObs.subscribe(resData => {
      this.getItem = this.getItem.filter((record: any) => record._id !== id);
      this.toastr.success(resData.message);
      this.editState = false;
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  onEditItem(id: number) {
    let authObs!: Observable<MyResponse<itemData>>;
    authObs = this.itemService.editItem(id)

    authObs.subscribe(resData => {
      //console.log(resData.data)
      this.editState = true
      this.editItem = resData.data
      //console.log(this.editItem.subCategoryId.subCategoryName)
      this.itemForm.patchValue({
        subCategoryName: this.editItem.subCategoryId._id,
        foodType: this.editItem.foodType
      })

      this.itemForm.get('itemName')?.setValue(this.editItem.itemName);
      this.itemForm.get('itemPrice')?.setValue(this.editItem.itemPrice);
      this.toastr.success(resData.message);

      // //console.log(resData)
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
