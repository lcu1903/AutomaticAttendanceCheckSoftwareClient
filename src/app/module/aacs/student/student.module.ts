import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CmInputComponent } from '../../../base-components/cm-inputs/cm-input.component';
import { CmSelectComponent } from '../../../base-components/cm-select/cm-select.component';
import { StudentsComponent } from './students.component';
import { StudentsCreateEditComponent } from './student-create-edit.component';
import { StudentsListComponent } from './students-list.component';
import { StudentRoutes } from './student.route';

@NgModule({
    declarations: [StudentsComponent, StudentsCreateEditComponent, StudentsListComponent],
    imports: [
        RouterModule.forChild(StudentRoutes),
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
        FileUploadModule,
        DatePickerModule,
        FileUploadModule,
    ],
    providers: [],
})
export class StudentModule {}
