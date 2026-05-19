import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import QaDocumentTable from './QaDocumentTable';

const QaDocument = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'QA Documents', to: '/' }]} title="QA Documents" />
      <CardBox>
        <QaDocumentTable />
      </CardBox>
    </div>
  );
};

export default QaDocument;
