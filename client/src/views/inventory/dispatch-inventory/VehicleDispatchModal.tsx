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
import { GetTransport } from 'src/features/master/Transport/TransportSlice';
import { useNavigate } from 'react-router';

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
    batches: [
      {
        batch_no: '',
        quantity: '',
        unit: '',
        max_quantity: 0,
      },
    ],
    delivery_location: '',
    product_name: '',
    lr_no: '',
    transport_id: '',
    remarks: '',
    booking_date: '',
    arrived_booking: '', // ✅ NEW FIELD
    max_quantity: 0,
  });

  const batchMap = Object.fromEntries((StoreData || []).map((b: any) => [b.id, b]));

  const [errors, setErrors] = useState<any>({});

  const purchaseOrder = useSelector(
    (state: RootState) => state.purchaseOrder.purchaseOrders,
  ) as any[];

  const transport = useSelector((state: RootState) => state.transport.Transportdata) as any[];

  const purchaseOrders = purchaseOrder.filter(
    (d) => d.workNo !== null && d.workNo.status == 'Approved',
  );

  useEffect(() => {
    dispatch(getPurchaseOrders());
    dispatch(GetTransport());
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

  const transports =
    transport?.map((po: any) => ({
      value: po.id,
      label: po.transporter_name,
    })) || [];

  const navigate = useNavigate();

  const transporterOptions = [
    ...transports,
    { label: '+ Add Transporter', value: 'add_transporter' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    const requiredFields = [
      'po_id',
      'vehicle_number',
      'driver_details',
      'delivery_location',
      'product_name',
      'lr_no',
      'transport_id',
      'booking_date',
      'remarks',
      'arrived_booking',
    ];

    requiredFields.forEach((field) => {
      const value = formData[field];

      if (value === null || value === undefined || value === '') {
        newErrors[field] = 'This field is required';
      }
    });

    formData.batches.forEach((b: any, i: number) => {
      if (!b.batch_no || !b.quantity || !b.unit) {
        newErrors[`batch_${i}`] = 'Batch, Quantity & Unit required';
      }

      if (Number(b.quantity) > Number(b.max_quantity)) {
        toast.error(`Batch ${i + 1} exceeds max quantity`);
        return;
      }
    });

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
          batches: [
            {
              batch_no: '',
              quantity: '',
              unit: '',
              max_quantity: 0,
            },
          ],
          delivery_location: '',
          product_name: '',
          lr_no: '',
          transport_id: '',
          remarks: '',
          booking_date: '',
          arrived_booking: '',
        });

        setOpenModal(false);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create dispatch entry');
    }
  };

  const addBatchRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      batches: [...prev.batches, { batch_no: '', quantity: '', unit: '', max_quantity: 0 }],
    }));
  };

  const removeBatchRow = (index: number) => {
    const updated = [...formData.batches];
    updated.splice(index, 1);
    setFormData({ ...formData, batches: updated });
  };
  const handleBatchChange = (index: number, field: string, value: any) => {
    const updated = [...formData.batches];

    updated[index][field] = value;

    if (field === 'batch_no') {
      const batch = batchMap[value];
      updated[index].max_quantity = batch?.total_issued_qty || 0;
    }

    setFormData({ ...formData, batches: updated });
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
            <Label value="Product Name" />
            <TextInput
              name="product_name"
              placeholder="Enter Product Name"
              value={formData.product_name}
              onChange={handleChange}
            />
            {errors.product_name && (
              <span className="text-red-500 text-sm">{errors.product_name}</span>
            )}
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Label value="LR No." />
            <TextInput
              name="lr_no"
              placeholder="Enter LR No."
              value={formData.lr_no}
              onChange={handleChange}
            />
            {errors.lr_no && <span className="text-red-500 text-sm">{errors.lr_no}</span>}
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

          <div className="col-span-12">
            <Label value="Batch Dispatch Details" />

            {formData?.batches.map((batch: any, index: number) => (
              <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-end">
                {/* Batch */}
                <div className="col-span-6">
                  <Select
                    options={batchOptions}
                    value={batchOptions.find((opt) => opt.value === batch.batch_no)}
                    onChange={(selected: any) =>
                      handleBatchChange(index, 'batch_no', selected?.value)
                    }
                  />
                </div>

                <div className="sm:col-span-5 col-span-12">
                  {' '}
                  <Label value="Quantity" />{' '}
                  <div className="flex">
                    {' '}
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={batch.quantity}
                      max={batch.max_quantity}
                      onChange={(e) => handleBatchChange(index, 'quantity', e.target.value)}
                      className="w-full border px-3 py-2 rounded-l-md"
                    />
                    <select
                      value={batch.unit}
                      onChange={(e) => handleBatchChange(index, 'unit', e.target.value)}
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
                </div>

                {/* Add Remove */}
                <div className="col-span-1 flex gap-2">
                  <Button color="primary" size="xs" onClick={addBatchRow}>
                    +
                  </Button>

                  {formData.batches.length > 1 && (
                    <Button size="xs" color="failure" onClick={() => removeBatchRow(index)}>
                      -
                    </Button>
                  )}
                </div>
              </div>
            ))}
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

            <Select
              options={transporterOptions}
              value={transporterOptions.find((opt) => opt.value === formData.transport_id) || null}
              onChange={(selected: any) => {
                // ✅ Add Transporter Click
                if (selected?.value === 'add_transporter') {
                  // CLEAR VALUE (NOT NUMBER)
                  setFormData((prev: any) => ({
                    ...prev,
                    transport_id: '',
                  }));

                  navigate('/master/transport');
                  return;
                }

                // ✅ Normal Selection
                setFormData((prev: any) => ({
                  ...prev,
                  transport_id: Number(selected?.value),
                }));
              }}
            />

            {errors.transport_id && (
              <span className="text-red-500 text-sm">{errors.transport_id}</span>
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
