export interface SystemPageRes {
    pageId?: string;
    pageName?: string;
    pageUrl?: string;
    pageIcon?: string;
    parentId?: string;
    pageOrder?: number;
}
export interface SystemPageCreateReq {
    pageName?: string;
    pageUrl?: string;
    pageIcon?: string;
    parentId?: string;
    pageOrder?: number;
}
export interface SystemPageUpdateReq {
    pageId: string;
    pageName?: string;
    pageUrl?: string;
    pageIcon?: string;
    parentId?: string;
    pageOrder?: number;
}
export interface SystemPageTreeRes {
    pageId: string;
    pageName?: string;
    pageUrl?: string;
    pageIcon?: string;
    children?: SystemPageTreeRes[];
    parentId?: string;
    isLeaf?: boolean;
    isExpanded?: boolean;
}
