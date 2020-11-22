import { Component, OnInit } from '@angular/core';
import {NgForm } from '@angular/forms';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService} from '../../model/auth.service';
import { User } from '../../model/user.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  log(x) {console.log(x);} 
  ngOnInit(): void {
  }
}
