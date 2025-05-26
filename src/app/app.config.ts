import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, RouterModule, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTransloco } from './base-components/transloco/transloco.provider';
import { provideAuth } from './core/auth/auth.provider';
import { provideMessagePopup } from './base-components/message-popup/message.provider';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withEnabledBlockingInitialNavigation(),
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        provideTransloco(),
        provideMessagePopup(),
        importProvidersFrom(
            RouterModule.forRoot(routes, {
                preloadingStrategy: PreloadAllModules,
            }),
        ),
        provideAuth(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    name: 'primeng',
                    order: 'tailwind-base, primeng, tailwind-utilities',
                },
            },
        }),
    ],
};
