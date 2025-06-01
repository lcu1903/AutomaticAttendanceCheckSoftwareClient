export interface Response<T = null> {
    success: boolean;
    data: T;
    errors?: string[];
}

export interface ReqPagination {
    pageIndex: number;
    pageSize: number;
}

export interface Pagination<T> {
    results: T;
    currentIndex: number;
    total: number;
}

export interface GenerateId {
    id: string;
}

export interface PaginationResponse<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
export interface GenerateIdRes {
    id: string;
}
