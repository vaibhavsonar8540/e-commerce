import { createProduct } from "@/service/productService";

export const addProduct = (payload) => async (dispatch) => {
    try {
        const data = await createProduct(payload);
        return data;
    } catch (error) {
        throw error;
    }
};