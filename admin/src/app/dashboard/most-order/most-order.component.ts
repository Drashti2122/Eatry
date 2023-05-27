import { Component } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DailyReportsService } from 'src/app/shared/service/reports/daily-reports.service';

@Component({
  selector: 'app-most-order',
  templateUrl: './most-order.component.html',
  styleUrls: ['./most-order.component.css']
})
export class MostOrderComponent {
  errorMsg!: string;
  defaultValue: number = 5;
  getTopMost: any;
  p = 0;

  constructor(private dailyReportsService: DailyReportsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getTopMostItemData();
  }

  getTopMostItemData() {
    let authObs!: Observable<any>;
    authObs = this.dailyReportsService.topMostItem(this.defaultValue);
    authObs.subscribe(resData => {
      //console.log(resData?.data);
      this.getTopMost = resData?.data;
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });
  }

  onNumberChange(value: number) {
    this.defaultValue = value;
    this.getTopMostItemData();
  }
}
