import { provideEnvironmentInitializer, importProvidersFrom, EnvironmentProviders, inject } from '@angular/core';
import { DefaultTranspiler, TRANSLOCO_CONFIG, TRANSLOCO_FALLBACK_STRATEGY, TRANSLOCO_INTERCEPTOR, TRANSLOCO_LOADER, TRANSLOCO_MISSING_HANDLER, TRANSLOCO_TRANSPILER, translocoConfig, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco.http-loader';

export const provideTransloco = (): Array<EnvironmentProviders | any> => {
    return [
        importProvidersFrom(TranslocoModule),
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: [
                    { id: 'en', label: 'English' },
                    { id: 'vi', label: 'Vietnamese' }
                ],
                defaultLang: 'vi',
                fallbackLang: 'vi',
                reRenderOnLangChange: true,
                prodMode: true,
            }),
        },
        {
            provide: TRANSLOCO_LOADER,
            useClass: TranslocoHttpLoader,
        },
        {
            provide: TRANSLOCO_TRANSPILER,
            useClass: DefaultTranspiler
        },
        {
            provide: TRANSLOCO_MISSING_HANDLER,
            useValue: { handle: (key: string, translateParams?: any) => key }
        },
        {
            provide: TRANSLOCO_INTERCEPTOR,
            useValue: {
                intercept: (req: any) => req,
                preSaveTranslation: (translations: any, lang: string, key: string) => translations,
            },
        },
        {
            provide: TRANSLOCO_FALLBACK_STRATEGY,
            useValue: {
                getNextLangs: (lang: string) => [lang, 'vi'],
            },
        },
        provideEnvironmentInitializer(() => {
            const translocoService = inject(TranslocoService);
            const defaultLang = translocoService.getDefaultLang();
            translocoService.setActiveLang(defaultLang);
            return translocoService.load(defaultLang).toPromise();
        })
    ];
};