import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { NoAuthGuard } from './core/auth/guard/noAuth.guard';
import { PageGuard } from './core/auth/guard/page.guard';
import { AppLayout } from './layout/component/app.layout';
import { LoginComponent } from './module/auth/login/login.component';
import { RegisterComponent } from './module/auth/register/register.component';
import { HomeComponent } from './module/home/home.component';
export const routes: Routes = [
    { path: '', redirectTo: 'attendances', pathMatch: 'full' },
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
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/system/system.module').then((m) => m.SystemModule),
            },
            { path: '', canActivateChild: [PageGuard], loadChildren: () => import('./module/aacs/class/class.module').then((m) => m.ClassModule) },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/aacs/teacher/teacher.module').then((m) => m.TeacherModule),
            },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/aacs/student/student.module').then((m) => m.StudentModule),
            },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/aacs/semester/semester.module').then((m) => m.SemesterModule),
            },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/aacs/subject/subject.module').then((m) => m.SubjectModule),
            },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/aacs/subject-schedule/subject-schedule.module').then((m) => m.SubjectScheduleModule),
            },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () =>
                    import('./module/aacs/subject-schedule-student/subject-schedule-student.module').then((m) => m.SubjectScheduleStudentModule),
            },
            {
                path: '',
                canActivateChild: [PageGuard],
                loadChildren: () => import('./module/aacs/attendance/attendance.module').then((m) => m.AttendanceModule),
            },
        ],
    },
];
