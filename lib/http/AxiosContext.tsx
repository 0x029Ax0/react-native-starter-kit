import type { AxiosInstance } from 'axios';
import { createContext, ReactNode, useMemo } from 'react';
import { http } from './AxiosInstance';

type AxiosProviderProps = {
    children: ReactNode;
    instance?: AxiosInstance;
};

export const AxiosContext = createContext<AxiosInstance>(http);

export const AxiosProvider = ({ children, instance }: AxiosProviderProps) => {
    const axiosInstance = useMemo(() => instance ?? http, [instance]);

    return (
        <AxiosContext.Provider value={axiosInstance}>
            {children}
        </AxiosContext.Provider>
    );
};