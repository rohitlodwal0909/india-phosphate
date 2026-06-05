import { Icon } from '@iconify/react';
import FormatCurrency from 'src/views/accounts/ledger/LedgerComponent/components/formatCurrency';

const ProductWiseCard = ({ products = [] }: any) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Product Performance</h3>
          <p className="text-sm text-gray-500">Product-wise quantity and sales summary</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Icon icon="solar:box-bold" width={20} className="text-indigo-600" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Product
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Quantity
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {products?.map((item: any, index: number) => (
              <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="font-medium text-gray-800">{item.product_name}</div>
                </td>

                <td className="px-5 py-4 text-right font-semibold text-gray-800">
                  {item.totalQuantity}
                </td>

                <td className="px-5 py-4 text-right font-semibold text-green-600">
                  {FormatCurrency(item.totalAmount)}
                </td>
              </tr>
            ))}

            {products?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No product data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductWiseCard;
