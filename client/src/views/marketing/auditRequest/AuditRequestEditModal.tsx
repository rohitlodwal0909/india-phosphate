import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { getAudit, updateAudit } from 'src/features/marketing/AuditSlice';
import { validateForm } from './Validation';
import { GetGrade } from 'src/features/master/Grade/GradeSlice';
import { ImageUrl } from 'src/constants/contant';

interface AuditEditModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  permissions: any;
}

// const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'IHS'];

const AuditEditModal: React.FC<AuditEditModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
  permissions,
}) => {
  const dispatch = useDispatch<any>();

  const enabled = permissions?.admin?.role_id === 3 ? true : false;

  const { productdata } = useSelector((s: any) => s.products);
  const customers = useSelector((s: RootState) => s.purchaseOrder.customers);
  const grades = useSelector((state: RootState) => state.grades.gradedata) ?? [];

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getAllCustomers());
    dispatch(GetGrade());
  }, []);

  /* ================= FORM ================= */

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<any>({
    arrival_date: '',
    company_id: '',
    address: '',
    contact_person: '',
    mobile: '',
    audit_agenda: '',
    note: '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

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

  useEffect(() => {
    if (!selectedRow) return;

    /* ===== BASIC DATA ===== */
    setFormData({
      arrival_date: selectedRow.arrival_date || '',
      company_id: selectedRow.company_id || '',
      audit_agenda: selectedRow.audit_agenda || '',
      note: selectedRow.note || '',
      compliance_status: selectedRow.compliance_status || '',
      compliance_remark: selectedRow.compliance_remark || '',
    });

    /* ===== CUSTOMER SELECT ===== */
    setSelectedCustomer({
      label: selectedRow.customers?.company_name,
      value: selectedRow.company_id,
      address: selectedRow.customers?.company_address,
    });

    /* ===== AUDIT ITEMS ===== */
    if (selectedRow.interested_products?.length) {
      const items = selectedRow.interested_products.map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        grade: item.grade,
        auditor_name: item.auditor_name,
      }));

      setAuditItems(items);
    }
  }, [selectedRow]);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm(formData, auditItems)) return;

    const payload = new FormData();

    payload.append('arrival_date', formData.arrival_date || '');
    payload.append('company_id', formData.company_id || '');
    payload.append('audit_agenda', formData.audit_agenda || '');
    payload.append('note', formData.note || '');
    payload.append('compliance_status', formData.compliance_status || '');
    payload.append('compliance_remark', formData.compliance_remark || '');

    payload.append('auditItems', JSON.stringify(auditItems));

    if (pdfFile) {
      payload.append('pdf', pdfFile);
    }

    // const payload = {
    //   ...formData,
    //   auditItems,
    // };

    try {
      await dispatch(
        updateAudit({
          id: selectedRow?.id,
          data: payload,
        }),
      ).unwrap();

      toast.success('Audit Request Update ✅');
      dispatch(getAudit());
      // resetForm();
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save enquiry');
    }
  };
  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Audit Request</Modal.Header>

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
                  value={formData.arrival_date || ''}
                  onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                />
              </div>

              <div className="col-span-5">
                <Label value="Company Name" />
                <Select
                  options={customerOptions}
                  value={selectedCustomer}
                  onChange={(val: any) => {
                    setSelectedCustomer(val);
                    handleCustomer(val);
                  }}
                />{' '}
              </div>

              <div className="col-span-4">
                <Label value="Upload PDF" />

                <input
                  type="file"
                  accept=".pdf"
                  className="w-full border rounded-lg p-2 bg-white"
                  onChange={(e: any) => {
                    if (e.target.files[0]) {
                      setPdfFile(e.target.files[0]);
                    }
                  }}
                />

                {selectedRow?.pdf_file && (
                  <a
                    href={`${ImageUrl}uploads/audit/${selectedRow.pdf_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-2 inline-block"
                  >
                    View Current PDF
                  </a>
                )}
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
                    value={productOptions.find(
                      (p: any) => p.value === auditItems[index].product_id,
                    )}
                    onChange={(v: any) => handleItem(index, 'product_id', v.value)}
                  />
                </div>

                <div className="col-span-3">
                  <Label>Grade</Label>
                  <select
                    className="w-full border p-2 rounded"
                    value={auditItems[index].grade}
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
                  <TextInput
                    value={auditItems[index].auditor_name}
                    onChange={(e) => handleItem(index, 'auditor_name', e.target.value)}
                  />{' '}
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

          {enabled && (
            <div className="border rounded-lg p-5 bg-gray-50">
              <h3 className="font-semibold mb-4">Compliance</h3>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <Label>Compliance Status</Label>
                  <select
                    className="w-full border p-2 rounded"
                    value={formData.compliance_status || ''}
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
                    value={formData.compliance_remark || ''}
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
          )}

          {/* ================= REMARK ================= */}

          <div className="border rounded-lg p-5 bg-gray-50">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Audit Agenda" />
                <Textarea
                  value={formData.audit_agenda || ''}
                  onChange={(e) => setFormData({ ...formData, audit_agenda: e.target.value })}
                />
              </div>

              <div className="col-span-6">
                {' '}
                <Label value="Note" />
                <Textarea
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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

export default AuditEditModal;
