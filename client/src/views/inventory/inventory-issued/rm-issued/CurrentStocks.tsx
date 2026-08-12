import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreRM } from 'src/features/Inventorymodule/InventoryIssued/RMIssueSlice';
import { AppDispatch, RootState } from 'src/store';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
};

type RMItem = {
  id: number;
  name: string;
  total_quantity: number;
  unit: string;
};

const CurrentStocks = ({ openModal, setOpenModal }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const storeRawMaterial = useSelector((state: RootState) => state.rmissue.storerm) as RMItem[];

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(getStoreRM());
  }, [dispatch]);

  const filteredStocks = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return storeRawMaterial || [];
    }
    return (storeRawMaterial || []).filter((item) => item.name?.toLowerCase().includes(search));
  }, [storeRawMaterial, searchText]);

  return (
    <Modal size="3xl" show={openModal} position="center" onClose={() => setOpenModal(false)}>
      <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
        Current Raw Material Stocks
      </ModalHeader>

      <ModalBody>
        <div className="mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md">
          {/* Search */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search raw material..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-96 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Stocks */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((item) => (
                  <div key={item.id} className="border p-3 sm:p-4 rounded-md bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {item.name}
                    </label>

                    <p className="text-gray-900 font-semibold">
                      Available: {item.total_quantity ?? 0} {item.unit || ''}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-2 py-8">
                  {searchText ? 'No matching raw material found' : 'No stock data available'}
                </p>
              )}
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default CurrentStocks;
