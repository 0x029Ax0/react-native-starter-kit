import type { Method } from 'axios';

export type MutationRequestConfig = {
    url: string;
    method?: Method; // 'POST' | 'PUT' | 'PATCH' | 'DELETE' | ...
    headers?: Record<string, string>;
};