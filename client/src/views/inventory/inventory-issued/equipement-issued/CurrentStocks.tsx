import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useMemo, useState } from 'react';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  storeequipments: any[];
};

const CurrentStocks = ({ openModal, setOpenModal, storeequipments }: Props) => {
  const [searchText, setSearchText] = useState('');

  const filteredStocks = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return storeequipments || [];
    }

    return (storeequipments || []).filter((item) => item.name?.toLowerCase().includes(search));
  }, [storeequipments, searchText]);

  return (
    <Modal size="3xl" show={openModal} position="center" onClose={() => setOpenModal(false)}>
      <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
        Current Equipment Stocks
      </ModalHeader>

      <ModalBody>
        <div className="mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-96 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredStocks?.length > 0 ? (
              filteredStocks.map((item: any) => (
                <div key={item.id} className="border p-4 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.name}
                  </label>
                  <p className="text-gray-900 font-semibold">
                    Available: {item.total_quantity ?? 0} {item.unit || 'no Unit'}
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
