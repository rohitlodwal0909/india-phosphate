import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import {
  createDraftPackingList,
  getDraftPackingList,
} from 'src/features/account/exportinvoice/draft';
type Props = {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
};

const CreateModel = ({ placeModal, setPlaceModal }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
    file: null as File | null,
  });

  /* ================= Handlers ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.file) {
      toast.error('Please select Excel file');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('excel', formData.file);

    try {
      await dispatch(createDraftPackingList(payload)).unwrap();

      toast.success('Packing List uploaded successfully');

      dispatch(getDraftPackingList());

      setFormData({ name: '', file: null });
      setPlaceModal(false);
    } catch (error: any) {
      toast.error(error || 'Upload failed');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal
      show={placeModal}
      size="2xl"
      position={'center'}
      popup
      onClose={() => setPlaceModal(false)}
    >
      <ModalHeader className="border-b">
        <div className="flex items-center gap-2">
          <Icon icon="solar:upload-bold" width={22} />
          Upload Packing List
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6 py-2">
          {/* Invoice Name */}
          <div>
            <Label value="Name" className="mb-2 block font-medium" />
            <TextInput
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              sizing="lg"
            />
          </div>

          {/* Upload Box */}
          <div>
            <Label value="Upload Excel File" className="mb-2 block font-medium" />

            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <Icon
                  icon="material-symbols:upload-file-rounded"
                  width={45}
                  className="text-gray-400 mb-2"
                />

                <p className="mb-1 text-sm font-semibold text-gray-700">
                  Click to upload Excel file
                </p>

                <p className="text-xs text-gray-500">XLSX or XLS only</p>

                {formData.file && (
                  <div className="mt-3 text-green-600 text-sm font-medium">
                    ✔ {formData.file.name}
                  </div>
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
        </div>
      </ModalBody>

      <ModalFooter className="border-t flex justify-end gap-3">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSubmit}>
          <Icon icon="solar:upload-bold" width={18} className="mr-2" />
          Upload
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModel;
