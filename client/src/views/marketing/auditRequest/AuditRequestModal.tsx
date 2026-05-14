import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { validateForm } from './Validation';
import { addAudit, getAudit } from 'src/features/marketing/AuditSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'IHS'];

const AuditRequestModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const { productdata } = useSelector((s: any) => s.products);
  const customers = useSelector((s: RootState) => s.purchaseOrder.customers);

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getAllCustomers());
  }, []);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState<any>({
    arrival_date: '',
    company_id: '',
    address: '',
    contact_person: '',
    mobile: '',
    audit_agenda: '',
    note: '',
  });

  const [auditItems, setAuditItems] = useState([{ product_id: '', grade: '', auditor_name: '' }]);

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

  /* ================= HANDLERS ================= */

  const handleCustomer = (val: any) => {
    setFormData({
      ...formData,
      company_id: val.value,
      address: val.address,
    });
  };

  const handleItem = (i: number, field: string, value: any) => {
    const updated = [...auditItems];
    updated[i][field] = value;
    setAuditItems(updated);
  };

  const addRow = () => {
    setAuditItems([...auditItems, { product_id: '', grade: '', auditor_name: '' }]);
  };

  const removeRow = (i: number) => {
    setAuditItems(auditItems.filter((_, idx) => idx !== i));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm(formData, auditItems)) return;

    try {
      await dispatch(
        addAudit({
          ...formData,
          auditItems,
        }),
      ).unwrap();

      toast.success('Audit Request Sent to QA & QC ✅');
      dispatch(getAudit());
      // resetForm();
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save enquiry');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>Audit Request</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= BASIC INFO ================= */}

          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold mb-4">Audit Information</h3>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <Label value="Arrival Date" />
                <TextInput
                  type="date"
                  onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                />
              </div>

              <div className="col-span-5">
                <Label value="Company Name" />
                <Select options={customerOptions} onChange={handleCustomer} />
              </div>
            </div>
          </div>

          {/* ================= AUDIT ITEMS ================= */}

          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold mb-4">Audit Details</h3>

            {auditItems.map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                <div className="col-span-4">
                  <Label>Interested Product</Label>
                  <Select
                    options={productOptions}
                    onChange={(v: any) => handleItem(index, 'product_id', v.value)}
                  />
                </div>

                <div className="col-span-3">
                  <Label>Grade</Label>
                  <select
                    className="w-full border p-2 rounded"
                    onChange={(e) => handleItem(index, 'grade', e.target.value)}
                  >
                    <option>Select</option>
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4">
                  <Label>Name of Auditor</Label>
                  <TextInput onChange={(e) => handleItem(index, 'auditor_name', e.target.value)} />
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
              + Add Row
            </Button>
          </div>

          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold mb-4">Compliance</h3>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <Label>Compliance Status</Label>
                <select
                  className="w-full border p-2 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compliance_status: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="Complied">Complied</option>
                  <option value="Not Complied">Not Complied</option>
                </select>
              </div>

              <div className="col-span-8">
                <Label>Compliance Remark</Label>
                <Textarea
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compliance_remark: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* ================= REMARK ================= */}

          <div className="border rounded-lg p-5 bg-gray-50">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Audit Agenda" />
                <Textarea
                  onChange={(e) => setFormData({ ...formData, audit_agenda: e.target.value })}
                />
              </div>

              <div className="col-span-6">
                {' '}
                <Label value="Note" />
                <Textarea onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
              </div>
            </div>
          </div>

          {/* ================= ACTION ================= */}

          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Notify QA & QC
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AuditRequestModal;
