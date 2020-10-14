import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Limit } from '../models/limit'
import { Keypair } from '../models/key_pair';
import { Network } from '../models/network';
import { SecurityGroup } from '../models/security_groups'
import { MessageService } from '../services/message.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { InstanceData } from '../models/instance_data';
import { MetaData } from '../models/metadata';
import { Inject } from '@angular/core';
import { FIP } from '../models/floating_ips';
import { Instance } from '../models/instance';


export class DialogData {
  //private keys: Keypair[];
  private networks: Network[];
  private instanceData = new InstanceData();
  public VolumeType: {};
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  limits: Limit;


  constructor(private http: HttpClient, private dataService: DataService, private messageService: MessageService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }



  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  openDialog(type: string): void {

    const dialogRef = this.dialog.open(Dialogview, {
      width: '0px auto;',
      height: '0px auto;',
      data: {
        VolumeType: type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}




@Component({
  selector: 'dialog-view',
  templateUrl: 'dialog-view.html',
  styleUrls: ['./dialog-view.css']
})
export class Dialogview {
  public limit: Limit;
  public selectedKey;
  public selectedNetwork;
  private metaData = new MetaData();
  private instanceData = new InstanceData();
  public isVisible = false;
  public keys: Keypair[];
  public networks: Network[];
  public securityGroups: SecurityGroup[];
  public securityGroup: SecurityGroup;
  private hasSsh: boolean = false;
  private hasIcmp: boolean = false;
  private hasHttp: boolean = false;
  private hasHttps: boolean = false;
  private hasRdp: boolean = false;
  public popupMessage: string = "";
  public privateKey: string;
  public goodKeys: boolean = true;
  public goodRescources: boolean = true;
  public showFIP: boolean = false;
  public gotFIP: boolean = true;
  public isWindows: boolean;
  public floatingIPs: FIP[];
  public floatingIp: FIP;
  public fipNetwork: Network;
  public instance: Instance;
  public ramLimit;
  public flavor: string;
  public image: string;

constructor(
    public dialogRef: MatDialogRef<Dialogview>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataService: DataService) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.checkRules();
    this.checkRescources();
    this.getSelectables();
    if (this.data.VolumeType === 'bio') {
      this.flavor = 'standard.2core-16ram';
      this.image = 'debian-9-x86_64_bioconductor';
      this.ramLimit = 16;
      this.isWindows = false;
    } else if (this.data.VolumeType === 'win') {
      this.flavor = 'standard.medium';
      this.image = 'windows-server-2019-standard-eval-x86_64';
      this.ramLimit = 4;
      this.isWindows = true;
    } else if (this.data.VolumeType === 'ubuntu') {
      this.flavor = 'standard.medium';
      this.image = 'ubuntu-focal-x86_64';
      this.ramLimit = 4;
      this.isWindows = false;
    }

  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then();
  }


  getSelectables(): void {  //sets up ssh keys and networks to be displayed in form fields

    this.dataService.getNetwork().subscribe(
      data => {
        this.networks = data;
        for (let network of this.networks) {
          if (network.name == "78-128-250-pers-proj-net") {
            this.selectedNetwork = network.id;
          }
          if (network.name == "public-cesnet-78-128-250-PERSONAL") {
            this.fipNetwork = network;
          }
        }
        this.getKeys();
      },
      err => {

      }
    )
  }

  getKeys(): void {
    this.dataService.getKeys().subscribe(
      data => {
        this.keys = data;
        this.checkKeys();
      },
      err => {

      }
    )
  }

  checkRules(): void {
    this.dataService.getSecurityGroups().subscribe(data => {
      this.securityGroups = data;
      for (let group of this.securityGroups) {
        if (group.name == 'default') {
          this.securityGroup = group;
          break;
        }
      }
      for (let rule of this.securityGroup.security_group_rules) {
        if (rule.protocol === "tcp") {
          if (rule.port_range_max === 22) {
            this.hasSsh = true;
          }
          if (rule.port_range_max === 80) {
            this.hasHttp = true;
          }
          if (rule.port_range_max === 443) {
            this.hasHttps = true;
          }

        }
        if (rule.protocol === "icmp") {
          this.hasIcmp = true;
        }
        if(rule.protocol === "rdp") {
          this.hasRdp = true;
        }
      }
      if (!this.hasIcmp) {
        this.dataService.postSecurityRule(this.securityGroup.id, "all_icmp");
      }
      if (!this.hasSsh) {
        this.dataService.postSecurityRule(this.securityGroup.id, "ssh");
      }
      if (!this.hasHttp) {
        this.dataService.postSecurityRule(this.securityGroup.id, "http");
      }
      if (!this.hasHttps) {
        this.dataService.postSecurityRule(this.securityGroup.id, "https");
      }
      if (!this.hasRdp && this.isWindows) {
        this.dataService.postSecurityRule(this.securityGroup.id, "rdp");
      }
    },
      err => {
        console.log(err);
      });
  }

  checkKeys(): void {
    if (this.keys.length == 0) {
      this.isVisible = true;
      this.goodKeys = false;
    } else {
      this.goodKeys = true;
      this.isVisible = true;
    }
  }

  createKey(key_name: string): void {
    this.dataService.postKeyPairs(key_name).subscribe(data => {
      this.privateKey = data.private_key;
    });
  }

  checkRescources(): void {
    this.dataService.getLimit().subscribe(data => {
      this.limit = data;
      if ((this.limit.cores.limit - this.limit.cores.used) < 2) {
        this.goodRescources = false;
        this.isVisible = true;
        this.popupMessage = 'You dont have free Cores, you need 2 cores free \n';
      }
      if ((this.limit.instances.limit - this.limit.instances.used) < 1) {
        this.goodRescources = false;
        this.isVisible = true;
        this.popupMessage = 'You have too many Instances created \n';
      }
      if ((this.limit.ram.limit - this.limit.ram.used) < this.ramLimit) {
        this.goodRescources = false;
        this.isVisible = true;
        this.popupMessage += 'You dont have enough free RAM, you need ' + this.ramLimit + 'B free \n' ;
      }
    });
  }


  onNoClick(name: string): void {
    var usr_name = this.dataService.getUserName();
    var usr_mail = this.dataService.getUserEmail();

    this.isVisible = false;
    this.metaData = { Bioclass_user: usr_name, Bioclass_email: usr_mail };
    console.log(this.metaData);
    this.instanceData = {
      flavor: this.flavor, image: this.image,
      key_name: this.selectedKey, servername: name, network_id: this.selectedNetwork, metadata: this.metaData
    };
    this.dataService.postInstance(this.instanceData).subscribe(data => {

      this.instance = data;
      this.postFIP();
    });

  }

  postFIP(): void {
    this.isVisible = false;
    this.showFIP = false;
    this.gotFIP = true;
    if (this.instance.status != "ACTIVE") {
      this.delay(1500).then(any => {
        this.dataService.getInstance(this.instance.id).subscribe(
          data => {
            this.instance = data
            this.postFIP();
          });
      })
    } else {
      this.dataService.postFloatinIp(this.instance.id, this.fipNetwork.id).subscribe(
        data => {
          console.log(JSON.stringify(data));
          this.isVisible = true;
          this.floatingIp = data;
          this.showFIP = true;

        }, err => {
          console.log(err);
          this.isVisible = true;
          this.showFIP = true;
          this.gotFIP = false;

        });
    }

  };

  continueToMain(): void {
    this.goodKeys = true;
    this.getSelectables();
  }

  close(): void {
    this.dialogRef.close();
  }


}


