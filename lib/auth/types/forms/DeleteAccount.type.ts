import { z } from "zod";

export const deleteAccountSchema = z.object({
    password: z.string().min(1, 'Please enter your password')
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

export type DeleteAccountSuccessResponse = {
    status: 'success';
};

export type DeleteAccountErrorResponse = {
    status: "error";
    error?: string;
    message?: string;
};

export type DeleteAccountResponse = DeleteAccountSuccessResponse | DeleteAccountErrorResponse;