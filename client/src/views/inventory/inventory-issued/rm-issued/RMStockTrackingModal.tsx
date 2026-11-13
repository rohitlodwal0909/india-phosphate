import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { toast } from 'react-toastify';
import axiosInstance from 'src/constants/axiosInstance';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { getStoreRM } from 'src/features/Inventorymodule/InventoryIssued/RMIssueSlice';

type StockRow = {
  id: number;
  grn_number: string;
  date: string;
  total_quantity: number;
  remaining_quantity: number;
  issued_quantity: number;
  qc_reference: string;
  production_return_quantity: number;
  total_available: number;
  transferred_quantity: number;
  returns: { id: number; quantity: number; production_batch?: string; note?: string }[];
};
type Tracking = { material: { name: string; code: string; unit: string }; rows: StockRow[]; totals: Record<string, number> };
type Props = { open: boolean; onClose: () => void; rmId: number | null; rmName: string };
const qty = (value: number) => Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 3 });

const RMStockTrackingModal = ({ open, onClose, rmId, rmName }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [returnRow, setReturnRow] = useState<StockRow | null>(null);
  const [returnQuantity, setReturnQuantity] = useState('');
  const [productionBatch, setProductionBatch] = useState('');
  const [returnNote, setReturnNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!rmId) return;
    setLoading(true);
    try { const response = await axiosInstance.get(`/rm-stock-tracking/${rmId}`); setTracking(response.data); }
    catch (error: any) { toast.error(error.response?.data?.message || 'Could not load RM stock tracking.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (open && rmId) void load(); }, [open, rmId]);

  const recordReturn = async () => {
    if (!rmId || !returnRow) return;
    const value = Number(returnQuantity);
    const returnable = Math.max(0, returnRow.issued_quantity - returnRow.production_return_quantity);
    if (!Number.isFinite(value) || value <= 0 || value > returnable || !productionBatch.trim()) {
      toast.error(`Enter a valid quantity up to ${qty(returnable)} and provide the production batch.`); return;
    }
    setSaving(true);
    try {
      await axiosInstance.post(`/rm-stock-tracking/${rmId}/returns`, { grn_entry_id: returnRow.id, quantity: value, production_batch: productionBatch.trim(), note: returnNote.trim() });
      toast.success('Production return recorded.'); setReturnRow(null); setReturnQuantity(''); setProductionBatch(''); setReturnNote('');
      await load(); dispatch(getStoreRM());
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not record production return.'); }
    finally { setSaving(false); }
  };

  const moveToWarehouse = async (row: StockRow) => {
    if (!rmId || row.total_available <= 0) return;
    setSaving(true);
    try {
      const response = await axiosInstance.post(`/rm-stock-tracking/${rmId}/warehouse-transfer`, { grn_entry_id: row.id });
      toast.success(response.data?.message || 'Transferred to Warehouse Master.');
      await load(); dispatch(getStoreRM());
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not transfer stock.'); }
    finally { setSaving(false); }
  };

  const totals = tracking?.totals;
  return <Modal show={open} size="7xl" onClose={onClose}>
    <ModalHeader>{rmName} · RM Stock Tracking</ModalHeader>
    <ModalBody>
      <div className="mb-3 flex items-center justify-between"><p className="text-sm text-gray-600">RM Code: <strong>{tracking?.material?.code || '—'}</strong>{tracking?.material?.unit ? ` · Unit: ${tracking.material.unit}` : ''}</p>{loading && <span className="text-sm text-gray-500">Loading…</span>}</div>
      <div className="max-h-[65vh] overflow-auto rounded-lg border">
        <table className="min-w-[1050px] w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-100 text-xs uppercase text-gray-700"><tr>
            <th className="px-3 py-3">Date of Material Arrival</th><th className="px-3 py-3">Total Quantity</th><th className="px-3 py-3">Remaining Quantity</th><th className="px-3 py-3">Issued Quantity</th><th className="px-3 py-3">QC Reference No.</th><th className="px-3 py-3">Return Material by Production</th><th className="px-3 py-3">Total Available</th><th className="px-3 py-3">Move to Warehouse Master</th>
          </tr></thead>
          <tbody className="divide-y">
            {(tracking?.rows || []).map((row) => <tr key={row.id}>
              <td className="whitespace-nowrap px-3 py-3"><div>{row.date ? new Date(`${row.date}T00:00:00`).toLocaleDateString('en-GB') : '—'}</div><div className="text-xs text-gray-500">{row.grn_number}</div></td>
              <td className="px-3 py-3">{qty(row.total_quantity)}</td><td className="px-3 py-3">{qty(row.remaining_quantity)}</td><td className="px-3 py-3">{qty(row.issued_quantity)}</td><td className="px-3 py-3">{row.qc_reference || '—'}</td>
              <td className="px-3 py-3"><div>{qty(row.production_return_quantity)}</div>{row.returns?.map((entry) => <div key={entry.id} className="mt-1 text-xs text-gray-500">{qty(entry.quantity)} · {entry.production_batch || 'Production'}</div>)}{row.issued_quantity > row.production_return_quantity && <Button size="xs" color="light" className="mt-1" disabled={saving} onClick={() => { setReturnRow(row); setReturnQuantity(''); setProductionBatch(''); setReturnNote(''); }}>Record Return</Button>}</td>
              <td className="px-3 py-3 font-semibold">{qty(row.total_available)}</td>
              <td className="px-3 py-3">{row.total_available > 0 ? <Button size="xs" color="primary" disabled={saving || loading} onClick={() => moveToWarehouse(row)}>Move {qty(row.total_available)}</Button> : row.transferred_quantity > 0 ? <span className="text-green-700">Moved: {qty(row.transferred_quantity)}</span> : '—'}</td>
            </tr>)}
            {!loading && !tracking?.rows?.length && <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-500">No approved RM arrivals found.</td></tr>}
          </tbody>
          {tracking?.rows?.length ? <tfoot className="sticky bottom-0 bg-gray-100 font-semibold"><tr><td className="px-3 py-3">Total</td><td className="px-3 py-3">{qty(totals?.total_quantity || 0)}</td><td className="px-3 py-3">{qty(totals?.remaining_quantity || 0)}</td><td className="px-3 py-3">{qty(totals?.issued_quantity || 0)}</td><td className="px-3 py-3">—</td><td className="px-3 py-3">{qty(totals?.production_return_quantity || 0)}</td><td className="px-3 py-3">{qty(totals?.total_available || 0)}</td><td className="px-3 py-3">—</td></tr></tfoot> : null}
        </table>
      </div>
      {returnRow && <div className="mt-4 rounded-lg border bg-gray-50 p-4"><h4 className="mb-3 font-semibold">Production Return · {returnRow.grn_number}</h4><div className="grid gap-3 md:grid-cols-3"><input type="number" min="0.001" max={returnRow.issued_quantity - returnRow.production_return_quantity} step="0.001" value={returnQuantity} onChange={(event) => setReturnQuantity(event.target.value)} placeholder={`Quantity (up to ${qty(returnRow.issued_quantity - returnRow.production_return_quantity)})`} className="rounded-md border border-gray-300 p-2" /><input value={productionBatch} onChange={(event) => setProductionBatch(event.target.value)} placeholder="Production batch / reference" className="rounded-md border border-gray-300 p-2" /><input value={returnNote} onChange={(event) => setReturnNote(event.target.value)} placeholder="Note (optional)" className="rounded-md border border-gray-300 p-2" /></div><div className="mt-3 flex justify-end gap-2"><Button color="light" onClick={() => setReturnRow(null)}>Cancel</Button><Button color="primary" disabled={saving} onClick={recordReturn}>{saving ? 'Saving…' : 'Save Return'}</Button></div></div>}
    </ModalBody>
  </Modal>;
};

export default RMStockTrackingModal;
