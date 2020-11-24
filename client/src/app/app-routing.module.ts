import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyComponent } from './pages/survey/survey.component';
import { EditComponent } from './pages/edit/edit.component';
import { HomeComponent } from './pages/home/home.component';
import { ResponseComponent } from './pages/response/response.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, data: {title: 'Home'}},
  {path: 'survey', component: SurveyComponent, data: {title: 'Survey'}},
  {path: 'survey/add', component: EditComponent, data: {title: 'Add'}},
  {path: 'survey/edit/:id', component: EditComponent, data: {title: 'Edit'}},
  {path: 'survey/response/:id', component: ResponseComponent, data: {title: 'Response'}},
  {path: 'login', data: {title: 'Login'}, redirectTo: '/admin/auth', pathMatch: 'full'},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)/*, canActivate[StoreFirstGuard]*/},
  {path: '', redirectTo: '/home', pathMatch: 'full', data: {title: 'Welcome'}}, // For index page
  {path: '**', redirectTo: '/survey'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
