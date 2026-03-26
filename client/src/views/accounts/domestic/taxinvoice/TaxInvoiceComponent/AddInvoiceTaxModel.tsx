import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect, useState } from 'react';
import InvoiceModel from './InvoiceModel';
import Productsandcharges from './Productsandcharges';
import { toast } from 'react-toastify';
import {
  createInvoice,
  getInvoice,
  updateInvoice,
} from '../../../../../features/account/invoice/taxinvoice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';

const AddInvoiceTaxModel = ({ show, setShowmodal, data, type }) => {
  const [activeTab, setActiveTab] = useState('invoice');
  const dispatch = useDispatch<AppDispatch>();
  const invoice = useSelector((state: RootState) => state.taxinvoices.singleinvoice) as any;

  useEffect(() => {
    dispatch(getInvoice(data?.id));
  }, [dispatch]);

  useEffect(() => {
    if (invoice) {
      setFormData((prev) => ({
        ...prev,
        ...invoice,
      }));

      // ✅ Products set
      if (invoice?.InvoiceItems?.length) {
        setProducts(
          invoice.InvoiceItems.map((item) => ({
            kind_of_pkgs: item.kind_of_pkgs || '',
            product_name: item.product_id || '',
            hsn: item.hsn || '',
            qty: item.qty || '',
            rate: item.rate || '',
            per: item.per || 'kg',
            amount: item.amount || 0,
            batch_no: item.batch_no || '',
            mfg: item.mfg || '',
            exp: item.exp || '',
          })),
        );
      }

      // ✅ Charges set
      setCharges({
        insurance: invoice.insurance || '0.10%',
        freight: invoice.freight || '',
        round_off: invoice.round_off || '',
        gst_rate: invoice.gst_rate || '18',
      });
    }
  }, [invoice]);

  const [formData, setFormData] = useState({
    // Basic
    invoice_type: type,
    dispatch_id: data?.id,
    invoice_no: '',
    invoice_date: '',
    eway_bill: '',
    delivery_note: '',
    delivery_note_date: '',

    // IRN
    irn: '',
    ack_no: '',
    ack_date: '',

    // Party
    buyer: '',
    consignee: '',
    gst_type: '', // export / domestic

    // Payment
    payment_mode: '',
    payment_remark: '',

    // References
    reference_no: '',
    other_reference: '',
    buyer_order_no: '',
    buyer_order_date: '',

    // Dispatch
    dispatch_doc_no: '',
    dispatch_through: '',
    destination: '',
    country: '',

    // Export
    lut_no: '',
    from_to: '',

    // GST
    gst_rate: '',

    // Other
    terms_delivery: '',
  });

  const [products, setProducts] = useState([
    {
      kind_of_pkgs: '',
      product_name: '',
      hsn: '',
      qty: '',
      rate: '',
      per: 'kg',
      amount: 0,
      batch_no: '',
      mfg: '',
      exp: '',
    },
  ]);

  const [charges, setCharges] = useState({
    insurance: '0.10%',
    freight: '',
    round_off: '',
    gst_rate: '18',
  });

  const handleSubmit = async () => {
    if (!formData.invoice_no || !formData.invoice_date) {
      toast.error('Please fill invoice details');
      setActiveTab('invoice');
      return;
    }

    if (!products.length) {
      toast.error('At least 1 product add');
      setActiveTab('products');
      return;
    }

    const invalidProduct = products.find((p) => !p.product_name || !p.qty || !p.rate);

    if (invalidProduct) {
      toast.error('Complete product fields');
      setActiveTab('products');
      return;
    }

    const payload = {
      invoiceData: {
        ...formData,
        ...charges,
      },
      products,
    };

    try {
      // 🔥 UPDATE or CREATE
      if (invoice?.id) {
        await dispatch(updateInvoice({ id: invoice.id, data: payload })).unwrap();
        toast.success('Invoice updated successfully');
      } else {
        await dispatch(createInvoice(payload)).unwrap();
        toast.success('Invoice created successfully');
      }

      setShowmodal(false);
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={setShowmodal} size="7xl">
      <ModalHeader className="text-xl font-semibold text-gray-800">
        {invoice?.id ? 'Update Tax Invoice' : 'Create Tax Invoice'}
      </ModalHeader>

      <ModalBody className="bg-gray-50 rounded-lg">
        {' '}
        {/* 🔹 Tabs */}
        <div className="flex gap-6 mb-6 border-b">
          <button
            className={`pb-2 text-sm font-medium transition ${
              activeTab === 'invoice'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('invoice')}
          >
            Invoice Details
          </button>

          <button
            className={`pb-2 text-sm font-medium transition ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Products & Charges
          </button>
        </div>
        {/* 🔹 TAB 1 - Invoice */}
        {activeTab === 'invoice' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <InvoiceModel data={data} formData={formData} setFormData={setFormData} />
            </div>
          </>
        )}
        {/* 🔹 TAB 2 - Products */}
        {activeTab === 'products' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-sm border">
              <Productsandcharges
                products={products}
                setProducts={setProducts}
                charges={charges}
                setCharges={setCharges}
              />
            </div>
          </>
        )}
      </ModalBody>

      <ModalFooter className="flex justify-between">
        <Button color="gray" onClick={setShowmodal}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSubmit} className="px-6 font-semibold">
          {invoice?.id ? 'Update Invoice' : 'Save Invoice'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddInvoiceTaxModel;
