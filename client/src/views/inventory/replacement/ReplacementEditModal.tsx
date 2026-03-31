import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, Textarea, Checkbox, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { allUnits } from 'src/utils/AllUnit';
import { toast } from 'react-toastify';
import {
  getReplacement,
  updateReplacement,
} from 'src/features/Inventorymodule/replacement/ReplacementSlice';
import { getInvoices } from 'src/features/account/invoice/taxinvoice';

interface ReplacementModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  data: any;
}

const ReplacementEditModal: React.FC<ReplacementModalProps> = ({
  openModal,
  setOpenModal,
  data,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  console.log(data);

  const invoicesdata = useSelector((state: RootState) => state.taxinvoices.invoices) as any;

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const [formData, setFormData] = useState<any>({
    id: '',
    product_name: '',
    invoice_no: '',
    replacement_type: '',
    quantity: '',
    unit: '',
    replacement_choice: '',
    credit_note: '',
    remarks: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        id: data?.id,
        product_name: data?.product_name || '',
        invoice_no: data?.invoice_no || '',
        replacement_type: data?.replacement_type || '',
        quantity: data?.quantity || '',
        unit: data?.unit || '',
        replacement_choice: data?.replacement_choice || '',
        credit_note: data?.credit_note || '',
        remarks: data?.remarks || '',
      });

      setErrors({});
    }
  }, [data]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>,
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

  const po_nos =
    invoicesdata?.map((po: any) => ({
      value: po.id,
      label: po.invoice_no,
    })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    const requiredFields = [
      'product_name',
      'invoice_no',
      'replacement_type',
      'replacement_choice',
      'credit_note',
    ];

    if (formData.replacement_type === 'short_qty') {
      requiredFields.push('quantity', 'unit');
    }

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // conditional note validation
    if (formData.credit_note === 'yes' && !formData.remarks) {
      newErrors.remarks = 'Note is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await dispatch(updateReplacement(formData)).unwrap();

      if (res) {
        toast.success('Replacement update successfully');
        dispatch(getReplacement());

        // reset form
        setFormData({
          id: '',
          product_name: '',
          invoice_no: '',
          replacement_type: '',
          quantity: '',
          unit: '',
          replacement_choice: '',
          credit_note: '',
          remarks: '',
        });

        setOpenModal(false);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create entry');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="3xl">
      <Modal.Header>Edit Replacement</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* PO */}

          <div className="col-span-6">
            <Label value="Product Name" />
            <TextInput
              name="product_name"
              placeholder="Enter Product name"
              value={formData.product_name}
              onChange={handleChange}
            />
            {errors.product_name && (
              <span className="text-red-500 text-sm">{errors.product_name}</span>
            )}
          </div>
          <div className="col-span-6">
            <Label value="Invoice No." />
            <Select
              options={po_nos}
              value={po_nos.find((opt) => opt.value === formData.invoice_no) || null}
              onChange={(selected: any) =>
                setFormData({ ...formData, invoice_no: selected?.value })
              }
              placeholder="Select Invoice No"
              className="react-select-container"
              classNamePrefix="react-select"
              menuPortalTarget={document.body} // ✅ FIX DROPDOWN CUT ISSUE
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ✅ ऊपर लाएगा dropdown
                control: (base) => ({
                  ...base,
                  minHeight: '42px',
                  borderColor: '#d1d5db', // tailwind gray-300
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#6366f1', // indigo hover
                  },
                }),
              }}
            />
            {errors.invoice_no && <span className="text-red-500 text-sm">{errors.invoice_no}</span>}
          </div>

          {/* Replacement Type */}
          <div className="col-span-6">
            <Label value="Replacement Type" />
            <select
              name="replacement_type"
              value={formData.replacement_type}
              onChange={(e) => {
                handleChange(e);

                if (e.target.value !== 'short_qty') {
                  setFormData((prev: any) => ({
                    ...prev,
                    quantity: '',
                    unit: '',
                  }));
                }
              }}
              className="border px-2 py-2 rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="rejection">Rejection</option>
              <option value="short_qty">Short Quantity</option>
            </select>
            {errors.replacement_type && (
              <span className="text-red-500 text-sm">{errors.replacement_type}</span>
            )}
          </div>

          {/* Quantity */}

          <div className="col-span-6">
            <Label value="Quantity" />
            <div className="flex">
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
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

          {/* Replacement */}
          <div className="col-span-6 flex gap-6 items-center">
            <Label value="Replacement" />

            <Checkbox
              checked={formData.replacement_choice === 'yes'}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  replacement_choice: prev.replacement_choice === 'yes' ? '' : 'yes',
                }))
              }
            />
            <span>Yes</span>

            <Checkbox
              checked={formData.replacement_choice === 'no'}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  replacement_choice: prev.replacement_choice === 'no' ? '' : 'no',
                }))
              }
            />
            <span>No</span>
          </div>

          {/* Credit Note */}
          <div className="col-span-6 flex gap-6 items-center">
            <Label value="Credit/Debit Note" />

            <Checkbox
              checked={formData.credit_note === 'yes'}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  credit_note: 'yes',
                }))
              }
            />
            <span>Yes</span>

            <Checkbox
              checked={formData.credit_note === 'no'}
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  credit_note: 'no',
                  remarks: '',
                }))
              }
            />
            <span>No</span>
          </div>

          {/* Note */}
          {formData.credit_note === 'yes' && (
            <div className="col-span-12">
              <Label value="Note" />
              <Textarea
                name="remarks"
                placeholder="Enter Note"
                value={formData.remarks}
                onChange={handleChange}
              />
              {errors.remarks && <span className="text-red-500 text-sm">{errors.remarks}</span>}
            </div>
          )}

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-2">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReplacementEditModal;
