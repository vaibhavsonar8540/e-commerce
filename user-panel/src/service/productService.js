import api from "@/utils/axiosInstant"

export const createProduct = async(payload) => {
    const res = await api.post("/product/create" , payload)
    return res.data
}