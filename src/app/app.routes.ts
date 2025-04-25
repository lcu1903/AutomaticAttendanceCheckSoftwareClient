import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { NoAuthGuard } from './core/auth/guard/noAuth.guard';
import { PageGuard } from './core/auth/guard/page.guard';
import { AppLayout } from './layout/component/app.layout';
import { LoginComponent } from './module/auth/login/login.component';
import { RegisterComponent } from './module/auth/register/register.component';
import { HomeComponent } from './module/home/home.component';
export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: AppLayout,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'login',
                canActivate: [NoAuthGuard],
                canActivateChild: [NoAuthGuard],
                component: LoginComponent,
            },
            {
                path: 'register',
                canActivate: [NoAuthGuard],
                canActivateChild: [NoAuthGuard],
                component: RegisterComponent,
            },
        ],
    },

    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: AppLayout,
        data: {
            layout: 'normal',
        },
        children: [
            {
                path: 'home',
                canActivate: [PageGuard],
                canActivateChild: [PageGuard],
                component: HomeComponent,
            },
        ],
    },
];
