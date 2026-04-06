import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';

type Props = {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewModal = ({ placeModal, setPlaceModal, selectedRow }: Props) => {
  /* ================= SAFE PRODUCTS PARSE ================= */

  /* ================= FORMAT HELPER ================= */

  const formatQty = (name?: string, qty?: number | string, unit?: string) => {
    if (!name) return '-';
    return `${name} (${qty ?? '-'} ${unit ?? ''})`;
  };

  /* ================= BASIC FIELDS ================= */

  const fields = [
    ['Product Name', selectedRow?.Product?.product_name || '-'],

    [
      'RM (Qty)',
      formatQty(selectedRow?.RmCode?.rm_code, selectedRow?.rm_qty, selectedRow?.rm_unit),
    ],

    ['PM (Qty)', formatQty(selectedRow?.PmCode?.name, selectedRow?.pm_qty, selectedRow?.pm_unit)],

    [
      'Equipment (Qty)',
      formatQty(
        selectedRow?.Equipment?.name,
        selectedRow?.equipment_qty,
        selectedRow?.equipment_unit,
      ),
    ],

    ['Address', selectedRow?.address || '-'],
    ['Application', selectedRow?.application || '-'],
    ['Expected Arrival Date', selectedRow?.expected_arrival_date || '-'],
    ['Remark', selectedRow?.remark || '-'],
  ];

  return (
    <Modal size="6xl" show={placeModal} position="center" onClose={() => setPlaceModal(false)}>
      <ModalHeader className="text-2xl font-bold">PO Requisition Details</ModalHeader>

      <ModalBody>
        <Tabs variant="underline">
          {/* ================= QUOTATION INFO ================= */}

          <TabItem
            active
            title="PO Requisition"
            icon={() => <Icon icon="mdi:file-document-outline" height={20} />}
          >
            {/* ================= BASIC DETAILS ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
              {fields.map(([label, value]) => (
                <div key={label as string} className="bg-gray-50 rounded-md p-4 shadow-sm">
                  <p className="text-sm text-gray-500 font-semibold">{label}</p>
                  <p className="text-base font-medium mt-1">{value as string}</p>
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

export default ViewModal;
