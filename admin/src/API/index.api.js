export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/v1/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const PRODUCT_ROUTES = "/api/v1/medicine";
export const ADD_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/addMedicine`;
export const GET_ALL_PRODUCTS_ROUTE = `${PRODUCT_ROUTES}/getMedicines`;
export const UPDATE_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/updateMedicine`;
export const UPDATE_IMAGES_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/updateImagesMedicine`;
export const DELETE_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/deleteMedicine`;

export const CATEGORY_ROUTES = "/api/v1/category";
export const GET_ALL_CATEGORIES_ROUTE = `${CATEGORY_ROUTES}/getCategories`;

export const BRAND_ROUTES = "/api/v1/brand";
export const GET_ALL_BRANDS_ROUTE = `${BRAND_ROUTES}/getBrands`;

export const BATCHES_ROUTES = "/api/v1/batch";
export const GET_ALL_BATCHES_FOR_MEDICINE_ROUTE = `${BATCHES_ROUTES}/getBatchesForMedicine`;

export const CUSTOMER_ROUTES = "/api/v1/customer";
export const ADD_CUSTOMER_ROUTE = `${CUSTOMER_ROUTES}/createCustomer`;
export const GET_ALL_CUSTOMERS_ROUTE = `${CUSTOMER_ROUTES}/getCustomers`;
export const GET_CUSTOMER_BY_ID_ROUTE = `${CUSTOMER_ROUTES}/:id`;
export const UPDATE_CUSTOMER_ROUTE = `${CUSTOMER_ROUTES}/profile`;
export const DELETE_CUSTOMER_ROUTE = `${CUSTOMER_ROUTES}/deleteCustomer`;

export const CLOUDINARY_ROUTES = "/api/v1/cloudinary";
export const REMOVE_IMAGE_ROUTE = `${CLOUDINARY_ROUTES}/removeImage`;
