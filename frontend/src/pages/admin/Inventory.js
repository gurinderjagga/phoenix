import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AddCarModal from '../../components/admin/AddCarModal';
import apiService from '../../utils/api';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

// Icon Components
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, carId: null });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });

  useBodyScrollLock(confirmModal.isOpen || alertModal.isOpen);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car =>
      car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCars(filtered);
  }, [cars, searchTerm]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCars();
      setCars(response.cars || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCar(null);
    setShowAddModal(true);
  };

  const handleEdit = (car) => {
    setSelectedCar(car);
    setShowAddModal(true);
  };

  const confirmDelete = (carId) => {
    setConfirmModal({ isOpen: true, carId });
  };

  const executeDelete = async () => {
    const carId = confirmModal.carId;
    setConfirmModal({ isOpen: false, carId: null });
    try {
      await apiService.deleteCar(carId);
      fetchCars();
      setAlertModal({ isOpen: true, message: 'Car deleted successfully', isError: false });
    } catch (error) {
      console.error('Error deleting car:', error);
      setAlertModal({ isOpen: true, message: 'Failed to delete car', isError: true });
    }
  };

  const handleSaveCar = async (carData) => {
    try {
      if (carData.id) {
        await apiService.updateCar(carData.id, carData);
        setAlertModal({ isOpen: true, message: 'Car updated successfully!', isError: false });
      } else {
        await apiService.createCar(carData);
        setAlertModal({ isOpen: true, message: 'Car added successfully!', isError: false });
      }

      fetchCars();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving car:', error);
      setAlertModal({ isOpen: true, message: 'Failed to save car', isError: true });
      throw error;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'available': 'bg-green-100 text-green-800',
      'sold': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'unavailable': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-sm uppercase tracking-wider ${statusClasses[status] || statusClasses.available}`}>
        {status || 'available'}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your dealership's car inventory</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by model, make, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900 w-full sm:w-64 md:w-80"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap hidden sm:block">
                {filteredCars.length} of {cars.length} cars
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="bg-black text-white px-4 py-2 flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[48px] sm:min-h-0"
            >
              <PlusIcon />
              <span>Add New Car</span>
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-gray-200 overflow-hidden relative">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading inventory...</p>
            </div>
          ) : (
            <>
              {/* === MOBILE CARD VIEW === */}
              <div className="block md:hidden divide-y divide-gray-200">
                {filteredCars.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No cars found matching your search.' : 'No cars in inventory.'}
                  </div>
                ) : (
                  filteredCars.map((car) => (
                    <div key={car.id} className="p-4">
                      <div className="flex items-start space-x-4 mb-3">
                        <div className="w-20 h-14 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
                          {car.images && car.images[0] ? (
                            <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 uppercase tracking-wider truncate">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{car.year} &bull; {car.category || 'N/A'}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-primary">${car.price?.toLocaleString() || '0'}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${car.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {car.stock > 0 ? `${car.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(car)}
                          className="flex-1 flex items-center justify-center min-h-[44px] bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-sm">
                          <EditIcon /><span className="ml-2">Edit</span>
                        </button>
                        <button onClick={() => confirmDelete(car.id)}
                          className="flex-1 flex items-center justify-center min-h-[44px] bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-sm">
                          <TrashIcon /><span className="ml-2">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* === DESKTOP TABLE VIEW === */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCars.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          {searchTerm ? 'No cars found matching your search.' : 'No cars in inventory.'}
                        </td>
                      </tr>
                    ) : (
                      filteredCars.map((car) => (
                        <tr key={car.id} className="">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-16 h-12 bg-gray-200 rounded-sm overflow-hidden">
                              {car.images && car.images[0] ? (
                                <img
                                  src={car.images[0]}
                                  alt={car.model}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                  <CarIcon />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {car.brand} {car.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {car.year}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {car.stock || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${car.price?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(car.stock === 0 ? 'unavailable' : (car.status || 'available'))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleEdit(car)}
                                className="text-gray-400 min-h-[48px] min-w-[48px] flex items-center justify-center"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => confirmDelete(car.id)}
                                className="text-gray-400 min-h-[48px] min-w-[48px] flex items-center justify-center"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Car Modal */}
      <AddCarModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCar}
        car={selectedCar}
      />

      {/* Delete Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-red-500">
            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-2">Delete Vehicle</h2>
            <p className="text-sm text-gray-500 mb-8 tracking-wide">
              Are you sure you want to permanently delete this car from inventory?
            </p>
            <div className="flex space-x-4">
              <button
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em]"
                onClick={() => setConfirmModal({ isOpen: false, carId: null })}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-600 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em]"
                onClick={executeDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
              {alertModal.isError ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              )}
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-2">
              {alertModal.isError ? 'Action Failed' : 'Success'}
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {alertModal.message}
            </p>
            <button
              className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
              onClick={() => setAlertModal({ isOpen: false, message: '', isError: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Inventory;



