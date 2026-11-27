import { useParams } from "react-router-dom";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../../slices/userSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import PageTitle from "../../components/PageTitle";
import UserModal from "../../components/UserModal";
import useUserDetails from "../../hooks/useUserDetails";

function UsersList() {
  const { pageNumber = 1 } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, error } = useGetUsersQuery({ pageNumber });
  const {
    userForm,
    showUserModal,
    isSaving,
    isDeleting,
    formErrorMessage,
    openEditUserModal,
    closeUserModal,
    handleUserFormChange,
    saveUser,
    deleteUserHandler,
  } = useUserDetails();

  return (
    <>
      <PageTitle title="Users | Admin" />
      <Row className="align-items-center mb-3">
        <Col>
          <h1>Users</h1>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Could not load users."}
        </Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th className="bg-white">User #</th>
                <th className="bg-white">Name</th>
                <th className="bg-white">Email</th>
                <th className="bg-white">Administrator</th>
                <th className="bg-white" />
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck
                        aria-label="Administrator"
                        className="text-success"
                      />
                    ) : (
                      <FaTimes
                        aria-label="Not an administrator"
                        className="text-danger"
                      />
                    )}
                  </td>
                  <td className="text-end text-nowrap">
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      aria-label={`Edit ${user.name}`}
                      onClick={() => openEditUserModal(user)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      type="button"
                      variant="outline-danger"
                      size="sm"
                      aria-label={`Delete ${user.name}`}
                      title={
                        user.isAdmin
                          ? "Administrator accounts cannot be deleted"
                          : user._id === userInfo?._id
                          ? "You cannot delete your own account"
                          : undefined
                      }
                      disabled={
                        isDeleting ||
                        user.isAdmin ||
                        user._id === userInfo?._id
                      }
                      onClick={() => deleteUserHandler(user)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {data?.users?.length === 0 && (
            <Message variant="info">No users found.</Message>
          )}
          <Paginate
            pages={data?.pages}
            pageNumber={data?.pageNumber}
            isUserList
          />
        </>
      )}
      <UserModal
        show={showUserModal}
        onHide={closeUserModal}
        userForm={userForm}
        onChange={handleUserFormChange}
        onSubmit={saveUser}
        isSaving={isSaving}
        error={formErrorMessage}
      />
    </>
  );
}

export default UsersList;
