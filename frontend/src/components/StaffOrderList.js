import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Table from './Table';
import Navbar from './Navbar';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/order_flow/orders/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  // Define columns for the table
  const columns = [
    { key: 'order_id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'total_cost', label: 'Total Cost' },
    { key: 'status', label: 'Status' }
  ];

  // Prepare the order data
  const orderData = orders.map(order => ({
    order_id: order.order_id,
    customer: order.customer.name,  // Assuming 'customer' object has a 'name' field
    total_cost: order.total_cost,  // Ensure you have 'total_cost' in your order object
    status: order.status
  }));

  return (
   <div>
  <Navbar/>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <Table data={orderData} columns={columns} />
    </div>
    </div>
  );
};

export default OrderList;
