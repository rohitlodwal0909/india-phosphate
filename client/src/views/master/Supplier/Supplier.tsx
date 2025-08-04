import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import SupplierTable from './SuplierComponent.tsx/SupplierTable';
import CardBox from 'src/components/shared/CardBox';

const Supplier = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Supplier ", to: "/" }]}
        title="Supplier"/>
         <CardBox>
        <SupplierTable/>
        </CardBox>
        </>
  )
}

export default Supplier