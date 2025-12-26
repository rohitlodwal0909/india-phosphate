import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tabs,
  TabItem,
} from "flowbite-react";
import { Icon } from "@iconify/react";

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
 
};

const ViewBmrMasterModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,

}: Props) => {

const fields = [
  ['BMR Code', selectedRow?.bmr_code],
  ['Product Name', selectedRow?.product_name],
  ['Batch Size', selectedRow?.batch_size],
  ['Equipment Used', selectedRow?.equipment_used],
  ['Raw Materials', selectedRow?.raw_materials],
  ['Process Steps', selectedRow?.process_steps],
  ['Packaging Details', selectedRow?.packaging_details],
  ['QA/QC Signoff', selectedRow?.qa_qc_signoff],
  ['Remarks', selectedRow?.remarks],
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
        BMR Master Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="BMR Master View"
            icon={() => <Icon icon="solar:shield-user-outline" height={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {fields.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-500 font-semibold">{label}</p>
                  <p className="text-base text-gray-800 mt-1 font-medium break-words">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>
          </TabItem>
        </Tabs>
      </ModalBody>
      <ModalFooter className="justify-center">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewBmrMasterModal;
