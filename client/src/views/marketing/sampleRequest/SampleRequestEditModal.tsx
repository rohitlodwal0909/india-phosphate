import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { updateSampleRequest } from 'src/features/marketing/SampleRequestSlice';
import { GetGrade } from 'src/features/master/Grade/GradeSlice';

import { toast } from 'react-toastify';
import { ImageUrl } from 'src/constants/contant';
import { validateSampleRequest } from './validateSampleRequest';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
}

const fileUrl = (file: string) => `${ImageUrl}uploads/sample-request/${file}`;

const sampleTypes = [
  { value: 'FOC', label: 'FOC' },
  { value: 'Chargeable', label: 'Chargeable' },
  { value: 'Customer Account', label: 'Customer Account' },
];

const SampleRequestEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const { productdata } = useSelector((state: any) => state.products);

  const customers = useSelector((state: RootState) => state.purchaseOrder.customers);

  const grades = useSelector((state: RootState) => state.grades.gradedata) ?? [];

  /* ================= STATES ================= */

  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    company_id: '',
    type: 'domestic',
    priority: '',
    contact_person: '',
    mobile: '',
    address: '',
    delivery_address: '',
    remark: '',
    docket_remark: '',
    sample_status: '',
    dispatch_date: '',
    delivery_status: '',
    expected_delivery_date: '',
    delivered_date: '',
    feedback: '',
    followups: '[]',
  });
  const [followupDraft, setFollowupDraft] = useState({ followup_date: '', status: '', note: '' });

  const [items, setItems] = useState([
    {
      product_id: '',
      grade: '',
      qty: '',
      sample_type: '',
      file: null,
      existing_file: null,
    },
  ]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getAllCustomers());
    dispatch(GetGrade());
  }, [dispatch]);

  /* ================= OPTIONS ================= */

  const customerOptions = customers?.map((c: any) => ({
    label: c.company_name,
    value: c.id,
    address: c.company_address,
  }));

  const productOptions = productdata?.map((p: any) => ({
    label: p.product_name,
    value: p.id,
  }));

  /* ================= CUSTOMER ================= */

  const handleCustomer = (val: any) => {
    setFormData({
      ...formData,
      company_id: val.value,
      address: val.address,
      delivery_address: val.delivery_address,
    });
  };

  /* ================= ITEM HANDLER ================= */

  const handleItem = (index: number, field: string, value: any) => {
    setItems((prev: any) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      if (field === 'file') {
        updated[index].existing_file = null;
      }

      return updated;
    });
  };

  /* ================= ADD REMOVE ================= */

  const addRow = () => {
    setItems([
      ...items,
      {
        product_id: '',
        grade: '',
        qty: '',
        sample_type: '',
        file: null,
        existing_file: null,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const parseFollowups = (value: any) => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value || '[]') : value;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const addFollowup = () => {
    if (formData.delivery_status !== 'delivered' || !formData.delivered_date) {
      toast.error('Record the delivery date before starting marketing follow-up');
      return;
    }
    if (!followupDraft.followup_date || !followupDraft.status) {
      toast.error('Enter follow-up date and status');
      return;
    }
    if (formData.delivered_date) {
      const earliestMarketingDate = new Date(formData.delivered_date + 'T00:00:00');
      earliestMarketingDate.setDate(earliestMarketingDate.getDate() + 7);
      if (followupDraft.followup_date < earliestMarketingDate.toISOString().slice(0, 10)) {
        toast.error('Marketing follow-up starts 7 days after delivery');
        return;
      }
    }
    setFormData((prev: any) => ({
      ...prev,
      followups: JSON.stringify([...parseFollowups(prev.followups), followupDraft]),
    }));
    setFollowupDraft({ followup_date: '', status: '', note: '' });
  };

  /* ================= VALIDATION ================= */

  /* ================= SUBMIT ================= */

  const submit = async (e: any) => {
    e.preventDefault();

    if (formData.delivery_status === 'not_delivered' && !formData.expected_delivery_date) {
      toast.error('Enter the new delivery date when the sample is not delivered');
      return;
    }
    if (formData.delivery_status === 'delivered' && !formData.delivered_date) {
      toast.error('Enter the delivery date');
      return;
    }

    const isValid = validateSampleRequest(formData, items, setErrors);

    if (!isValid) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const formDataObj = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      const itemsWithoutFile = items.map(({ file, ...rest }) => rest);

      formDataObj.append('items', JSON.stringify(itemsWithoutFile));

      items.forEach((item, index) => {
        if (item.file) {
          formDataObj.append(`file_${index}`, item.file);
        }
      });

      await dispatch(
        updateSampleRequest({
          id: selectedRow.id,
          data: formDataObj,
        }),
      ).unwrap();

      toast.success('Update Sample Request ✅');

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save');
    }
  };

  /* ================= EDIT DATA ================= */

  useEffect(() => {
    if (!openModal || !selectedRow) return;

    setFormData({
      company_id: selectedRow.company_id ?? '',
      type: selectedRow.type ?? 'domestic',
      priority: selectedRow.priority ?? '',
      contact_person: selectedRow.contact_person ?? '',
      mobile: selectedRow.mobile ?? '',
      address: selectedRow.address ?? '',
      delivery_address: selectedRow.delivery_address ?? selectedRow.delivery_address ?? '',
      remark: selectedRow.remark ?? '',
      docket_remark: selectedRow.docket_remark ?? '',
      sample_status: selectedRow.sample_status ?? '',
      dispatch_date: selectedRow.dispatch_date ?? '',
      delivery_status: selectedRow.delivery_status ?? '',
      expected_delivery_date: selectedRow.expected_delivery_date ?? '',
      delivered_date: selectedRow.delivered_date ?? '',
      feedback: selectedRow.feedback ?? '',
      followups: selectedRow.followups || '[]',
    });

    try {
      const parsed =
        typeof selectedRow.interested_products === 'string'
          ? JSON.parse(selectedRow.interested_products)
          : selectedRow.interested_products || [];

      const formatted = parsed.map((p: any) => ({
        product_id: p.product_id || '',
        grade: p.grade || '',
        qty: p.qty || '',
        sample_type: p.sample_type || '',
        file: null,
        existing_file: p.spec_file || p.file || null,
      }));

      setItems(
        formatted.length
          ? formatted
          : [
              {
                product_id: '',
                grade: '',
                qty: '',
                sample_type: '',
                file: null,
                existing_file: null,
              },
            ],
      );
    } catch (err) {
      console.log(err);

      setItems([
        {
          product_id: '',
          grade: '',
          qty: '',
          sample_type: '',
          file: null,
          existing_file: null,
        },
      ]);
    }
  }, [selectedRow, openModal]);

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div className="text-xl font-semibold">Edit Sample Request</div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={submit} className="space-y-6">
          {/* ================= COMPANY ================= */}

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-4">Company Information</h3>

            <div className="grid grid-cols-12 gap-4">
              {/* COMPANY */}
              <div className="col-span-6">
                <Label value="Company Name *" />

                <Select
                  options={customerOptions}
                  placeholder="Select company"
                  value={customerOptions?.find((c: any) => c.value === formData.company_id)}
                  onChange={handleCustomer}
                />

                {errors.company_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.company_id}</p>
                )}
              </div>

              {/* TYPE */}
              <div className="col-span-3">
                <Label value="Type *" />

                <select
                  className="w-full border rounded p-2"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="domestic">Domestic</option>

                  <option value="export">Export</option>
                </select>
              </div>

              {/* CONTACT */}
              <div className="col-span-3">
                <Label value="Contact Person *" />

                <TextInput
                  placeholder="Enter contact person"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_person: e.target.value,
                    })
                  }
                />

                {errors.contact_person && (
                  <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>
                )}
              </div>

              {/* MOBILE */}
              <div className="col-span-4">
                <Label value="Mobile *" />

                <TextInput
                  placeholder="Enter mobile number"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value,
                    })
                  }
                />

                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              {/* BILLING ADDRESS */}
              <div className="col-span-4">
                <Label value="Address *" />

                <Textarea
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                />

                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* DELIVERY ADDRESS */}
              <div className="col-span-4">
                <Label value="Delivery Address *" />

                <Textarea
                  placeholder="Enter delivery address"
                  value={formData.delivery_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      delivery_address: e.target.value,
                    })
                  }
                />

                {errors.delivery_address && (
                  <p className="text-red-500 text-xs mt-1">{errors.delivery_address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border md:w-1/2">
            <Label value="Priority" />
            <select
              className="w-full border rounded p-2"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* ================= PRODUCTS ================= */}

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-4">Sample Product Details</h3>

            {items.map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-5 items-start border-b pb-4">
                {/* PRODUCT */}
                <div className="col-span-3">
                  <Label>Product *</Label>

                  <Select
                    options={productOptions}
                    placeholder="Select product"
                    value={productOptions?.find((p: any) => p.value === items[index].product_id)}
                    onChange={(v: any) => handleItem(index, 'product_id', v.value)}
                  />

                  {errors[`product_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`product_${index}`]}</p>
                  )}
                </div>

                {/* GRADE */}
                <div className="col-span-2">
                  <Label>Grade *</Label>

                  <select
                    value={items[index].grade}
                    className="w-full border p-2 rounded"
                    onChange={(e) => handleItem(index, 'grade', e.target.value)}
                  >
                    <option value="">Select Grade</option>

                    {grades.map((g: any) => (
                      <option key={g.id} value={g.grade}>
                        {g.grade}
                      </option>
                    ))}
                  </select>

                  {errors[`grade_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`grade_${index}`]}</p>
                  )}
                </div>

                {/* QTY */}
                <div className="col-span-2">
                  <Label>Qty *</Label>

                  <TextInput
                    placeholder="Enter qty"
                    value={items[index].qty}
                    onChange={(e) => handleItem(index, 'qty', e.target.value)}
                  />

                  {errors[`qty_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`qty_${index}`]}</p>
                  )}
                </div>

                {/* SAMPLE TYPE */}
                <div className="col-span-3">
                  <Label>Sample Type *</Label>

                  <Select
                    options={sampleTypes}
                    placeholder="Select sample type"
                    value={sampleTypes.find((s) => s.value === items[index].sample_type)}
                    onChange={(v: any) => handleItem(index, 'sample_type', v.value)}
                  />

                  {errors[`sample_type_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`sample_type_${index}`]}</p>
                  )}
                </div>

                {/* FILE */}
                <div className="col-span-2">
                  <Label>Specification</Label>

                  <label
                    htmlFor={`file-${index}`}
                    className="flex items-center justify-center w-full h-11 px-3 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-xs text-gray-600"
                  >
                    <span className="truncate">
                      {items[index].file?.name || (items[index].existing_file ? 'Replace specification' : 'Upload specification')}
                    </span>
                  </label>

                  <input
                    id={`file-${index}`}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(e: any) => handleItem(index, 'file', e.target.files[0])}
                  />

                  {items[index].existing_file && !items[index].file && (
                    <div className="text-xs mt-2">
                      <a
                        href={fileUrl(items[index].existing_file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View File
                      </a>
                    </div>
                  )}

                  {errors[`file_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`file_${index}`]}</p>
                  )}
                </div>

                {/* REMOVE */}
                <div className="col-span-1 pt-6">
                  {index > 0 && (
                    <Button color="failure" size="xs" onClick={() => removeRow(index)}>
                      X
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button color="primary" size="xs" onClick={addRow}>
              + Add Product
            </Button>
          </div>

          {/* ================= REMARK ================= */}

          <div className="bg-gray-50 p-5 rounded-lg border">
            <Label value="Remark" />

            <Textarea
              placeholder="Enter remark"
              value={formData.remark}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remark: e.target.value,
                })
              }
            />
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border space-y-4">
            <h3 className="font-semibold text-gray-700">Dispatch & Delivery Follow-up</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><Label value="Dispatch Date" /><TextInput type="date" value={formData.dispatch_date} onChange={(e) => setFormData({ ...formData, dispatch_date: e.target.value })} /></div>
              <div><Label value="Delivery Status" /><select className="w-full border rounded p-2" value={formData.delivery_status} onChange={(e) => setFormData({ ...formData, delivery_status: e.target.value, delivered_date: e.target.value === 'delivered' ? formData.delivered_date : '' })}><option value="">Select status</option><option value="dispatched">Dispatched</option><option value="not_delivered">Not delivered</option><option value="delivered">Delivered</option></select></div>
              <div><Label value="New Delivery Date" /><TextInput type="date" value={formData.expected_delivery_date} onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })} disabled={formData.delivery_status !== 'not_delivered'} /></div>
              <div><Label value="Delivered Date" /><TextInput type="date" value={formData.delivered_date} onChange={(e) => setFormData({ ...formData, delivered_date: e.target.value })} disabled={formData.delivery_status !== 'delivered'} /></div>
            </div>
            {formData.dispatch_date && <p className="text-sm text-gray-600">Delivery check due: {new Date(new Date(formData.dispatch_date + 'T00:00:00').setDate(new Date(formData.dispatch_date + 'T00:00:00').getDate() + 3)).toLocaleDateString('en-GB')} (3 days after dispatch)</p>}
            {formData.delivered_date && <p className="text-sm text-gray-600">Marketing follow-up starts: {new Date(new Date(formData.delivered_date + 'T00:00:00').setDate(new Date(formData.delivered_date + 'T00:00:00').getDate() + 7)).toLocaleDateString('en-GB')} (7 days after delivery)</p>}
            <div><Label value="Customer Feedback" /><Textarea value={formData.feedback} onChange={(e) => setFormData({ ...formData, feedback: e.target.value })} placeholder="Record customer feedback" /></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div><Label value="Marketing Follow-up Date" /><TextInput type="date" min={formData.delivered_date ? (() => { const date = new Date(formData.delivered_date + 'T00:00:00'); date.setDate(date.getDate() + 7); return date.toISOString().slice(0, 10); })() : undefined} value={followupDraft.followup_date} onChange={(e) => setFollowupDraft({ ...followupDraft, followup_date: e.target.value })} /></div>
              <div><Label value="Status" /><select className="w-full border rounded p-2" value={followupDraft.status} onChange={(e) => setFollowupDraft({ ...followupDraft, status: e.target.value })}><option value="">Select status</option><option value="interested">Interested</option><option value="not_interested">Not Interested</option><option value="follow_up_order">Follow Up for Order</option><option value="pending">Pending</option></select></div>
              <div><Label value="Feedback / Note" /><TextInput value={followupDraft.note} onChange={(e) => setFollowupDraft({ ...followupDraft, note: e.target.value })} placeholder="Follow-up note" /></div>
              <Button type="button" color="primary" onClick={addFollowup}>Add Follow-up</Button>
            </div>
            <div className="space-y-2">{parseFollowups(formData.followups).map((followup: any, index: number) => <div key={`${followup.followup_date}-${index}`} className="text-sm border rounded p-2">{followup.followup_date} · {followup.status} · {followup.note || 'No note'}</div>)}</div>
          </div>

          {/* ================= DOCKET ================= */}

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-4">Docket Details</h3>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Docket Remark" />

                <Textarea
                  placeholder="Enter docket remark"
                  value={formData.docket_remark}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      docket_remark: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-6">
                <Label value="Sample Status" />

                <TextInput
                  placeholder="Enter sample status"
                  value={formData.sample_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sample_status: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* ================= ACTION ================= */}

          <div className="flex justify-end gap-3">
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

export default SampleRequestEditModal;
