import { OrderService } from './../../shared/service/order/order.service';
import { DataStorageService } from './../../data-storage.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { userData } from 'src/app/shared/interface/user.interface';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  errorMsg!: string;
  errorState: boolean = false;
  rolesState!: boolean;
  orderExists: boolean = false;
  userExists: boolean = false;
  userData: string | object = JSON.parse(localStorage.getItem('userData') as string);
  userDataStateForLogin: boolean = false;
  getRoles = JSON.parse(localStorage.getItem('role') as string);

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router, private dataStorageService: DataStorageService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.onTableReservationState();
    this.orderService.orderExists.subscribe(res => {
      this.orderExists = res;
    })
    this.dataStorageService.userExists.subscribe(res => {
      this.userExists = res;
    })
    const getRole = JSON.parse(localStorage.getItem('role') as string);
    if (getRole == "User") {
      this.dataStorageService.userExists.next(true);
    }

  }

  onTableReservationState() {
    //login-or-not
    //console.log("hello everyone")
    if (this.userData == null) {
      this.userDataStateForLogin = true;
    }
    if (this.userData) {
      this.userDataStateForLogin = false;
    }
    //console.log("User Data State for login: " + this.userDataStateForLogin);

    //check role
    //console.log("ROLES", this.getRoles);
    if (this.getRoles == null) {
      this.rolesState = true;
    } else if (this.getRoles == 'User') {
      this.rolesState = true;
    } else if (this.getRoles == 'otpUser') {
      this.rolesState = false;
    }
    //console.log("Role State: " + this.rolesState);
  }

  // onLogoutState() {
  //   if (this.getRoles == 'User') {
  //     this.authService.logoutUser();
  //   }
  // }

  loginForm = new FormGroup({
    loginEmail: new FormControl('', Validators.required),
    loginPassword: new FormControl('', Validators.required),
  });

  //Login validation
  get loginEmail() {
    return this.loginForm.get('loginEmail');
  }
  get loginPassword() {
    return this.loginForm.get('loginPassword');
  }

  onLogin() {
    let postData: any = this.loginForm.value;
    if (!postData.loginEmail) {
      this.errorState = true;
      this.toastr.error("Email is Required");
    }
    if (!postData.loginPassword) {
      this.errorState = true;
      this.toastr.error("Password is Required");
    }
    if (this.errorState == false) {
      const formData = new FormData();

      //console.log("postData" + postData.loginEmail, postData.loginPassword)
      formData.append("userEmail", postData.loginEmail)
      formData.append("userPassword", postData.loginPassword)

      let authObs!: Observable<MyResponse<userData>>;
      authObs = this.authService.login(formData)

      authObs.subscribe(resData => {
        this.toastr.success(resData.message);
        let role = 'User';
        localStorage.setItem('role', JSON.stringify(role));
        const getRole = JSON.parse(localStorage.getItem('role') as string);
        if (getRole == "User") {
          this.dataStorageService.userExists.next(true);
        }
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.loginForm.reset();
    }
  }

  //registration
  registerForm = new FormGroup({
    resName: new FormControl('', Validators.required),
    resEmail: new FormControl('', Validators.required),
    resPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]),
    resCPassword: new FormControl('', Validators.required),
    resCNo: new FormControl('', [Validators.required, Validators.pattern(/^(0|91)?[6-9][0-9]{9}$/)])
  })

  //register validation
  get resName() {
    return this.registerForm.get('resName');
  }
  get resEmail() {
    return this.registerForm.get('resEmail');
  }
  get resPassword() {
    return this.registerForm.get('resPassword');
  }
  get resCPassword() {
    return this.registerForm.get('resCPassword');
  }
  get resCNo() {
    return this.registerForm.get('resCNo');
  }

  onRegister() {
    //console.log(this.registerForm.value)
    let postData: any = this.registerForm.value;

    if (!postData.resName) {
      this.errorState = true;
      this.toastr.error("Username is required");
    }
    if (!postData.resEmail) {
      this.errorState = true;
      this.toastr.error("email is required");
    }
    if (!postData.resCNo) {
      this.errorState = true;
      this.toastr.error("Contactno is required");
    }
    if (!postData.resPassword) {
      this.errorState = true;
      this.toastr.error("Password is required");
    }
    if (!postData.resCPassword) {
      this.errorState = true;
      this.toastr.error("Confirm password is required");
    }
    if (postData.resPassword != postData.resCPassword) {
      this.errorState = true;
      this.toastr.error("Password and confirm password is required");
    }
    if (this.errorState == false) {
      const formData = new FormData();

      formData.append("userName", postData.resName);
      formData.append("userEmail", postData.resEmail)
      formData.append("userContactNo", postData.resCNo)
      formData.append("userPassword", postData.resPassword)
      formData.append("userPasswordConfirm", postData.resCPassword)

      let authObs!: Observable<MyResponse<userData>>;
      authObs = this.authService.register(formData)

      authObs.subscribe(resData => {
        this.toastr.success(resData.message);
        // this.router.navigate(['/dashboard']);
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.registerForm.reset();
    }
  }
}
