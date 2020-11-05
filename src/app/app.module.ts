import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from "@angular/common";
import { ChartsModule } from 'ng2-charts';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule} from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent, LoginDialog } from './login/login.component';
import { DashboardComponent, Dialogview } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { UserOverviewComponent } from './user-overview/user-overview.component';

import { DataService } from './services/data.service';
import { MessagesComponent } from './messages/messages.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InstancesComponent } from './instances/instances.component';
import { CallbackComponent } from './callback/callback.component';
import { InstanceTableComponent } from './instance-table/instance-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    UserOverviewComponent,
    MessagesComponent,
    InstancesComponent,
    Dialogview,
    LoginDialog,
    CallbackComponent,
    InstanceTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [
    Dialogview,
    LoginDialog,
  ],
  providers: [DataService, CookieService, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}, MatDialogModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

export class PizzaPartyAppModule { }

