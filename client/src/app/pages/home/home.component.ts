import { Component, OnInit } from '@angular/core';
import { BasePageComponent} from '../../partials/base-page/base-page.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BasePageComponent implements OnInit {

  Survey: object = [];

  constructor(route: ActivatedRoute, private apiService: ApiService) {
    super(route);
    this.getSurveyList();
   }

  ngOnInit(): void {
    this.title = 'Home';
  }

  getSurveyList(): void{
    this.apiService.getSurveyList().subscribe((surveyList) => {
      this.Survey = surveyList;
      console.log(this.Survey);
    });
  }
}
