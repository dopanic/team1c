import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyComponent } from './pages/survey/survey.component';
import { EditComponent } from './pages/edit/edit.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {path: 'survey', component: SurveyComponent, data: {title: 'Survey'}},
  {path: 'survey/add', component: EditComponent, data: {title: 'Add'}},
  {path: 'survey/edit/:id', component: EditComponent, data: {title: 'Edit'}},
  {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  {path: '', redirectTo: '/survey', pathMatch: 'full', data: {title: 'Welcome'}}, // For index page
  {path: '**', redirectTo: '/survey'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
