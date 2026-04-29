import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import AuditRequestTable from './AuditRequestTable';

const AuditRequest = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Audit Request', to: '/' }]} title="Audit Request" />
      <CardBox>
        <AuditRequestTable />
      </CardBox>
    </div>
  );
};

export default AuditRequest;
