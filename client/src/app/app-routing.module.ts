import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyComponent } from './pages/survey/survey.component';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
  {path: 'survey', component: SurveyComponent, data: {title: 'Survey'}},
  {path: 'survey/add', component: EditComponent, data: {title: 'Add'}},
  {path: 'survey/edit/:id', component: EditComponent, data: {title: 'Edit'}},
  {path: 'login', data: {title: 'Login'}, redirectTo: '/admin/auth', pathMatch: 'full'},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)/*, canActivate[StoreFirstGuard]*/},
  {path: '', redirectTo: '/survey', pathMatch: 'full', data: {title: 'Welcome'}}, // For index page
  {path: '**', redirectTo: '/survey'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
