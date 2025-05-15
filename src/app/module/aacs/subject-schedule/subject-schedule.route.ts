import { Route } from '@angular/router';
import { SubjectSchedulesListComponent } from './subject-schedule-list.component';
import { SubjectScheduleComponent } from './subject-schedule.component';
import { SubjectSchedulesCreateEditComponent } from './subject-schedule-create-edit.component';

export const SubjectScheduleRoutes: Route[] = [
    {
        path: 'subject-schedules',
        component: SubjectScheduleComponent,
        children: [
            {
                path: '',
                component: SubjectSchedulesListComponent,
            },
            {
                path: 'create',
                component: SubjectSchedulesCreateEditComponent,
            },
            {
                path: 'edit/:id',
                component: SubjectSchedulesCreateEditComponent,
            },
        ],
    },
];
