import { Component, OnDestroy, OnInit } from '@angular/core';
import { SystemPageService } from '../../../aacs/service/system-page/system-page.service';
import { SystemPageCreateReq, SystemPageRes } from '../../../aacs/service/system-page/types';
import { Subject, filter, finalize, takeUntil } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
import { z } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { zodValidator } from '../../../utils/validation.utils';
import { SystemPageUpdateReq } from './../../../aacs/service/system-page/types';
import { cloneDeep } from 'lodash';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
@Component({
    selector: 'system-page',
    templateUrl: './system-page.component.html',
    standalone: false,
})
export class SystemPageComponent implements OnInit, OnDestroy {
    systemPageSchema = z
        .object({
            pageName: z.string().nullable(),
            pageIcon: z.string().nullable(),
        })
        .refine(() => {
            if (this.selectedPage == null) {
                return false;
            }
            return true;
        });
    systemPageForm!: FormGroup;
    private readonly _unsubscribeAll = new Subject<any>();
    systemPageRes: SystemPageRes[] = [];
    treeRes: TreeNode<SystemPageRes>[] = [];
    originTreeRes: TreeNode<SystemPageRes>[] = [];
    selectedPage: TreeNode<SystemPageRes> | null = null;
    newNode: TreeNode<SystemPageRes> | null = null;
    isLoading: boolean = true;
    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _systemPageService: SystemPageService,
        private readonly _translocoService: TranslocoService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
    ) {}
    filter: {
        textSearch?: string;
    } = {
        textSearch: undefined,
    };
    type: 'add' | 'edit' | 'null' = 'add';
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.getSystemPageRes();
        this.systemPageForm = this._formBuilder.group(
            {
                pageId: [''],
                pageName: [''],
                pageUrl: [''],
                pageIcon: [''],
                parentId: [''],
            },
            {
                validators: zodValidator(this.systemPageSchema),
            },
        );
    }
    getSystemPageRes() {
        this._systemPageService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.systemPageRes = res.data;
                this.buildTreeData(this.systemPageRes);
            });
    }
    buildTreeData(data: SystemPageRes[]) {
        const nodes = data
            .filter((e) => e.parentId == null)
            .map((item) => {
                return {
                    data: item,
                    label: this._translocoService.translate(item.pageName ?? ''),
                    icon: item.pageIcon,
                    expanded: true,
                    children: data
                        .filter((child) => child.parentId === item.pageId)
                        .map((child) => {
                            return {
                                data: child,
                                label: this._translocoService.translate(child.pageName ?? ''),
                                icon: child.pageIcon,
                                expanded: true,
                            };
                        }),
                };
            });
        this.treeRes = [
            {
                label: this._translocoService.translate('Root'),
                data: {
                    pageId: 'root',
                    pageName: 'Root',
                },
                icon: 'pi pi-home', // or any icon you wish to use for the root
                expanded: true,
                children: nodes,
            },
        ];
        this.originTreeRes = cloneDeep(this.treeRes);
    }
    onNodeSelect(event: any) {
        if (this.newNode && this.newNode?.data?.pageId != event.node.data.pageId) {
            this.onCancel();
        }
        // if (event.node.data.pageId === 'root') {
        //     return;
        // }

        if (this.selectedPage?.data?.pageId) {
            this.type = 'edit';
            this.systemPageForm.patchValue({
                pageId: this.selectedPage?.data.pageId,
                pageName: this.selectedPage?.data?.pageName,
                pageUrl: this.selectedPage?.data?.pageUrl,
                pageIcon: this.selectedPage?.data?.pageIcon,
                parentId: this.selectedPage?.data?.parentId,
            });
        } else {
            this.type = 'add';
            this.systemPageForm.patchValue({
                pageId: null,
                pageName: null,
                pageUrl: null,
                pageIcon: null,
                parentId: this.newNode?.data?.parentId,
            });
        }
        console.log('Selected Node:', this.selectedPage);
    }
    onSubmit() {
        if (!this.systemPageForm.valid) {
            this.systemPageForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.systemPageForm.getRawValue();
        var systemPageReq;
        if (this.type === 'edit') {
            formValue.pageId = this.selectedPage?.data?.pageId;
            4;
            systemPageReq = {
                ...formValue,
            } as SystemPageUpdateReq;
            this._systemPageService
                .update(systemPageReq.pageId, systemPageReq)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.success) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.success');
                        this.newNode = null;
                        this.selectedPage = null;
                        this.systemPageForm.reset();
                        this.getSystemPageRes();
                    }
                });
        } else {
            systemPageReq = {
                ...formValue,
                parentId: this.newNode?.data?.parentId,
            } as SystemPageCreateReq;

            this._systemPageService
                .create(systemPageReq)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.success) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.success');
                        this.newNode = null;
                        this.selectedPage = null;
                        this.systemPageForm.reset();
                        this.getSystemPageRes();
                    }
                });
        }
    }
    onAddPage() {
        this.type = 'add';
        this.newNode = {
            data: {
                pageId: '',
                pageName: '',
                pageUrl: '',
                pageIcon: '',
                parentId: this.selectedPage?.data?.pageId,
            },
            label: '',
            icon: 'pi pi-plus',
        };
        console.log(this.newNode);

        if (this.selectedPage) {
            this.newNode.data!.parentId = this.selectedPage?.data?.pageId;
            //add new node to the selected node
            this.selectedPage.children = this.selectedPage.children || [];
            this.selectedPage.children = [...this.selectedPage.children, this.newNode];
        }
        this.selectedPage = this.newNode;
        this.systemPageForm.reset();
    }
    onCancel() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.unSaveChanges'),
            this._translocoService.translate('common.confirmUnSaveChanges'),
            () => {
                this.selectedPage = null;
                this.newNode = null;
                this.systemPageForm.reset();
                this.type = 'add';
                this.treeRes = cloneDeep(this.originTreeRes);
            },
            () => {},
        );
    }
    onDeletePage() {
        if (this.selectedPage?.data?.pageId) {
            this._confirmationPopupService.showConfirm(
                this._translocoService.translate('common.delete'),
                this._translocoService.translate('common.confirmDelete'),
                () => {
                    this.isLoading = true;
                    this._systemPageService
                        .delete(this.selectedPage?.data?.pageId!)
                        .pipe(
                            takeUntil(this._unsubscribeAll),
                            finalize(() => {
                                this.isLoading = false;
                            }),
                        )
                        .subscribe((res) => {
                            if (res.success) {
                                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.success');
                                this.getSystemPageRes();
                            }
                        });
                },
                () => {},
            );
        }
    }
}
