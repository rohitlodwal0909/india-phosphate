import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { RootState } from 'src/store';

import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { getDispute, getPoandsample, updateDispute } from 'src/features/marketing/DisputeSlice';
import { validateDisputeForm } from './Validation';
import { ImageUrl } from 'src/constants/contant';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
}

const selectStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

const priorityOptions = [
  {
    value: 'high',
    label: 'High',
    color: '#dc2626',
  },
  {
    value: 'medium',
    label: 'Medium',
    color: '#f59e0b',
  },
  {
    value: 'low',
    label: 'Low',
    color: '#16a34a',
  },
];

const formatPriority = (option: any) => (
  <div className="flex items-center gap-2">
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: option.color,
      }}
    />
    {option.label}
  </div>
);

const disputeStatusOptions = [
  {
    value: 'open',
    label: 'Open',
    color: '#2563eb',
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    color: '#f59e0b',
  },
  {
    value: 'resolved',
    label: 'Resolved',
    color: '#16a34a',
  },
  {
    value: 'closed',
    label: 'Closed',
    color: '#6b7280',
  },
];

const formatStatus = (option: any) => (
  <div className="flex items-center gap-2">
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: option.color,
      }}
    />
    {option.label}
  </div>
);

const DisputeEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  /* ================= REDUX ================= */

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  const poandsample = useSelector((state: RootState) => state.disputes?.poandsample) ?? [];

  // Marketing users only
  const users = usersdata.filter((user: any) => Number(user.role_id) === 9);

  useEffect(() => {
    dispatch(GetUsermodule());
  }, [dispatch]);

  const initialForm = {
    dispute_type: '',
    dispute_type_id: '',

    dispute_reason: '',

    assigned_to: '',

    priority: '',

    followups: [
      {
        followup_date: '',
        note: '',
        status: '',
      },
    ],
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (selectedRow && openModal) {
      setFormData({
        dispute_type: selectedRow.dispute_type || '',
        dispute_type_id: selectedRow.dispute_type_id || '',
        dispute_reason: selectedRow.dispute_reason || '',
        assigned_to: selectedRow.assigned_to || '',
        priority: selectedRow.priority || '',

        followups:
          selectedRow.followups && selectedRow.followups.length > 0
            ? JSON.parse(selectedRow.followups).map((f: any) => ({
                followup_date: f.followup_date || '',
                note: f.note || '',
                status: f.status || '',
              }))
            : [
                {
                  followup_date: '',
                  note: '',
                  status: '',
                },
              ],
      });
    }
  }, [selectedRow, openModal]);

  /* ================= FORM ================= */

  /* ================= GET PO / SAMPLE ================= */

  useEffect(() => {
    if (formData.dispute_type) {
      dispatch(
        getPoandsample({
          name: formData.dispute_type,
        }),
      );
    }
  }, [formData.dispute_type, dispatch]);

  /* ================= OPTIONS ================= */

  const poandsampleOptions = poandsample.map((item: any) => ({
    label: formData.dispute_type === 'po' ? item.po_no : item.sr_no,
    value: item.id,
    data: item,
  }));

  const usersOptions = users.map((u: any) => ({
    label: u.username,
    value: u.id,
  }));

  /* ================= HANDLERS ================= */

  const handleCustomerChange = (selected: any) => {
    const data = selected?.data;

    setFormData((prev) => ({
      ...prev,
      dispute_type_id: data?.id || '',
    }));
  };

  const handleFollowupChange = (followupIndex: number, field: string, value: any) => {
    const updated = [...formData.followups];

    updated[followupIndex] = {
      ...updated[followupIndex],
      [field]: value,
    };

    setFormData({
      ...formData,
      followups: updated,
    });
  };

  const addFollowup = () => {
    setFormData({
      ...formData,

      followups: [
        ...formData.followups,

        {
          followup_date: '',
          note: '',
          status: '',
        },
      ],
    });
  };

  const removeFollowup = (index: number) => {
    const updated = formData.followups.filter((_: any, i: number) => i !== index);

    setFormData({
      ...formData,
      followups: updated,
    });
  };

  const resetForm = () => {
    setFormData(initialForm);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateDisputeForm(formData, formData.followups)) return;
    try {
      const payload = new FormData();
      const id = selectedRow.id;
      payload.append('dispute_type', formData.dispute_type);
      payload.append('dispute_type_id', formData.dispute_type_id);
      payload.append('dispute_reason', formData.dispute_reason);
      payload.append('assigned_to', formData.assigned_to);
      payload.append('priority', formData.priority);

      payload.append('followups', JSON.stringify(formData.followups));

      if (pdfFile) {
        payload.append('pdf', pdfFile);
      }

      await dispatch(updateDispute({ id, data: payload })).unwrap();
      dispatch(getDispute());

      toast.success('Dispute Updated Successfully ✅');

      resetForm();

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create dispute');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)} popup={false}>
      <Modal.Header>Edit Dispute</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= BASIC DETAILS ================= */}

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-lg mb-4">Dispute Details</h3>

            <div className="grid grid-cols-12 gap-4">
              {/* TYPE */}

              <div className="col-span-3">
                <Label value="PO / Sample Type" />

                <select
                  className="w-full border rounded-md p-2"
                  value={formData.dispute_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dispute_type: e.target.value,
                    })
                  }
                >
                  <option value="">Select Type</option>

                  <option value="po">PO Number</option>

                  <option value="sample">Sample Number</option>
                </select>
              </div>

              {/* PO / SAMPLE SELECT */}

              <div className="col-span-3">
                <Label
                  value={
                    formData.dispute_type === 'po' ? 'Select PO Number' : 'Select Sample Number'
                  }
                />

                <Select
                  options={poandsampleOptions}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  value={poandsampleOptions.find(
                    (item: any) => item.value == formData.dispute_type_id,
                  )}
                  onChange={handleCustomerChange}
                />
              </div>

              {/* PRIORITY */}

              <div className="col-span-3">
                <Label value="Priority" />

                <Select
                  options={priorityOptions}
                  formatOptionLabel={formatPriority}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  value={priorityOptions.find((item: any) => item.value === formData.priority)}
                  onChange={(v: any) =>
                    setFormData({
                      ...formData,
                      priority: v?.value,
                    })
                  }
                />
              </div>

              {/* ASSIGNED TO */}

              <div className="col-span-3">
                <Label value="Assigned To (Sales Person)" />

                <Select
                  options={usersOptions}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  value={usersOptions.find((item: any) => item.value == formData.assigned_to)}
                  onChange={(v: any) =>
                    setFormData({
                      ...formData,
                      assigned_to: v?.value,
                    })
                  }
                />
              </div>

              {/* REASON */}

              <div className="col-span-8">
                <Label value="Dispute Reason" />

                <Textarea
                  rows={2}
                  placeholder="Write dispute reason..."
                  value={formData.dispute_reason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dispute_reason: e.target.value,
                    })
                  }
                />
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
                {selectedRow?.pdf_file && (
                  <a
                    href={`${ImageUrl}uploads/dispute/${selectedRow.pdf_file}`}
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

          {/* ================= FOLLOWUPS ================= */}

          <div className="bg-gray-50 rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Notes & Followups</h3>

              <Button color="primary" size="xs" type="button" onClick={addFollowup}>
                + Add Followup
              </Button>
            </div>

            <div className="space-y-4">
              {formData.followups.map((followup, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 border bg-white rounded-lg p-4">
                  {/* FOLLOWUP DATE */}

                  <div className="col-span-3">
                    <Label value="Followup Date" />

                    <TextInput
                      type="date"
                      value={followup.followup_date}
                      onChange={(e) => handleFollowupChange(index, 'followup_date', e.target.value)}
                    />
                  </div>

                  {/* STATUS */}

                  <div className="col-span-3">
                    <Label value="Status" />

                    <Select
                      options={disputeStatusOptions}
                      formatOptionLabel={formatStatus}
                      menuPortalTarget={document.body}
                      styles={selectStyles}
                      value={disputeStatusOptions.find(
                        (item: any) => item.value === followup.status,
                      )}
                      onChange={(v: any) => handleFollowupChange(index, 'status', v?.value)}
                    />
                  </div>

                  {/* NOTE */}

                  <div className="col-span-5">
                    <Label value="Note" />

                    <Textarea
                      rows={2}
                      placeholder="Write followup note..."
                      value={followup.note}
                      onChange={(e) => handleFollowupChange(index, 'note', e.target.value)}
                    />
                  </div>

                  {/* REMOVE */}

                  <div className="col-span-1 flex items-end">
                    {index > 0 && (
                      <Button
                        color="failure"
                        size="xs"
                        type="button"
                        onClick={() => removeFollowup(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= ACTION ================= */}

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button color="gray" type="button" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Update Dispute
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default DisputeEditModal;
