import { OrderService } from './../shared/service/order/order.service';
import { DataStorageService } from './../data-storage.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../shared/service/menu/menu.service';
import { itemData } from '../shared/interface/item.interface';
import { MyResponse } from '../shared/interface/responseData.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css',]
})
export class MenuComponent {
  errorMsg!: string;
  getAllItem!: itemData[] | any;
  getRoles!: string;
  socket!: string;
  rolesState!: boolean;
  items: itemData[] = []; // Replace with your item data array

  constructor(
    private menuService: MenuService,
    private toastr: ToastrService,
    private dataStorageService: DataStorageService,
    private OrderService: OrderService) {
    this.getItems()
  }

  toggleLike(item: any, id: number) {
    item.isLiked = !item.isLiked;
    //console.log(item.isLiked, id)
    if (item.isLiked == true) {
      let authObs!: Observable<any>;
      authObs = this.menuService.like(id)

      authObs.subscribe(resData => {
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
    }

  }

  ngOnInit(): void {

    //check role
    this.getRoles = JSON.parse(localStorage.getItem('role') as string);
    //console.log("ROLES", this.getRoles);
    if (this.getRoles == null) {
      this.rolesState = true;
    } else if (this.getRoles == 'otpUser') {
      this.rolesState = false;
    }
  }

  getItems() {
    let authObs!: Observable<MyResponse<itemData[]>>;
    authObs = this.menuService.getItem()

    authObs.subscribe(resData => {
      this.getAllItem = resData?.data;
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }


  //About Order

  orderForm = new FormGroup({
    itemId: new FormControl('', Validators.required),
    itemPrice: new FormControl('', Validators.required),
    quantity: new FormControl(1, Validators.required)
  })

  onOrder(itemId: string, itemPrice: string) {
    const otp = JSON.parse(localStorage.getItem('otp') as string);

    this.orderForm.patchValue({ itemId: itemId, itemPrice: itemPrice });
    let postData: any = this.orderForm.value;
    // //console.log(this.orderForm.value);

    let totalPrice = postData.quantity * postData.itemPrice;
    const formData = new FormData();

    formData.append("itemId", postData.itemId);
    formData.append("quantity", postData.quantity);
    formData.append("totalPrice", "" + totalPrice);

    let authObs!: Observable<MyResponse>;
    authObs = this.menuService.orderPlace(formData)

    authObs.subscribe(resData => {
      // //console.log(resData.message)
      this.dataStorageService.orderExists.next(true);
      this.toastr.success(resData.message);
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

}
