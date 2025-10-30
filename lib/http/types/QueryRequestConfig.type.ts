import { MutationRequestConfig } from "./MutationRequestConfig.type";


export type QueryRequestConfig<TParams> = MutationRequestConfig & { params?: (p: TParams) => Record<string, any> };
