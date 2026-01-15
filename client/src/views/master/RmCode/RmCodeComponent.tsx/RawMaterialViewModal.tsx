import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { rawmaterialdelete } from 'src/features/master/RmCode/RmCodeSlice';
import { AppDispatch } from 'src/store';
import { useEffect, useState } from 'react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const RawMaterialViewModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rawmaterialList, setRawmaterialList] = useState<any[]>([]);

  useEffect(() => {
    setRawmaterialList(selectedRow?.rawMaterials || []);
  }, [selectedRow]);

  const handleOndelete = async (id: number) => {
    await dispatch(rawmaterialdelete(id));
    setRawmaterialList((prev) => prev.filter((item) => item.id !== id));
    toast.success('Raw Material entry deleted');
  };

  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="overflow-x-hidden"
    >
      <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
        Raw Material Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            title="Raw Material "
            icon={() => <Icon icon="solar:graph-linear" height={20} />}
          >
            <div className="space-y-4">
              {rawmaterialList?.length === 0 ? (
                <p className="text-gray-500">No follow-up data available.</p>
              ) : (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full text-sm text-left text-gray-800 border border-gray-300">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                      <tr>
                        <th className="px-4 py-3 border">#</th>
                        <th className="px-4 py-3 border">RM Code</th>
                        <th className="px-4 py-3 border">Type</th>
                        <th className="px-4 py-3 border">Test</th>
                        <th className="px-4 py-3 border">Limit</th>
                        <th className="px-4 py-3 border">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rawmaterialList.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border">{index + 1}</td>
                          <td className="px-4 py-2 border break-words">{selectedRow?.rm_code}</td>
                          <td className="px-4 py-2 border capitalize">
                            {item.type == 1 ? 'Raw Material' : 'Physical Properties'}
                          </td>
                          <td className="px-4 py-2 border">{item?.test || '-'}</td>
                          <td className="px-4 py-2 border capitalize">{item?.limit}</td>
                          <td className="px-4 py-2 border capitalize">
                            <Button
                              size="sm"
                              color="lighterror"
                              className="p-0"
                              onClick={() => {
                                handleOndelete(item?.id);
                              }}
                            >
                              <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabItem>
        </Tabs>
        <div className="rounded-lg  n px-2">
          <div className="bg-white shadow rounded p-4"></div>
        </div>
      </ModalBody>
      <ModalFooter className="justify-center">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RawMaterialViewModal;
