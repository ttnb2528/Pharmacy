export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/v1/auth";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CUSTOMER_ROUTES = "/api/v1/customer";
export const GET_USER_INFO = `${CUSTOMER_ROUTES}/getUserInfo`;
export const UPDATE_USER_ROUTE = `${CUSTOMER_ROUTES}/profile`;
export const UPDATE_PASSWORD_ROUTE = `${CUSTOMER_ROUTES}/update-password`;
export const ADD_PROFILE_IMAGE_ROUTE = `${CUSTOMER_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${CUSTOMER_ROUTES}/remove-profile-image`;

export const ADDRESS_ROUTES = "/api/v1/address";
export const GET_ADDRESS_ROUTE = `${ADDRESS_ROUTES}/getAddress`;
export const GET_ALL_ADDRESSES_ROUTE = `${ADDRESS_ROUTES}/getAllAddress`;
export const ADD_ADDRESS_ROUTE = `${ADDRESS_ROUTES}/addAddress`;
export const UPDATE_ADDRESS_ROUTE = `${ADDRESS_ROUTES}/updateAddress`;
export const DELETE_ADDRESS_ROUTE = `${ADDRESS_ROUTES}/deleteAddress`;

export const LOCATION_ROUTES = "/api/v1/location";
export const GET_PROVINCES_ROUTE = `${LOCATION_ROUTES}/getProvinces`;
export const GET_DISTRICTS_ROUTE = `${LOCATION_ROUTES}/getDistricts`;
export const GET_WARDS_ROUTE = `${LOCATION_ROUTES}/getWards`;
