import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
const SHARED_KEY = 'shared-data';
const SEARCH_SHARED_KEY = 'search-shared-data';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private functionTriggerSubject = new Subject<void>(); // Subject for triggering function
  private functionTriggerSubjectsearch = new Subject<void>(); // Subject for triggering function

  constructor() { }

  // Method to trigger the function call
  triggerFunction() {
    this.functionTriggerSubject.next();
  }
  triggerFunctionsearch() {
    this.functionTriggerSubjectsearch.next();
  }
  // Observable for components to subscribe to
  get functionTriggerObservable() {
    return this.functionTriggerSubject.asObservable();
  }
  get functionTriggerObservablesearch() {
    return this.functionTriggerSubjectsearch.asObservable();
  }
  public savedata(data: string): void {
    window.localStorage.removeItem(SHARED_KEY);
    window.localStorage.setItem(SHARED_KEY, data);
  }
  public getdata(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(SHARED_KEY);
    } else {
      // Handle the case where localStorage is not available
      // console.error("localStorage is not supported in this environment");
      return null;
    }
  }
  public savesearchdata(data: string): void {
    window.localStorage.removeItem(SEARCH_SHARED_KEY);
    window.localStorage.setItem(SEARCH_SHARED_KEY, data);
  }
  public getsearchdata(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(SEARCH_SHARED_KEY);
    } else {
      // Handle the case where localStorage is not available
      // console.error("localStorage is not supported in this environment");
      return null;
    }
  }


}
