import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(private http: HttpClient) { }

  // Example function to fetch data from the API
  getRetailjiProducts(): Observable<any> {
    return this.http.post("https://node.express.tensoftware.in", { type: "jewellers" });
  }
}
