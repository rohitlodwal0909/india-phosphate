import { Icon } from '@iconify/react/dist/iconify.js';

// const productData = [
//   {
//     product: 'DAP',
//     qty: '520 MT',
//     amount: '₹25 Lac',
//     lastPurchase: '20-May-2026',
//     icon: 'mdi:package-variant',
//   },
//   {
//     product: 'SSP',
//     qty: '300 MT',
//     amount: '₹12 Lac',
//     lastPurchase: '12-May-2026',
//     icon: 'mdi:package-variant-closed',
//   },
//   {
//     product: 'NPK',
//     qty: '180 MT',
//     amount: '₹8 Lac',
//     lastPurchase: '05-May-2026',
//     icon: 'mdi:cube-outline',
//   },
//   {
//     product: 'Rock Phosphate',
//     qty: '150 MT',
//     amount: '₹5 Lac',
//     lastPurchase: '01-May-2026',
//     icon: 'mdi:package',
//   },
// ];

const formatCurrency = (amount: number) => {
  amount = Number(amount || 0);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
};

const ProductSummary = ({ products }) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Product Purchase Summary</h3>

        <span className="text-sm text-gray-500">Top Products</span>
      </div>

      <div className="space-y-4">
        {products?.map((item) => (
          <div
            key={item.product}
            className="flex justify-between items-center border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Icon icon="mdi:package-variant" width={22} className="text-blue-600" />
              </div>

              <div>
                <h4 className="font-medium">{item.product_name}</h4>

                {/* <p className="text-xs text-gray-500">Last Purchase : {item.lastPurchase}</p> */}
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-800">{formatCurrency(item.totalAmount)}</p>

              <p className="text-sm text-gray-500">{item.totalQty}KG</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSummary;
