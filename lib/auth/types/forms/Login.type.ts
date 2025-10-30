import z from "zod";
import { User } from "../User.type";

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Min 8 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export type LoginApiResponse = {
    token: string;
    user: User;
};

export type LoginSuccessResponse = {
    status: 'success';
    data: LoginApiResponse;
};

export type LoginErrorResponse = {
    status: 'error';
    message?: string;
    errors?: Record<string, string[]>;
};

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;