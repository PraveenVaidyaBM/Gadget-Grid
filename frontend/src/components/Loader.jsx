import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
      <Spinner
        animation="border"
        role="status"
        className="app-loader"
      >
      </Spinner>
  );
};

export default Loader;
