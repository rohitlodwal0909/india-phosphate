import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Label,
  TextInput,
  Select,
  Textarea,
} from 'flowbite-react';
import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

type Props = {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
};

const ledgerGroups = [
  'Bank Accounts',
  'Bank OD Accounts',
  'Branch / Divisions',
  'Capital Account',
  'Cash-in-Hand',
  'Current Assets',
  'Current Liabilities',
  'Deposits (Asset)',
  'Direct Expenses',
  'Direct Incomes',
  'Duties & Taxes',
  'Expenses (Direct)',
  'Expenses (Indirect)',
  'Fixed Assets',
  'Indirect Expenses',
  'Indirect Income',
  'Investments',
  'Loans & Advances (Asset)',
  'Loans (Liability)',
  'Misc. Expenses (Asset)',
  'Provisions',
  'Purchase Accounts',
  'Reserves & Surplus',
  'Retained Earnings',
  'Sales Accounts',
  'Secured Loans',
  'Stock-in-Hand',
  'Sundry Creditors',
  'Sundry Debtors',
  'Suspense Account',
  'Unsecured Loans',

  // GST Specific
  'GST Input CGST',
  'GST Input SGST',
  'GST Input IGST',
  'GST Output CGST',
  'GST Output SGST',
  'GST Output IGST',

  // TDS / TCS
  'TDS Receivable',
  'TDS Payable',
  'TCS Receivable',
  'TCS Payable',

  // Chemical Industry Specific
  'Raw Material Purchase',
  'Packing Material Purchase',
  'Consumables Purchase',
  'Production Expenses',
  'Factory Overheads',
  'Freight Inward',
  'Freight Outward',
  'Transport Charges',
  'Export Sales',
  'Domestic Sales',
  'Commission Expenses',
  'Brokerage Expenses',
  'Quality Control Expenses',
  'Laboratory Expenses',
  'Employee Salary',
  'Wages Expenses',
  'Electricity Expenses',
  'Fuel Expenses',
  'Repair & Maintenance',
  'Insurance Expenses',
  'Interest Expenses',
  'Forex Gain',
  'Forex Loss',
  'Round Off Account',
  'Bad Debts',
  'Discount Allowed',
  'Discount Received',
];

const voucherTypes = [
  'Purchase',
  'Sales',
  'Payment',
  'Receipt',
  'Journal',
  'Contra',
  'Debit Note',
  'Credit Note',
];

const AddLedgerModel = ({ placeModal, setPlaceModal }: Props) => {
  const [formData, setFormData] = useState({
    transaction_date: '',
    voucher_no: '',
    voucher_type: '',
    reference_no: '',

    ledger_name: '',
    ledger_group: '',

    debit_amount: '',
    credit_amount: '',

    payment_status: '',
    particulars: '',
  });

  const balance = useMemo(() => {
    const debit = Number(formData.debit_amount || 0);
    const credit = Number(formData.credit_amount || 0);
    return debit - credit;
  }, [formData.debit_amount, formData.credit_amount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.transaction_date) {
      toast.error('Transaction Date is required');
      return;
    }

    if (!formData.ledger_name) {
      toast.error('Ledger Name is required');
      return;
    }

    console.log({
      ...formData,
      balance,
    });

    toast.success('Ledger Entry Saved Successfully');

    setPlaceModal(false);
  };

  return (
    <Modal show={placeModal} size="7xl" onClose={() => setPlaceModal(false)}>
      <ModalHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Icon icon="solar:wallet-money-bold" width={22} className="text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">Create Ledger Entry</h3>
            <p className="text-xs text-gray-500">Accounting Voucher Transaction Entry</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-5">
          {/* Voucher Information */}
          <div className="border rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:document-bold" width={18} />
              <h4 className="font-semibold">Voucher Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label value="Transaction Date *" />
                <TextInput
                  type="date"
                  name="transaction_date"
                  value={formData.transaction_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Voucher No" />
                <TextInput
                  placeholder="JV-0001"
                  name="voucher_no"
                  value={formData.voucher_no}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Voucher Type" />
                <Select name="voucher_type" value={formData.voucher_type} onChange={handleChange}>
                  <option value="">Select Type</option>

                  {voucherTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label value="Reference No" />
                <TextInput
                  placeholder="REF-1001"
                  name="reference_no"
                  value={formData.reference_no}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Ledger Information */}
          <div className="border rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:user-id-bold" width={18} />
              <h4 className="font-semibold">Ledger Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="Ledger Name *" />
                <TextInput
                  placeholder="ABC Chemicals Pvt Ltd"
                  name="ledger_name"
                  value={formData.ledger_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Ledger Group" />
                <Select name="ledger_group" value={formData.ledger_group} onChange={handleChange}>
                  <option value="">Select Ledger Group</option>

                  {ledgerGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Amount Information */}
          <div className="border rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:dollar-bold" width={18} />
              <h4 className="font-semibold">Amount Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label value="Debit Amount" />
                <TextInput
                  type="number"
                  placeholder="0"
                  name="debit_amount"
                  value={formData.debit_amount}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Credit Amount" />
                <TextInput
                  type="number"
                  placeholder="0"
                  name="credit_amount"
                  value={formData.credit_amount}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label value="Balance" />
                <TextInput readOnly value={balance.toString()} />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:check-circle-bold" width={18} />
              <h4 className="font-semibold">Status Information</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="Payment Status" />
                <Select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Notpaid">Not Paid</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Narration */}
          <div className="border rounded-xl p-5 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="solar:notes-bold" width={18} />
              <h4 className="font-semibold">Narration / Particulars</h4>
            </div>

            <Textarea
              rows={5}
              name="particulars"
              value={formData.particulars}
              onChange={handleChange}
              placeholder="Enter narration, remarks, transaction details..."
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="border-t flex justify-between">
        <div className="text-sm text-gray-500">Fields marked with * are mandatory</div>

        <div className="flex gap-3">
          <Button color="gray" onClick={() => setPlaceModal(false)}>
            Cancel
          </Button>

          <Button color="primary" onClick={handleSubmit}>
            <Icon icon="solar:diskette-bold" width={18} className="mr-2" />
            Save Ledger Entry
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default AddLedgerModel;
