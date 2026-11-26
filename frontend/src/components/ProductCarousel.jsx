import { Carousel, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetTopRatedProductsQuery } from "../slices/productSlice";
import Loader from "./Loader";
import Message from "./Message";
import Rating from "./Rating";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopRatedProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message ||
          error?.error ||
          "Could not load top-rated products."}
      </Message>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-2">Top Rated Products</h2>
      <Carousel
        variant="dark"
        pause="hover"
        className="top-rated-carousel bg-light rounded mb-4"
      >
        {products.map((product) => (
          <Carousel.Item key={product._id} className="px-4 px-md-5 py-3">
            <Row className="align-items-center gx-2 gy-2">
              <Col md={5} className="text-center">
                <Link to={`/product/${product._id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="top-rated-product-image object-fit-contain"
                    fluid
                  />
                </Link>
              </Col>
              <Col md={7} className="ps-md-2">
                <h3 className="h5 mb-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-decoration-none"
                  >
                    {product.name}
                  </Link>
                </h3>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <p className="small text-muted top-rated-product-description mb-2">
                  {product.description}
                </p>
                <p className="fs-5 fw-semibold mb-0">
                  ${Number(product.price).toFixed(2)}
                </p>
              </Col>
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}

export default ProductCarousel;
