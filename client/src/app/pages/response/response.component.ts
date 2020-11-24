import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Express API

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {
  responseForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.responseForm = this.fb.group({
      title: [''],
      answersArr: this.fb.array([
          this.initQuestions()
      ])
    });
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (typeof(id) !== undefined) {
      this.setSurvey(id);
    }
  }

  setSurvey(id: string): void{
    this.apiService.getSurveyOne(id).subscribe(data => {
      const dataQuestionsArr = data.questionsArr;
      for (let i = 0; i < dataQuestionsArr.length - 1; i++) {
        this.addQuestion();
      }
      for (const questionArr of dataQuestionsArr) {
        questionArr.answer = '';
      }
      this.responseForm.setValue({
        title: data.title,
        answersArr: dataQuestionsArr
      });
    });
  }

  initQuestions(): FormGroup {
    return this.fb.group({
        question: [''],
        answer: ['', Validators.required]
    });
  }

  addQuestion(): void {
    const control = this.responseForm.controls.answersArr as FormArray;
    control.push(this.initQuestions());
  }

  onSubmit(): boolean {
    if (!this.responseForm.valid) {
      return false;
    } else {
      if (window.confirm('Once you submit, you cannot change the answers. Are you sure?')) {
        const id = this.actRoute.snapshot.paramMap.get('id');
        let responseFormValue = this.responseForm.value;
        responseFormValue.surveyId = id;
        this.apiService.createResponse(responseFormValue)
        .subscribe(res => {
            this.router.navigateByUrl('/survey');
            console.log('A response created successfully.');
          }, (err) => {
            console.log(err);
          });
      }
    }
  }

}
