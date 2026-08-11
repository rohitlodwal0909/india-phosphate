import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFinishedStock } from 'src/features/Inventorymodule/InventoryIssued/FMIssuedSlice';
import { AppDispatch, RootState } from 'src/store';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
};

const CurrentStocks = ({ openModal, setOpenModal }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState('');

  const { finishedstock } = useSelector((state: RootState) => state.issuedFM) as any;

  const filteredStocks = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return finishedstock || [];
    }

    return (finishedstock || []).filter(
      (item) =>
        item.batch_no?.toLowerCase().includes(search) ||
        item.product_name?.toLowerCase().includes(search),
    );
  }, [finishedstock, searchText]);

  useEffect(() => {
    dispatch(getFinishedStock());
  }, [dispatch]);

  return (
    <Modal size="3xl" show={openModal} position="center" onClose={() => setOpenModal(false)}>
      <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
        Current Finished Material Stocks
      </ModalHeader>

      <ModalBody>
        <div className="mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search finish material..."
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
                    {item.batch_no}
                  </label>
                  <p className="text-gray-900 font-semibold">
                    Available: {item.remaining_qty ?? 0}
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
