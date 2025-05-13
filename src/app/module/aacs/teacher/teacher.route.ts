import { Route } from '@angular/router';
import { TeachersListComponent } from './teachers-list.component';
import { TeachersComponent } from './teachers.component';
import { TeachersCreateEditComponent } from './teacher-create-edit.component';

export const TeacherRoutes: Route[] = [
    {
        path: 'teachers',
        component: TeachersComponent,
        children: [
            {
                path: '',
                component: TeachersListComponent,
            },
            {
                path: 'create',
                component: TeachersCreateEditComponent,
            },
            {
                path: 'edit/:id',
                component: TeachersCreateEditComponent,
            },
        ],
    },
];
