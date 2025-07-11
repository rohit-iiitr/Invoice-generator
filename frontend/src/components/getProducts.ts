import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

export async function getProducts (userId: string){
    try {
        const response = await axios.get(`${BACKEND_URL}/api/products/${userId}/get`);
        return response;
    } catch (error) {
        console.log("Getting product error: ", error);        
    }
}