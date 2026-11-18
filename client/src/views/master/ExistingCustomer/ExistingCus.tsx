import { useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CustomerTable from './ExistingComponent.tsx/CustomerTable';
import CardBox from 'src/components/shared/CardBox';

const ExistingCustomer = () => {
  const [exportData, setExportData] = useState<Record<string, any>[]>([]);

  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'Existing Customer', to: '/' }]}
        title="Existing Customer"
        exportData={exportData}
      />
      <CardBox>
        <CustomerTable onExportData={setExportData} />
      </CardBox>
    </>
  );
};

export default ExistingCustomer;
