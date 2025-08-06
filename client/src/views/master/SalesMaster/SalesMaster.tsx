import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import SalesMasterTable from './SalesMasterComponent.tsx/SalesMasterTable';
import CardBox from 'src/components/shared/CardBox';

const SalesMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Sales Master ", to: "/" }]}
        title="Sales Master"/>
         <CardBox>
        <SalesMasterTable/>
        </CardBox>
        </>
  )
}

export default SalesMaster