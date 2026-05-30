import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import TaskManagerTable from './TaskManagerTable';

const TaskManager = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Task Manager', to: '/' }]} title="Task Manager" />
      <CardBox>
        <TaskManagerTable />
      </CardBox>
    </div>
  );
};

export default TaskManager;
