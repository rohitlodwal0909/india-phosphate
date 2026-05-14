import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadCoaPdf } from 'src/features/marketing/SampleRequestSlice';
import { ImageUrl } from 'src/constants/contant';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  row: any;
}

const SampleQcModal: React.FC<Props> = ({ openModal, setOpenModal, row }) => {
  const dispatch = useDispatch<any>();

  /* ================= STATE ================= */

  const initialState = {
    sample_id: null,
    sample_given: '',
    qc_remark: '',
    coa_file: null as File | null,
  };

  const [formData, setFormData] = useState(initialState);

  /* ================= LOAD EDIT DATA ================= */

  useEffect(() => {
    if (row && openModal) {
      setFormData({
        sample_id: row.id,
        sample_given: row.qc_status || '',
        qc_remark: row.qc_remark || '',
        coa_file: null,
      });
    }
  }, [row, openModal]);

  /* ================= CLOSE ================= */

  const closeModal = () => {
    setFormData(initialState);
    setOpenModal(false);
  };

  /* ================= SUBMIT ================= */

  const submit = async (e: any) => {
    e.preventDefault();

    /* ===== VALIDATION ===== */

    if (!formData.sample_given) {
      toast.error('Select sample status');
      return;
    }

    try {
      const fd = new FormData();

      fd.append('sample_id', String(formData.sample_id));
      fd.append('sample_given', formData.sample_given);
      fd.append('qc_remark', formData.qc_remark || '');

      // Only append when new file selected
      if (formData.coa_file) {
        fd.append('coa_pdf', formData.coa_file);
      }

      await dispatch(uploadCoaPdf(fd)).unwrap();

      toast.success(row?.qc_coa_pdf ? 'QC Updated Successfully ✅' : 'QC Created Successfully ✅');

      closeModal();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save');
    }
  };

  /* ================= FILE URL ================= */

  const fileUrl = row?.qc_coa_pdf && `${ImageUrl}uploads/coa_pdf/${row.qc_coa_pdf}`;

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="3xl" onClose={closeModal}>
      <Modal.Header>
        <div className="text-xl font-semibold">Sample QC Action</div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={submit} className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-lg border">
            <div className="grid grid-cols-12 gap-4">
              {/* SAMPLE GIVEN */}
              <div className="col-span-12">
                <Label value="Sample Given" />

                <select
                  className="w-full border rounded p-2"
                  value={formData.sample_given}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sample_given: e.target.value,
                    }))
                  }
                >
                  <option value="">Select</option>
                  <option value="given">Given</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* EXISTING COA */}
              {row?.qc_coa_pdf && (
                <div className="col-span-12">
                  <Label value="Uploaded COA" />

                  <div className="flex items-center gap-3">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline font-medium"
                    >
                      View COA File
                    </a>

                    <span className="text-green-600 text-sm">(Already Uploaded)</span>
                  </div>
                </div>
              )}

              {/* UPLOAD NEW FILE */}
              <div className="col-span-12">
                <Label value="Upload / Replace COA" />

                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="w-full border rounded p-2"
                  onChange={(e: any) =>
                    setFormData((prev) => ({
                      ...prev,
                      coa_file: e.target.files[0],
                    }))
                  }
                />
              </div>

              {/* REMARK */}
              <div className="col-span-12">
                <Label value="QC Remark" />

                <Textarea
                  value={formData.qc_remark}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      qc_remark: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              {row?.qc_coa_pdf ? 'Update QC' : 'Save QC'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SampleQcModal;
