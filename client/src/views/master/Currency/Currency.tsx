import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CurrencyTable from './CurrencyComponent.tsx/CurrencyTable';
import CardBox from 'src/components/shared/CardBox';

const Currency = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Currency", to: "/" }]}
        title="Currency"/>
         <CardBox>
        <CurrencyTable/>
        </CardBox>
        </>
  )
}

export default Currency