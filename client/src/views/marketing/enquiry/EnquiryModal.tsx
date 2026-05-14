import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { RootState } from 'src/store';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { addEnquiry, getEnquiry } from 'src/features/marketing/EnquirySlice';
import { validateEnquiryForm } from './Validation';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const selectStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'IHS'];

const enquiryStatusOptions = [
  { value: 'closed', label: 'Closed', color: '#16a34a' },
  { value: 'rejected', label: 'Need Clarification', color: '#ef4444' },
  { value: 'quotation', label: 'Pending Quotation', color: '#2563eb' },
  { value: 'coa', label: 'Documents / COA Pending', color: '#facc15' },
  { value: 'freight', label: 'Awaiting Freight', color: '#fdba74' },
  { value: 'dispatch', label: 'Awaiting Dispatch', color: '#f97316' },

  // ✅ NEW STATUS
  { value: 'internal_hold', label: 'Internal Hold', color: '#9333ea' },
  { value: 'customer_hold', label: 'Customer Hold', color: '#dc2626' },
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

  /* ================= REDUX ================= */

  const customers = useSelector((state: RootState) => state.purchaseOrder?.customers) ?? [];

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  const { productdata = [] } = useSelector((state: RootState) => state.products) ?? {};

  // ✅ Marketing Users
  const users = usersdata.filter((user: any) => Number(user.role_id) === 9);

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(GetProduct());
    dispatch(GetUsermodule());
  }, [dispatch]);

  /* ================= FORM ================= */

  const initialForm = {
    company_id: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const [products, setProducts] = useState([
    {
      product_id: '',
      grade: '',
      sales_person: '',
      followups: [
        {
          followup_date: '',
          status: '',
          note: '',
        },
      ],
    },
  ]);
  /* ================= OPTIONS ================= */

  const customerOptions = customers.map((c: any) => ({
    label: c.company_name,
    value: c.id,
  }));

  const usersOptions = users.map((u: any) => ({
    label: u.username,
    value: u.id,
  }));

  const productOptions = productdata.map((p: any) => ({
    label: p.product_name,
    value: p.id,
  }));

  /* ================= HANDLERS ================= */

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const addRow = () => {
    setProducts([
      ...products,
      {
        product_id: '',
        grade: '',
        sales_person: '',
        followups: [
          {
            followup_date: '',
            status: '',
            note: '',
          },
        ],
      },
    ]);
  };

  const removeRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setProducts([
      ...products,
      {
        product_id: '',
        grade: '',
        sales_person: '',
        followups: [
          {
            followup_date: '',
            status: '',
            note: '',
          },
        ],
      },
    ]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateEnquiryForm(formData, products)) return;

    try {
      await dispatch(
        addEnquiry({
          ...formData,
          products,
        }),
      ).unwrap();

      toast.success('Enquiry Saved ✅');

      dispatch(getEnquiry());

      resetForm();
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save enquiry');
    }
  };

  const handleFollowupChange = (
    productIndex: number,
    followupIndex: number,
    field: string,
    value: any,
  ) => {
    const updated = [...products];

    updated[productIndex].followups[followupIndex] = {
      ...updated[productIndex].followups[followupIndex],
      [field]: value,
    };

    setProducts(updated);
  };

  const addFollowup = (productIndex: number) => {
    const updated = [...products];

    updated[productIndex].followups.push({
      followup_date: '',
      status: '',
      note: '',
    });

    setProducts(updated);
  };

  const removeFollowup = (productIndex: number, followupIndex: number) => {
    const updated = [...products];

    updated[productIndex].followups = updated[productIndex].followups.filter(
      (_, i) => i !== followupIndex,
    );

    setProducts(updated);
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="6xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>Create Enquiry</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="col-span-4">
              <Label value="Date" />
              <TextInput value={new Date().toLocaleDateString()} disabled />
            </div>

            <div className="col-span-8">
              <Label value="Company Name" />
              <Select
                options={customerOptions}
                onChange={(v: any) => setFormData({ ...formData, company_id: v?.value })}
              />
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Interested Products</h3>

              <Button color="primary" size="xs" onClick={addRow}>
                + Add Product
              </Button>
            </div>

            {products.map((product, pIndex) => (
              <div key={pIndex} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                {/* PRODUCT ROW */}
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4">
                    <Label value="Product" />
                    <Select
                      options={productOptions}
                      menuPortalTarget={document.body}
                      styles={selectStyles}
                      onChange={(v: any) => handleProductChange(pIndex, 'product_id', v?.value)}
                    />
                  </div>

                  <div className="col-span-3">
                    <Label value="Grade" />
                    <select
                      className="w-full border rounded-md p-2"
                      value={product.grade}
                      onChange={(e) => handleProductChange(pIndex, 'grade', e.target.value)}
                    >
                      <option value="">Select Grade</option>
                      {grades.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <Label value="Sales Person" />
                    <Select
                      options={usersOptions}
                      menuPortalTarget={document.body}
                      styles={selectStyles}
                      onChange={(v: any) => handleProductChange(pIndex, 'sales_person', v?.value)}
                    />
                  </div>

                  <div className="col-span-2 flex gap-2">
                    <Button color="primary" size="xs" onClick={() => addFollowup(pIndex)}>
                      + Followup
                    </Button>

                    {pIndex > 0 && (
                      <Button color="failure" size="xs" onClick={() => removeRow(pIndex)}>
                        ✕
                      </Button>
                    )}
                  </div>
                </div>

                {/* FOLLOWUPS */}
                {product.followups.map((f, fIndex) => (
                  <div
                    key={fIndex}
                    className="grid grid-cols-12 gap-3 items-end bg-white p-3 rounded border"
                  >
                    <div className="col-span-3">
                      <Label value="Followup Date" />
                      <TextInput
                        type="date"
                        value={f.followup_date}
                        onChange={(e) =>
                          handleFollowupChange(pIndex, fIndex, 'followup_date', e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-3">
                      <Label value="Status" />
                      <Select
                        options={enquiryStatusOptions}
                        formatOptionLabel={formatStatus}
                        menuPortalTarget={document.body}
                        styles={selectStyles}
                        onChange={(v: any) =>
                          handleFollowupChange(pIndex, fIndex, 'status', v?.value)
                        }
                      />
                    </div>

                    <div className="col-span-5">
                      <Label value="Note" />
                      <Textarea
                        rows={1}
                        value={f.note}
                        onChange={(e) =>
                          handleFollowupChange(pIndex, fIndex, 'note', e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-1">
                      {fIndex > 0 && (
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => removeFollowup(pIndex, fIndex)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* FOLLOWUP */}
          {/* <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="col-span-4">
              <Label value="Product" />
              <Select
                options={productOptions}
                onChange={(v: any) => handleProductChange(index, 'product_id', v?.value)}
              />
            </div>
            <div className="col-span-2">
              <Label value="Follow Up Date" />
              <TextInput
                type="date"
                value={formData.followup_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followup_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-3">
              <Label value="Status" />
              <Select
                options={enquiryStatusOptions}
                formatOptionLabel={formatStatus}
                isClearable
                onChange={(v: any) => setFormData({ ...formData, status: v?.value })}
              />
            </div>

            <div className="col-span-3">
              <Label value="Followup Note" />
              <Textarea
                rows={2}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div> */}

          {/* ACTION */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Save Enquiry
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EnquiryModal;
