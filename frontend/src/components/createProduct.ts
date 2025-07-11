import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

export async function createProduct(userId: string, name: string, qty: number, rate: number, totalAmt: number) {
    try {  
        const response = await axios.post (`${BACKEND_URL}/api/products/${userId}/add`,{
            name: name,
            qty: qty,
            rate: rate,
            totalAmt: qty * rate,
        })
       
      
        return response;
    } catch (error) {
        console.log ("creating product error: ", error);
    }
}