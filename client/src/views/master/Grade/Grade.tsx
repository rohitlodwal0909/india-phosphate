import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import GradeTable from './GradeComponent.tsx/GradeTable';

const Grade = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Grade ', to: '/' }]} title="Grade" />
      <CardBox>
        <GradeTable />
      </CardBox>
    </>
  );
};

export default Grade;
