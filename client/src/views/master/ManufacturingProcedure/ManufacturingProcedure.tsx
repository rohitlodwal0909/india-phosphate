import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import ManufacturingProcedureTable from './ManufacturingComponent/ManufacturingProcedureTable';

const ManufacturingProcedure = () => {
  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'ManufacturingProcedure ', to: '/' }]}
        title="ManufacturingProcedure"
      />
      <CardBox>
        <ManufacturingProcedureTable />
      </CardBox>
    </>
  );
};

export default ManufacturingProcedure;
