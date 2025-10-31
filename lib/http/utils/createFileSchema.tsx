import { z } from "zod";

export const createFileSchema = (options?: {
    maxSize?: number;
    allowedTypes?: string[];
    required?: boolean;
}) => {
    let schema = z.instanceof(File);

    if (options?.maxSize) {
        schema = schema.refine(
            (file) => file.size <= options.maxSize!,
            { message: `File must be less than ${options.maxSize! / 1000000}MB` }
        );
    }
    
    if (options?.allowedTypes) {
        schema = schema.refine(
            (file) => options.allowedTypes!.includes(file.type),
            { message: `Allowed types: ${options.allowedTypes!.join(', ')}` }
        );
    }

    return options?.required ? schema : schema.optional();
};