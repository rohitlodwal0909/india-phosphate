import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import DesignationTable from './DesignationComponent.tsx/DesignationTable';
import CardBox from 'src/components/shared/CardBox';

const Designation = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Designation ", to: "/" }]}
        title="Designation"/>
         <CardBox>
        <DesignationTable/>
        </CardBox>
        </>
  )
}

export default Designation