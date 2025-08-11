import {
 
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
  supplierdata:any
};

const ViewStoreModel = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  supplierdata
}: Props) => {
  return (
    <div>
      <Modal
      size="3xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
        View Store Details
      </ModalHeader>
      <ModalBody>
        <div className=" mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ["Supplier Name", selectedRow?.supplier_name ? supplierdata?.find(items=> items.id == selectedRow?.supplier_name)?.supplier_name :""],
              ["GRN Number", selectedRow?.grn_number],
              ["GRN Date", selectedRow?.grn_date],
              ["GRN Time", selectedRow?.grn_time],
              ["Manufacturer Name", selectedRow?.manufacturer_name],
              ["Invoice Number", selectedRow?.invoice_number],
              ["Guard Entry ID", selectedRow?.guard_entry_id],
              ["Batch Number", selectedRow?.batch_number],
              ["Store RM Code", selectedRow?.store_rm_code],
              ["QA/QC Status", selectedRow?.qa_qc_status],
              // ["Container Count", selectedRow?.container_count],
              // ["Container Unit", selectedRow?.container_unit],
              ["Quantity", selectedRow?.quantity],
              ["Unit", selectedRow?.unit],
              ["Remaining quantity", selectedRow?.pending_quantity || 0],
              ["Remarks", selectedRow?.remarks],
              // ["Store Location", selectedRow?.store_location],
              // ["Manufacturing Date", selectedRow?.mfg_date],
              // ["Expiry Date", selectedRow?.exp_date],
            
            ].map(([label, value]) => (
              <div key={label}>
                <label className="block text-sm font-medium text-black-900 mb-1">
                  {label}
                </label>
                <p className="text-gray-900">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </Modal>
    </div>
  );
};

export default ViewStoreModel;
