import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useGetOrdersQuery } from "../../slices/orderSlice";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";

function OrderList() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <PageTitle title="Orders | Admin" />
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th className="bg-white">Order #</th>
              <th className="bg-white">User</th>
              <th className="bg-white">Date</th>
              <th className="bg-white">Total</th>
              <th className="bg-white">Payment</th>
              <th className="bg-white">Delivery</th>
              <th className="bg-white" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${Number(order.totalPrice).toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    new Date(order.paidAt).toLocaleDateString()
                  ) : (
                    <FaTimes className="order-status-missing" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt).toLocaleDateString()
                  ) : (
                    <FaTimes className="order-status-missing" />
                  )}
                </td>
                <td>
                  <Button
                    as={Link}
                    to={`/order/${order._id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default OrderList;
