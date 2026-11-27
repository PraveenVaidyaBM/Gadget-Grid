import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Paginate({
  pages,
  pageNumber,
  isAdmin = false,
  isUserList = false,
  keyword = "",
}) {
  if (!pages || pages <= 1) {
    return null;
  }

  const currentPage = Number(pageNumber) || 1;

  return (
    <Pagination className="justify-content-center my-3">
      {[...Array(pages).keys()].map((x) => (
        <LinkContainer
          key={x + 1}
          to={
            isUserList
              ? `/admin/userlist/${x + 1}`
              : isAdmin
                ? `/admin/productlist/${x + 1}`
                : keyword
                  ? `/search/${encodeURIComponent(keyword)}/page/${x + 1}`
                  : `/page/${x + 1}`
          }
        >
          <Pagination.Item active={x + 1 === currentPage}>
            {x + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
}

export default Paginate;
