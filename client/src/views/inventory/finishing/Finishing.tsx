import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';

import FinishingTable from './FinishingTable';

const Finishing = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Finishing', to: '/' }]} title="Finishing" />
      <CardBox>
        <FinishingTable />
      </CardBox>
    </div>
  );
};

export default Finishing;
