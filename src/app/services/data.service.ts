import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MessageService } from './message.service';
import { Limit } from '../models/limit';
import { Network } from '../models/network';
import { Token } from '../models/token';
import { Keypair} from '../models/key_pair';
import { MetaData } from '../models/metadata';
import { Project, ProjectList } from '../models/projects';
import { InstanceData } from '../models/instance_data';
import { Instance } from '../models/instance';
import { CookieService} from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SecurityGroup } from "../models/security_groups";
import { FIP } from '../models/floating_ips';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {  //DataService takes care of all http requests and comunication with API
  private apiURL = environment.apiUrl;//"http://localhost:5000";
  private project_id:string;
  // private user_name:string;
  // private user_email:string;



  constructor(private httpClient: HttpClient , private messageService: MessageService, private cookieService:CookieService, private router:Router) { }

  login(inputToken:Token):any{
      return this.httpClient.post(this.apiURL+"/",inputToken);
  }

  /*
    If you need to get different data from a given GET request go to ../models/<the object you want> and add parameter,
    it will be automatically parsed from the JSON response
  */

  deleteInstance(id): Observable<Instance> {
    console.log("killing machine");
    return this.httpClient.delete<Instance>(this.apiURL + "/instances/" + id + "/");
  }
  deleteFloatingIP(ip) {
    return this.httpClient.delete(this.apiURL + "/floating_ips/" + ip + "/");
  }


  getLimit(): Observable<Limit> {
      return this.httpClient.get<Limit>(this.apiURL+"/limits/");
  }

  getNetwork(): Observable<Network[]> {
    return this.httpClient.get<Network[]>(this.apiURL+"/networks/");
  }

  getKeys (): Observable<Keypair[]> {
    return this.httpClient.get<Keypair[]>(this.apiURL+"/keypairs/");
  }

  getInstances (): Observable<Instance[]>{
    return this.httpClient.get<Instance[]>(this.apiURL+"/instances/");
  }

  getInstance (id:string): Observable<Instance>{
    return this.httpClient.get<Instance>(this.apiURL+"/instances/"+id+"/");
  }

  getSecurityGroups (): Observable<SecurityGroup[]>{
    return this.httpClient.get<SecurityGroup[]>(this.apiURL+"/security_groups/");
  }

  getProjects():Observable<ProjectList>{
    return this.httpClient.get<ProjectList>(this.apiURL+"/projects/");
  }

  getFloatingIPS():Observable<FIP[]>{
    return this.httpClient.get<FIP[]>(this.apiURL+"/floating_ips/")
  }

  putProject(projectid:Project):void{
    this.httpClient.put(this.apiURL+'/',{project_id:projectid},{observe: 'response'}).toPromise().then((data:any) => {
      this.router.navigate(['dashboard']);  //after a project is selected the authentization proces is done and used gets redirected to dasboard
    },
    (err:any) => {
        console.log(err);
    })
  }


  postInstance(instanceData:InstanceData):Observable<Instance>{
    return this.httpClient.post<Instance>(this.apiURL+"/instances/", instanceData);
  }

  postKeyPairs(name:string):Observable<Keypair>{
    return this.httpClient.post<Keypair>(this.apiURL+"/keypairs/",{keyname:name});
  };

  // postSecurityRulesSsh(id:string):void{
  //   this.httpClient.post(this.apiURL+"/security_groups/"+id+"/security_group_rules/",{type:"ssh"}).toPromise().then((data:any) => {
  //   },
  //   (err:any) =>{
  //     console.log(err);
  //   });
  //
  // }
  //
  // postSecurityRulesIcmp(id:string):void{
  //   this.httpClient.post(this.apiURL+"/security_groups/"+id+"/security_group_rules/",{type:"all_icmp"}).toPromise().then((data:any) => {
  //   },
  //   (err:any) =>{
  //     console.log(err);
  //   });
  //
  // }
  //
  // postSecurityRulesHttp(id:string):void{
  //   this.httpClient.post(this.apiURL+"/security_groups/"+id+"/security_group_rules/",{type:"http"}).toPromise().then((data:any) => {
  //   },
  //   (err:any) =>{
  //     console.log(err);
  //   });
  //
  // }
  //
  // postSecurityRulesHttps(id:string):void{
  //   this.httpClient.post(this.apiURL+"/security_groups/"+id+"/security_group_rules/",{type:"https"}).toPromise().then((data:any) => {
  //   },
  //   (err:any) =>{
  //     console.log(err);
  //   });
  //
  // }

  postSecurityRule(id:string, type:string):void{
    this.httpClient.post(this.apiURL+"/security_groups/"+id+"/security_group_rules/",{type:type}).toPromise().then((data:any) => {
      },
      (err:any) =>{
        console.log(err);
      });
    }
  postFloatinIp(instance_id:string, network_id:string):Observable<FIP>{
    return this.httpClient.post<FIP>(this.apiURL+"/floating_ips/", {instance_id:instance_id,network_id:network_id});
  }

  putMetadata(instance:Instance, metaData:MetaData):void{
    this.httpClient.put(this.apiURL+"/metadata/"+instance.id+"/",metaData,{observe: 'response'}).toPromise().then((data:any) => {
    },
    (err:any) =>{
      console.log(err);
    });
  }

  /*
    getters and setters added for ease of passing important data from loginComponent to dashboardComponent, parent child structure isnt in place
  */

  setUserName(name:string):void{
    console.log('username was set');
    localStorage.setItem("userName", name);
  }

  getUserName():string{
    return localStorage.getItem('userName');

  }

  setProjectId(id:string):void{
    this.project_id=id;
  }

  getProjectId():string{
    return this.project_id;
  }

  setUserEmail(mail:string):void{
    localStorage.setItem("userEmail", mail);
  }

  getUserEmail():string{
    return localStorage.getItem('userEmail');

  }

}
