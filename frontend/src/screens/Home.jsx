// external libraries
import { Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useGetProductsQuery } from "../slices/productSlice";
import { useParams } from "react-router-dom";

// components
import PageTitle from "../components/PageTitle";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

const Home = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  return (
    <>
      <PageTitle
        title={
          keyword
            ? `Search: ${keyword} | Gadget Grid`
            : "Home | Gadget Grid"
        }
      />
      {keyword && (
        <LinkContainer to="/">
          <Button variant="light" className="mb-3">
            Go Back
          </Button>
        </LinkContainer>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {!keyword && (
            <ProductCarousel />
          )}
          <h2 className="mb-2">Latest Products</h2>
          <Row>
            {data?.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            pageNumber={data.pageNumber}
            keyword={keyword}
          />
        </>
      )}
    </>
  );
};

export default Home;
