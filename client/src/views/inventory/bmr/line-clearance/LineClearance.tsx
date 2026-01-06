import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import LineClearanceTable from './LineClearanceTable';

const LineClearance = () => {
  return (
    <div>
      <BreadcrumbComp
        items={[{ title: 'Line Clearance Dispensing (Raw Material)', to: '/' }]}
        title="Line Clearance Dispensing (Raw Material)"
      />
      <CardBox>
        <LineClearanceTable />
      </CardBox>
    </div>
  );
};

export default LineClearance;
