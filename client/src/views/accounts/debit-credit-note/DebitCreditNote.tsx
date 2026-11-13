import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { getReplacement } from 'src/features/Inventorymodule/replacement/ReplacementSlice';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const DebitCreditNote = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rows = useSelector((state: RootState) => (state as any).replacements?.replacement || []);

  useEffect(() => { dispatch(getReplacement()); }, [dispatch]);

  const notes = rows.filter((row: any) => row.credit_note === 'yes' && row.note_type);

  return <>
    <BreadcrumbComp items={[{ title: 'Debit / Credit Notes', to: '/' }]} title="Debit / Credit Notes" />
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100"><tr>{['Date', 'Note Type', 'Work Order', 'PO Type / No.', 'PO Details', 'Dispatch', 'PI / Invoice', 'Product', 'Replacement', 'Quantity', 'Details'].map((heading) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead>
        <tbody>{notes.map((row: any) => <tr key={row.id} className="border-t">
          <td className="p-3">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</td>
          <td className="p-3 capitalize">{row.note_type} note</td>
          <td className="p-3">{row.workOrder?.work_order_no || row.work_order_no || '-'}</td>
          <td className="p-3">{row.marketingPO?.po_no || row.purchasePO?.po_no || '-'}</td>
          <td className="p-3">{row.marketingPO ? `${row.marketingPO.customer_name || ''} · ${row.marketingPO.product_name || ''} · Qty ${row.marketingPO.quantity || '-'} · Total ${row.marketingPO.total || '-'}` : (row.purchasePO?.purchasePo || []).map((line: any) => `${line.product?.product_name || 'Item'}: ${line.qty} ${line.unit || ''} @ ${line.rate}`).join(', ') || '-'}</td>
          <td className="p-3">{row.dispatch?.id ? `#${row.dispatch.id}` : '-'}</td>
          <td className="p-3">{row.invoices?.invoice_no || '-'}</td>
          <td className="p-3">{row.product_name}</td>
          <td className="p-3">{row.replacement_type}</td>
          <td className="p-3">{row.quantity ? `${row.quantity} ${row.unit || ''}` : '-'}</td>
          <td className="p-3">{row.remarks || '-'}</td>
        </tr>)}{!notes.length && <tr><td colSpan={11} className="p-6 text-center text-gray-500">No debit or credit notes found.</td></tr>}</tbody>
      </table>
    </div>
  </>;
};

export default DebitCreditNote;
