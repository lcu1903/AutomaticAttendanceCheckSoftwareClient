import { Route } from '@angular/router';
import { SystemPageComponent } from './page/system-page.component';
import { SystemUsersComponent } from './users/users.component';
import { SystemDepartmentsComponent } from './department/system-departments.component';
import { SystemPositionsComponent } from './position/system-positions.component';

export const SystemRoutes: Route[] = [
    {
        path: 'page',
        component: SystemPageComponent,
    },
    {
        path: 'users',
        component: SystemUsersComponent,
    },
    {
        path: 'departments',
        component:SystemDepartmentsComponent
    },
    {
        path: 'positions',
        component:SystemPositionsComponent
    }
];
