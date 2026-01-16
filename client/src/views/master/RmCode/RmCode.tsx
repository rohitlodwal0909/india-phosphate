import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import RmCodeTable from './RmCodeComponent.tsx/RmCodeTable';
import CardBox from 'src/components/shared/CardBox';

const RmCode = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'RmCode ', to: '/' }]} title="RmCode" />
      <CardBox>
        <RmCodeTable />
      </CardBox>
    </>
  );
};

export default RmCode;
