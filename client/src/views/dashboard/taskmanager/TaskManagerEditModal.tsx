import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea, Badge } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { toast } from 'react-toastify';

import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';

import { getTask, updateTask } from 'src/features/dashboard/TaskManagerSlice';

interface Props {
  openModal: boolean;
  selectedRow: any;
  setOpenModal: (val: boolean) => void;
}

const TaskManagerEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  /* ================= LOAD USERS ================= */

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

  /* ================= SET EDIT DATA ================= */

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        task_title: selectedRow?.task_title || '',
        assign_to: selectedRow?.assign_to || '',
        priority: selectedRow?.priority || '',
        due_date: selectedRow?.due_date || '',
        task_description: selectedRow?.task_description || '',
      });
    }
  }, [selectedRow]);

  /* ================= OPTIONS ================= */

  const usersOptions = usersdata?.map((user: any) => ({
    label: user.username,
    value: user.id,
  }));

  const priorityOptions = [
    { label: '🟢 Low', value: 'Low' },
    { label: '🟡 Medium', value: 'Medium' },
    { label: '🟠 High', value: 'High' },
    { label: '🔴 Urgent', value: 'Urgent' },
  ];

  /* ================= PRIORITY BADGE ================= */

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
        id: selectedRow?.id,
        formData,
      };

      await dispatch(updateTask(payload)).unwrap();

      toast.success('Task Updated Successfully ✅');

      dispatch(getTask());

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update task');
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
              <h3 className="text-2xl font-bold text-gray-800">Update Task</h3>

              <p className="text-sm text-gray-500 mt-1">Edit assigned task details</p>
            </div>

            <div>{getPriorityBadge(formData.priority)}</div>
          </div>

          {/* ================= FORM ================= */}

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
                  value={usersOptions.find((item: any) => item.value === formData.assign_to)}
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
                  value={priorityOptions.find((item: any) => item.value === formData.priority)}
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

              {/* STATUS */}

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
            </div>
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="blue" type="submit">
              Update Task
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskManagerEditModal;
