import api from "@/utils/axiosInstant";

export const getCollection = async () => {
    const res = await api.get("/collection/collections");

    console.log(res.data);

    return res.data.collections;
};

export const getCategories = async () => {
    const res = await api.get("/collection/categories");

    console.log(res.data.categories , "33333333");

    return res.data.categories;
};

export const getSubCategories = async () => {
    const res = await api.get("/collection/sub-categories");
    console.log(res.data);

    return res.data.subCategories;
};