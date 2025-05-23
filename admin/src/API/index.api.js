export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/v1/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/loginAdmin`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const PRODUCT_ROUTES = "/api/v1/medicine";
export const ADD_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/addMedicine`;
export const GET_ALL_PRODUCTS_ROUTE = `${PRODUCT_ROUTES}/getMedicines`;
export const UPDATE_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/updateMedicine`;
export const UPDATE_IMAGES_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/updateImagesMedicine`;
export const DELETE_MEDICINE_ROUTE = `${PRODUCT_ROUTES}/deleteMedicine`;
export const BULK_ADD_MEDICINES_ROUTE = `${PRODUCT_ROUTES}/bulkAddMedicines`;

export const CATEGORY_ROUTES = "/api/v1/category";
export const ADD_CATEGORY_ROUTE = `${CATEGORY_ROUTES}/addCategory`;
export const GET_ALL_CATEGORIES_ROUTE = `${CATEGORY_ROUTES}/getCategories`;
export const UPDATE_CATEGORY_ROUTE = `${CATEGORY_ROUTES}/updateCategory`;
export const DELETE_CATEGORY_ROUTE = `${CATEGORY_ROUTES}/deleteCategory`;

export const BRAND_ROUTES = "/api/v1/brand";
export const ADD_BRAND_ROUTE = `${BRAND_ROUTES}/addBrand`;
export const GET_ALL_BRANDS_ROUTE = `${BRAND_ROUTES}/getBrands`;
export const UPDATE_BRAND_ROUTE = `${BRAND_ROUTES}/updateBrand`;
export const DELETE_BRAND_ROUTE = `${BRAND_ROUTES}/deleteBrand`;

export const MANUFACTURE_ROUTES = "/api/v1/manufacture";
export const ADD_MANUFACTURE_ROUTE = `${MANUFACTURE_ROUTES}/addManufacture`;
export const GET_ALL_MANUFACTURES_ROUTE = `${MANUFACTURE_ROUTES}/getManufactures`;
export const UPDATE_MANUFACTURE_ROUTE = `${MANUFACTURE_ROUTES}/updateManufacture`;
export const DELETE_MANUFACTURE_ROUTE = `${MANUFACTURE_ROUTES}/deleteManufacture`;

export const SUPPLIER_ROUTE = "/api/v1/supplier";
export const ADD_SUPPLIER_ROUTE = `${SUPPLIER_ROUTE}/addSupplier`;
export const GET_ALL_SUPPLIERS_ROUTE = `${SUPPLIER_ROUTE}/getSuppliers`;
export const UPDATE_SUPPLIER_ROUTE = `${SUPPLIER_ROUTE}/updateSupplier`;
export const DELETE_SUPPLIER_ROUTE = `${SUPPLIER_ROUTE}/deleteSupplier`;

export const BATCHES_ROUTES = "/api/v1/batch";
export const CREATE_BATCH_ROUTE = `${BATCHES_ROUTES}/createBatch`;
export const GET_ALL_BATCHES_ROUTE = `${BATCHES_ROUTES}/getBatches`;
export const GET_ALL_BATCHES_FOR_MEDICINE_ROUTE = `${BATCHES_ROUTES}/getBatchesForMedicine`;
export const GET_ALL_BATCHES_FOR_STATISTICS_ROUTE = `${BATCHES_ROUTES}/getBatchesForStatistics`;
export const UPDATE_BATCH_PARTIAL_ROUTE = `${BATCHES_ROUTES}/update-partial`;
export const BULK_IMPORT_BATCHES_ROUTE = `${BATCHES_ROUTES}/bulkImportBatches`;

export const STATISTICS_ROUTES = "/api/v1/statistic";
export const GET_EXPIRING_MEDICINES_ROUTE = `${STATISTICS_ROUTES}/getExpiringMedicines`;
export const GET_EXPIRED_MEDICINES_ROUTE = `${STATISTICS_ROUTES}/getExpiredMedicines`;
export const GET_DAILY_REVENUE_ROUTE = `${STATISTICS_ROUTES}/getDailyRevenue`;
export const GET_MONTHLY_REVENUE_ROUTE = `${STATISTICS_ROUTES}/getMonthlyRevenue`;
export const GET_DASHBOARD_OVERVIEW_ROUTE = `${STATISTICS_ROUTES}/getDashboardOverview`;
export const GET_BEST_SELLING_MEDICINES_ROUTE = `${STATISTICS_ROUTES}/bestSellingMedicines`;
export const GET_SLOWEST_SELLING_MEDICINES_ROUTE = `${STATISTICS_ROUTES}/slowestSellingMedicines`;
export const GET_TOP_CUSTOMERS_ROUTE = `${STATISTICS_ROUTES}/topCustomers`;

