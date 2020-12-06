import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Express API
import Swal from 'sweetalert2'

import { AuthService } from 'src/app/model/auth.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  user: User;
  surveyForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = new User();
    this.surveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      userId: this.getUserId(),
      questionsArr: this.fb.array([
          this.initQuestions(),
      ])
    });
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.setSurvey(id);
    }
  }

  getUserId(): string {
    if (this.authService.authenticated)
    {
      const userArr = JSON.parse(localStorage.getItem('user'));
      return userArr.id;
    } else {
      return null;
    }
  }

  setSurvey(id: string): void {
    this.apiService.getSurveyOne(id).subscribe(data => {
      for (let i = 0; i < data.questionsArr.length - 1; i++) {
        this.addQuestion();
      }
      this.surveyForm.setValue({
        title: data.title,
        userId: data.userId,
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
            // Success message to User
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Updated successfully !',
              showConfirmButton: false,
              timer: 1500
            })
          }, (err) => {
            console.log(err);
          });
        } else {
          this.apiService.createSurvey(this.surveyForm.value)
          .subscribe(res => {
              this.router.navigateByUrl('/survey');
              console.log('Created successfully.');
            // Success message to User
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Now your survey is ready !',
              showConfirmButton: false,
              timer: 1500
            })
            }, (err) => {
              console.log(err);
            });
        }
      }
    }
  }

}
