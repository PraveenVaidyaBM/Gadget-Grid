import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

function SearchBox() {
  const { keyword: routeKeyword } = useParams();
  const [keyword, setKeyword] = useState(routeKeyword || "");
  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    const searchTerm = keyword.trim();

    if (searchTerm) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
      setKeyword("")
    } else {
      navigate("/");
    }
  };

  return (
    <Form
      className="d-flex my-2 my-md-0 w-100 search-box"
      onSubmit={submitHandler}
    >
      <InputGroup>
        <Form.Control
          type="search"
          name="keyword"
          placeholder="Search products"
          aria-label="Search products"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <Button
          type="submit"
          variant="light"
          aria-label="Search products"
          title="Search"
        >
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBox;
