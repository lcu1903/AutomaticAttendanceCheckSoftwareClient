import { Route } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { AttendanceScheduleStudentComponent } from './attendance-schedule-student.component';
import { AttendancesComponent } from './attendances.component';
import { AttendanceHistoriesComponent } from './attendance-histories.component';

export const AttendanceRoutes: Route[] = [
    {
        path: 'attendances',
        component: AttendancesComponent,
        children: [
            {
                path: '',
                component: AttendanceScheduleStudentComponent,
            },
            {
                path: 'check',
                component: AttendanceComponent,
            },
        ],
    },
    {
        path: 'attendance-histories',
        component: AttendanceHistoriesComponent,
    },
];
