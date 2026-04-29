import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedDate?: string;
}

const meetingTypeOptions = [
  { value: 'internal', label: 'Internal Meeting' },
  { value: 'client', label: 'Client Meeting' },
];

const platformOptions = [
  { value: 'Google Meet', label: 'Google Meet' },
  { value: 'Zoom', label: 'Zoom' },
];

const CalanderModal: React.FC<Props> = ({ openModal, setOpenModal, selectedDate }) => {
  /* ================= STATE ================= */

  const [formData, setFormData] = useState<any>({
    title: '',
    meeting_type: '',
    platform: '',
    meeting_date: '',
    meeting_time: '',
    invited_person: '',
    description: '',
    meeting_link: '',
  });

  /* ================= AUTO DATE ================= */

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev: any) => ({
        ...prev,
        meeting_date: selectedDate,
      }));
    }
  }, [selectedDate]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ================= LINK GENERATOR ================= */

  const generateMeetingLink = () => {
    const random = Math.random().toString(36).substring(2, 10);

    if (formData.platform === 'Google Meet') {
      handleChange('meeting_link', `https://meet.google.com/${random}`);
    } else if (formData.platform === 'Zoom') {
      handleChange('meeting_link', `https://zoom.us/j/${Date.now()}`);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!formData.title) return toast.error('Meeting title required');
    if (!formData.meeting_date) return toast.error('Select date');
    if (!formData.meeting_time) return toast.error('Select time');

    console.log('MEETING DATA =>', formData);

    toast.success('Meeting Scheduled Successfully ✅');

    setOpenModal(false);
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} size="5xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>
        <div className="flex items-center gap-2">
          <Icon icon="tabler:calendar-plus" width={22} />
          <span className="text-lg font-semibold">Schedule Meeting</span>
        </div>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 p-5 rounded-xl">
            <div className="col-span-6">
              <Label value="Meeting Title / Subject" />
              <TextInput
                placeholder="Enter meeting title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="col-span-3">
              <Label value="Meeting Type" />
              <Select
                options={meetingTypeOptions}
                onChange={(v: any) => handleChange('meeting_type', v.value)}
              />
            </div>

            <div className="col-span-3">
              <Label value="Platform" />
              <Select
                options={platformOptions}
                formatOptionLabel={(opt) => (
                  <div className="flex gap-2 items-center">
                    <Icon
                      icon={opt.value === 'Google Meet' ? 'logos:google-meet' : 'logos:zoom'}
                      width={20}
                    />
                    {opt.label}
                  </div>
                )}
                onChange={(v: any) => {
                  handleChange('platform', v.value);
                  setTimeout(generateMeetingLink, 200);
                }}
              />
            </div>
          </div>

          {/* DATE TIME */}
          <div className="grid grid-cols-12 gap-4 bg-gray-50 p-5 rounded-xl">
            <div className="col-span-6">
              <Label value="Meeting Date" />
              <TextInput
                type="date"
                value={formData.meeting_date}
                onChange={(e) => handleChange('meeting_date', e.target.value)}
              />
            </div>

            <div className="col-span-6">
              <Label value="Meeting Time" />
              <TextInput
                type="time"
                value={formData.meeting_time}
                onChange={(e) => handleChange('meeting_time', e.target.value)}
              />
            </div>
          </div>

          {/* INVITE SECTION */}
          <div className="bg-gray-50 p-5 rounded-xl space-y-4">
            <div>
              <Label value="Invited Persons (Emails comma separated)" />
              <TextInput
                placeholder="client@gmail.com, team@gmail.com"
                value={formData.invited_person}
                onChange={(e) => handleChange('invited_person', e.target.value)}
              />
            </div>

            <div>
              <Label value="Meeting Link" />
              <TextInput value={formData.meeting_link} disabled />
            </div>

            <div>
              <Label value="Meeting Description / Agenda" />
              <Textarea
                rows={3}
                placeholder="Meeting agenda..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Schedule Meeting
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CalanderModal;
