import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartContainerComponent } from './chart-container/chart-container.component';
import { HttpClientModule } from '@angular/common/http';
import { ComponentInfoComponent } from './component-info/component-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';


@NgModule({
  declarations: [
    AppComponent,
    ChartContainerComponent,
    ComponentInfoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
