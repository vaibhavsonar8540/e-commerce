import { setCategories, setCollection, setLoading, setSubCategories, setCart, setWishlist } from "@/redux/slices/commonSlice";
import { getCategories, getCollection, getSubCategories, getCartApi, addToCartApi, updateCartQtyApi, removeFromCartApi, getWishlistApi, addToWishlistApi, removeFromWishlistApi } from "@/service/commonService";

export const fetchCollection = () => async (dispatch) => {
    try {
        const data = await getCollection();
        dispatch(setCollection(data));
    } catch (error) {
        // catch silently
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        const categoryData = await getCategories();
        dispatch(setCategories(categoryData));
    } catch (error) {
        // catch silently
    }
};

export const fetchSUbCategories = () => async (dispatch) => {
    try {
        const subCategoryData = await getSubCategories();
        dispatch(setSubCategories(subCategoryData));
    } catch (error) {
        // catch silently
    }
};

export const fetchCart = () => async (dispatch) => {
    try {
        const cartData = await getCartApi();
        dispatch(setCart(cartData));
    } catch (error) {
        // catch silently
    }
};

export const addToCartAction = (productId, quantity) => async (dispatch) => {
    try {
        await addToCartApi(productId, quantity);
        dispatch(fetchCart());
    } catch (error) {
        throw error;
    }
};

export const updateCartQtyAction = (productId, quantity) => async (dispatch) => {
    try {
        await updateCartQtyApi(productId, quantity);
        dispatch(fetchCart());
    } catch (error) {
        throw error;
    }
};

export const removeFromCartAction = (productId) => async (dispatch) => {
    try {
        await removeFromCartApi(productId);
        dispatch(fetchCart());
    } catch (error) {
        throw error;
    }
};

export const fetchWishlist = () => async (dispatch) => {
    try {
        const wishlistData = await getWishlistApi();
        dispatch(setWishlist(wishlistData?.productId || []));
    } catch (error) {
        // catch silently
    }
};

export const addToWishlistAction = (productId) => async (dispatch) => {
    try {
        await addToWishlistApi(productId);
        dispatch(fetchWishlist());
    } catch (error) {
        throw error;
    }
};

export const removeFromWishlistAction = (productId) => async (dispatch) => {
    try {
        await removeFromWishlistApi(productId);
        dispatch(fetchWishlist());
    } catch (error) {
        throw error;
    }
};