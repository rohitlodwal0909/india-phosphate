import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import HsnMasterTable from './HsnMasterComponent.tsx/HsnMasterTable';
import CardBox from 'src/components/shared/CardBox';

const HsnMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Hsn Master ", to: "/" }]}
        title="Hsn Master"/>
         <CardBox>
        <HsnMasterTable/>
        </CardBox>
        </>
  )
}

export default HsnMaster