import { Route } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StudentsListComponent } from './students-list.component';
import { StudentsCreateEditComponent } from './student-create-edit.component';

export const StudentRoutes: Route[] = [
    {
        path: 'students',
        component: StudentsComponent,
        children: [
            {
                path: '',
                component: StudentsListComponent,
            },
            {
                path: 'create',
                component: StudentsCreateEditComponent,
            },
            {
                path: 'edit/:id',
                component: StudentsCreateEditComponent,
            },
        ],
    },
];
