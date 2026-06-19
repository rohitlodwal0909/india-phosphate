import { Icon } from '@iconify/react/dist/iconify.js';
import FormatCurrency from './FormatCurrency';

const PoHistory = ({ poHistorysD }) => {
  const totalPO = poHistorysD?.length || 0;

  const totalPOValue = poHistorysD?.reduce(
    (sum, po) =>
      sum + (po.products?.reduce((productSum, p) => productSum + Number(p.amount || 0), 0) || 0),
    0,
  );

  const approvedPO = poHistorysD?.filter((po) => po.payment_status === 'Received').length;

  const pendingPO = totalPO - approvedPO;

  const largestPO =
    Math.max(
      ...(poHistorysD?.map(
        (po) => po.products?.reduce((productSum, p) => productSum + Number(p.amount || 0), 0) || 0,
      ) || [0]),
    ) || 0;

  const avgPOValue = totalPO ? totalPOValue / totalPO : 0;

  const lastPO = poHistorysD?.[0]?.po_no || '-';

  const completionRate = totalPO ? ((approvedPO / totalPO) * 100).toFixed(0) : 0;

  const formatCurrency = (amount = 0) => {
    amount = Number(amount);

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  };
  const formatDate = (date: string) => {
    if (!date) return '-';

    return new Date(date)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(/ /g, '-');
  };
  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      {/* Header */}

      <div className="flex justify-between items-center p-5 border-b">
        <div>
          <h3 className="text-lg font-semibold">Purchase Order History</h3>

          <p className="text-sm text-gray-500">Complete purchase order records</p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon icon="mdi:file-document-multiple-outline" width={24} className="text-blue-600" />
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-4 gap-4 p-5 border-b bg-gray-50">
        <div>
          <p className="text-xs text-gray-500">Total PO</p>
          <h4 className="font-bold text-xl">{totalPO}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">PO Value</p>
          <h4 className="font-bold text-green-600 text-xl"> {FormatCurrency(totalPOValue || 0)}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Open PO</p>
          <h4 className="font-bold text-orange-500 text-xl"> {pendingPO}</h4>
        </div>

        <div>
          <p className="text-xs text-gray-500">Closed PO</p>
          <h4 className="font-bold text-blue-600 text-xl"> {approvedPO}</h4>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b text-sm">
              <th className="px-4 py-3 text-left">PO No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Dispatch</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {poHistorysD?.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-4 font-semibold text-blue-600">{item.po_no}</td>

                <td className="px-4 py-4">{formatDate(item.po_date)}</td>

                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {item.products?.map((product, idx) => (
                      <div key={idx} className="font-medium">
                        {product.product_name}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {item.products?.map((product, idx) => (
                      <div key={idx}>
                        {product.qty}
                        {' KG'}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {item.products?.map((product, idx) => (
                      <div key={idx} className="font-medium text-green-600">
                        {formatCurrency(product.amount)}
                        {/* ₹
                        {Number(product.amount).toLocaleString('en-IN')} */}
                      </div>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-4">
                  {item.invoice_no
                    ? item.invoice_no
                        .split(',')
                        .map((inv, idx) => <div key={idx}>{inv.trim()}</div>)
                    : '-'}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.invoice_no
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {item.invoice_no ? 'Deliverd' : 'Pending'}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.payment_status === 'Approved'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {item.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="p-5 border-t bg-gray-50">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-gray-500">Largest PO</p>
            <h4 className="font-bold">{formatCurrency(largestPO)}</h4>
          </div>

          <div>
            <p className="text-xs text-gray-500">Avg PO Value</p>
            <h4 className="font-bold">{formatCurrency(avgPOValue)}</h4>
          </div>

          <div>
            <p className="text-xs text-gray-500">Last PO</p>
            <h4 className="font-bold">{lastPO}</h4>
          </div>

          <div>
            <p className="text-xs text-gray-500">Completion Rate</p>
            <h4 className="font-bold text-green-600"> {completionRate}%</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoHistory;
