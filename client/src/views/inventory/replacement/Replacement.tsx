import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import ReplacementTable from './ReplacementTable';

const Replacement = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Replacement', to: '/' }]} title="Replacement" />
      <CardBox>
        <ReplacementTable />
      </CardBox>
    </div>
  );
};

export default Replacement;
