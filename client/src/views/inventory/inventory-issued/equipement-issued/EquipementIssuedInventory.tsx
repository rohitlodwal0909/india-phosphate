import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import EquipementIssuedType from './EquipementIssuedTable';

const EquipementIssuedInventory = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Equipment Issued', to: '/' }]} title="Equipment Issued" />
      <CardBox>
        <EquipementIssuedType />
      </CardBox>
    </div>
  );
};

export default EquipementIssuedInventory;
