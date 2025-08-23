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

const ViewPendingOrderModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
}: Props) => {
  const fields = [
    ["Order Number", selectedRow?.order_number],
    ["Customer Name ", selectedRow?.customer_name_or_id],
    ["Order Date", selectedRow?.order_date],
    ["Expected Delivery Date", selectedRow?.expected_delivery_date],
    ["Products Ordered", selectedRow?.products_ordered],
    ["Total Quantity", selectedRow?.total_quantity],
    ["Quantity Delivered", selectedRow?.quantity_delivered],
    [
      "Quantity Pending",
      selectedRow?.total_quantity && selectedRow?.quantity_delivered
        ? selectedRow.total_quantity - selectedRow.quantity_delivered
        : "-",
    ],
    ["Remarks", selectedRow?.remarks || "-"],
    ["Order Status", selectedRow?.order_status],
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
        Pending Order Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Pending Order View"
            icon={() => <Icon icon="solar:clipboard-text-outline" height={20} />}
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

export default ViewPendingOrderModal;
