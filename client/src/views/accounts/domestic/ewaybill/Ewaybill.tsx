import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import EwaybillTable from './EwayComponent/EwaybillTable';

const Ewaybill = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'E-Way Bill ', to: '/' }]} title="E-Way Bill" />
      <CardBox>
        <EwaybillTable />
      </CardBox>
    </>
  );
};

export default Ewaybill;
