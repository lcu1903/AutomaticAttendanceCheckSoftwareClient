import { Route } from '@angular/router';
import { SystemPageComponent } from './page/system-page.component';
import { SystemUsersComponent } from './users/users.component';
import { SystemDepartmentsComponent } from './department/system-departments.component';
import { SystemPositionsComponent } from './position/system-positions.component';
import { SystemUsersListComponent } from './users/users-list.component';
import { SystemUsersCreateEditComponent } from './users/users-create-edit.component';

export const SystemRoutes: Route[] = [
    {
        path: 'page',
        component: SystemPageComponent,
    },
    {
        path: 'users',
        component: SystemUsersComponent,
        children: [
            {
                path: '',
                component: SystemUsersListComponent,
            },
            {
                path: 'create',
                component: SystemUsersCreateEditComponent,
            },
            {
                path: 'edit/:id',
                component: SystemUsersCreateEditComponent,
            },
        ],
    },
    {
        path: 'departments',
        component: SystemDepartmentsComponent,
    },
    {
        path: 'positions',
        component: SystemPositionsComponent,
    },
];
