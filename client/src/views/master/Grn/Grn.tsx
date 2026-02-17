import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import GrnTable from './GrnComponent.tsx/GrnTable';

const Grn = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Grn Master ', to: '/' }]} title="Grn Master" />
      <CardBox>
        <GrnTable />
      </CardBox>
    </>
  );
};

export default Grn;
