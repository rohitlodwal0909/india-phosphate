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
   itemList:any;
  locationList:any;
};

const ViewStockMasterModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  itemList,
  locationList,
}: Props) => {

  const rawDate = selectedRow?.last_updated_at;
const dateObj = new Date(rawDate);

// Format date as DD-MM-YYYY
const formattedDate = dateObj.toLocaleDateString('en-GB'); // gives "20/08/2025"
const formattedDateDashed = formattedDate.replace(/\//g, '-'); // "20-08-2025"

// Format time as hh:mm AM/PM
const formattedTime = dateObj.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}); // "03:12 PM"
  const fields = [

    ["Item Type", selectedRow?.item_type],
    ["Item ID", selectedRow?.item_id ? itemList?.find(item => item?.id == selectedRow?.item_id)?.rm_code : ""],
    ["Item Name", selectedRow?.item_name],
    ["Item Code", selectedRow?.item_code],
    ["Batch Number", selectedRow?.batch_no],
    ["Purchase number", selectedRow?.purchase_number],
    ["Material Name", selectedRow?.material_name],
    ["GST number", selectedRow?.gst_no],

    ["UOM", selectedRow?.uom],
    ["Quantity In Stock", selectedRow?.quantity_in_stock],
    ["Minimum Stock Level", selectedRow?.minimum_stock_level],
    ["Reorder Level", selectedRow?.reorder_level],
    ["Location ID", selectedRow?.location_id ?  locationList?.find(item => item?.id == selectedRow?.location_id ).name : "" ],
    ["Rack No", selectedRow?.rack_no],
    ["Expiry Date", selectedRow?.expiry_date],
    ["Last Updated By", selectedRow?.created_by_username],
    [ "Last Updated At", `${formattedDateDashed} ${formattedTime}` ],
    ["Status", selectedRow?.status],
    
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

export default ViewStockMasterModal;
