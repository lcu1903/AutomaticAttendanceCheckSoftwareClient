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
        this.value = obj; // obj should be the id
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onSelectChange(value: any): void {
        if (this.type === 'multi') {
            // value là mảng các object hoặc id
            const ids = Array.isArray(value) ? value.map((v) => (typeof v === 'object' ? v.id : v)) : [];
            this.value = ids;
            this.model = ids;
            this.modelChange.emit(ids);
            this.onChange(ids);
        } else {
            // single select
            const id = value && typeof value === 'object' ? value.id : value;
            this.value = id;
            this.model = id;
            this.modelChange.emit(id);
            this.onChange(id);
        }
    }
    getSelectedNames(selectedOptions: CmSelectOption[]): string {
        return selectedOptions?.map((o) => o.name).join(', ') ?? '';
    }
}
