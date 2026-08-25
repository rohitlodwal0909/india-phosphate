import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import FormatCurrency from 'src/views/accounts/ledger/LedgerComponent/components/FormatCurrency';

const ProductWiseCard = ({ products = [] }: any) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search
  const filteredProducts = useMemo(() => {
    return products.filter((item: any) =>
      item.product_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Search change hone par first page
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 border-b bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Product Performance</h3>

          <p className="text-sm text-gray-500">Product-wise quantity and sales summary</p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Icon icon="solar:box-bold" width={20} className="text-indigo-600" />
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b">
        <div className="relative max-w-sm">
          <Icon
            icon="solar:magnifer-linear"
            width={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search product..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="solar:close-circle-bold" width={20} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
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
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((item: any, index: number) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  {search ? 'No product found' : 'No product data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t">
          <div className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium text-gray-700">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-gray-700">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            of <span className="font-medium text-gray-700">{filteredProducts.length}</span> products
          </div>

          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border
                         border-gray-300 text-gray-600
                         hover:bg-gray-100
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon icon="solar:alt-arrow-left-linear" width={18} />
            </button>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border
                         border-gray-300 text-gray-600
                         hover:bg-gray-100
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon icon="solar:alt-arrow-right-linear" width={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductWiseCard;
