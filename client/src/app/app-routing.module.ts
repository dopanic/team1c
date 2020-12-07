import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyComponent } from './pages/survey/survey.component';
import { EditComponent } from './pages/edit/edit.component';
import { MysurveyComponent } from './pages/mysurvey/mysurvey.component';
import { HomeComponent } from './pages/home/home.component';
import { RegComponent } from './admin/reg/reg.component';
import { AuthGuard } from './admin/auth/auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent, data: {title: 'Home'}},
  {path: 'survey', component: SurveyComponent, data: {title: 'Survey', allList: true}},
  {path: 'mysurvey', component: MysurveyComponent, data: {title: 'Survey'}, canActivate: [AuthGuard]},
  {path: 'survey/add', component: EditComponent, data: {title: 'Add'}, canActivate: [AuthGuard]},
  {path: 'survey/edit/:id', component: EditComponent, data: {title: 'Edit'}, canActivate: [AuthGuard]},
  {path: 'register', component: RegComponent, data: {title: 'register'}},
  {path: 'login', data: {title: 'Login'}, redirectTo: '/admin/auth', pathMatch: 'full'},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)/*, canActivate[AuthGuard]*/},
  {path: '', redirectTo: '/home', pathMatch: 'full', data: {title: 'Welcome'}}, // For index page
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
