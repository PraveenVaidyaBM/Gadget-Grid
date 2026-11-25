// external libraries
import { memo, useMemo } from "react";
import { Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// Cpmponents
import Rating from "./Rating";

const Product = memo(({ product }) => {
  const image = useMemo(
    () => product.image || product.thumbnail || product.images?.[0],
    [product],
  );

  return (
    <>
      <Card variant="top" className="my-2 p-2 rounded">
        <LinkContainer to={`/product/${product._id}`}>
          <Card.Link className="p-0">
            <Card.Img
              className="product-card-image"
              src={image}
              alt={product.name}
            />
          </Card.Link>
        </LinkContainer>
        <Card.Body>
          <LinkContainer to={`/product/${product._id}`}>
            <Card.Link className="text-decoration-none">
              <Card.Title as="div" className="product-title">
                <strong>{product.name}</strong>
              </Card.Title>
            </Card.Link>
          </LinkContainer>
          <Card.Text as="div">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </Card.Text>
          <Card.Text as="h3">${product.price}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
});

export default Product;
