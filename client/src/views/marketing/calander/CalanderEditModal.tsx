import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { RootState } from 'src/store';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'HIS'];

const enquiryStatusOptions = [
  { value: 'closed', label: 'Closed', color: '#16a34a' },
  { value: 'rejected', label: 'Need Clarification', color: '#ef4444' },
  { value: 'quotation', label: 'Pending Quotation', color: '#2563eb' },
  { value: 'coa', label: 'Documents / COA Pending', color: '#facc15' },
  { value: 'freight', label: 'Awaiting Freight', color: '#fdba74' },
  { value: 'dispatch', label: 'Awaiting Dispatch', color: '#f97316' },
];

const formatStatus = (option: any) => (
  <div className="flex items-center gap-2">
    <span
      style={{
        background: option.color,
        width: 12,
        height: 12,
        borderRadius: '50%',
      }}
    />
    {option.label}
  </div>
);

const EnquiryModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((state: RootState) => state.purchaseOrder.customers);

  const { productdata } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(GetProduct());
  }, []);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState<any>({
    company_id: '',
    followup_date: '',
    note: '',
    status: '',
  });

  const [products, setProducts] = useState([{ product_id: '', grade: '', sales_person: '' }]);

  const customerOptions = customers?.map((c: any) => ({
    label: c.company_name,
    value: c.id,
  }));

  const productOptions = productdata?.map((p: any) => ({
    label: p.product_name,
    value: p.id,
  }));

  /* ================= HANDLERS ================= */

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addRow = () => {
    setProducts([...products, { product_id: '', grade: '', sales_person: '' }]);
  };

  const removeRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.company_id) {
      toast.error('Company required');
      return;
    }

    const payload = {
      ...formData,
      products,
    };

    console.log(payload);

    toast.success('Enquiry Saved ✅');

    setOpenModal(false);
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="6xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Create Enquiry</span>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= BASIC INFO ================= */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="col-span-4">
              <Label value="Date" />
              <TextInput value={new Date().toLocaleDateString()} disabled />
            </div>

            <div className="col-span-8">
              <Label value="Company Name" />
              <Select
                options={customerOptions}
                placeholder="Select Company"
                onChange={(v: any) => setFormData({ ...formData, company_id: v.value })}
              />
            </div>
          </div>

          {/* ================= PRODUCTS ================= */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Interested Products</h3>

              <Button size="xs" color="primary" onClick={addRow}>
                + Add Product
              </Button>
            </div>

            {products.map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end border-b pb-3">
                <div className="col-span-5">
                  <Label value="Product" />
                  <Select
                    options={productOptions}
                    placeholder="Select Product"
                    onChange={(v: any) => handleProductChange(index, 'product_id', v.value)}
                  />
                </div>

                <div className="col-span-3">
                  <Label value="Grade" />
                  <select
                    className="w-full border rounded-md p-2 text-sm"
                    onChange={(e) => handleProductChange(index, 'grade', e.target.value)}
                  >
                    <option>Select Grade</option>
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-3">
                  <Label value="Sales Person" />
                  <TextInput
                    placeholder="Sales Person"
                    onChange={(e) => handleProductChange(index, 'sales_person', e.target.value)}
                  />
                </div>

                <div className="col-span-1">
                  {index > 0 && (
                    <Button color="failure" size="xs" onClick={() => removeRow(index)}>
                      ✕
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ================= FOLLOWUP ================= */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="col-span-4">
              <Label value="Follow Up Date" />
              <TextInput
                type="date"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followup_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-4">
              <Label value="Status" />
              <Select
                options={enquiryStatusOptions}
                formatOptionLabel={formatStatus}
                placeholder="Select Status"
                onChange={(v: any) => setFormData({ ...formData, status: v.value })}
              />
            </div>

            <div className="col-span-4">
              <Label value="Followup Note" />
              <Textarea
                rows={2}
                placeholder="Write followup remark..."
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Save Enquiry
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EnquiryModal;
