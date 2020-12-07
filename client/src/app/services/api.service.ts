import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

const PROTOCOL = 'https';
// const PORT = ':3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  user: User;
  baseUri: string;
  authToken: string;

  private httpOptions =
    {
        headers: new  HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        })
    };

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {
    this.baseUri = `${PROTOCOL}://${location.hostname}/api`;
    this.user = new User();
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
    if(this.loggedIn)
    {
      const url = `${this.baseUri}/survey/del/${id}`;
      return this.http.get(url);
    }
  }

  registerUser(user): Observable<any> {
    const url = `${this.baseUri}/users/signup`;
    return this.http.post(url, user);
  }

  authenticate(user: User): Observable<any>
  {
    const url = `${this.baseUri}/users/login`;
    return this.http.post<any>(url, user, this.httpOptions);
  }
  storeUserData(token: any, user:User): void
  {
    localStorage.setItem('id_token', 'Bearer' +token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  loggedIn(): boolean
  {
    return !this.jwtService.isTokenExpired(this.authToken);
  }
  logout(): void
  {
    this.authToken = null;
    this.user = null;
    localStorage.clear();

  }
  getSurveys(): Observable<any>
  {
    this.loadToken();
    return this.http.get<any>(this.baseUri + 'surveys');
  }
  private loadToken(): void
  {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.authToken);
  }
}
