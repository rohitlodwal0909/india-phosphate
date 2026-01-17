import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  storeRawMaterial: any[];
};

const CurrentStocks = ({ openModal, setOpenModal, storeRawMaterial }: Props) => {
  return (
    <Modal size="3xl" show={openModal} position="center" onClose={() => setOpenModal(false)}>
      <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
        Current PM Stocks
      </ModalHeader>

      <ModalBody>
        <div className="mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {storeRawMaterial?.length > 0 ? (
              storeRawMaterial.map((item: any) => (
                <div key={item.id} className="border p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.name}
                  </label>
                  <p className="text-gray-900 font-semibold">
                    Available: {item.total_quantity ?? 0} {item.unit ?? 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2">No stock data available</p>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter />
    </Modal>
  );
};

export default CurrentStocks;
