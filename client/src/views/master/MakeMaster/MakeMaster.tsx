import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import MakeMasterTable from './MakeMasterComponent.tsx/MakeMasterTable';
import CardBox from 'src/components/shared/CardBox';

const MakeMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Make Master ", to: "/" }]}
        title="Make Master"/>
         <CardBox>
        <MakeMasterTable/>
        </CardBox>
        </>
  )
}

export default MakeMaster