import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Express API
import { AuthService } from 'src/app/model/auth.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})

export class SurveyComponent implements OnInit {

  surveys: any = [];
  h1Title: string;
  allList: boolean;

  constructor(
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.getSurveyList();
    this.isAllList();
  }

  ngOnInit(): void { }

  getSurveyList(): void {
    this.apiService.getSurveyList().subscribe(data => {
      this.surveys = data;
    });
  }

  removeSurvey(survey: any, index: number): void {
    if (window.confirm('Are you sure?')) {
      this.apiService.removeSurvey(survey._id).subscribe(data => {
        this.surveys.splice(index, 1);
      });
    }
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  isAllList(): void {
    this.actRoute.data.subscribe(data => {
      this.h1Title = data.title;
      this.allList = data.allList;
    });
  }

  hasPrivilege(userId): boolean
  {
    if (this.authService.authenticated) {
      const userArr = JSON.parse(localStorage.getItem('user'));
      if (userId === userArr.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}
