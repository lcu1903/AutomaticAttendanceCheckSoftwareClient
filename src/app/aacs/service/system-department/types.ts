export interface SystemDepartmentRes {
    departmentId: string;
    departmentName: string | null;
    departmentParentId: string | null;
    departmentParentName: string | null;
    description: string | null;
}

export interface SystemDepartmentCreateReq {
    departmentName: string | null;
    departmentParentId: string | null;
    description: string | null;
}

export interface SystemDepartmentUpdateReq {
    departmentId: string;
    departmentName: string | null;
    departmentParentId: string | null;
    description: string | null;
}
