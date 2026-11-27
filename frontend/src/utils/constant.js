export const BASE_URL = import.meta.env.DEV ? "http://localhost:5000" : "";
export const PRODUCTS_URL = `${BASE_URL}/api/products`;
export const USERS_URL = `${BASE_URL}/api/users`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
export const PAYPAL_URL = `${BASE_URL}/api/config/paypal`;

export const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const INITIAL_PRODUCT_FORM = {
  name: "",
  image: "",
  description: "",
  brand: "",
  category: "",
  price: "",
  countInStock: "",
};

export const EMPTY_USER_FORM = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isAdmin: false,
};