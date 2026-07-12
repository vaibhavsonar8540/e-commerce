import api from "@/utils/axiosInstant";


export const createCollData = async (payload) => {
  try {
    // Pass the payload directly so name and order exist at req.body root
    const res = await api.post("/collection/create-collection", payload);
    return res.data.collection;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const getCollection = async () => {
    const res = await api.get("/collection/collections");

    console.log(res.data , "server collection");

    return res.data.collections;
};

export const createCategoryData = async (payload) => {
  try {
    const res = await api.post(
      "/collection/create-category",
      payload
    );

    return res.data.category;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const getCategories = async () => {
    const res = await api.get("/collection/categories");
    return res.data.categories;
};


// ... existing get and create service functions remain identical ...

export const createSubCategoryData = async (payload) => {
  try {
    const res = await api.post(
      "/collection/create-sub-category",
      payload
    );
    return res.data.subCategory;
  } catch (error) {
    console.error("API error creating sub-category data:", error);
    throw error;
  }
};

export const getSubCategories = async () => {
    const res = await api.get("/collection/sub-categories");
    return res.data.subCategories;
};
