import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { LoginComponent } from './module/auth/login/login.component';
import { NoAuthGuard } from './core/auth/guard/noAuth.guard';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { EmptyComponent } from './layout/component/empty.component';
import { PageGuard } from './core/auth/guard/page.guard';
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
        ]
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
        ]
    },

];
