import { Component, OnInit } from '@angular/core';
import {NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService} from '../../model/auth.service';

import { User } from '../../model/user.model';

@Component({

  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent implements OnInit {

  public user: User;
  public errorMessage: string;
  constructor(private router: Router,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.user = new User();
  }
  register ( form : NgForm) : void
  {
    if(form.valid)
    {
      this.auth.registerUser(this.user).subscribe(data =>{
        if(data.success)
        {
          this.auth.storeUserData(data.token, data.user);
          this.router.navigateByUrl('register');
        }
        else
        {
          this.errorMessage = 'Could Not Register';
        }
      });

      this.router.navigateByUrl("survey");
    }
    else
    {
      this.errorMessage = 'Form Data Invalid';
    }
  }
}
