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

const GuardEditmodal = ({
  editModal,
  modalPlacement,
  setEditModal,
  selectedUser,
  onUpdateUser,
  logindata,
}) => {
  const [formData, setFormData] = useState({
    user_id: logindata?.admin?.id,
    name: '',
    guard_type: '',
    vehicle_number: '',
    product_name: '',
    product_id: '',
    quantity_net: '',
    quantity_unit: '',
    sender_name: '',
    remark: '',
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        user_id: logindata?.admin?.id,
        name: selectedUser.name || '',
        guard_type: selectedUser.guard_type || '',
        vehicle_number: selectedUser.vehicle_number || '',
        product_name: selectedUser.product_name || '',
        product_id: selectedUser.product_id || '',
        quantity_net: selectedUser.quantity_net || '',
        quantity_unit: selectedUser.quantity_unit || '',
        sender_name: selectedUser.sender_name || '',
        remark: selectedUser.remark || '',
      });
    }
  }, [selectedUser]);

  const handleChange = (field, value) => {
    const resetFields = {
      vehicle_number: '',
      product_name: '',
      product_id: '',
      sender_name: '',
      remark: '',
    };

    if (field === 'guard_type') {
      setFormData((prev) => ({
        ...prev,
        guard_type: value,
        ...resetFields,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...selectedUser,
      ...formData,
    };
    onUpdateUser(updated);
    setEditModal(false);
  };

  return (
    <Modal
      show={editModal}
      position={modalPlacement}
      onClose={() => setEditModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0">Edit Entry</ModalHeader>
      <ModalBody className="overflow-auto ">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="name" value="Enter Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              style={{ borderRadius: '8px' }}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* Guard Type */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="guard_type" value="Select Vehical Type" />
            <select
              id="guard_type"
              value={formData?.guard_type}
              onChange={(e) => handleChange('guard_type', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="Vehicle">Vehicle </option>
              <option value="Courier">Courier</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Vehicle Fields */}
          {formData.guard_type === 'Vehicle' && (
            <div className="sm:col-span-6 col-span-12">
              <Label htmlFor="vehicle_number" value="Vehicle No." />
              <TextInput
                id="vehicle_number"
                type="text"
                placeholder="Enter Vehicle No."
                value={formData.vehicle_number}
                style={{ borderRadius: '8px' }}
                onChange={(e) => handleChange('vehicle_number', e.target.value)}
              />
            </div>
          )}

          {/* Courier Fields */}
          {formData.guard_type === 'Courier' && (
            <>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="sender_name" value="Sender Name" />
                <TextInput
                  id="sender_name"
                  type="text"
                  placeholder="Enter Sender Name"
                  value={formData.sender_name}
                  onChange={(e) => handleChange('sender_name', e.target.value)}
                />
              </div>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="product_name" value="Product Name" />
                <TextInput
                  id="product_name"
                  type="text"
                  placeholder="Enter Product Name"
                  value={formData.product_name}
                  onChange={(e) => handleChange('product_name', e.target.value)}
                />
              </div>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="product_id" value="Product ID" />
                <TextInput
                  id="product_id"
                  type="text"
                  placeholder="Enter Product ID"
                  value={formData.product_id}
                  onChange={(e) => handleChange('product_id', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Quantity with Unit */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="quantity" value="Quantity (Net)" />
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="quantity_net"
                name="quantity_net"
                placeholder="Enter quantity"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.quantity_net}
                onChange={(e) => handleChange('quantity_net', e.target.value)}
              />
              <select
                className="rounded-r-md border border-l-0 border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={formData.quantity_unit}
                onChange={(e) => handleChange('quantity_unit', e.target.value)}
              >
                {allUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formData.guard_type === 'Other' && (
            <div className="col-span-12">
              <Label htmlFor="remark" value="Remark" />
              <textarea
                id="remark"
                placeholder="Enter your remarks here"
                value={formData.remark}
                onChange={(e) => handleChange('remark', e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none border-gray-300 focus:ring-blue-500"
                rows={4}
              />
            </div>
          )}
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

export default GuardEditmodal;
