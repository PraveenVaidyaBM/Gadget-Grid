import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTimes} from "react-icons/fa";

import { useGetMyOrdersQuery } from "../slices/oderAPiSlice";
import Loader from "./Loader";
import Message from "./Message";

function OrderHistory() {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message ||
          error?.error ||
          "Could not load order history."}
      </Message>
    );
  }

  return (
    <>
      <h2>Order History</h2>
      {orders?.length ? (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th className="bg-white">Order #</th>
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
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${Number(order.totalPrice).toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    new Date(order.paidAt).toLocaleDateString()
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    new Date(order.deliveredAt).toLocaleDateString()
                  ) : ( 
                    <FaTimes style={{ color: "red" }} />
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
      ) : (
        <Message>You have not placed any orders yet.</Message>
      )}
    </>
  );
}

export default OrderHistory;
