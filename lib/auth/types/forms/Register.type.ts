import { z } from 'zod';
import { User } from '../User.type';

export const registerSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Enter a valid email'),
        password: z.string().min(8, 'Min 8 characters'),
        password_confirmation: z.string().min(8, 'Min 8 characters'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match.',
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
