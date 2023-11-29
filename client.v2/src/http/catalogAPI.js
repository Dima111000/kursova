import { guestInstance, authInstance } from './index.js'

export const createCategory = async (category) => {
    const { data } = await authInstance.post('category/create', category)
    return data
}

export const updateCategory = async (id, category) => {
    const { data } = await authInstance.put(`category/update/${id}`, category)
    return data
}

export const deleteCategory = async (id) => {
    const { data } = await authInstance.delete(`category/delete/${id}`)
    return data
}

export const fetchCategories = async () => {
    const { data } = await guestInstance.get('category/getall')
    return data
}

export const fetchCategory = async (id) => {
    const { data } = await guestInstance.get(`category/getone/${id}`)
    return data
}

export const createBrand = async (brand) => {
    const { data } = await authInstance.post('brand/create', brand)
    return data
}

export const updateBrand = async (id, brand) => {
    const { data } = await authInstance.put(`brand/update/${id}`, brand)
    return data
}

export const deleteBrand = async (id) => {
    const { data } = await authInstance.delete(`brand/delete/${id}`)
    return data
}

export const fetchBrands = async () => {
    const { data } = await guestInstance.get('brand/getall')
    return data
}

export const fetchBrand = async (id) => {
    const { data } = await guestInstance.get(`brand/getone/${id}`)
    return data
}

export const createProduct = async (product) => {
    const { data } = await authInstance.post('product/create', product)
    return data
}

export const updateProduct = async (id, product) => {
    const { data } = await authInstance.put(`product/update/${id}`, product)
    return data
}

export const deleteProduct = async (id) => {
    const { data } = await authInstance.delete(`product/delete/${id}`)
    return data
}

export const fetchAllProducts = async (categoryId = null, brandId = null, page = 1, limit = 6, minPrice = null, maxPrice = null) => {
    let url = 'product/getall';
    
    if (categoryId) url += '/categoryId/' + categoryId;
    if (brandId) url += '/brandId/' + brandId;

    const params = {
        page,
        limit,
        minPrice,
        maxPrice,
    };

    const { data } = await guestInstance.get(url, { params });
    return data;
};

export const getAllProducts = async () => {
    const { data } = await guestInstance.get('product/getall');
    return data;
}

export const fetchOneProduct = async (id) => {
    const { data } = await guestInstance.get(`product/getone/${id}`)
    return data
}

export const fetchProdRating = async (id) => {
    const { data } = await guestInstance.get(`rating/product/${id}`)
    return data
}

export const createProperty = async (productId, property) => {
    const { data } = await authInstance.post(`product/${productId}/property/create`, property)
    return data
}

export const updateProperty = async (productId, id, property) => {
    const { data } = await authInstance.put(`product/${productId}/property/update/${id}`, property)
    return data
}

export const deleteProperty = async (productId, id) => {
    const { data } = await authInstance.delete(`product/${productId}/property/delete/${id}`)
    return data
}