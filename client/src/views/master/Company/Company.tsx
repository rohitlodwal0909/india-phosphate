import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CompanyTable from './CompanyComponent.tsx/CompanyTable';
import CardBox from 'src/components/shared/CardBox';

const Company = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Company ", to: "/" }]}
        title="Company"/>
         <CardBox>
        <CompanyTable/>
        </CardBox>
        </>
  )
}

export default Company