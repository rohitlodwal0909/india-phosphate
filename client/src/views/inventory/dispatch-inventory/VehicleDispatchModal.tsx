import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { allUnits } from 'src/utils/AllUnit';
import {
  addDispatch,
  GetFetchDispatch,
} from 'src/features/Inventorymodule/dispatchmodule/DispatchSlice';
import { toast } from 'react-toastify';
import { getPurchaseOrders } from 'src/features/marketing/PurchaseOrderSlice';

interface VehicleDispatchModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  StoreData: any;
}

const VehicleDispatchModal: React.FC<VehicleDispatchModalProps> = ({
  openModal,
  setOpenModal,
  StoreData,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    po_id: '',
    vehicle_number: '',
    driver_details: '',
    batch_numbers: [],
    quantity: '',
    unit: '',
    delivery_location: '',
    delivered_by: '',
    remarks: '',
    invoice_no: '',
    booking_date: '',
    arrived_booking: '', // ✅ NEW FIELD
    max_quantity: 0,
  });

  const batchMap = Object.fromEntries((StoreData || []).map((b: any) => [b.id, b]));

  const [errors, setErrors] = useState<any>({});

  const purchaseOrder = useSelector(
    (state: RootState) => state.purchaseOrder.purchaseOrders,
  ) as any[];

  const purchaseOrders = purchaseOrder.filter(
    (d) => d.workNo !== null && d.workNo.status == 'Approved',
  );

  useEffect(() => {
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: '',
    }));
  };

  const batchOptions =
    StoreData?.map((item: any) => ({
      value: item.id,
      label: item.qc_batch_number,
    })) || [];

  const po_nos =
    purchaseOrders?.map((po: any) => ({
      value: po.id,
      label: po.po_no,
    })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    const requiredFields = [
      'po_id',
      'vehicle_number',
      'driver_details',
      'quantity',
      'delivery_location',
      'batch_numbers',
      'delivered_by',
      'invoice_no',
      'booking_date',
      'remarks',
      'unit',
      'arrived_booking', // ✅ added
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.quantity > formData.max_quantity) {
      toast.error(`Quantity cannot exceed ${formData.max_quantity}`);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await dispatch(addDispatch(formData)).unwrap();

      if (res) {
        toast.success('Dispatch entry created successfully');
        dispatch(GetFetchDispatch());

        setFormData({
          po_id: '',
          vehicle_number: '',
          driver_details: '',
          batch_numbers: [],
          quantity: '',
          unit: '',
          delivery_location: '',
          delivered_by: '',
          remarks: '',
        });

        setOpenModal(false);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create dispatch entry');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
      <Modal.Header>Dispatch Details</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* PO Number */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="PO No." />
            <Select
              options={po_nos}
              value={po_nos.find((opt) => opt.value === formData.po_id) || null}
              onChange={(selected: any) => setFormData({ ...formData, po_id: selected?.value })}
            />
            {errors.po_id && <span className="text-red-500 text-sm">{errors.po_id}</span>}
          </div>

          {/* Vehicle Number */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Vehicle Number" />
            <TextInput
              name="vehicle_number"
              placeholder="Enter Vehicle Number"
              value={formData.vehicle_number}
              onChange={handleChange}
            />
            {errors.vehicle_number && (
              <span className="text-red-500 text-sm">{errors.vehicle_number}</span>
            )}
          </div>

          {/* Driver */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Driver Details" />
            <TextInput
              name="driver_details"
              placeholder="Enter Driver Details"
              value={formData.driver_details}
              onChange={handleChange}
            />
            {errors.driver_details && (
              <span className="text-red-500 text-sm">{errors.driver_details}</span>
            )}
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Invoice no." />
            <TextInput
              name="invoice_no"
              placeholder="Enter Invoice no."
              value={formData.invoice_no}
              onChange={handleChange}
            />
            {errors.invoice_no && <span className="text-red-500 text-sm">{errors.invoice_no}</span>}
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Date of booking" />

            <input
              type="date"
              name="booking_date"
              value={formData.booking_date || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 "
            />
            {errors.booking_date && (
              <span className="text-red-500 text-sm">{errors.booking_date}</span>
            )}
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Label value="Arrived Booking Date" />

            <input
              type="date"
              name="arrived_booking"
              value={formData.arrived_booking || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
            />

            {errors.arrived_booking && (
              <span className="text-red-500 text-sm">{errors.arrived_booking}</span>
            )}
          </div>

          {/* Batch Numbers */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Batch Numbers" />
            <Select
              isMulti
              options={batchOptions}
              value={batchOptions.filter((opt: any) => formData.batch_numbers.includes(opt.value))}
              onChange={(selected: any) => {
                const ids = selected ? selected.map((s: any) => s.value) : [];

                let maxQty = 0;

                ids.forEach((id: any) => {
                  const batch = batchMap[id];
                  maxQty += batch?.finishing?.finish_quantity || 0;
                });

                setFormData({
                  ...formData,
                  batch_numbers: ids,
                  max_quantity: maxQty,
                });
              }}
            />
            {errors.batch_numbers && (
              <span className="text-red-500 text-sm">{errors.batch_numbers}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Quantity" />
            <div className="flex">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                max={formData.max_quantity || 0}
                className="w-full border px-3 py-2 rounded-l-md"
              />

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="border border-l-0 px-2 rounded-r-md"
              >
                <option value="">Unit</option>
                {allUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>

            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
            {errors.unit && <span className="text-red-500 text-sm">{errors.unit}</span>}
          </div>

          {/* Delivery Location */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Delivery Location" />
            <TextInput
              name="delivery_location"
              placeholder="Enter Delivery Location"
              value={formData.delivery_location}
              onChange={handleChange}
            />
            {errors.delivery_location && (
              <span className="text-red-500 text-sm">{errors.delivery_location}</span>
            )}
          </div>

          {/* Transporter */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Transporter" />
            <TextInput
              name="delivered_by"
              placeholder="Enter Transporter"
              value={formData.delivered_by}
              onChange={handleChange}
            />
            {errors.delivered_by && (
              <span className="text-red-500 text-sm">{errors.delivered_by}</span>
            )}
          </div>

          {/* Remarks */}
          <div className="col-span-12">
            <Label value="Remarks" />
            <Textarea
              name="remarks"
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
            {errors.remarks && <span className="text-red-500 text-sm">{errors.remarks}</span>}
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-2">
            <Button color="gray" type="button" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleDispatchModal;
