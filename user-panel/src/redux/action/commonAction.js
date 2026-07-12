import { setCategories, setCollection, setLoading, setSubCategories } from "@/redux/slices/commonSlice";
import { getCategories, getCollection, getSubCategories } from "@/service/commonService";

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