import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import AccountPaymentTable from './AccountPaymentComponent/AccountPaymentTable';

const AccountPayment = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Account Payment', to: '/' }]} title="Account Payment" />
      <CardBox>
        <AccountPaymentTable />
      </CardBox>
    </>
  );
};

export default AccountPayment;
