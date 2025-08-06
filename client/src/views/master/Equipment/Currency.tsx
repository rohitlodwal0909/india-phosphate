import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import EquipmentTable from './EquipmentComponent.tsx/EquipmentTable';
import CardBox from 'src/components/shared/CardBox';

const Equipment = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Equipment", to: "/" }]}
        title="Equipment"/>
         <CardBox>
        <EquipmentTable/>
        </CardBox>
        </>
  )
}

export default Equipment