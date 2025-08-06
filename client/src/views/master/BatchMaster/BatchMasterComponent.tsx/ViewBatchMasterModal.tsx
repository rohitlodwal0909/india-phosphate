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
  Statedata: any;
 
};

const ViewBatchMasterModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,

}: Props) => {
  const fields = [
    ["BMR Number", selectedRow?.bmr_number],
    ["Batch Number", selectedRow?.batch_number],
    ["Product Name", selectedRow?.product_name],
    ["Production Date", selectedRow?.production_date],
    ["Expiry Date", selectedRow?.expiry_date],
    ["Quantity Produced", selectedRow?.quantity_produced],
    [
      "Raw Materials Used",
      Array.isArray(selectedRow?.raw_materials)
        ? selectedRow.raw_materials.join(", ")
        : selectedRow?.raw_materials || "-",
    ],
    ["Process Details", selectedRow?.process_details],
    ["Verified By", selectedRow?.verified_by],
    ["Approved By", selectedRow?.approved_by],
    ["Status", selectedRow?.status],
    ["Created At", selectedRow?.createdAt],
    ["Updated At", selectedRow?.updatedAt],
    ["Deleted At", selectedRow?.deletedAt || "-"],
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
        BatchMaster Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="BatchMaster View"
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

export default ViewBatchMasterModal;
