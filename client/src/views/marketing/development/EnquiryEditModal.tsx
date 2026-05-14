import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { RootState } from 'src/store';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { updateEnquiry } from 'src/features/marketing/EnquirySlice';
import { validateEnquiryForm } from './Validation';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
}

const selectStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

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

const EnquiryEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((state: RootState) => state.purchaseOrder.customers);

  const { productdata } = useSelector((state: any) => state.products);
  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata ?? []);
  const users = usersdata.filter((user) => Number(user.role_id) === 9);

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(GetProduct());
    dispatch(GetUsermodule());
  }, []);

  useEffect(() => {
    if (!selectedRow) return;

    setFormData({
      company_id: selectedRow.company_id || '',
    });

    if (selectedRow.interested_products?.length) {
      const mappedProducts = selectedRow.interested_products.map((p: any) => {
        let followups = [];

        if (Array.isArray(p.followups)) {
          followups = p.followups;
        } else if (typeof p.followups === 'string') {
          try {
            followups = JSON.parse(p.followups);
          } catch {
            followups = [];
          }
        }

        return {
          product_id: p.product_id || '',
          grade: p.grade || '',
          sales_person: p.person_name || '',
          followups:
            followups.length > 0
              ? followups
              : [
                  {
                    followup_date: '',
                    status: '',
                    note: '',
                  },
                ],
        };
      });

      setProducts(mappedProducts);
    }
  }, [selectedRow]);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState<any>({
    company_id: '',
    // followup_date: '',
    // note: '',
    // status: '',
  });

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

  const handleFollowupChange = (
    productIndex: number,
    followupIndex: number,
    field: string,
    value: any,
  ) => {
    const updated = [...products];

    updated[productIndex].followups[followupIndex][field] = value;

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

  const removeFollowup = (pIndex: number, fIndex: number) => {
    const updated = [...products];

    updated[pIndex].followups = updated[pIndex].followups.filter((_, i) => i !== fIndex);

    setProducts(updated);
  };

  const customerOptions = customers?.map((c: any) => ({
    label: c.company_name,
    value: c.id,
  }));

  const productOptions = productdata?.map((p: any) => ({
    label: p.product_name,
    value: p.id,
  }));

  const usersOptions = users?.map((c: any) => ({
    label: c.username,
    value: c.id,
  }));

  /* ================= HANDLERS ================= */

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index][field] = value;
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateEnquiryForm(formData, products)) return;

    try {
      const payload = {
        ...formData,
        products,
      };

      await dispatch(
        updateEnquiry({
          id: selectedRow?.id,
          data: payload, // ✅ correct key
        }),
      ).unwrap();

      toast.success('Enquiry Update ✅');
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save enquiry');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="6xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Edit Enquiry</span>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= BASIC INFO ================= */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="col-span-8">
              <Label value="Company Name" />
              <Select
                options={customerOptions}
                placeholder="Select Company"
                value={customerOptions?.find((c: any) => c.value === formData.company_id)}
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
                      value={productOptions?.find(
                        (p: any) => p.value === products[pIndex].product_id,
                      )}
                      onChange={(v: any) => handleProductChange(pIndex, 'product_id', v?.value)}
                    />
                  </div>

                  <div className="col-span-3">
                    <Label value="Grade" />
                    <select
                      className="w-full border rounded-md p-2"
                      value={product.grade || ''}
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
                      value={usersOptions.find((u: any) => u.value == product.sales_person)}
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
                {product?.followups?.map((f, fIndex) => (
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
                        value={enquiryStatusOptions.find((s) => s.value === f.status)}
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

          {/* ================= FOLLOWUP ================= */}
          {/* <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="col-span-4">
              <Label value="Follow Up Date" />
              <TextInput
                type="date"
                value={formData.followup_date || ''}
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
                value={enquiryStatusOptions.find((s) => s.value === formData.status)}
                onChange={(v: any) => setFormData({ ...formData, status: v.value })}
              />
            </div>

            <div className="col-span-4">
              <Label value="Followup Note" />
              <Textarea
                rows={2}
                placeholder="Write followup remark..."
                value={formData.note || ''}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </div> */}

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

export default EnquiryEditModal;
