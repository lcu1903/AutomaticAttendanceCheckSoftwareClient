import { MessageService } from 'primeng/api';
import { EnvironmentProviders, provideEnvironmentInitializer, inject } from '@angular/core';

export const provideMessagePopup = (): Array<EnvironmentProviders | any> => {
    return [
        MessageService,
        provideEnvironmentInitializer(() => {
            const messageService = inject(MessageService);
            messageService.add({ severity: 'info', summary: 'Transloco', detail: 'Transloco is initialized' });
        }),
    ];
};
