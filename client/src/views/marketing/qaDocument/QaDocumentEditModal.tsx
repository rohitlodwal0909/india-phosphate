import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { getQaDocument, updateQaDocument } from 'src/features/marketing/QaDocumentSlice';
import { validateQaDocument } from './Validation';
import { ImageUrl } from 'src/constants/contant';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
}

const QaDocumentEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((s: RootState) => s.purchaseOrder.customers);

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;
  const roleId = Number(logindata?.admin?.role_id);
  const isAdmin = roleId === 1;
  const isQa = roleId === 3;
  const canEditMarketingSteps = isAdmin || roleId === 9;
  const canEditQaStep = isAdmin || isQa;

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
    priority: '',
  });

  const defaultRow = {
    doc_name: '',
    qa_person_id: '',
    received_marketing_id: '',
    share_customer_by: '',
    status: '',
    approval_from: 'marketing',
    comment: '',
    file: null,
    old_file: '',
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

  /* ================= SET DATA ================= */

  useEffect(() => {
    if (!selectedRow) return;

    setFormData({
      company_id: selectedRow.company_id || '',
      priority: selectedRow.priority || '',
    });

    if (selectedRow.qa_document?.length) {
      const items = selectedRow.qa_document.map((item: any) => ({
        id: item.id,
        doc_name: item.doc_name || '',
        qa_person_id: item.qa_person_id || '',
        received_marketing_id: item.received_marketing_id || '',
        share_customer_by: item.share_customer_by || '',
        status: item.status || '',
        approval_from: item.approval_from || 'marketing',
        comment: item.comment || '',
        file: null,
        old_file: item.file || '',
      }));

      setCoaItems(items);
    } else {
      setCoaItems([defaultRow]);
    }
  }, [selectedRow]);

  /* ================= HANDLERS ================= */

  const handleCustomer = (val: any) => {
    setFormData((prev) => ({
      ...prev,
      company_id: val?.value || '',
    }));
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
      const form = new FormData();

      form.append('company_id', formData.company_id);
      form.append('priority', formData.priority);

      // JSON DATA
      form.append(
        'coaItems',
        JSON.stringify(
          coaItems.map((item: any) => ({
            id: item.id || '',
            doc_name: item.doc_name,
            qa_person_id: item.qa_person_id,
            received_marketing_id: item.received_marketing_id,
            share_customer_by: item.share_customer_by,
            status: item.status,
            approval_from: item.approval_from || 'marketing',
            comment: item.comment,
            old_file: item.old_file || '',
          })),
        ),
      );

      // FILES
      coaItems.forEach((item: any, index: number) => {
        if (item.file) {
          form.append(`file_${index}`, item.file);
        }
      });

      await dispatch(
        updateQaDocument({
          id: selectedRow.id,
          data: form,
        }),
      ).unwrap();

      toast.success('QA Document Updated Successfully');

      dispatch(getQaDocument());

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Edit QA Documents</h2>

          <p className="text-sm text-gray-500 mt-1">
            Update QA workflow & customer sharing details
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* COMPANY INFO */}
          <div className="border rounded-2xl p-5 bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-700">Company Information</h3>

              <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Step 1</div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Company Name" className="mb-2 block" />

                <Select
                  options={customerOptions}
                  placeholder="Select Company"
                  value={customerOptions?.find(
                    (c: any) => Number(c.value) === Number(formData.company_id),
                  )}
                  onChange={handleCustomer}
                  isDisabled={!canEditMarketingSteps}
                />
              </div>
              <div className="col-span-4">
                <Label value="Priority" className="mb-2 block" />
                <select
                  className="w-full h-10 border rounded-lg px-3 bg-white"
                  value={formData.priority}
                  disabled={!canEditMarketingSteps}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="border rounded-2xl p-5 bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">COA Specification Documents</h3>

                <p className="text-sm text-gray-500">Edit QA approval & sharing workflow</p>
              </div>

              {canEditMarketingSteps && <Button color="primary" size="sm" type="button" onClick={addRow}>+ Add New Document</Button>}
            </div>

            {coaItems.map((item, index) => {
              const step2Enabled = !!selectedRow?.qa_document?.[index]?.doc_name;

              const step3Enabled = !!selectedRow?.qa_document?.[index]?.status;
              const step2Editable = step2Enabled && canEditQaStep;

              return (
                <div key={index} className="border rounded-2xl p-5 bg-white shadow-sm mb-6">
                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">Document #{index + 1}</h4>

                      <p className="text-sm text-gray-500">QA approval workflow</p>
                    </div>

                    {index > 0 && canEditMarketingSteps && (
                      <Button color="failure" size="xs" onClick={() => removeRow(index)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* STEP 1 */}
                  <div className={`border rounded-xl p-5 bg-blue-50 mb-5 ${canEditMarketingSteps ? '' : 'opacity-60 pointer-events-none'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-blue-700">Step 1 : Assign QA Person</h5>

                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Marketing Team
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* DOC NAME */}
                      <div className="col-span-4">
                        <Label value="Document Name" className="mb-2 block" />

                        <TextInput
                          placeholder="Enter document name"
                          value={item.doc_name}
                          onChange={(e) => handleItem(index, 'doc_name', e.target.value)}
                        />
                      </div>

                      {/* QA PERSON */}
                      <div className="col-span-4">
                        <Label value="QA Person" className="mb-2 block" />

                        <Select
                          options={qaOptions}
                          placeholder="Select QA Person"
                          value={qaOptions.find(
                            (o: any) => Number(o.value) === Number(item.qa_person_id),
                          )}
                          onChange={(v: any) => handleItem(index, 'qa_person_id', v?.value)}
                        />
                      </div>

                      <div className="col-span-4">
                        <Label value="Upload Pdf" className="mb-2 block" />

                        <label
                          htmlFor={`file-${index}`}
                          className="flex items-center justify-between w-full h-11 px-4 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 text-sm text-gray-600"
                        >
                          <span className="truncate">
                            {item.file?.name || item.old_file || 'Upload PDF'}
                          </span>

                          <span className="text-blue-600 font-medium">Browse</span>
                        </label>

                        <input
                          id={`file-${index}`}
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx"
                          className="hidden"
                          onChange={(e: any) => {
                            const file = e.target.files[0];

                            if (!file) return;

                            if (!/\.(png|jpe?g|pdf|docx?|xlsx?)$/i.test(file.name)) {
                              toast.error('Upload PNG, JPG, PDF, Word, or Excel files only');
                              e.target.value = '';
                              return;
                            }

                            handleItem(index, 'file', file);
                          }}
                        />

                        {/* OLD FILE VIEW */}
                        {item.old_file && (
                          <a
                            href={`${ImageUrl}uploads/qa-documents/${item.old_file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 mt-2 inline-block"
                          >
                            View Uploaded File
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div
                    className={`border rounded-xl p-5 mb-5 ${
                      !step2Editable
                        ? 'bg-gray-100 opacity-60 pointer-events-none'
                        : item.approval_from === 'admin'
                          ? 'bg-amber-100 border-amber-800'
                          : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className={`font-semibold ${item.approval_from === 'admin' ? 'text-amber-900' : 'text-yellow-700'}`}>Step 2 : QA Review</h5>

                      <span className={`text-xs px-3 py-1 rounded-full ${item.approval_from === 'admin' ? 'bg-amber-800 text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                        QA Department
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* STATUS */}
                      <div className="col-span-3">
                        <Label value="Document Status" className="mb-2 block" />

                        <div className="flex gap-5 mt-3">
                          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${index}`}
                              checked={item.status === 'given'}
                              onChange={() => handleItem(index, 'status', 'given')}
                            />

                            <span>Given</span>
                          </label>

                          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${index}`}
                              checked={item.status === 'not_given'}
                              onChange={() => handleItem(index, 'status', 'not_given')}
                            />

                            <span>Not Given</span>
                          </label>
                        </div>
                      </div>

                      {/* COMMENT */}
                      <div className="col-span-3">
                        <Label value="Comment" className="mb-2 block" />

                        <TextInput
                          placeholder="Enter QA comment"
                          value={item.comment}
                          onChange={(e) => handleItem(index, 'comment', e.target.value)}
                        />
                      </div>

                      {/* RECEIVED */}
                      <div className="col-span-3">
                        <Label value="Received By Marketing" className="mb-2 block" />

                        <Select
                          options={marketingOptions}
                          placeholder="Select Marketing Person"
                          value={marketingOptions.find(
                            (o: any) => Number(o.value) === Number(item.received_marketing_id),
                          )}
                          onChange={(v: any) =>
                            handleItem(index, 'received_marketing_id', v?.value)
                          }
                        />
                      </div>

                      <div className="col-span-3">
                        <Label value="Approval From" className="mb-2 block" />
                        <select
                          className="w-full h-10 border rounded-lg px-3 bg-white"
                          value={item.approval_from || 'marketing'}
                          onChange={(e) => handleItem(index, 'approval_from', e.target.value)}
                        >
                          <option value="marketing">Marketing</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div
                    className={`border rounded-xl p-5 ${
                      step3Enabled && canEditMarketingSteps ? 'bg-green-50' : 'bg-gray-100 opacity-60 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-green-700">Step 3 : Share With Customer</h5>

                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        Marketing Team
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <Label value="Share Customer By" className="mb-2 block" />

                        <Select
                          options={marketingOptions}
                          placeholder="Select Marketing Person"
                          value={marketingOptions.find(
                            (o: any) => Number(o.value) === Number(item.share_customer_by),
                          )}
                          onChange={(v: any) => handleItem(index, 'share_customer_by', v?.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Update QA Document
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default QaDocumentEditModal;
