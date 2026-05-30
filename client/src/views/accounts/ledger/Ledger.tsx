import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import LedgerTable from './LedgerComponent/LedgerTable';

const Ledger = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Ledger Account', to: '/' }]} title="Ledger Account" />
      <CardBox>
        <LedgerTable />
      </CardBox>
    </>
  );
};

export default Ledger;
