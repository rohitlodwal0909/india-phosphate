import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
  Statedata: any;
};

const ViewCompanyModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  Statedata,
}: Props) => {
  Statedata;

  const selected = Statedata.find((item: any) => item.id === parseInt(selectedRow?.state_id));
  const fields = [
    ['Company Name', selectedRow?.company_name],
    ['Company Code', selectedRow?.company_code],
    ['Status', selectedRow?.status],
    ['Phone', selectedRow?.phone],
    ['Email', selectedRow?.email],
    ['GST Number', selectedRow?.gst_number],
    ['CIN Number', selectedRow?.cin_number],
    ['TIN Number', selectedRow?.tin_number],
    ['DIN Number', selectedRow?.din_number],
    ['MSME registration', selectedRow?.msme_reg],
    ['Domestic', selectedRow?.domestic],
    ['Address', selectedRow?.address],
    ['Pan card', selectedRow?.pan_number],
    ['Create by', selectedRow?.created_by_username],
    ['City', selectedRow?.city],
    ['State', selected?.state_name],
    ['Country', selectedRow?.country],
  ];

  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="overflow-x-hidden"
    >
      <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
        Company Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Company View"
            icon={() => <Icon icon="solar:shield-user-outline" height={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {fields?.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-500 font-semibold">{label}</p>
                  <p className="text-base text-gray-800 mt-1 font-medium break-words">
                    {value || '-'}
                  </p>
                </div>
              ))}
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

export default ViewCompanyModal;
