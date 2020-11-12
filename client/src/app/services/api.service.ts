import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

const PROTOCOL = 'http';
const PORT = 3000;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUri: string;

  // private httpOptions =
  //   {
  //       headers: new  HttpHeaders({
  //           'Content-Type': 'application/json',
  //           'Access-Control-Allow-Origin': '*',
  //           'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  //       })
  //   }; 

  constructor(private http: HttpClient) {
    this.baseUri = `${PROTOCOL}://${location.hostname}:${PORT}`;
  }

  // read: get a full list
  getSurveyList(): any {
    const url = `${this.baseUri}/survey/list`;
    return this.http.get(url);
  }

  // read: get a one survey
  getSurveyOne(id: string): Observable<any> {
    const url = `${this.baseUri}/survey/view/${id}`;
    return this.http.get(url);
  }

  // update: edit a survey
  updateSurvey(id: string, data: any): Observable<any> {
    const url = `${this.baseUri}/survey/edit/${id}`;
    return this.http.post(url, data);
  }

  // create: add a survey
  createSurvey(data): Observable<any> {
    const url = `${this.baseUri}/survey/add`;
    return this.http.post(url, data);
  }

  // delete: delete a survey
  removeSurvey(id): Observable<any> {
    const url = `${this.baseUri}/survey/del/${id}`;
    return this.http.get(url);
  }

}
