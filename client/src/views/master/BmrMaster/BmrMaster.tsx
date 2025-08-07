import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import BmrMasterTable from './BmrMasterComponent.tsx/BmrMasterTable';
import CardBox from 'src/components/shared/CardBox';

const BmrMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Bmr Master ", to: "/" }]}
        title="Bmr Master"/>
         <CardBox>
        <BmrMasterTable/>
        </CardBox>
        </>
  )
}

export default BmrMaster