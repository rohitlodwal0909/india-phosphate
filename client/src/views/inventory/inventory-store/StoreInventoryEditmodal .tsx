import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { allUnits } from 'src/utils/AllUnit';

const StoreInventoryEditmodal = ({
  editModal,
  modalPlacement,
  setEditModal,
  selectedUser,
  onUpdateUser,
}) => {
  const [formData, setFormData] = useState({
    supplier: '',
    datetime: '',
    grn: '',
    manufacturer: '',
    invoice: '',
    quantity: '',
    vehicle: '',
    batchNo: '',
    storeRMCode: '',
    containers: '',
    container_unit: '',
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        supplier: selectedUser.supplier || '',
        datetime: selectedUser.datetime || '',
        grn: selectedUser.grn || '',
        manufacturer: selectedUser.manufacturer || '',
        invoice: selectedUser.invoice || '',
        quantity: selectedUser.quantity || '',
        vehicle: selectedUser.vehicle || '',
        batchNo: selectedUser.batchNo || '',
        storeRMCode: selectedUser.storeRMCode || '',
        containers: selectedUser.containers || '',
        container_unit: selectedUser.container_unit || '',
      });
    }
  }, [selectedUser]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...selectedUser, ...formData };
    onUpdateUser(updatedData);
    setEditModal(false);
  };

  return (
    <Modal
      show={editModal}
      position={modalPlacement}
      onClose={() => setEditModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0">Edit Inventory</ModalHeader>
      <ModalBody className="overflow-auto max-h-[100vh]">
        <form className="grid grid-cols-12 gap-5" onSubmit={handleSubmit}>
          {/* Supplier Name */}
          <InputField
            id="supplier"
            label="Supplier Name"
            value={formData.supplier}
            onChange={handleChange}
          />
          {/* Date & Time */}
          <InputField
            id="datetime"
            label="Date & Time"
            type="datetime-local"
            value={formData.datetime}
            onChange={handleChange}
          />

          {/* GRN Number */}
          <InputField id="grn" label="GRN Number" value={formData.grn} onChange={handleChange} />

          {/* Manufacturing Name */}
          <InputField
            id="manufacturer"
            label="Manufacturing Name"
            value={formData.manufacturer}
            onChange={handleChange}
          />

          {/* Invoice Number */}
          <InputField
            id="invoice"
            label="Invoice Number"
            value={formData.invoice}
            onChange={handleChange}
          />

          {/* Quantity */}
          <InputField
            id="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />

          {/* Vehicle Number */}
          <InputField
            id="vehicle"
            label="Vehicle Number"
            value={formData.vehicle}
            onChange={handleChange}
          />

          {/* Batch Number */}
          <InputField
            id="batchNo"
            label="Batch Number"
            value={formData.batchNo}
            onChange={handleChange}
          />

          {/* Store RM Code */}
          <InputField
            id="storeRMCode"
            label="Store RM Code"
            value={formData.storeRMCode}
            onChange={handleChange}
          />

          {/* Containers */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="quantityNet" value="Quantity (Net)" />
            <div className="flex rounded-md shadow-sm">
              {/* Quantity input (read-only) */}
              <input
                type="text"
                id="quantityNet"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                value={formData?.containers}
                onChange={(e) => handleChange('containers', e.target.value)}
              />

              {/* Unit select (disabled for read-only) */}
              <select
                className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700"
                value={formData.container_unit}
                onChange={(e) => handleChange('container_unit', e.target.value)}
              >
                <option value="">Unit</option>
                {allUnits?.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-[1rem]">
            <Button type="reset" color="error" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

// Reusable InputField component
const InputField = ({ id, label, type = 'text', value, onChange }) => (
  <div className="sm:col-span-6 col-span-12">
    <div className="mb-2 block">
      <Label htmlFor={id} value={label} />
      <span className="text-red-700 ps-1">*</span>
    </div>
    <TextInput
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      style={{ borderRadius: '5px' }}
    />
  </div>
);
export default StoreInventoryEditmodal;
