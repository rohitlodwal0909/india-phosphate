import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import BatchMasterTable from './BatchMasterComponent.tsx/BatchMasterTable';
import CardBox from 'src/components/shared/CardBox';

const BatchMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Batch Master ", to: "/" }]}
        title="Batch Master"/>
         <CardBox>
        <BatchMasterTable/>
        </CardBox>
        </>
  )
}

export default BatchMaster