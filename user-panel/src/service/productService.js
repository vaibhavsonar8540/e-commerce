import api from "@/utils/axiosInstant"

export const createProduct = async(payload) => {
    const res = await api.post("/create" , payload)
    return res.data.data
}