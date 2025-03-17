export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/v1/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CUSTOMER_ROUTES = "/api/v1/customer";
export const GET_USER_INFO = `${CUSTOMER_ROUTES}/getUserInfo`;
export const ADD_TO_CART_ROUTE = `${CUSTOMER_ROUTES}/addToCart`;
export const REMOVE_FROM_CART_ROUTE = `${CUSTOMER_ROUTES}/removeFromCart`;
export const REMOVE_PRODUCT_FROM_CART_ROUTE = `${CUSTOMER_ROUTES}/removeProductFromCart`;
export const UPDATE_CART_ROUTE = `${CUSTOMER_ROUTES}/updateCart`;
export const CLEAR_CART_ROUTE = `${CUSTOMER_ROUTES}/clearCart`;
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

export const COUPON_ROUTES = "/api/v1/coupon";
export const CREATE_COUPON_ROUTE = `${COUPON_ROUTES}/createCoupon`;
export const GET_COUPONS_ROUTE = `${COUPON_ROUTES}/getCoupons`;
export const GET_COUPON_ROUTE = `${COUPON_ROUTES}/getCoupon/:id`;
export const UPDATE_COUPON_ROUTE = `${COUPON_ROUTES}/updateCoupon/:id`;

export const PRODUCT_ROUTES = "/api/v1/medicine";
export const GET_ALL_PRODUCTS_ROUTE = `${PRODUCT_ROUTES}/getMedicines`;
export const GET_ALL_PRODUCTS_BY_HISTORY_ROUTE = `${PRODUCT_ROUTES}/getMedicineByHistory`;
export const GET_ALL_PRODUCTS_DISCOUNT_ROUTE = `${PRODUCT_ROUTES}/getMedicinesByIsDiscount`;
export const GET_ALL_PRODUCT_BY_CATEGORY_ROUTE = `${PRODUCT_ROUTES}/getMedicineByCategory`;
export const GET_ALL_PRODUCT_BY_CATEGORY_NAME_ROUTE = `${PRODUCT_ROUTES}/getMedicinesByCategoryName`;
export const GET_PRODUCT_BY_BEST_SELLING_ROUTE = `${PRODUCT_ROUTES}/getMedicineByBestSelling`;
export const GET_PRODUCT_ROUTE = `${PRODUCT_ROUTES}/getMedicine/:id`;
export const CREATE_PRODUCT_ROUTE = `${PRODUCT_ROUTES}/addMedicine`;
export const UPDATE_PRODUCT_ROUTE = `${PRODUCT_ROUTES}/updateMedicine/:id`;
export const DELETE_PRODUCT_ROUTE = `${PRODUCT_ROUTES}/deleteMedicine/:id`;

export const CATEGORY_ROUTES = "/api/v1/category";
export const GET_ALL_CATEGORIES_ROUTE = `${CATEGORY_ROUTES}/getCategories`;

export const ORDER_ROUTES = "/api/v1/order";
export const CREATE_ORDER_ROUTE = `${ORDER_ROUTES}/createOrder`;
export const GET_ORDERS_ROUTE = `${ORDER_ROUTES}/getOrders`;
export const GET_CURRENT_USER_ORDER_ROUTE = `${ORDER_ROUTES}/getCurrentUserOrders`;
export const GET_ORDER_BY_ID_ROUTE = `${ORDER_ROUTES}/getOrderById`;
export const GET_ORDER_DETAIL_ROUTE = `${ORDER_ROUTES}/getOrderDetail`;
export const GET_ORDER_BY_VNP_TXN_REF = `${ORDER_ROUTES}/by-vnp-txn-ref`;
export const CHECK_PURCHASE_ROUTE = `${ORDER_ROUTES}/checkPurchase`;
export const UPDATE_STATUS_ORDER_ROUTE = `${ORDER_ROUTES}/updateStatusOrder`;
export const DELETE_ORDER_ROUTE = `${ORDER_ROUTES}/deleteOrder`;

export const POINT_HISTORY_ROUTES = "/api/v1/pointHistory";
export const GET_POINT_HISTORIES_ROUTE = `${POINT_HISTORY_ROUTES}/getPointHistories`;

export const COMMENT_ROUTES = "/api/v1/comment";
export const CREATE_COMMENT_ROUTE = `${COMMENT_ROUTES}/createComment`;
export const GET_COMMENTS_ROUTE = `${COMMENT_ROUTES}/getCommentByProductId`;
export const GET_COMMENT_PRODUCT_CURRENT_USER_ROUTE = `${COMMENT_ROUTES}/getCommentProductCurrentUser`;
export const EDIT_COMMENT_ROUTE = `${COMMENT_ROUTES}/editComment`;

export const PAYPAL_ROUTES = "/api/v1/paypal";
export const CREATE_PAYPAL_ORDER_ROUTE = `${PAYPAL_ROUTES}/createOrder`;

export const VNPAY_ROUTES = "/api/v1/vnpay";
export const CREATE_VNPAY_ORDER_ROUTE = `${VNPAY_ROUTES}/create_payment_url`;
export const VNPAY_RETURN_ROUTE = `${VNPAY_ROUTES}/vnpay_return`;