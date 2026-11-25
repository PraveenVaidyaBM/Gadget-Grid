// external libraries
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">&copy; {year} Gadget Grid</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
