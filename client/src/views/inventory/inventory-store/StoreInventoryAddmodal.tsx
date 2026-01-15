import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GetCheckinmodule } from 'src/features/Inventorymodule/guardmodule/GuardSlice';
import {
  addStore,
  GetStoremodule,
} from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { allUnits } from 'src/utils/AllUnit';
import { AppDispatch } from 'src/store';
import { GetRmCode } from 'src/features/master/RmCode/RmCodeSlice';

type FormDataType = {
  user_id: any;
  supplier_name: string;
  manufacturer_name: string;
  invoice_number: string;
  guard_entry_id: any;
  batch_number: string;
  type: string;
  store_rm_code: string;
  store_pm_code: string;
  equipment: string;
  quantity: string;
  unit: string;
};

const StoreInventoryAddmodal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  pmCodes,
  equipments,
  selectedRow,
  logindata,
  supplierdata,
}) => {
  const { rmcodedata, loading } = useSelector((state: any) => state.rmcodes);

  const [formData, setFormData] = useState<FormDataType>({
    user_id: logindata?.admin?.id,
    supplier_name: '',
    manufacturer_name: '',
    invoice_number: '',
    guard_entry_id: selectedRow?.id,
    batch_number: '',
    type: '',
    store_rm_code: '',
    store_pm_code: '',
    equipment: '',
    quantity: selectedRow?.quantity_net,
    unit: selectedRow?.quantity_unit,
  });

  const requiredFields = [
    'supplier_name',
    'manufacturer_name',
    'invoice_number',
    'batch_number',
    'type',
  ];

  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Partial<FormDataType>>({});
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' }); // clear error on change
  };

  useEffect(() => {
    dispatch(GetRmCode());
  }, [dispatch]);

  useEffect(() => {
    setFormData({
      ...formData,
      guard_entry_id: selectedRow?.id,
      quantity: selectedRow?.quantity_net,
      unit: selectedRow?.quantity_unit,
    });
  }, [selectedRow]);

  // const [showTimePicker, setShowTimePicker] = useState(true);

  const handleClose = () => {
    setTimeout(() => {
      setPlaceModal(false);
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, grn_time: null }));
      }, 100);
    }, 100); // Give MUI enough time to unmount
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.type === 'equipment') {
      if (!formData.equipment) {
        newErrors.equipment = 'Equipment is required';
      }
    }
    if (formData.type === 'pm') {
      if (!formData.store_pm_code) {
        newErrors.store_pm_code = 'PM Code is required';
      }
    }
    // Material validation
    if (formData.type === 'material') {
      if (!formData.store_rm_code) {
        newErrors.store_rm_code = 'RM Code is required';
      }
      if (!formData.store_pm_code) {
        newErrors.store_pm_code = 'PM Code is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await dispatch(addStore(formData)).unwrap();
      if (res) {
        toast.success('Store data added successfully!');
        setFormData({
          supplier_name: '',
          type: '',
          manufacturer_name: '',
          invoice_number: '',
          guard_entry_id: '',
          batch_number: '',
          store_rm_code: '',
          store_pm_code: '',
          equipment: '',
          quantity: '',
          unit: '',
          user_id: logindata?.admin?.id,
        });
        dispatch(GetCheckinmodule(logindata?.admin?.id));
        dispatch(GetStoremodule());
        handleClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update entry');
    }
  };

  return (
    <Modal size="3xl" show={placeModal} position={modalPlacement} onClose={handleClose}>
      <ModalHeader className="pb-0">New Store Entry</ModalHeader>
      <ModalBody>
        <form className="grid grid-cols-12 gap-5" onSubmit={handleSubmit}>
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="guard_type" value="Select Guard Type" />
            <select
              id="guard_type"
              value={selectedRow?.guard_type}
              onChange={(e) => handleChange('guard_type', e.target.value)}
              className="w-full p-2  border rounded-md border-gray-300hh"
              disabled
            >
              <option value="">Select</option>
              <option value="Vehicle">Vehicle </option>
              <option value="Courier">Courier</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Conditionally show for vehicle_number */}
          {selectedRow?.guard_type === 'Vehicle' && (
            <>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="vehicleNo" value="Vehicle No." />
                <TextInput
                  id="vehicleNo"
                  name="vehicle_number"
                  type="text"
                  style={{ borderRadius: '8px' }}
                  value={selectedRow?.vehicle_number}
                  readOnly
                />
              </div>
            </>
          )}

          {/* Conditionally show for courier */}
          {selectedRow?.guard_type === 'Courier' && (
            <>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="senderName" value="Sender Name" />
                <TextInput
                  id="senderName"
                  name="sender_name"
                  type="text"
                  style={{ borderRadius: '8px' }}
                  value={selectedRow?.sender_name}
                  readOnly
                />
              </div>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="productName" value="Product Name" />
                <TextInput
                  id="productName"
                  name="product_name"
                  type="text"
                  style={{ borderRadius: '8px' }}
                  value={selectedRow?.product_name}
                  readOnly
                />
              </div>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="productId" value="Product ID" />
                <TextInput
                  id="productId"
                  name="product_id"
                  type="text"
                  style={{ borderRadius: '8px' }}
                  value={selectedRow?.product_id}
                  readOnly
                />
              </div>
            </>
          )}

          {selectedRow?.guard_type == 'Other' && (
            <div className="sm:col-span-6 col-span-12">
              <Label htmlFor="remark" value="Remark" />
              <TextInput
                id="remark"
                name="remark"
                type="text"
                style={{ borderRadius: '8px' }}
                value={selectedRow?.remark}
                readOnly
              />
            </div>
          )}
          {/* Always show Quantity (Net) if available */}
          {selectedRow?.quantity_net && (
            <div className="sm:col-span-6 col-span-12">
              <Label htmlFor="quantityNet" value="Quantity (Net)" />
              <div className="flex rounded-md shadow-sm mt-2">
                {/* Quantity input (read-only) */}
                <input
                  type="text"
                  id="quantityNet"
                  className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                  value={selectedRow?.quantity_net}
                  readOnly
                />

                {/* Unit select (disabled for read-only) */}
                <select
                  className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700"
                  value={selectedRow?.quantity_unit || ''}
                  disabled
                >
                  <option value="">Unit</option>
                  {allUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Supplier Name */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="guard_type" value="Supplier" />
            <select
              id="supplier_name"
              value={selectedRow?.supplier_name}
              onChange={(e) => handleChange('supplier_name', e.target.value)}
              className="w-full p-2  border rounded-md border-gray-300"
            >
              <option value="">Select Supplier </option>
              {supplierdata.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
          </div>

          {/* Manufacturer Name */}
          <InputField
            id="manufacturer_name"
            label="Manufacturer Name"
            value={formData.manufacturer_name}
            onChange={handleChange}
            error={errors.manufacturer_name}
            placeholder="Enter Manufacturer Name"
          />

          {/* Invoice Number */}
          <InputField
            id="invoice_number"
            label="Invoice Number"
            value={formData.invoice_number}
            onChange={handleChange}
            error={errors.invoice_number}
            placeholder="Enter Invoice Number"
          />

          {/* Batch Number */}
          <InputField
            id="batch_number"
            label="Batch Number"
            value={formData.batch_number}
            onChange={handleChange}
            error={errors.batch_number}
            placeholder="Enter Batch Number"
          />

          <div className="sm:col-span-6 col-span-12">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Type <span className="text-red-700 ">*</span>
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className={`bg-gray-50 border ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 text-sm  rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
            >
              <option value="">Select Type</option>
              <option value="equipment">Equipment</option>
              <option value="material">Material</option>
              <option value="pm">PM</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* Store RM Code */}

          {formData.type == 'material' && (
            <>
              <div className="sm:col-span-6 col-span-12">
                <label
                  htmlFor="store_rm_code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Store RM Code <span className="text-red-700 ">*</span>
                </label>
                <select
                  id="store_rm_code"
                  name="store_rm_code"
                  value={formData.store_rm_code}
                  onChange={(e) => handleChange('store_rm_code', e.target.value)}
                  className={`bg-gray-50 border ${
                    errors.store_rm_code ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 text-sm  rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option value="">Select RM Code</option>
                  {!loading &&
                    rmcodedata?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.rm_code}
                      </option>
                    ))}
                </select>
                {errors.store_rm_code && (
                  <p className="mt-1 text-sm text-red-500">{errors.store_rm_code}</p>
                )}
              </div>
            </>
          )}

          {(formData.type === 'pm' || formData.type === 'material') && (
            <>
              <div className="sm:col-span-6 col-span-12">
                <label
                  htmlFor="store_pm_code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select PM <span className="text-red-700 ">*</span>
                </label>
                <select
                  id="store_pm_code"
                  name="store_pm_code"
                  value={formData.store_pm_code}
                  onChange={(e) => handleChange('store_pm_code', e.target.value)}
                  className={`bg-gray-50 border ${
                    errors.store_pm_code ? 'border-red-500' : 'border-gray-300'
                  } text-gray-900 text-sm  rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                >
                  <option value="">Select PM </option>
                  {!loading &&
                    pmCodes?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
                {errors.store_pm_code && (
                  <p className="mt-1 text-sm text-red-500">{errors.store_pm_code}</p>
                )}
              </div>
            </>
          )}

          {formData.type == 'equipment' && (
            <div className="sm:col-span-6 col-span-12">
              <label
                htmlFor="equipment"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Equipment <span className="text-red-700 ">*</span>
              </label>
              <select
                id="equipment"
                name="equipment"
                value={formData.equipment}
                onChange={(e) => handleChange('equipment', e.target.value)}
                className={`bg-gray-50 border ${
                  errors.equipment ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm  rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              >
                <option value="">Select Equipment List</option>
                {!loading &&
                  equipments?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              {errors.equipment && <p className="mt-1 text-sm text-red-500">{errors.equipment}</p>}
            </div>
          )}

          {/* Submit/Cancel Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-[1rem] ">
            <Button type="reset" color="error" onClick={() => setPlaceModal(false)}>
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

// Reusable InputField component for consistency
const InputField = ({ id, label, type = 'text', value, onChange, error, placeholder = '' }) => (
  <div className="sm:col-span-6 col-span-12">
    <div className="mb-2 block">
      <Label htmlFor={id} value={label} />
      <span className="text-red-700 ps-1">*</span>
    </div>
    <TextInput
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(id, e.target.value)}
      color={error ? 'failure' : 'gray'}
      style={{ borderRadius: '5px' }}
      helperText={error && <span className="text-red-500 text-xs">{error}</span>}
    />
  </div>
);
export default StoreInventoryAddmodal;
