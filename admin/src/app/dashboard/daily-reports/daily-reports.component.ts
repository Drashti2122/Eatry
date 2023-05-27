import { Component } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DailyReportsService } from 'src/app/shared/service/reports/daily-reports.service';

@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.css']
})
export class DailyReportsComponent {
  errorMsg!: string;
  defaultValue: number = 5;
  getTopMost: any;
  p = 0;
  constructor(private dailyReportsService: DailyReportsService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getDailyReportsData();
  }

  getDailyReportsData() {
    let authObs!: Observable<any>;
    authObs = this.dailyReportsService.getDailyReport(this.defaultValue);
    authObs.subscribe(resData => {
      console.log(resData?.data);
      this.getTopMost = resData?.data;
    }, error => {
      //console.log(error);
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    });
  }

  onNumberChange(value: number) {
    this.defaultValue = value;
    this.getDailyReportsData();
  }
}
