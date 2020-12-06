import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Express API
import Swal from 'sweetalert2'



@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})

export class SurveyComponent implements OnInit {

  surveys: any = [];

  constructor(
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    // super(route);
    this.getSurveyList();
  }

  ngOnInit(): void {
    // this.title = 'ABCD?';
  }

  getSurveyList(): void {
    this.apiService.getSurveyList().subscribe(data => {
      this.surveys = data;
    });
  }

  removeSurvey(survey: any, index: number): void {
    if (window.confirm('Are you sure?')) {
      this.apiService.removeSurvey(survey._id).subscribe(data => {
        this.surveys.splice(index, 1);
        // Success message to User
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The survey is deleted !',
          showConfirmButton: false,
          timer: 1500
        })
        
      });
    }
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}
