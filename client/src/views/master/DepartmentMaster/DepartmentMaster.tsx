import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import DepartmentMasterTable from './DepartmentMasterComponent.tsx/DepartmentMasterTable';
import CardBox from 'src/components/shared/CardBox';

const DepartmentMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Department Master ", to: "/" }]}
        title="Department Master"/>
         <CardBox>
        <DepartmentMasterTable/>
        </CardBox>
        </>
  )
}

export default DepartmentMaster