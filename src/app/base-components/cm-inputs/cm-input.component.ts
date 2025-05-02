import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, input, Input, Optional, Output, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, NgControl, FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DatePickerModule } from 'primeng/datepicker';
import moment, { Moment } from 'moment';
@Component({
    selector: 'cm-input',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        IconFieldModule,
        InputIconModule,
        TranslocoModule,
        InputTextModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        DatePickerModule,
    ],
    templateUrl: './cm-input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CmInputComponent),
            multi: true,
        },
    ],
})
export class CmInputComponent implements ControlValueAccessor {
    @Input() type: string = 'text';
    @Input() placeholder: string | null = null;
    @Input() label: string | null = null;
    @Input() preIcon: string | null = null;
    @Input() postIcon: string | null = null;
    @Input() showSecretToggle = false;
    @Input() required = false;
    @Input() errors: string | null = null;
    @Input() disabled = false;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() model: Date | Moment | string | number | null = null;
    @Input() end: Date | Moment | string | number | null | any;
    @Input() start: Date | Moment | string | number | null | any;
    value: any = '';
    constructor() {}
    onChange: (value: any) => void = () => {};
    onTouched: () => void = () => {};

    writeValue(obj: any): void {
        this.value = obj === undefined || obj === null ? '' : obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Optional: Implement if you need to handle disabled state
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (this.type === 'number') {
            let number = parseFloat(input.value);
            if (isNaN(number)) {
                number = 0;
            }
            this.value = number;
            this.model = number;
            this.modelChange.emit(this.model);
            this.onChange(this.value);
        } else {
            this.value = input.value;
            this.model = input.value;
            this.modelChange.emit(this.model);
            this.onChange(this.value);
        }
    }
    onSelectDate(event: Date): void {
        this.value = event; // giữ value là Date cho DatePicker
        this.model = moment(event).toISOString(); // emit ISO string nếu cần
        this.modelChange.emit(this.model);
        this.onChange(this.value);
    }
    convertDateToIoString(): void {
        this.model = moment(this.model).startOf('day').toISOString();
    }

    onShowSecretToggle(): void {
        this.showSecretToggle = !this.showSecretToggle;
    }
    convertStartToIoString(): void {
        this.start = moment(this.start).startOf('day').toISOString();
    }
    convertEndToIoString(): void {
        // adđ 1 day, for the case when user choose range date about 1 day.
        this.end = moment(this.end).endOf('day').toISOString(); // Output expected : the end of day is formated as UTC time
    }
}
