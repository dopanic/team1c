import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Express API

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  survey: any;
  surveyForm: FormGroup;
  questions: any;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    // super(route);
    this.surveyForm = this.fb.group({
      title: '',
      question1: '',
      question2: '',
      question3: ''
    });
  }

  ngOnInit(): void {
    // this.title = 'DEFG?';
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.getSurveyOne(id);
  }

  getSurveyOne(id: string): void{
    this.apiService.getSurveyOne(id).subscribe(data => {
      this.surveyForm.setValue({
        title: data['title'],
        question1: data['question1'],
        question2: data['question2'],
        question3: data['question3']
      });
    });
  }

  onSubmit(): boolean {
    if (!this.surveyForm.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        const id = this.actRoute.snapshot.paramMap.get('id');
        if (id) {
          this.apiService.updateSurvey(id, this.surveyForm.value)
          .subscribe(res => {
            this.router.navigateByUrl('/survey');
            console.log('Updated successfully.');
          }, (err) => {
            console.log(err);
          });
        } else {
          this.apiService.createSurvey(this.surveyForm.value)
          .subscribe(res => {
              this.router.navigateByUrl('/survey');
              console.log('Created successfully.');
            }, (err) => {
              console.log(err);
            });
        }
      }
    }
  }

}
