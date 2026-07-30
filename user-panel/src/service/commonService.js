import api from "@/utils/axiosInstant";

export const getCollection = async () => {
    const res = await api.get("/collection/collections");
    return res.data.collections;
};

export const getCategories = async () => {
    const res = await api.get("/collection/categories");
    return res.data.categories;
};

export const getSubCategories = async () => {
    const res = await api.get("/collection/sub-categories");
    return res.data.subCategories;
};

export const getCartApi = async () => {
    const res = await api.get("/cart/get-cart");
    return res.data.data;
};

export const addToCartApi = async (productId, quantity) => {
    const res = await api.post("/cart/add-to-cart", { productId, quantity });
    return res.data.data;
};

export const updateCartQtyApi = async (productId, quantity) => {
    const res = await api.post("/cart/update-quantity", { productId, quantity });
    return res.data.data;
};

export const removeFromCartApi = async (productId) => {
    const res = await api.post("/cart/remove-from-cart", { productId });
    return res.data.data;
};

export const getWishlistApi = async () => {
    const res = await api.get("/wishlist/wishlist");
    return res.data.data;
};

export const addToWishlistApi = async (productId) => {
    const res = await api.post("/wishlist/add-to-favrouite", { productId });
    return res.data.data;
};

export const removeFromWishlistApi = async (productId) => {
    const res = await api.post("/wishlist/remove-from-favrouite", { productId });
    return res.data.data;
};