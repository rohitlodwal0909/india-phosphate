import noData from "../assets/images/svgs/no-data.webp";

const TableComponent = ({ table, flexRender, columns }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white dark:bg-gray-900">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="whitespace-nowrap py-3 px-4 text-gray-900 dark:text-gray-300"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-8 px-4">
              <div className="flex flex-col items-center">
                <img
                  src={noData}
                  alt="No data"
                  height={100}
                  width={100}
                  className="mb-4"
                />
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableComponent;
