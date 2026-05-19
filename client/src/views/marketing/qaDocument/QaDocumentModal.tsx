import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { getAudit } from 'src/features/marketing/AuditSlice';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { addQaDocument } from 'src/features/marketing/QaDocumentSlice';
import { validateQaDocument } from './Validation';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const QaDocumentModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((s: RootState) => s.purchaseOrder.customers);
  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  /* ================= FILTER USERS ================= */

  const qaPersons = usersdata.filter((u: any) => Number(u.role_id) === 3);

  const marketingPersons = usersdata.filter((u: any) => Number(u.role_id) === 9);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(GetUsermodule());
    dispatch(getAllCustomers());
  }, [dispatch]);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState({
    company_id: '',
  });

  const defaultRow = {
    doc_name: '',
    qa_person_id: '',
    received_marketing_id: '',
    share_customer_by: '',
    status: '',
    comment: '',
  };

  const [coaItems, setCoaItems] = useState([defaultRow]);

  /* ================= OPTIONS ================= */

  const customerOptions = customers?.map((c: any) => ({
    label: c.company_name,
    value: c.id,
  }));

  const qaOptions = qaPersons.map((p: any) => ({
    label: p.username,
    value: p.id,
  }));

  const marketingOptions = marketingPersons.map((p: any) => ({
    label: p.username,
    value: p.id,
  }));

  /* ================= HANDLERS ================= */

  const handleCustomer = (val: any) => {
    setFormData({
      company_id: val.value,
    });
  };

  const handleItem = (index: number, field: string, value: any) => {
    setCoaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addRow = () => {
    setCoaItems((prev) => [...prev, { ...defaultRow }]);
  };

  const removeRow = (index: number) => {
    setCoaItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateQaDocument(formData, coaItems)) return;

    try {
      await dispatch(
        addQaDocument({
          ...formData,
          coaItems,
        }),
      ).unwrap();

      toast.success('Audit Request Sent to QA & QC ✅');
      dispatch(getAudit());
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>QA Documents</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* COMPANY INFO */}
          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold mb-4">Company Information</h3>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <Label value="Company Name" />
                <Select options={customerOptions} onChange={handleCustomer} />
              </div>
            </div>
          </div>

          {/* AUDIT TABLE */}
          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold mb-4">COA Specification Documents</h3>

            {coaItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
                {/* DOC NAME */}
                <div className="col-span-2">
                  <Label>Doc Name</Label>
                  <TextInput
                    value={item.doc_name}
                    onChange={(e) => handleItem(index, 'doc_name', e.target.value)}
                  />
                </div>

                {/* QA PERSON */}
                <div className="col-span-2">
                  <Label>QA Person</Label>
                  <Select
                    options={qaOptions}
                    onChange={(v: any) => handleItem(index, 'qa_person_id', v.value)}
                  />
                </div>

                {/* RECEIVED */}
                <div className="col-span-2">
                  <Label>Received by Marketing</Label>
                  <Select
                    options={marketingOptions}
                    onChange={(v: any) => handleItem(index, 'received_marketing_id', v.value)}
                  />
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <Label>Given / Not Given</Label>

                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`status-${index}`}
                        checked={item.status === 'given'}
                        onChange={() => handleItem(index, 'status', 'given')}
                      />
                      Given
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`status-${index}`}
                        checked={item.status === 'not_given'}
                        onChange={() => handleItem(index, 'status', 'not_given')}
                      />
                      Not Given
                    </label>
                  </div>
                </div>

                {/* SHARE CUSTOMER */}
                <div className="col-span-2">
                  <Label>Share Customer</Label>
                  <Select
                    options={marketingOptions}
                    onChange={(v: any) => handleItem(index, 'share_customer_by', v.value)}
                  />
                </div>

                {/* COMMENT */}
                <div className="col-span-2">
                  <Label>Comment</Label>
                  <TextInput
                    value={item.comment}
                    onChange={(e) => handleItem(index, 'comment', e.target.value)}
                  />
                </div>

                {/* REMOVE */}
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

          {/* ACTION */}
          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default QaDocumentModal;
