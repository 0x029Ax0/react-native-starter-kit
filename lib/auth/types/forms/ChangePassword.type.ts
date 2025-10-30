import { z } from 'zod';

export const changePasswordSchema = z
    .object({
        password: z.string().min(1, 'Fill in your current password.'),
        new_password: z.string().min(8, 'Min. 8 characters.'),
        new_password_confirmation: z.string().min(8, 'Min. 8 characters.'),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
        message: 'New passwords do not match.',
        path: ['new_password_confirmation'],
    });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export type ChangePasswordApiResponse = {};

export type ChangePasswordSuccessResponse = {
    status: 'success';
};

export type ChangePasswordErrorResponse = {
    status: 'error';
    error?: string;
    message?: string;
};

export type ChangePasswordResponse = ChangePasswordSuccessResponse | ChangePasswordErrorResponse;