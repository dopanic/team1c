import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/auth.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  constructor(private AuthService: AuthService,
              private router: Router) { }

  ngOnInit(): void 
  {
    this.user = new User();
  }
  onLogoutClick(): void
  {
    this.AuthService.logout();
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean
  {
    const result = this.AuthService.authenticated;
    if(result)
    {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    return result;
  }

}
