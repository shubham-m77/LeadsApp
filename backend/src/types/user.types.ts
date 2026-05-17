export type UserRole = 'admin' | 'sales';
export interface iUser {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    role: UserRole;
}