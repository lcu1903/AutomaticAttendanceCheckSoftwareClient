import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SystemPageComponent } from './page/system-page.component';
import { SystemRoutes } from './system.routing';
import { TreeModule } from 'primeng/tree';
import { CmInputComponent } from '../../base-components/cm-inputs/cm-input.component';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [SystemPageComponent],
    imports: [RouterModule.forChild(SystemRoutes), TreeModule, CmInputComponent, TranslocoModule, ButtonModule, ReactiveFormsModule, CommonModule],
    providers: [],
})
export class SystemModule {}
