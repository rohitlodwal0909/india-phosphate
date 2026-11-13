import { Modal, ModalBody, ModalHeader } from 'flowbite-react';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewProductionPlanning = ({ openModal, setOpenModal, selectedRow }: Props) => {
  const existingItems = Array.isArray(selectedRow?.items) ? selectedRow.items : [];

  return (
    <Modal size="7xl" show={openModal} position="center" onClose={() => setOpenModal(false)}>
      <ModalHeader className="text-center font-semibold text-gray-800">
        Production Planning Details
      </ModalHeader>

      <ModalBody>
        <div className="bg-white rounded-lg">
          {/* Planning Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Planning Date</label>

            <p className="text-gray-900">
              {selectedRow?.date ? new Date(selectedRow.date).toLocaleDateString() : '-'}
            </p>
          </div>

          {/* Production Items */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Production Items</h3>

            {existingItems.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        #
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Work Order No.
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Equipment
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Material
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Quality
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Target
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Batch No.
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Labour Count
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Name of Person
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Morning Output
                      </th>

                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Evening Output
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {existingItems.map((item: any, index: number) => (
                      <tr key={item.id ?? index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b text-gray-700">{index + 1}</td>

                        <td className="px-4 py-3 border-b font-medium text-gray-900">
                          {item.work_order_no || '-'}
                        </td>

                        <td className="px-4 py-3 border-b text-gray-700">
                          {item.Equipment?.name || item.Equipment?.equipment_name || item.equipment_id || '-'}
                        </td>

                        <td className="px-4 py-3 border-b text-gray-700">
                          {item.Product?.product_name || item.material_id || '-'}
                        </td>

                        <td className="px-4 py-3 border-b text-gray-700">{item.quality || '-'}</td>

                        <td className="px-4 py-3 border-b text-gray-700">{item.target || '-'}</td>

                        <td className="px-4 py-3 border-b text-gray-700">{item.batch_no || '-'}</td>

                        <td className="px-4 py-3 border-b text-gray-700">{item.labours || '-'}</td>

                        <td className="px-4 py-3 border-b text-gray-700">
                          {item.name_of_person || '-'}
                        </td>

                        <td className="px-4 py-3 border-b text-gray-700">
                          {item.output_morning || '-'}
                        </td>

                        <td className="px-4 py-3 border-b text-gray-700">
                          {item.output_evening || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 border border-gray-200 rounded-lg">
                No production items found.
              </div>
            )}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewProductionPlanning;
