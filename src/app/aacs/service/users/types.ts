export interface UserRes {
    userId: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    fullName?: string;
    imageUrl?: string;
    departmentId?: string;
    departmentName?: string;
    positionId?: string;
    positionName?: string;
    studentCode?: string;
    teacherCode?: string;
    classId?: string;
    className?: string;
    birthdate?: string;
}

export interface UserCreateReq {
    userName: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    studentCode?: string;
    teacherCode?: string;
    classId?: string;
    imageUrl?: string;
    birthdate?: string;
}
export interface UserUpdateReq {
    userId: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    studentCode?: string;
    teacherCode?: string;
    classId?: string;
    birthdate?: string;
    imageUrl?: string;
}
