import { Role } from "../../../domain/enum/role.vo";

export class UserRefreshRequest {
    userId: number;

    role: Role;

    refreshToken: string;

    constructor(userId: number, role: Role, refreshToken: string) {
        this.userId = userId;
        this.role = role;
        this.refreshToken = refreshToken;
    }
}