import React, { useEffect, useState } from 'react';
import { Button, Label, Modal, Textarea, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from 'src/store';
import { allUnits } from 'src/utils/AllUnit';
import { toast } from 'react-toastify';
import {
  addReplacement,
  getReplacement,
  getReplacementOptions,
} from 'src/features/Inventorymodule/replacement/ReplacementSlice';

interface ReplacementModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const emptyEntry = () => ({ product_name: '', replacement_type: '', quantity: '', unit: '', replacement_choice: 'no' });

const ReplacementModal: React.FC<ReplacementModalProps> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [options, setOptions] = useState<any>({ workOrders: [], purchaseOrders: [], purchasePos: [], dispatches: [], invoices: [] });
  const [poSource, setPoSource] = useState<'marketing' | 'purchase'>('marketing');
  const [workOrderId, setWorkOrderId] = useState('');
  const [poId, setPoId] = useState('');
  const [dispatchId, setDispatchId] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [entries, setEntries] = useState<any[]>([emptyEntry()]);
  const [formData, setFormData] = useState({ credit_note: 'no', note_type: '', remarks: '' });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    dispatch(getReplacementOptions()).unwrap().then(setOptions).catch((error: any) => {
      toast.error(typeof error === 'string' ? error : 'Could not load replacement options');
    });
  }, [dispatch]);

  const workOrder = options.workOrders.find((item: any) => String(item.id) === workOrderId);
  const marketingPOs = options.purchaseOrders.map((po: any) => ({ value: String(po.id), label: `${po.po_no} — ${po.customer_name || ''}` }));
  const purchasePOs = options.purchasePos.map((po: any) => ({ value: String(po.id), label: po.po_no }));
  const workOrderOptions = options.workOrders.map((item: any) => ({ value: String(item.id), label: item.work_order_no || `Work order #${item.id}` }));
  const selectedPO = poSource === 'marketing'
    ? options.purchaseOrders.find((item: any) => String(item.id) === poId)
    : options.purchasePos.find((item: any) => String(item.id) === poId);
  const dispatches = options.dispatches.filter((item: any) => String(item.po_id) === poId);
  const invoices = options.invoices.filter((item: any) => String(item.dispatch_id) === dispatchId);

  useEffect(() => {
    if (!dispatches.some((item: any) => String(item.id) === dispatchId) && dispatches.length) {
      setDispatchId(String(dispatches[0].id));
      setInvoiceId('');
    }
  }, [poId, dispatches, dispatchId]);

  useEffect(() => {
    if (!invoices.some((item: any) => String(item.id) === invoiceId) && invoices.length) {
      setInvoiceId(String(invoices[0].id));
    }
  }, [dispatchId, invoices, invoiceId]);

  const selectStyles = { menuPortal: (base: any) => ({ ...base, zIndex: 9999 }) };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: any = {};
    if (poSource === 'marketing' && !workOrderId) nextErrors.work_order_id = 'Select a work order';
    if (!poId) nextErrors.po_id = 'Select a purchase order';
    if (poSource === 'marketing' && !dispatchId) nextErrors.dispatch_id = 'Select a dispatch';
    if (poSource === 'marketing' && !invoiceId) nextErrors.invoice_no = 'Select PI / invoice';
    entries.forEach((entry, index) => {
      if (!entry.product_name.trim()) nextErrors[`product_${index}`] = 'Product is required';
      if (!entry.replacement_type) nextErrors[`type_${index}`] = 'Select replacement type';
      if (entry.replacement_type === 'short_qty' && (!entry.quantity || !entry.unit)) nextErrors[`qty_${index}`] = 'Enter quantity and unit';
    });
    if (formData.credit_note === 'yes' && !formData.note_type) nextErrors.note_type = 'Select debit or credit note';
    if (formData.credit_note === 'yes' && !formData.remarks.trim()) nextErrors.remarks = 'Note is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await dispatch(addReplacement({
        invoice_no: invoiceId ? Number(invoiceId) : null,
        work_order_id: workOrderId ? Number(workOrderId) : null,
        work_order_no: workOrder?.work_order_no,
        po_source: poSource,
        marketing_po_id: poSource === 'marketing' ? Number(poId) : null,
        purchase_po_id: poSource === 'purchase' ? Number(poId) : null,
        dispatch_id: dispatchId ? Number(dispatchId) : null,
        credit_note: formData.credit_note,
        note_type: formData.note_type || null,
        remarks: formData.remarks,
        entries,
      })).unwrap();
      toast.success('Replacement created successfully');
      dispatch(getReplacement());
      setEntries([emptyEntry()]); setWorkOrderId(''); setPoId(''); setDispatchId(''); setInvoiceId('');
      setFormData({ credit_note: 'no', note_type: '', remarks: '' }); setErrors({});
      setOpenModal(false);
      // Send the accounts team directly to the note register after a note is created.
      if (formData.credit_note === 'yes') navigate('/accounts/debit-credit-note');
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : error?.message || error?.error || 'Failed to create entry');
    }
  };

  const handlePOType = (source: 'marketing' | 'purchase') => {
    setPoSource(source); setWorkOrderId(''); setPoId(''); setDispatchId(''); setInvoiceId('');
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
      <Modal.Header>Replacement</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Label value="Work Order No." />
            <Select isDisabled={poSource === 'purchase'} options={workOrderOptions} value={workOrderOptions.find((item: any) => item.value === workOrderId) || null}
              onChange={(selected: any) => {
                const id = selected?.value || '';
                const record = options.workOrders.find((item: any) => String(item.id) === id);
                setWorkOrderId(id);
                if (poSource === 'marketing') setPoId(record?.workNo?.id ? String(record.workNo.id) : '');
                setDispatchId(''); setInvoiceId('');
              }} placeholder="Select Work Order" menuPortalTarget={document.body} styles={selectStyles} />
            {errors.work_order_id && <p className="text-red-500 text-sm">{errors.work_order_id}</p>}
          </div>
          <div className="col-span-6">
            <Label value="PO Type" />
            <select className="border rounded-md p-2 w-full" value={poSource} onChange={(event) => handlePOType(event.target.value as 'marketing' | 'purchase')}>
              <option value="marketing">Marketing PO</option><option value="purchase">Purchase PO</option>
            </select>
          </div>
          <div className="col-span-6">
            <Label value={`${poSource === 'marketing' ? 'Marketing' : 'Purchase'} PO No.`} />
            <Select options={poSource === 'marketing' ? marketingPOs : purchasePOs} value={(poSource === 'marketing' ? marketingPOs : purchasePOs).find((item: any) => item.value === poId) || null}
              onChange={(selected: any) => { setPoId(selected?.value || ''); if (poSource === 'marketing') setWorkOrderId(''); setDispatchId(''); setInvoiceId(''); }} placeholder="Select PO No." menuPortalTarget={document.body} styles={selectStyles} />
            {errors.po_id && <p className="text-red-500 text-sm">{errors.po_id}</p>}
          </div>
          <div className={`col-span-6 ${poSource === 'purchase' ? 'opacity-60' : ''}`}>
            <Label value="Dispatch" />
            <select disabled={poSource === 'purchase'} className="border rounded-md p-2 w-full" value={dispatchId} onChange={(event) => { setDispatchId(event.target.value); setInvoiceId(''); }}>
              <option value="">Select Dispatch</option>{dispatches.map((item: any) => <option key={item.id} value={item.id}>Dispatch #{item.id} · {item.work_order_no || item.product_name || ''}</option>)}
            </select>
            {errors.dispatch_id && <p className="text-red-500 text-sm">{errors.dispatch_id}</p>}
          </div>
          <div className={`col-span-6 ${poSource === 'purchase' ? 'opacity-60' : ''}`}>
            <Label value="PI / Invoice No." />
            <select disabled={poSource === 'purchase'} className="border rounded-md p-2 w-full" value={invoiceId} onChange={(event) => setInvoiceId(event.target.value)}>
              <option value="">Select PI / Invoice</option>{invoices.map((item: any) => <option key={item.id} value={item.id}>{item.invoice_no || `Invoice #${item.id}`}</option>)}
            </select>
            {errors.invoice_no && <p className="text-red-500 text-sm">{errors.invoice_no}</p>}
          </div>
          {selectedPO && <div className="col-span-12 rounded bg-gray-50 p-3 text-sm">
            <b>Selected PO:</b> {selectedPO.po_no || '-'} · {selectedPO.customer_name || 'Purchase PO'} · {poSource === 'marketing'
              ? `Product: ${selectedPO.product_name || '-'} · Qty: ${selectedPO.quantity || '-'} · Total: ${selectedPO.total || '-'}`
              : (selectedPO.purchasePo || []).map((line: any) => `${line.product?.product_name || 'Item'} (${line.qty} ${line.unit || ''})`).join(', ') || 'No PO line items'}
          </div>}

          <div className="col-span-12 flex items-center justify-between"><Label value="Replacement Entries" /><Button type="button" size="xs" color="light" onClick={() => setEntries((current) => [...current, emptyEntry()])}>+ Add Entry</Button></div>
          {entries.map((entry, index) => <div key={index} className="col-span-12 grid grid-cols-12 gap-3 rounded border p-3">
            <div className="col-span-4"><Label value="Product Name" /><TextInput value={entry.product_name} onChange={(event) => setEntries((current) => current.map((row, i) => i === index ? { ...row, product_name: event.target.value } : row))} />{errors[`product_${index}`] && <p className="text-red-500 text-sm">{errors[`product_${index}`]}</p>}</div>
            <div className="col-span-3"><Label value="Replacement Type" /><select className="border rounded-md p-2 w-full" value={entry.replacement_type} onChange={(event) => setEntries((current) => current.map((row, i) => i === index ? { ...row, replacement_type: event.target.value, ...(event.target.value === 'short_qty' ? {} : { quantity: '', unit: '' }) } : row))}><option value="">Select</option><option value="rejection">Rejection</option><option value="short_qty">Short Quantity</option></select>{errors[`type_${index}`] && <p className="text-red-500 text-sm">{errors[`type_${index}`]}</p>}</div>
            <div className="col-span-3"><Label value="Quantity / Unit" /><div className="flex"><input type="number" min="0" className="w-full border px-2" value={entry.quantity} onChange={(event) => setEntries((current) => current.map((row, i) => i === index ? { ...row, quantity: event.target.value } : row))} /><select className="border px-2" value={entry.unit} onChange={(event) => setEntries((current) => current.map((row, i) => i === index ? { ...row, unit: event.target.value } : row))}><option value="">Unit</option>{allUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.value}</option>)}</select></div>{errors[`qty_${index}`] && <p className="text-red-500 text-sm">{errors[`qty_${index}`]}</p>}</div>
            <div className="col-span-2"><Label value="Replacement?" /><select className="border rounded-md p-2 w-full" value={entry.replacement_choice} onChange={(event) => setEntries((current) => current.map((row, i) => i === index ? { ...row, replacement_choice: event.target.value } : row))}><option value="yes">Yes</option><option value="no">No</option></select></div>
            {entries.length > 1 && <div className="col-span-12 flex justify-end"><Button type="button" size="xs" color="failure" onClick={() => setEntries((current) => current.filter((_, i) => i !== index))}>Remove Entry</Button></div>}
          </div>)}

          <div className="col-span-6"><Label value="Debit/Credit Note?" /><select className="border rounded-md p-2 w-full" value={formData.credit_note} onChange={(event) => setFormData((current) => ({ ...current, credit_note: event.target.value, ...(event.target.value === 'no' ? { note_type: '', remarks: '' } : {}) }))}><option value="no">No</option><option value="yes">Yes</option></select></div>
          {formData.credit_note === 'yes' && <>
            <div className="col-span-6"><Label value="Note Type" /><select className="border rounded-md p-2 w-full" name="note_type" value={formData.note_type} onChange={(event) => setFormData((current) => ({ ...current, note_type: event.target.value }))}><option value="">Select</option><option value="debit">Debit Note</option><option value="credit">Credit Note</option></select>{errors.note_type && <p className="text-red-500 text-sm">{errors.note_type}</p>}</div>
            <div className="col-span-12"><Label value="Note" /><Textarea value={formData.remarks} onChange={(event) => setFormData((current) => ({ ...current, remarks: event.target.value }))} placeholder="Enter note" />{errors.remarks && <p className="text-red-500 text-sm">{errors.remarks}</p>}</div>
          </>}
          <div className="col-span-12 flex justify-end gap-2"><Button type="button" color="gray" onClick={() => setOpenModal(false)}>Cancel</Button><Button color="primary" type="submit">Submit</Button></div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ReplacementModal;
