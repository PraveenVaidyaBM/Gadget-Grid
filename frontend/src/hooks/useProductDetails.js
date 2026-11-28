import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../slices/cartSlice";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../slices/productSlice";
import { INITIAL_PRODUCT_FORM } from "../utils/constant";

const createProductFormData = (productForm) => {
  const formData = new FormData();

  Object.entries(productForm).forEach(([key, value]) => {
    if (key === "imageFile") {
      return;
    }

    formData.append(key, value == null ? "" : String(value));
  });

  if (productForm.imageFile) {
    formData.append("image", productForm.imageFile);
  }

  return formData;
};

const useProductDetails = ({ product } = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId, pageNumber } = useParams();
  const {
    data,
    isLoading,
    error,
    refetch: refetchProducts,
  } = useGetProductsQuery(
    { pageNumber },
    { skip: Boolean(productId) },
  );
  const [
    createProductMutation,
    {
      isLoading: isCreating,
      error: createError,
      reset: resetCreateProduct,
    },
  ] = useCreateProductMutation();
  const [
    updateProductMutation,
    {
      isLoading: isUpdating,
      error: updateError,
      reset: resetUpdateProduct,
    },
  ] = useUpdateProductMutation();
  const [deleteProductMutation, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const [qty, setQty] = useState(1);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);
  const isSaving = isCreating || isUpdating;
  const formError = createError || updateError;

  const productFormErrorMessage = formError
    ? formError?.data?.message ||
      formError?.error ||
      "Could not save product."
    : "";

  const addToCartHandler = useCallback(() => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }, [dispatch, navigate, product, qty]);

  const openCreateProductModal = useCallback(() => {
    resetCreateProduct();
    resetUpdateProduct();
    setEditingProduct(null);
    setProductForm({ ...INITIAL_PRODUCT_FORM });
    setShowCreateProductModal(true);
  }, [resetCreateProduct, resetUpdateProduct]);

  const openEditProductModal = useCallback(
    (productToEdit) => {
      resetCreateProduct();
      resetUpdateProduct();
      setEditingProduct(productToEdit);
      setProductForm({
        name: productToEdit.name,
        imageFile: null,
        description: productToEdit.description,
        brand: productToEdit.brand || "",
        category: productToEdit.category,
        price: String(productToEdit.price),
        countInStock: String(productToEdit.countInStock),
      });
      setShowCreateProductModal(true);
    },
    [resetCreateProduct, resetUpdateProduct],
  );

  const closeCreateProductModal = useCallback(() => {
    if (!isSaving) {
      setShowCreateProductModal(false);
      setEditingProduct(null);
    }
  }, [isSaving]);

  const handleProductFormChange = useCallback((event) => {
    const { name, value, files } = event.target;
    setProductForm((currentForm) => ({
      ...currentForm,
      [name]: name === "imageFile" ? files?.[0] || null : value,
    }));
  }, []);

  const saveProduct = useCallback(
    async (event) => {
      event.preventDefault();

      if (
        !editingProduct &&
        !productForm.imageFile
      ) {
        toast.error("Upload an image for the product.");
        return;
      }

      const requestBody = createProductFormData(productForm);
      try {
        if (editingProduct) {
          await updateProductMutation({
            id: editingProduct._id,
            body: requestBody,
          }).unwrap();
        } else {
          await createProductMutation(requestBody).unwrap();
        }
      } catch (error) {
        const message =
          error?.data?.message ||
          error?.error ||
          `Could not ${editingProduct ? "update" : "create"} product.`;
        toast.error(message);
        return;
      }

      setShowCreateProductModal(false);
      setEditingProduct(null);
      setProductForm({ ...INITIAL_PRODUCT_FORM });

      try {
        const refreshResult = await refetchProducts();
        if (refreshResult?.error) {
          toast.error(
            "Product was saved, but the list could not be refreshed.",
          );
          return;
        }
      } catch {
        toast.error("Product was saved, but the list could not be refreshed.");
        return;
      }

      toast.success(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully.",
      );
    },
    [
      createProductMutation,
      editingProduct,
      productForm,
      refetchProducts,
      updateProductMutation,
    ],
  );

  const deleteProduct = useCallback(
    async (productToDelete) => {
      if (
        !window.confirm(
          `Delete "${productToDelete.name}"? This cannot be undone.`,
        )
      ) {
        return;
      }

      try {
        await deleteProductMutation(productToDelete._id).unwrap();
      } catch (error) {
        toast.error(
          error?.data?.message || error?.error || "Could not delete product.",
        );
        return;
      }

      const refreshResult = await refetchProducts();
      if (refreshResult?.error) {
        toast.error("Product was deleted, but the list could not be refreshed.");
        return;
      }

      toast.success("Product deleted successfully.");
    },
    [deleteProductMutation, refetchProducts],
  );

  return {
    data,
    isLoading,
    error,
    qty,
    setQty,
    editingProduct,
    addToCartHandler,
    saveProduct,
    deleteProduct,
    isDeleting,
    isSaving,
    productForm,
    productFormErrorMessage,
    showCreateProductModal,
    openCreateProductModal,
    openEditProductModal,
    closeCreateProductModal,
    handleProductFormChange,
  };
};

export default useProductDetails;
