import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import StockMasterTable from './StockMasterComponent.tsx/StockMasterTable';
import CardBox from 'src/components/shared/CardBox';

const StockMaster = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Stock Master ", to: "/" }]}
        title="Stock Master"/>
         <CardBox>
        <StockMasterTable/>
        </CardBox>
        </>
  )
}

export default StockMaster