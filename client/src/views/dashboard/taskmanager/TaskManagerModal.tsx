import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea, Badge } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { toast } from 'react-toastify';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { addTask, getTask } from 'src/features/dashboard/TaskManagerSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const TaskManagerModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  useEffect(() => {
    dispatch(GetUsermodule());
  }, [dispatch]);

  /* ================= FORM ================= */

  const [formData, setFormData] = useState<any>({
    task_title: '',
    assign_to: '',
    priority: '',
    due_date: '',
    task_description: '',
  });

  /* ================= OPTIONS ================= */

  const usersOptions = usersdata?.map((user: any) => ({
    label: user.username,
    value: user.id,
  }));

  const priorityOptions = [
    { label: '🟢 Low', value: 'Low', color: 'success' },
    { label: '🟡 Medium', value: 'Medium', color: 'warning' },
    { label: '🟠 High', value: 'High', color: 'failure' },
    { label: '🔴 Urgent', value: 'Urgent', color: 'failure' },
  ];

  /* ================= PRIORITY COLOR ================= */

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Low':
        return <Badge color="success">Low</Badge>;

      case 'Medium':
        return <Badge color="warning">Medium</Badge>;

      case 'High':
        return <Badge color="failure">High</Badge>;

      case 'Urgent':
        return <Badge color="failure">Urgent</Badge>;

      default:
        return <Badge color="gray">Pending</Badge>;
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.task_title) {
      toast.error('Task title is required');
      return;
    }

    if (!formData.assign_to) {
      toast.error('Please select assign user');
      return;
    }

    if (!formData.priority) {
      toast.error('Please select priority');
      return;
    }

    if (!formData.due_date) {
      toast.error('Please select due date');
      return;
    }

    try {
      const payload = {
        ...formData,
      };

      await dispatch(addTask(payload)).unwrap();

      toast.success('Task Assigned Successfully ✅');

      dispatch(getTask());

      setFormData({
        task_title: '',
        assign_to: '',
        priority: '',
        due_date: '',
        task_description: '',
        remarks: '',
        status: 'Pending',
      });

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to assign task');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="5xl" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= HEADER ================= */}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Task Assignment</h3>

              <p className="text-sm text-gray-500 mt-1">Assign new task to employee</p>
            </div>

            <div>{getPriorityBadge(formData.priority)}</div>
          </div>

          {/* ================= TASK INFO ================= */}

          <div className="border rounded-2xl p-6 bg-gray-50 shadow-sm">
            <h4 className="font-semibold text-lg mb-5 text-gray-700">Task Information</h4>

            <div className="grid grid-cols-12 gap-5">
              {/* TASK TITLE */}

              <div className="col-span-12 md:col-span-6">
                <Label value="Task Title" className="mb-2 block" />

                <TextInput
                  placeholder="Enter task title"
                  value={formData.task_title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      task_title: e.target.value,
                    })
                  }
                />
              </div>

              {/* ASSIGN TO */}

              <div className="col-span-12 md:col-span-6">
                <Label value="Assign To" className="mb-2 block" />

                <Select
                  options={usersOptions}
                  placeholder="Select Employee"
                  onChange={(v: any) =>
                    setFormData({
                      ...formData,
                      assign_to: v?.value,
                    })
                  }
                />
              </div>

              {/* PRIORITY */}

              <div className="col-span-12 md:col-span-6">
                <Label value="Priority" className="mb-2 block" />

                <Select
                  options={priorityOptions}
                  placeholder="Select Priority"
                  onChange={(v: any) =>
                    setFormData({
                      ...formData,
                      priority: v?.value,
                    })
                  }
                />
              </div>

              {/* DUE DATE */}

              <div className="col-span-12 md:col-span-6">
                <Label value="Due Date" className="mb-2 block" />

                <TextInput
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      due_date: e.target.value,
                    })
                  }
                />
              </div>

              {/* DESCRIPTION */}

              <div className="col-span-12">
                <Label value="Task Description" className="mb-2 block" />

                <Textarea
                  rows={5}
                  placeholder="Enter task description..."
                  value={formData.task_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      task_description: e.target.value,
                    })
                  }
                />
              </div>

              {/* REMARKS */}
            </div>
          </div>

          {/* ================= ACTION ================= */}

          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskManagerModal;
