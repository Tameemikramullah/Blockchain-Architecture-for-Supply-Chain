import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import Modal from './Modal';
import Loader from './Loader';
import Navbar from "./Navbar"

const InventoryDetails = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/store/inventories/details',{
        headers: {
          'Authorization': `Bearer ${accessToken}` // Include the access token in the Authorization header
        }
      });
        setInventoryData(response.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const inventoryColumns = [
    { key: 'product__name', label: 'Product Name' },
    { key: 'product__product_code', label: 'Product Code' },
    { key: 'quantity', label: 'Quantity' },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
  <div>
  <Navbar/>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-4">Inventory Details</h2>
      <Table
        data={inventoryData}
        columns={inventoryColumns}
        onRowClick={handleItemClick}
      />
      <Modal isOpen={!!selectedItem} onClose={handleCloseModal}>
        {selectedItem && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              {selectedItem.product__name}
            </h3>
            <p>
              <strong>Product Code:</strong> {selectedItem.product__product_code}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedItem.quantity}
            </p>
            {/* Add more detailed information about the selected item */}
          </div>
        )}
      </Modal>
    </div>
    </div>
  );
};

export default InventoryDetails;