import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addPendingOrder,
  GetPendingOrder,
} from 'src/features/master/PendingOrder/PendingOrderSlice';

const AddPendingOrderModal = ({ show, setShowmodal, logindata, rmcodedata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    order_number: '',
    customer_name_or_id: '',
    order_date: '',
    expected_delivery_date: '',
    products_ordered: '',
    total_quantity: '',
    quantity_delivered: '',
    remarks: '',
    order_status: 'Pending',
    created_by: logindata?.admin?.id || '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = [
      'order_number',
      'customer_name_or_id',
      'order_date',
      'expected_delivery_date',
      'products_ordered',
      'total_quantity',
      'quantity_delivered',
    ];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addPendingOrder(formData)).unwrap();
      toast.success(result.message || 'Pending order created successfully');
      dispatch(GetPendingOrder());

      // Reset form
      setFormData({
        order_number: '',
        customer_name_or_id: '',
        order_date: '',
        expected_delivery_date: '',
        products_ordered: '',
        total_quantity: '',
        quantity_delivered: '',
        remarks: '',
        order_status: 'Pending',
        created_by: logindata?.admin?.id || '',
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message ||err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="5xl">
      <ModalHeader>Create Pending Order</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Order Number */}
          <div className="col-span-4">
            <Label htmlFor="order_number" value="Order Number" />
            <TextInput
              id="order_number"
              value={formData.order_number}
              onChange={(e) => handleChange('order_number', e.target.value)}
              placeholder="Enter Order Number"
              color={errors.order_number ? 'failure' : 'gray'}
              className='form-rounded-md'
            />
            {errors.order_number && <p className="text-red-500 text-xs">{errors.order_number}</p>}
          </div>

          {/* Customer Name or ID */}
          <div className="col-span-4">
            <Label htmlFor="customer_name_or_id" value="Customer Name / ID" />
            <TextInput
              id="customer_name_or_id"
              value={formData.customer_name_or_id}
              onChange={(e) => handleChange('customer_name_or_id', e.target.value)}
              placeholder="Enter Customer Name or ID"
              color={errors.customer_name_or_id ? 'failure' : 'gray'}
               className='form-rounded-md'
            />
            {errors.customer_name_or_id && <p className="text-red-500 text-xs">{errors.customer_name_or_id}</p>}
          </div>

          {/* Order Date */}
          <div className="col-span-4">
            <Label htmlFor="order_date" value="Order Date" />
            <TextInput
              id="order_date"
              type="date"
              value={formData.order_date}
              onChange={(e) => handleChange('order_date', e.target.value)}
              color={errors.order_date ? 'failure' : 'gray'}
               className='form-rounded-md'
            />
            {errors.order_date && <p className="text-red-500 text-xs">{errors.order_date}</p>}
          </div>

          {/* Expected Delivery Date */}
          <div className="col-span-4">
            <Label htmlFor="expected_delivery_date" value="Expected Delivery Date" />
            <TextInput
              id="expected_delivery_date"
              type="date"
              value={formData.expected_delivery_date}
              onChange={(e) => handleChange('expected_delivery_date', e.target.value)}
              color={errors.expected_delivery_date ? 'failure' : 'gray'}
               className='form-rounded-md'
            />
            {errors.expected_delivery_date && <p className="text-red-500 text-xs">{errors.expected_delivery_date}</p>}
          </div>

          {/* Products Ordered */}
          <div className="col-span-4">
            <Label htmlFor="products_ordered" value="Products Ordered (Raw Material Code)" />
            <select
              id="products_ordered"
              value={formData.products_ordered}
              onChange={(e) => handleChange('products_ordered', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Raw Material</option>
              {(rmcodedata || []).map((item) => (
                <option key={item?.rm_code} value={item?.rm_code}>{item?.rm_code}</option>
              ))}
            </select>
            {errors.products_ordered && <p className="text-red-500 text-xs">{errors.products_ordered}</p>}
          </div>

          {/* Total Quantity */}
          <div className="col-span-4">
            <Label htmlFor="total_quantity" value="Total Quantity" />
            <TextInput
              id="total_quantity"
              value={formData.total_quantity}
              onChange={(e) => handleChange('total_quantity', e.target.value)}
              placeholder="Enter Total Quantity"
              color={errors.total_quantity ? 'failure' : 'gray'}
               className='form-rounded-md'
            />
            {errors.total_quantity && <p className="text-red-500 text-xs">{errors.total_quantity}</p>}
          </div>

          {/* Quantity Delivered */}
          <div className="col-span-4">
            <Label htmlFor="quantity_delivered" value="Quantity Delivered" />
            <TextInput
              id="quantity_delivered"
              value={formData.quantity_delivered}
              onChange={(e) => handleChange('quantity_delivered', e.target.value)}
              placeholder="Enter Delivered Quantity"
              color={errors.quantity_delivered ? 'failure' : 'gray'}
               className='form-rounded-md'
            />
            {errors.quantity_delivered && <p className="text-red-500 text-xs">{errors.quantity_delivered}</p>}
          </div>

          {/* Order Status */}
          <div className="col-span-4">
            <Label htmlFor="order_status" value="Order Status" />
            <select
              id="order_status"
              value={formData.order_status}
              onChange={(e) => handleChange('order_status', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Status</option>
              {['Pending', 'Partially Delivered', 'Completed'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="col-span-12">
            <Label htmlFor="remarks" value="Remarks (Optional)" />
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Enter any remarks or notes"
              rows={2}
              className="rounded-md"
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddPendingOrderModal;
