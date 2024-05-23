import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(private http: HttpClient) { }

  getRetailjiProducts(): Observable<any> {
    const url = "https://node.express.tensoftware.in";
    const body = { type: "jewellers" };

    const req = new HttpRequest('POST', url, body, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      filter(event => event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.Response),
      map(event => this.getEventMessage(event)),
      catchError(error => of({ progress: 100, data: null, error }))
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        return { progress: Math.round(100 * event.loaded / (event.total ?? event.loaded)), data: null };
      case HttpEventType.Response:
        return { progress: 100, data: event.body };
      default:
        return { progress: 0, data: null };
    }
  }
}
