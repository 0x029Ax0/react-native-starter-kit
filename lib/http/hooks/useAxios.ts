import { AxiosInstance } from "axios";
import { useContext } from "react";
import { AxiosContext } from "../AxiosContext";

export const useAxios = (): AxiosInstance => {
    return useContext(AxiosContext);
};