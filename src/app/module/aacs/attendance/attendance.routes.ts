import { Route } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { AttendanceScheduleStudentComponent } from './attendance-schedule-student.component';
import { AttendancesComponent } from './attendances.component';

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
];
