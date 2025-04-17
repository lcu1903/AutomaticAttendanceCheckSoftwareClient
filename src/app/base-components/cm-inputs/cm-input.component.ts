import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, NgControl, FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
    selector: 'cm-input',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule, IconFieldModule, InputIconModule, TranslocoModule, InputTextModule, ButtonModule, InputGroupModule, InputGroupAddonModule],
    templateUrl: './cm-input.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CmInputComponent),
        multi: true,
    }]
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
    value: any = '';
    constructor() {


    }
    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(obj: any): void {
        this.value = obj;
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
        this.value = input.value;
        this.onChange(this.value);
    }
    onShowSecretToggle(): void {
        this.showSecretToggle = !this.showSecretToggle;
    }
}