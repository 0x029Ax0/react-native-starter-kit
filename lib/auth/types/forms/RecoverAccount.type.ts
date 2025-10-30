import z from "zod";

export const recoverAccountSchema = z.object({
    email: z.string().email('Enter a valid email'),
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