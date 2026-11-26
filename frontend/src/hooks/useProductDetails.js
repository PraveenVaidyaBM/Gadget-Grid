import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../slices/cartSlice";
import { useCreateProductMutation } from "../slices/productSlice";
import { INITIAL_PRODUCT_FORM } from "../utils/constant";

const useProductDetails = ({ product, refetchProducts } = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [
    createProductMutation,
    {
      isLoading: isCreating,
      error: createError,
      reset: resetCreateProduct,
    },
  ] = useCreateProductMutation();

  const [qty, setQty] = useState(1);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);

  const createErrorMessage =
    createError?.data?.message ||
    createError?.error ||
    (createError ? "Could not create product." : "");

  const addToCartHandler = useCallback(() => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }, [dispatch, navigate, product, qty]);

  const openCreateProductModal = useCallback(() => {
    resetCreateProduct();
    setShowCreateProductModal(true);
  }, [resetCreateProduct]);

  const closeCreateProductModal = useCallback(() => {
    if (!isCreating) {
      setShowCreateProductModal(false);
    }
  }, [isCreating]);

  const handleProductFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setProductForm((currentForm) => ({ ...currentForm, [name]: value }));
  }, []);

  const createProduct = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        await createProductMutation({
          ...productForm,
          price: Number(productForm.price),
          countInStock: Number(productForm.countInStock),
        }).unwrap();
      } catch (error) {
        const message =
          error?.data?.message || error?.error || "Could not create product.";
        toast.error(message);
        return;
      }

      setShowCreateProductModal(false);
      setProductForm({ ...INITIAL_PRODUCT_FORM });

      try {
        const refreshResult = await refetchProducts();
        if (refreshResult?.error) {
          toast.error("Product was saved, but the list could not be refreshed.");
          return;
        }
      } catch {
        toast.error("Product was saved, but the list could not be refreshed.");
        return;
      }

      toast.success("Product created successfully.");
    },
    [createProductMutation, productForm, refetchProducts],
  );

  const editProduct = useCallback(() => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }, [navigate, product]);

  const deleteProduct = useCallback(() => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }, [navigate, product]);

  return {
    qty,
    setQty,
    addToCartHandler,
    createProduct,
    isCreating,
    productForm,
    createErrorMessage,
    showCreateProductModal,
    openCreateProductModal,
    closeCreateProductModal,
    handleProductFormChange,
    editProduct,
    deleteProduct,
  };
};

export default useProductDetails;
