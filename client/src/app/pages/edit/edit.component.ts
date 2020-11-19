import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Express API

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  surveyForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.surveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      questionsArr: this.fb.array([
          this.initQuestions(),
      ])
    });
    const id = this.actRoute.snapshot.paramMap.get('id');
    if(typeof(id) !== undefined) {
      this.setSurvey(id);
    }
  }

  setSurvey(id: string): void{
    this.apiService.getSurveyOne(id).subscribe(data => {
      for (let i = 0; i < data.questionsArr.length - 1; i++) {
        this.addQuestion();
      }
      this.surveyForm.setValue({
        title: data.title,
        questionsArr: data.questionsArr
      });
    });
  }

  initQuestions(): FormGroup {
    return this.fb.group({
        question: ['', Validators.required]
    });
  }

  addQuestion(): void {
    const control = this.surveyForm.controls.questionsArr as FormArray;
    control.push(this.initQuestions());
  }

  removeQuestion(i: number): void {
    if (window.confirm('Are you sure?')) {
      const control = this.surveyForm.controls.questionsArr as FormArray;
      control.removeAt(i);
    }
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
