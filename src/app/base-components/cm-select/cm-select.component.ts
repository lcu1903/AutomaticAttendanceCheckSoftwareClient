import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TranslocoModule } from '@jsverse/transloco';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
export interface CmSelectOption {
    id: string | null;
    name: string | null;
}
@Component({
    selector: 'cm-select',
    standalone: true,
    styles: [
        `
            ::ng-deep .p-select-clear-icon {
                position: static !important;
            }
        `,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputIconModule,
        SelectModule,
        MultiSelectModule,
    ],
    templateUrl: './cm-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CmSelectComponent),
            multi: true,
        },
    ],
})
export class CmSelectComponent implements ControlValueAccessor {
    @Input() options: CmSelectOption[] = [];
    @Input() placeholder: string | null = null;
    @Input() label: string | null = null;
    @Input() required = false;
    @Input() errors: string | null = null;
    @Input() disabled = false;
    @Input() preIcon: string | null = null;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() model: any = null;
    @Input() type: 'multi' | 'single' = 'single';

    value: any = null;

    onChange = (_: any) => {};
    onTouched = () => {};

    writeValue(obj: any): void {
        this.value = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onSelectChange(value: CmSelectOption): void {
        console.log('Selected value:', value);

        this.value = value;
        this.model = value;
        this.modelChange.emit(value);
        this.onChange(value);
    }
}
