import { Component, OnInit } from '@angular/core';
import { Label, Color } from 'ng2-charts';
import { Limit } from '../models/limit';
import { DataService } from '../services/data.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {
  private limits:Limit;

  public pieChartLabels = ['Used','Limit'];
  public pieChartData_floating = [];
  public pieChartData_instances = [];
  public pieChartData_cores = [];
  public pieChartData_ram = [];
  public pieChartType = 'pie';
  public userName: string;
  public userMail: string;
  public missingUserCredentialsMessage: string;
  public pieChartColors: Array < any > = [{
    backgroundColor: ['#607D8B', 'rgba(148,159,177,0.2)'],

 }];

  constructor( private dataService: DataService, private messageService : MessageService) { }

  ngOnInit() {
    console.log("user mail and name: ", this.dataService.getUserEmail(), this.dataService.getUserName());
    // console.log(this.dataService.user_name, this.dataService.getUserName());
    this.userName = this.dataService.getUserName();
    this.userMail = this.dataService.getUserEmail();
    this.missingUserCredentialsMessage = '';
    if (!(this.userName || this.userMail)) {
      this.missingUserCredentialsMessage = 'WARNING, there was a problem loading your credentials, please contact admin.';
    }
    this.dataService.getLimit().subscribe(
      data=> {
        this.limits = data;
        this.pieChartData_floating.push(this.limits.floating_ips.used);
        this.pieChartData_floating.push(this.limits.floating_ips.limit-this.limits.floating_ips.used);

        this.pieChartData_instances.push(this.limits.instances.used);
        this.pieChartData_instances.push(this.limits.instances.limit-this.limits.instances.used);

        this.pieChartData_cores.push(this.limits.cores.used);
        this.pieChartData_cores.push(this.limits.cores.limit-this.limits.cores.used);

        this.pieChartData_ram.push(this.limits.ram.used);
        this.pieChartData_ram.push(this.limits.ram.limit-this.limits.ram.used);
      },
      //err=>{this.messageService.add("Http Error => "+JSON.stringify(err));
      //}

    )

  }
  refresh():void {
    this.pieChartData_floating.length = 0;
    this.pieChartData_instances.length = 0;
    this.pieChartData_cores.length = 0;
    this.pieChartData_ram.length = 0;
    this.dataService.getLimit().subscribe(
      data=> {
        this.limits = data;
        console.log("triyng to refresh ");
        console.log(this.limits);
        this.pieChartData_floating.push(13);
        this.pieChartData_floating.push(20);
      }
    );
  }


}
