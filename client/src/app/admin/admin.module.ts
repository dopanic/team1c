import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { AuthComponent } from './auth/auth.component';
import { AdminComponent} from './admin.component';
import { AuthGuard } from './auth/auth.guard';
import { RegComponent } from './reg/reg.component';



const routing = RouterModule.forChild([
    { path: 'auth', component: AuthComponent},
    { path: 'main', component: AdminComponent, canActivate:[AuthGuard],
    children: [{path: '**', redirectTo: 'survey'}]},
    { path: '**', redirectTo: 'auth'},

]);

@NgModule({
    imports: [CommonModule, FormsModule, routing],
    providers: [AuthGuard],
    declarations: [AuthComponent, AdminComponent, RegComponent]   
})
export class AdminModule{}