import { z } from "zod";
import { User } from "../User.type";

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Please enter your name"),
    email: z.string().email("Please enter a valid email address"),
    avatar: z.string().optional(),
});

export type UpdateProfileInput = {
    name: string;
    email: string;
    avatar?: string | undefined;
};

export type UpdateProfileApiResponse = {
    user: User;
};

export type UpdateProfileSuccessResponse = {
    status: "success";
    data: UpdateProfileApiResponse;
};

export type UpdateProfileErrorResponse = {
    status: "error";
    message?: string;
    errors?: Record<string, string[]>;
};

export type UpdateProfileResponse = UpdateProfileSuccessResponse | UpdateProfileErrorResponse;