import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import StaffMasterTable from './StaffMasterComponent.tsx/StaffMasterTable';
import CardBox from 'src/components/shared/CardBox';

const StaffMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Staff Master ", to: "/" }]}
        title="Staff Master"/>
         <CardBox>
        <StaffMasterTable/>
        </CardBox>
        </>
  )
}

export default StaffMaster