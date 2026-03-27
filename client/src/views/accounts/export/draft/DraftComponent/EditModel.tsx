import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { Icon } from '@iconify/react';
import { ImageUrl } from 'src/constants/contant';
import { toast } from 'react-toastify';
import {
  getDraftPackingList,
  updateDraftPackingList,
} from 'src/features/account/exportinvoice/draft';

type Props = {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
  editData?: any;
};

const EditModel = ({ placeModal, setPlaceModal, editData }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
    file: null as File | null,
  });

  /* ================= Load Edit Data ================= */
  useEffect(() => {
    if (editData && placeModal) {
      setFormData({
        name: editData.name || '',
        file: null, // cannot prefill file input
      });
    }
  }, [editData, placeModal]);

  /* ================= Handlers ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };

  /* ================= Submit ================= */

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);

    // ✅ File optional in edit
    if (formData.file) {
      payload.append('excel', formData.file);
    }

    try {
      await dispatch(
        updateDraftPackingList({
          id: editData.id,
          data: payload,
        }),
      ).unwrap();

      toast.success('Draft packing list updated successfully');

      await dispatch(getDraftPackingList());

      handleClose();
    } catch (error: any) {
      toast.error(error || 'Update failed');
    }
  };

  /* ================= Close Modal ================= */

  const handleClose = () => {
    setPlaceModal(false);
    setFormData({
      name: '',
      file: null,
    });
  };

  /* ================= UI ================= */

  return (
    <Modal show={placeModal} size="2xl" popup position="center" onClose={handleClose}>
      <ModalHeader className="border-b">
        <div className="flex items-center gap-2">
          <Icon icon="solar:pen-bold" width={22} />
          Edit Draft Packing List
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6 py-2">
          {/* Invoice Name */}
          <div>
            <Label value="Packing List Name" className="mb-2 block font-medium" />
            <TextInput
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter packing list name"
              sizing="lg"
            />
          </div>

          {/* Upload Excel */}
          <div>
            <Label value="Replace Excel File (Optional)" className="mb-2 block font-medium" />

            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="text-center">
                <Icon
                  icon="material-symbols:upload-file-rounded"
                  width={45}
                  className="text-gray-400 mb-2"
                />

                <p className="text-sm font-semibold text-gray-700">
                  Click to upload new Excel file
                </p>

                <p className="text-xs text-gray-500">Leave empty to keep existing file</p>

                {formData.file && (
                  <p className="mt-3 text-green-600 text-sm font-medium">✔ {formData.file.name}</p>
                )}
              </div>

              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Current File */}
          {editData?.file && (
            <div className="bg-blue-50 border rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Current File</span>

              <a
                href={`${ImageUrl}${editData.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-semibold flex items-center gap-1"
              >
                <Icon icon="solar:eye-bold" width={18} />
                View File
              </a>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter className="border-t flex justify-end gap-3">
        <Button color="gray" onClick={handleClose}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSubmit}>
          <Icon icon="solar:pen-bold" width={18} className="mr-2" />
          Update Invoice
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModel;
