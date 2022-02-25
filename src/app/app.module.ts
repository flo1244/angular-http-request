import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { LoggingInterceptorService } from './logging-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {}


//HTTP request  URL(API endpoint) -->/posts/1
//HTTP Ver -> POST, GET, PUT,... what you want to do with the data. 
//Headers (Metadata) ->("Content-Type": "application/json") 
//Body (title: "New Post")

//HttpClientModule needs to be added to imports

//Interceptors:
// So this is just a dependency injection syntax supported by Angular that allows it to register a service

// under a different identifier and to have actually multiple services under that identifier, which will

// then all be provided and injected. Now Angular will do the rest, it will automatically grab all your

// HTTP interceptors and run their intercept method whenever a request leaves the application.

//the order of interceptors matter depending on which one you want to execute first. 