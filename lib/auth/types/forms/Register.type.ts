import { z } from 'zod';
import { User } from '../User.type';

export const registerSchema = z
    .object({
        name: z.string().min(1, 'Please enter your name'),
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        password_confirmation: z.string().min(8, 'Password must be at least 8 characters long'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterApiResponse = {
    token: string;
    user: User;
};

export type RegisterSuccessResponse = {
    status: 'success';
    data: RegisterApiResponse;
};

export type RegisterErrorResponse = {
    status: 'error';
    message?: string;
    errors?: Record<string, string[]>;
};

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;
