import { AxiosInstance } from "axios";
import { APIClient } from "./_apiClient.js";



const client = new APIClient();





export function setAxiosInstance(instance: AxiosInstance) {
    client.instance = instance;
}


export const getReq = client.createHandler('get');
export const postReq = client.createHandler('post');
export const putReq = client.createHandler('put');
export const patchReq = client.createHandler('patch');
export const deleteReq = client.createHandler('delete');
