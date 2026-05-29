import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getAllCustomers } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { addQaDocument, getQaDocument } from 'src/features/marketing/QaDocumentSlice';
import { validateQaDocument } from './Validation';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const selectStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

const QaDocumentModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((s: RootState) => s.purchaseOrder.customers) || [];

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  /* =========================================================
      FILTER USERS
  ========================================================= */

  const qaPersons = usersdata.filter((u: any) => Number(u.role_id) === 3);

  const marketingPersons = usersdata.filter((u: any) => Number(u.role_id) === 9);

  /* =========================================================
      LOAD DATA
  ========================================================= */

  useEffect(() => {
    dispatch(GetUsermodule());

    dispatch(getAllCustomers());
  }, [dispatch]);

  /* =========================================================
      FORM
  ========================================================= */

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
    file: null,
  };

  const [coaItems, setCoaItems] = useState<any[]>([defaultRow]);

  /* =========================================================
      OPTIONS
  ========================================================= */

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

  /* =========================================================
      HANDLERS
  ========================================================= */

  const handleCustomer = (val: any) => {
    setFormData({
      company_id: val?.value || '',
    });
  };

  const handleItem = (index: number, field: string, value: any) => {
    const updated = [...coaItems];

    updated[index][field] = value;

    setCoaItems(updated);
  };

  const addRow = () => {
    setCoaItems((prev) => [...prev, { ...defaultRow }]);
  };

  const removeRow = (index: number) => {
    const updated = coaItems.filter((_: any, i: number) => i !== index);

    setCoaItems(updated);
  };

  /* =========================================================
      SUBMIT
  ========================================================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateQaDocument(formData, coaItems)) return;

    try {
      const payload = new FormData();

      payload.append('company_id', formData.company_id);

      payload.append(
        'coaItems',
        JSON.stringify(
          coaItems.map((item: any) => ({
            doc_name: item.doc_name,
            qa_person_id: item.qa_person_id,
            received_marketing_id: item.received_marketing_id,
            share_customer_by: item.share_customer_by,
            status: item.status,
            comment: item.comment,
          })),
        ),
      );

      coaItems.forEach((item: any) => {
        if (item.file) {
          payload.append('files', item.file);
        }
      });

      await dispatch(addQaDocument(payload)).unwrap();

      toast.success('QA Document Saved Successfully ✅');

      dispatch(getQaDocument());

      setOpenModal(false);

      setFormData({
        company_id: '',
      });

      setCoaItems([defaultRow]);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save');
    }
  };

  /* =========================================================
      UI
  ========================================================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div>
          <h2 className="text-xl font-bold text-gray-800">QA Documents Workflow</h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage QA document approval & customer sharing process
          </p>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =========================================================
              COMPANY INFO
          ========================================================= */}

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
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  onChange={handleCustomer}
                />
              </div>
            </div>
          </div>

          {/* =========================================================
              DOCUMENTS
          ========================================================= */}

          <div className="border rounded-2xl p-5 bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">COA Specification Documents</h3>

                <p className="text-sm text-gray-500">
                  Assign QA, review documents, and share with customers
                </p>
              </div>

              <Button color="primary" size="sm" type="button" onClick={addRow}>
                + Add New Document
              </Button>
            </div>

            {coaItems.map((item, index) => {
              const step2Enabled = false;

              const step3Enabled = false;

              return (
                <div key={index} className="border rounded-2xl p-5 bg-white shadow-sm mb-6">
                  {/* HEADER */}

                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">Document #{index + 1}</h4>

                      <p className="text-sm text-gray-500">QA approval workflow</p>
                    </div>

                    {index > 0 && (
                      <Button
                        color="failure"
                        size="xs"
                        type="button"
                        onClick={() => removeRow(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* =========================================================
                      STEP 1
                  ========================================================= */}

                  <div className="border rounded-xl p-5 bg-blue-50 mb-5">
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
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          onChange={(v: any) => handleItem(index, 'qa_person_id', v?.value)}
                        />
                      </div>

                      {/* FILE */}

                      <div className="col-span-4">
                        <Label value="Upload Pdf" className="mb-2 block" />

                        <label
                          htmlFor={`file-${index}`}
                          className="flex items-center justify-center w-full h-11 px-3 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-xs text-gray-600"
                        >
                          {item.file?.name || 'Upload PDF'}
                        </label>

                        <input
                          id={`file-${index}`}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e: any) => handleItem(index, 'file', e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      STEP 2
                  ========================================================= */}

                  <div
                    className={`border rounded-xl p-5 mb-5 ${
                      step2Enabled ? 'bg-yellow-50' : 'bg-gray-100 opacity-60 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-yellow-700">Step 2 : QA Review</h5>

                      <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        QA Department
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      {/* STATUS */}

                      <div className="col-span-4">
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

                      <div className="col-span-4">
                        <Label value="Comment" className="mb-2 block" />

                        <Textarea
                          rows={2}
                          placeholder="Enter QA comment"
                          value={item.comment}
                          onChange={(e) => handleItem(index, 'comment', e.target.value)}
                        />
                      </div>

                      {/* RECEIVED */}

                      <div className="col-span-4">
                        <Label value="Received By Marketing" className="mb-2 block" />

                        <Select
                          options={marketingOptions}
                          placeholder="Select Marketing Person"
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          onChange={(v: any) =>
                            handleItem(index, 'received_marketing_id', v?.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      STEP 3
                  ========================================================= */}

                  <div
                    className={`border rounded-xl p-5 ${
                      step3Enabled ? 'bg-green-50' : 'bg-gray-100 opacity-60 pointer-events-none'
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
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          onChange={(v: any) => handleItem(index, 'share_customer_by', v?.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================================
              ACTION BUTTONS
          ========================================================= */}

          <div className="flex justify-end gap-3 pt-2">
            <Button color="gray" type="button" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Save QA Document
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default QaDocumentModal;
