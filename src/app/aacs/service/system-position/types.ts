export interface SystemPositionRes {
    positionId: string;
    positionName: string | null;
    positionParentId: string | null;
    positionParentName: string | null;
    description: string | null;
}

export interface SystemPositionCreateReq {
    positionName: string | null;
    positionParentId: string | null;
    description: string | null;
}

export interface SystemPositionUpdateReq {
    positionId: string;
    positionName: string | null;
    positionParentId: string | null;
    description: string | null;
}
