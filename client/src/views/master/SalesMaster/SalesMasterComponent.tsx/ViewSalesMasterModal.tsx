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
  CustomerData:any
};

const ViewSalesMasterModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  CustomerData
}: Props) => {

 const fields = [
  ['Invoice No', selectedRow?.invoice_no],
  ['Invoice Date', selectedRow?.invoice_date],
  ['Customer Name', selectedRow?.customer_id ? CustomerData.find(items => items?.id == selectedRow?.customer_id )?.customer_name :""],
  ['Payment Mode', selectedRow?.payment_mode],
  ['Subtotal Amount', selectedRow?.subtotal_amount],
  ['Tax Amount', selectedRow?.tax_amount],
  // ['Discount Amount', selectedRow?.discount_amount],
  ['Grand Total', selectedRow?.grand_total],
  ['Paid Amount', selectedRow?.paid_amount],
  // ['Balance Amount', selectedRow?.balance_amount],
  ['Status', selectedRow?.status],
  ['Remarks', selectedRow?.remarks],
  // ['Created By', selectedRow?.created_by],
  // ['Created At', selectedRow?.created_at],
  // ['Updated At', formattedDateDashed + ' ' + formattedTime],
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
        Stock Master Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Stock Master View"
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

export default ViewSalesMasterModal;
