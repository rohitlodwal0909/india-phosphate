import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { updateSampleRequest } from 'src/features/marketing/SampleRequestSlice';
import { ImageUrl } from 'src/constants/contant';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
}

const fileUrl = (file: string) => `${ImageUrl}uploads/sample-request/${file}`;

const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'IHS'];

const sampleTypes = [
  { value: 'FOC', label: 'FOC' },
  { value: 'Chargeable', label: 'Chargeable' },
  { value: 'Customer Account', label: 'Customer Account' },
];

const SampleRequestEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const { productdata } = useSelector((state: any) => state.products);
  const customers = useSelector((state: RootState) => state.purchaseOrder.customers);

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getAllCustomers());
  }, [dispatch]);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState<any>({
    company_id: '',
    type: 'domestic',
    contact_person: '',
    mobile: '',
    address: '',
    remark: '',
    docket_remark: '',
    sample_status: '',
  });

  const [items, setItems] = useState([
    { product_id: '', grade: '', qty: '', sample_type: '', file: null, existing_file: null },
  ]);

  const customerOptions = customers?.map((c: any) => ({
    label: c.company_name,
    value: c.id,
    address: c.company_address,
  }));

  const productOptions = productdata?.map((p: any) => ({
    label: p.product_name,
    value: p.id,
  }));

  /* ================= HANDLERS ================= */

  const handleCustomer = (val: any) => {
    setFormData({
      ...formData,
      company_id: val.value,
      address: val.address,
    });
  };

  const handleItem = (i: number, field: string, value: any) => {
    setItems((prev: any) => {
      const updated = [...prev];

      updated[i] = {
        ...updated[i],
        [field]: value,
      };

      /* Remove old file preview if new uploaded */
      if (field === 'file') {
        updated[i].existing_file = null;
      }

      return updated;
    });
  };

  const addRow = () =>
    setItems([
      ...items,
      { product_id: '', grade: '', qty: '', sample_type: '', file: null, existing_file: null },
    ]);

  const removeRow = (i: number) => setItems(items.filter((_, index) => index !== i));

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      /* -------- Main Fields -------- */
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key]);
      });

      /* -------- Items Without File -------- */
      const itemsWithoutFile = items.map(({ file, ...rest }) => rest);

      formDataObj.append('items', JSON.stringify(itemsWithoutFile));

      /* -------- Append Files -------- */
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

  useEffect(() => {
    if (!openModal || !selectedRow) return;

    /* ---------- FORM ---------- */
    setFormData({
      company_id: selectedRow.company_id ?? '',
      type: selectedRow.type ?? 'domestic',
      contact_person: selectedRow.contact_person ?? '',
      mobile: selectedRow.mobile ?? '',
      address: selectedRow.address ?? '',
      remark: selectedRow.remark ?? '',
      docket_remark: selectedRow.docket_remark ?? '',
      sample_status: selectedRow.sample_status ?? '',
    });

    /* ---------- PRODUCTS ---------- */
    try {
      const parsed =
        typeof selectedRow.interested_products === 'string'
          ? JSON.parse(selectedRow.interested_products)
          : selectedRow.interested_products || [];

      const formatted = parsed.map((p: any) => ({
        product_id: p.product_id || '',
        grade: p.grade || '',
        qty: p.qty || p.quantity || '',
        sample_type: p.sample_type || '',
        file: null, // new upload
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
        { product_id: '', grade: '', qty: '', sample_type: '', file: null, existing_file: null },
      ]);
    }
  }, [selectedRow, openModal]);

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div className="text-xl font-semibold">Marketing Sample Request</div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={submit} className="space-y-6">
          {/* ================= COMPANY DETAILS ================= */}

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-4">Company Information</h3>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Company Name" />
                <Select
                  options={customerOptions}
                  value={customerOptions?.find((c: any) => c.value === formData.company_id)}
                  onChange={handleCustomer}
                />{' '}
              </div>

              <div className="col-span-3">
                <Label value="Type" />
                <select
                  className="w-full border rounded p-2"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="domestic">Domestic</option>
                  <option value="export">Export</option>
                </select>
              </div>

              <div className="col-span-3">
                <Label value="Contact Person" />
                <TextInput
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>

              <div className="col-span-4">
                <Label value="Mobile" />
                <TextInput
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div className="col-span-8">
                <Label value="Address" />
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />{' '}
              </div>
            </div>
          </div>

          {/* ================= PRODUCT DETAILS ================= */}

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-4">Sample Product Details</h3>

            {items.map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                <div className="col-span-3">
                  <Label>Product</Label>
                  <Select
                    options={productOptions}
                    value={productOptions?.find((p: any) => p.value === items[index].product_id)}
                    onChange={(v: any) => handleItem(index, 'product_id', v.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Grade</Label>
                  <select
                    value={items[index].grade}
                    className="w-full border p-2 rounded"
                    onChange={(e) => handleItem(index, 'grade', e.target.value)}
                  >
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <Label>Qty</Label>
                  <TextInput
                    value={items[index].qty}
                    onChange={(e) => handleItem(index, 'qty', e.target.value)}
                  />
                </div>

                <div className="col-span-3">
                  <Label>Sample Type</Label>
                  <Select
                    options={sampleTypes}
                    value={sampleTypes.find((s) => s.value === items[index].sample_type)}
                    onChange={(v: any) => handleItem(index, 'sample_type', v.value)}
                  />
                </div>

                <div className="col-span-1">
                  <Label>Spec</Label>
                  <input
                    type="file"
                    className="text-sm"
                    onChange={(e: any) => handleItem(index, 'file', e.target.files[0])}
                  />

                  {items[index].existing_file && !items[index].file && (
                    <div className="text-xs mt-1">
                      <a
                        href={fileUrl(items[index].existing_file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Spec
                      </a>
                    </div>
                  )}
                </div>

                <div className="col-span-1">
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
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
            />
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-4">Docket details </h3>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Docket Remark" />
                <Textarea
                  value={formData.docket_remark}
                  onChange={(e) => setFormData({ ...formData, docket_remark: e.target.value })}
                />
              </div>

              <div className="col-span-6">
                <Label value="Sample Status" />
                <TextInput
                  value={formData.sample_status}
                  onChange={(e) => setFormData({ ...formData, sample_status: e.target.value })}
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
              Update{' '}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SampleRequestEditModal;
