import { useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CustomerTable from './CustomerComponent.tsx/CustomerTable';
import CardBox from 'src/components/shared/CardBox';

const Customer = () => {
  const [exportData, setExportData] = useState<Record<string, any>[]>([]);

  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'New Customer ', to: '/' }]}
        title="New Customer"
        exportData={exportData}
      />
      <CardBox>
        <CustomerTable onExportData={setExportData} />
      </CardBox>
    </>
  );
};

export default Customer;
