import { z } from "zod";

export const resetPasswordSchema = z
    .object({
        password: z.string().min(1, 'Please enter your password'),
        new_password: z.string().min(8, 'New password must be at least 8 characters long'),
        new_password_confirmation: z.string().min(8, 'Password must be at least 8 characters long')
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
        message: 'Passwords do not match',
        path: ['new_password_confirmation'],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type ResetPasswordSuccessResponse = {
    status: "success";
}

export type ResetPasswordErrorResponse = {
    status: "error";
    error?: string;
    message?: string;
}

export type ResetPasswordResponse = ResetPasswordSuccessResponse | ResetPasswordErrorResponse;