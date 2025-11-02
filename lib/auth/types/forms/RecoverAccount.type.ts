import z from "zod";

export const recoverAccountSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export type RecoverAccountInput = z.infer<typeof recoverAccountSchema>;

export type RecoverAccountSuccessResponse = {
    status: "success";
};

export type RecoverAccountErrorResponse = {
    status: "error";
    error?: string;
    message?: string;
};

export type RecoverAccountResponse = RecoverAccountSuccessResponse | RecoverAccountErrorResponse;