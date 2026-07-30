import { createCategoryData, createCollData, createSubCategoryData, getCategories, getCollection, getSubCategories } from "@/service/common.service";
import { setCategories, setCollection, setLoading, setSubCategories } from "../slices/commonSlice";


export const createCollection = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const data = await createCollData(payload);

    if (data) {
      dispatch(fetchCollection());
    }
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setLoading(false));
  }
};

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

export const createCategory = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    await createCategoryData(payload);

    await dispatch(fetchCategories());

    return {
      success: true,
      message: "Category created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Something went wrong",
    };
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


// ... existing fetch actions remain identical ...

export const createSubCategoryAction = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    await createSubCategoryData(payload);
    
    // Automatically re-fetch subcategories list to update ui dynamically
    dispatch(fetchSUbCategories());
  } catch (error) {
    console.log("Error inside createSubCategory action:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

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