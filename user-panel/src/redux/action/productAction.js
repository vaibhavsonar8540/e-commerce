import { createProduct } from "@/service/productService"

export const addProduct = (payload) => async(dispatch) => {
    try {
        await dispatch(createProduct(payload))
    } catch (error) {
        console.log(error)
    }
}