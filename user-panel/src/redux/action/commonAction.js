import { setCategories, setCollection, setLoading, setSubCategories, setCart, setWishlist } from "@/redux/slices/commonSlice";
import { getCategories, getCollection, getSubCategories, getCartApi, addToCartApi, updateCartQtyApi, removeFromCartApi, getWishlistApi, addToWishlistApi, removeFromWishlistApi } from "@/service/commonService";

export const fetchCollection = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        const data = await getCollection();
        dispatch(setCollection(data));
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(setLoading(false));
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))

        const categoryData = await getCategories()
        dispatch(setCategories(categoryData))
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchSUbCategories = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))

        const subCategoryData = await getSubCategories()
        dispatch(setSubCategories(subCategoryData))
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(setLoading(false));
    }
}

export const fetchCart = () => async (dispatch) => {
    try {
        const cartData = await getCartApi();
        dispatch(setCart(cartData));
    } catch (error) {
        console.log("Error fetching cart:", error);
    }
};

export const addToCartAction = (productId, quantity) => async (dispatch) => {
    try {
        await addToCartApi(productId, quantity);
        dispatch(fetchCart());
    } catch (error) {
        console.log("Error adding to cart:", error);
        throw error;
    }
};

export const updateCartQtyAction = (productId, quantity) => async (dispatch) => {
    try {
        await updateCartQtyApi(productId, quantity);
        dispatch(fetchCart());
    } catch (error) {
        console.log("Error updating cart quantity:", error);
        throw error;
    }
};

export const removeFromCartAction = (productId) => async (dispatch) => {
    try {
        await removeFromCartApi(productId);
        dispatch(fetchCart());
    } catch (error) {
        console.log("Error removing item from cart:", error);
        throw error;
    }
};

export const fetchWishlist = () => async (dispatch) => {
    try {
        const wishlistData = await getWishlistApi();
        // Since wishlistData holds { productId: [...] }, let's dispatch that array
        dispatch(setWishlist(wishlistData?.productId || []));
    } catch (error) {
        console.log("Error fetching wishlist:", error);
    }
};

export const addToWishlistAction = (productId) => async (dispatch) => {
    try {
        await addToWishlistApi(productId);
        dispatch(fetchWishlist());
    } catch (error) {
        console.log("Error adding to wishlist:", error);
        throw error;
    }
};

export const removeFromWishlistAction = (productId) => async (dispatch) => {
    try {
        await removeFromWishlistApi(productId);
        dispatch(fetchWishlist());
    } catch (error) {
        console.log("Error removing from wishlist:", error);
        throw error;
    }
};