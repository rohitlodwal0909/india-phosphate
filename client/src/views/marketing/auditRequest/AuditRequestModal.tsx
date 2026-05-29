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
import { GetGrade } from 'src/features/master/Grade/GradeSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

// const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'IHS'];

const AuditRequestModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { productdata } = useSelector((s: any) => s.products);
  const customers = useSelector((s: RootState) => s.purchaseOrder.customers);
  const grades = useSelector((state: RootState) => state.grades.gradedata) ?? [];

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getAllCustomers());
    dispatch(GetGrade());
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
      const payload = new FormData();

      payload.append('arrival_date', formData.arrival_date);
      payload.append('company_id', formData.company_id);
      payload.append('address', formData.address);
      payload.append('contact_person', formData.contact_person);
      payload.append('mobile', formData.mobile);
      payload.append('audit_agenda', formData.audit_agenda);
      payload.append('note', formData.note);

      payload.append('auditItems', JSON.stringify(auditItems));

      if (pdfFile) {
        payload.append('pdf', pdfFile);
      }

      await dispatch(addAudit(payload)).unwrap();

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

              <div className="col-span-4">
                <Label value="Upload PDF" />

                <input
                  type="file"
                  accept=".pdf"
                  className="w-full border rounded-lg  bg-white"
                  onChange={(e: any) => {
                    if (e.target.files[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                />
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
                    {Array.isArray(grades) &&
                      grades.map((g: any) => (
                        <option key={g.id} value={g.grade}>
                          {g.grade}
                        </option>
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
