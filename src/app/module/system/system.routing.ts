import { Route } from '@angular/router';
import { SystemPageComponent } from './page/system-page.component';
import { SystemUsersComponent } from './users/users.component';
import { SystemDepartmentsComponent } from './department/system-departments.component';
import { SystemPositionsComponent } from './position/system-positions.component';
import { SystemUsersListComponent } from './users/users-list.component';

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