export const CUSTOMER_ROUTES = "/api/v1/customer";
export const ADD_CUSTOMER_ROUTE = `${CUSTOMER_ROUTES}/createCustomer`;
export const GET_ALL_CUSTOMERS_ROUTE = `${CUSTOMER_ROUTES}/getCustomers`;
export const GET_CUSTOMER_BY_ID_ROUTE = `${CUSTOMER_ROUTES}/:id`;
export const UPDATE_CUSTOMER_ROUTE = `${CUSTOMER_ROUTES}/profile`;
export const DELETE_CUSTOMER_ROUTE = `${CUSTOMER_ROUTES}/deleteCustomer`;

export const ORDER_ROUTES = "/api/v1/order";
export const GET_ALL_ORDERS_ROUTE = `${ORDER_ROUTES}/getOrders`;
export const GET_ORDER_DETAIL_ROUTE = `${ORDER_ROUTES}/getOrderDetail`;
export const UPDATE_ORDER_STATUS_ROUTE = `${ORDER_ROUTES}/updateStatusOrder`;

export const STAFF_ROUTES = "/api/v1/staff";
export const ADD_STAFF_ROUTE = `${STAFF_ROUTES}/createStaff`;
export const GET_ALL_STAFF_ROUTE = `${STAFF_ROUTES}/getStaffs`;
export const GET_CURRENT_STAFF = `${STAFF_ROUTES}/getCurrentStaff`;
export const UPDATE_STAFF_ROUTE = `${STAFF_ROUTES}/updateStaff`;
export const DELETE_STAFF_ROUTE = `${STAFF_ROUTES}/deleteStaff`;
export const UPDATE_PASSWORD_ROUTE = `${STAFF_ROUTES}/update-password-admin`;

export const SHIFT_WORK_ROUTES = "/api/v1/shiftWork";
export const ADD_SHIFT_WORK_ROUTE = `${SHIFT_WORK_ROUTES}/addShiftWork`;
export const GET_ALL_SHIFT_WORK_ROUTE = `${SHIFT_WORK_ROUTES}/getShiftWorks`;
export const UPDATE_SHIFT_WORK_ROUTE = `${SHIFT_WORK_ROUTES}/updateShiftWork`;
export const DELETE_SHIFT_WORK_ROUTE = `${SHIFT_WORK_ROUTES}/deleteShiftWork`;

export const COUPON_ROUTES = "/api/v1/coupon";
export const ADD_COUPON_ROUTE = `${COUPON_ROUTES}/createCoupon`;
export const GET_ALL_COUPONS_ROUTE = `${COUPON_ROUTES}/getCoupons`;
export const GET_ALL_COUPONS_ADMIN_ROUTE = `${COUPON_ROUTES}/getCouponsAdmin`;
export const UPDATE_COUPON_ROUTE = `${COUPON_ROUTES}/updateCoupon`;
export const DELETE_COUPON_ROUTE = `${COUPON_ROUTES}/deleteCoupon`;

export const BILL_ROUTES = "/api/v1/bill";
export const CREATE_BILL_ROUTE = `${BILL_ROUTES}/createBill`;
export const GET_ALL_BILLS_ROUTE = `${BILL_ROUTES}/getBills`;
export const GET_BILL_BY_ID_ROUTE = `${BILL_ROUTES}/get-by-id`;
export const CREATE_RETURN_BILL_ROUTE = `${BILL_ROUTES}/return`;

export const SLIDER_BANNER_ROUTES = "/api/v1/sliderBanner";
export const CREATE_SLIDER_BANNER_ROUTE = `${SLIDER_BANNER_ROUTES}/createSliderBanner`;
export const UPDATE_IMAGE_SLIDER_BANNER_ROUTE = `${SLIDER_BANNER_ROUTES}/updateImageSliderBanner`;
export const GET_ALL_SLIDER_BANNERS_ROUTE = `${SLIDER_BANNER_ROUTES}/getAllSliderBanner`;
export const UPDATE_SLIDER_BANNER_ROUTE = `${SLIDER_BANNER_ROUTES}/updateSliderBanner`;
export const DELETE_SLIDER_BANNER_ROUTE = `${SLIDER_BANNER_ROUTES}/deleteSliderBanner`;

export const CLOUDINARY_ROUTES = "/api/v1/cloudinary";
export const REMOVE_IMAGE_ROUTE = `${CLOUDINARY_ROUTES}/removeImage`;
