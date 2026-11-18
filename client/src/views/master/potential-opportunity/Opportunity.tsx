import { useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import OpportunityTable from './OpportunityComponent.tsx/OpportunityTable';

const Opportunity = () => {
  const [exportData, setExportData] = useState<Record<string, any>[]>([]);

  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'Potential Opportunity ', to: '/' }]}
        title="Potential Opportunity"
        exportData={exportData}
      />
      <CardBox>
        <OpportunityTable onExportData={setExportData} />
      </CardBox>
    </>
  );
};

export default Opportunity;
