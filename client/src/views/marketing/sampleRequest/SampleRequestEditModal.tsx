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
    contact_person: '',
    mobile: '',
    address: '',
    delivery_address: '',
    remark: '',
    docket_remark: '',
    sample_status: '',
  });

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

  /* ================= VALIDATION ================= */

  /* ================= SUBMIT ================= */

  const submit = async (e: any) => {
    e.preventDefault();

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
      contact_person: selectedRow.contact_person ?? '',
      mobile: selectedRow.mobile ?? '',
      address: selectedRow.address ?? '',
      delivery_address: selectedRow.delivery_address ?? selectedRow.delivery_address ?? '',
      remark: selectedRow.remark ?? '',
      docket_remark: selectedRow.docket_remark ?? '',
      sample_status: selectedRow.sample_status ?? '',
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
                      mobile: e.target.value.replace(/\D/g, ''),
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
                  <Label>Specification *</Label>

                  <label
                    htmlFor={`file-${index}`}
                    className="flex items-center justify-center w-full h-11 px-3 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-xs text-gray-600"
                  >
                    Upload
                  </label>

                  <input
                    id={`file-${index}`}
                    type="file"
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
