import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AttendanceComponent } from './attendance.component';
import { RouterModule } from '@angular/router';
import { AttendanceRoutes } from './attendance.routes';
import { AttendanceScheduleStudentComponent } from './attendance-schedule-student.component';
import { AttendancesComponent } from './attendances.component';
import { AttendanceHistoriesComponent } from './attendance-histories.component';
import { CmInputComponent } from '../../../base-components/cm-inputs/cm-input.component';
import { CmSelectComponent } from '../../../base-components/cm-select/cm-select.component';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [AttendanceComponent, AttendancesComponent, AttendanceScheduleStudentComponent, AttendanceHistoriesComponent],
    imports: [
        RouterModule.forChild(AttendanceRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
        ButtonModule,
        DialogModule,
        CmInputComponent,
        CmSelectComponent,
        TableModule,
    ],
})
export class AttendanceModule {}
