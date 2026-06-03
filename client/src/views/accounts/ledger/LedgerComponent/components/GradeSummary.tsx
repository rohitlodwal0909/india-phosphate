import { Icon } from '@iconify/react';

const GradeSummary = ({ gradeWiseBusiness = [] }) => {
  const totalBusiness = gradeWiseBusiness?.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0,
  );

  const colors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-cyan-500',
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }

    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Grade Wise Business</h3>

        <Icon icon="mdi:chart-donut" width={24} className="text-primary" />
      </div>

      <div className="space-y-5">
        {gradeWiseBusiness?.length > 0 &&
          gradeWiseBusiness?.map((item, index) => {
            const amount = Number(item.totalAmount || 0);

            const percentage = totalBusiness > 0 ? ((amount / totalBusiness) * 100).toFixed(1) : 0;

            return (
              <div key={item.grade}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.grade}</span>

                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`${
                      colors[index % colors.length]
                    } h-3 rounded-full transition-all duration-500`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Qty: {Number(item.totalQty || 0).toLocaleString()} KG</span>

                  <span>{percentage}% Contribution</span>
                </div>
              </div>
            );
          })}

        {gradeWiseBusiness?.length === 0 && (
          <div className="text-center py-8 text-gray-500">No grade data available</div>
        )}
      </div>
    </div>
  );
};

export default GradeSummary;
