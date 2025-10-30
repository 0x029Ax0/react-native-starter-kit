import { QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiErrorResponse, QueryRequestConfig } from "../types";
import { useAxios } from "./useAxios";

export const useApiQuery = <TParams, TOutput>(
    key: (params: TParams) => QueryKey,
    config: QueryRequestConfig<TParams>,
    params: TParams,
    options?: UseQueryOptions<TOutput, AxiosError<ApiErrorResponse>, TOutput>
): UseQueryResult<TOutput, AxiosError<ApiErrorResponse>> => {
    const axios = useAxios();
    const k = key(params);

    return useQuery<TOutput, AxiosError<ApiErrorResponse>>({
        queryKey: k,
        queryFn: async () => {
            const { data } = await axios.request<TOutput>({
                url: config.url,
                method: config.method ?? 'GET',
                params: config.params?.(params),
                headers: { ...config.headers },
            });
            return data;
        },
        ...options,
    });
};