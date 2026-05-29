import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { addMeeting, getMeeting } from 'src/features/marketing/CalanderSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedDate?: string;
}

const meetingTypeOptions = [
  { value: 'internal', label: 'Internal Meeting' },
  { value: 'client', label: 'Client Meeting' },
];

// const platformOptions = [
//   { value: 'Google Meet', label: 'Google Meet', icon: 'logos:google-meet' },
//   { value: 'Zoom', label: 'Zoom', icon: 'logos:zoom' },
//   { value: 'Microsoft Teams', label: 'Microsoft Teams', icon: 'logos:microsoft-teams' },
//   { value: 'Skype', label: 'Skype', icon: 'logos:skype' },
//   { value: 'Whatsapp', label: 'Whatsapp', icon: 'logos:whatsapp-icon' },
//   { value: 'Telephonic', label: 'Telephonic', icon: 'mdi:phone' },
// ];

const CalanderModal: React.FC<Props> = ({ openModal, setOpenModal, selectedDate }) => {
  const dispatch = useDispatch<any>();

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];

  const usersOptions = usersdata.map((u: any) => ({
    label: u.username,
    value: u.id,
  }));

  useEffect(() => {
    dispatch(GetUsermodule());
  }, [dispatch]);

  /* ================= STATE ================= */

  const [formData, setFormData] = useState<any>({
    title: '',
    meeting_type: '',
    // platform: '',
    meeting_date: '',
    meeting_time: '',
    internal_users: [],
    // external_emails: '',
    description: '',
    // meeting_link: '',
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

  // const generateMeetingLink = () => {
  //   const random = Math.random().toString(36).substring(2, 10);

  //   switch (formData.platform) {
  //     case 'Google Meet':
  //       handleChange('meeting_link', `https://meet.google.com/${random}`);
  //       break;
  //     case 'Zoom':
  //       handleChange('meeting_link', `https://zoom.us/j/${Date.now()}`);
  //       break;
  //     case 'Microsoft Teams':
  //       handleChange('meeting_link', `https://teams.microsoft.com/l/meetup-join/${random}`);
  //       break;
  //     default:
  //       handleChange('meeting_link', '');
  //   }
  // };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      /* ================= VALIDATION ================= */

      if (!formData.title) return toast.error('Meeting title required');

      if (!formData.meeting_date) return toast.error('Select meeting date');

      if (!formData.meeting_time) return toast.error('Select meeting time');

      // if (!formData.platform) return toast.error('Select platform');

      if (formData.meeting_type === 'internal' && formData.internal_users.length === 0) {
        return toast.error('Select internal users');
      }

      /* ================= PAYLOAD ================= */

      const payload = {
        meeting_title: formData.title,
        meeting_type: formData.meeting_type,
        // platform: formData.platform,
        date: formData.meeting_date,
        time: formData.meeting_time,
        // meeting_link: formData.meeting_link,
        description: formData.description,
        internal_users: formData.internal_users,
        // external_emails: formData.external_emails,
      };

      // console.log('PAYLOAD', payload);

      /* ================= API CALL ================= */

      const response = await dispatch(addMeeting(payload)).unwrap();
      dispatch(getMeeting());

      toast.success(response.message || 'Meeting Scheduled Successfully ✅');

      /* ================= RESET FORM ================= */

      setFormData({
        title: '',
        meeting_type: '',
        // platform: '',
        meeting_date: '',
        meeting_time: '',
        internal_users: [],
        // external_emails: '',
        description: '',
        // meeting_link: '',
      });

      setOpenModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
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

            <div className="col-span-6">
              <Label value="Meeting Type" />
              <Select
                options={meetingTypeOptions}
                onChange={(v: any) => handleChange('meeting_type', v.value)}
              />
            </div>

            {/* <div className="col-span-3">
              <Label value="Platform" />
              <Select
                options={platformOptions}
                formatOptionLabel={(opt: any) => (
                  <div className="flex gap-2 items-center">
                    <Icon icon={opt.icon} width={20} />
                    {opt.label}
                  </div>
                )}
                onChange={(v: any) => {
                  handleChange('platform', v.value);
                  setTimeout(generateMeetingLink, 200);
                }}
              />
            </div> */}

            {formData.meeting_type === 'internal' && (
              <div className="col-span-4">
                <Label value="Invite person" />
                <Select
                  isMulti
                  options={usersOptions}
                  onChange={(v: any) =>
                    handleChange(
                      'internal_users',
                      v.map((x: any) => x.value),
                    )
                  }
                />
              </div>
            )}
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
            {/* <div>
              <Label value="Invited Persons (Emails comma separated)" />
              <TextInput
                placeholder="client@gmail.com, team@gmail.com"
                value={formData.external_emails}
                onChange={(e) => handleChange('external_emails', e.target.value)}
              />
            </div> */}

            {/* <div>
              <Label value="Meeting Link" />
              <TextInput value={formData.meeting_link} disabled />
            </div> */}

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
