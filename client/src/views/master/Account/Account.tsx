import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import AccountTable from './AccountComponent.tsx/AccountTable';
import CardBox from 'src/components/shared/CardBox';

const Account = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Account ", to: "/" }]}
        title="Account"/>
         <CardBox>
        <AccountTable/>
        </CardBox>
        </>
  )
}

export default Account