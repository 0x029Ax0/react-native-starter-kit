import { QueryKey, useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';
import type { MutationRequestConfig } from '../types/MutationRequestConfig.type';
import { useAxios } from './useAxios';

export function useApiMutation<TInput, TOutput>(
    key: QueryKey,
    config: MutationRequestConfig,
    options?: UseMutationOptions<TOutput, AxiosError<ApiErrorResponse>, TInput>
): UseMutationResult<TOutput, AxiosError<ApiErrorResponse>, TInput> {
    const axios = useAxios();
    
    return useMutation<TOutput, AxiosError<ApiErrorResponse>, TInput>({
        mutationKey: key,
        mutationFn: async (input: TInput) => {
            const { data } = await axios.request<TOutput>({
                url: config.url,
                method: config.method ?? 'POST',
                data: input,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
            });
            return data;
        },
        ...options,
    });
};