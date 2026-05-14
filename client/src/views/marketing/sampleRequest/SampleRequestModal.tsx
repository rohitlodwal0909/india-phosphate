import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { addSampleRequest } from 'src/features/marketing/SampleRequestSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'IHS'];

const sampleTypes = [
  { value: 'FOC', label: 'FOC' },
  { value: 'Chargeable', label: 'Chargeable' },
  { value: 'Customer Account', label: 'Customer Account' },
];

const SampleRequestModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const { productdata } = useSelector((state: any) => state.products);
  const customers = useSelector((state: RootState) => state.purchaseOrder.customers);

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getAllCustomers());
  }, []);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState<any>({
    company_id: '',
    type: 'domestic',
    contact_person: '',
    mobile: '',
    address: '',
    remark: '',
  });

  const [items, setItems] = useState([
    { product_id: '', grade: '', qty: '', sample_type: '', file: null },
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
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const addRow = () =>
    setItems([...items, { product_id: '', grade: '', qty: '', sample_type: '', file: null }]);

  const removeRow = (i: number) => setItems(items.filter((_, index) => index !== i));

  // const submit = (e: any) => {
  //   e.preventDefault();
  //   toast.success('Sample Request Sent to QC ✅');
  //   setOpenModal(false);
  // };

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

      await dispatch(addSampleRequest(formDataObj)).unwrap();

      toast.success('Sample Request Sent to QC ✅');
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save');
    }
  };

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
                <Select options={customerOptions} onChange={handleCustomer} />
              </div>

              <div className="col-span-3">
                <Label value="Type" />
                <select
                  className="w-full border rounded p-2"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="domestic">Domestic</option>
                  <option value="export">Export</option>
                </select>
              </div>

              <div className="col-span-3">
                <Label value="Contact Person" />
                <TextInput
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>

              <div className="col-span-4">
                <Label value="Mobile" />
                <TextInput onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
              </div>

              <div className="col-span-8">
                <Label value="Address" />
                <Textarea value={formData.address} />
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
                    onChange={(v: any) => handleItem(index, 'product_id', v.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Grade</Label>
                  <select
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
                  <TextInput onChange={(e) => handleItem(index, 'qty', e.target.value)} />
                </div>

                <div className="col-span-3">
                  <Label>Sample Type</Label>
                  <Select
                    options={sampleTypes}
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
            <Textarea onChange={(e) => setFormData({ ...formData, remark: e.target.value })} />
          </div>

          {/* ================= ACTION ================= */}

          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Send to QC
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SampleRequestModal;
