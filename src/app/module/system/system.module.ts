import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SystemPageComponent } from './page/system-page.component';
import { SystemRoutes } from './system.routing';
import { TreeModule } from 'primeng/tree';
import { CmInputComponent } from '../../base-components/cm-inputs/cm-input.component';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SystemUsersComponent } from './users/users.component';
import { SystemDepartmentsComponent } from './department/system-departments.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { SystemPositionsComponent } from './position/system-positions.component';
import { SystemDepartmentsCreateEditPopupComponent } from './department/system-departments-create-edit-popup.component';
import { CmSelectComponent } from '../../base-components/cm-select/cm-select.component';
import { SystemPositionsCreateEditPopupComponent } from './position/system-positions-create-edit-popup.component';
@NgModule({
    declarations: [
        SystemPageComponent,
        SystemUsersComponent,
        SystemDepartmentsComponent,
        SystemDepartmentsCreateEditPopupComponent,
        SystemPositionsComponent,
        SystemPositionsCreateEditPopupComponent,
    ],
    imports: [
        RouterModule.forChild(SystemRoutes),
        TreeModule,
        CmInputComponent,
        TranslocoModule,
        ButtonModule,
        ReactiveFormsModule,
        CommonModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        FormsModule,
        PaginatorModule,
        InputTextModule,
        CmSelectComponent,
    ],
    providers: [],
})
export class SystemModule {}
