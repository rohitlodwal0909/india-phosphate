import { Modal, Button, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import MeetingCountdown from './MeetingCountdown';
import { useDispatch } from 'react-redux';
import { meetingComplete } from 'src/features/marketing/CalanderSlice';
import { toast } from 'react-toastify';

const MeetingViewModal = ({ open, setOpen, meeting, permissions }: any) => {
  const dispatch = useDispatch<any>();

  if (!meeting) return null;

  /* ================= STATUS COLOR ================= */

  const statusColor =
    meeting.status === 'Completed'
      ? 'success'
      : meeting.status === 'Pending'
        ? 'warning'
        : 'failure';

  /* ================= COUNTDOWN ================= */

  const isClientMeeting = meeting?.meeting_type === 'client';

  const participant = meeting?.invites_meetings || [];

  const handleComplete = async (id) => {
    try {
      await dispatch(meetingComplete({ id })).unwrap();

      toast.success('Meeting completed successfully ✅');
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(error?.message || 'Failed to complete meeting ❌');
    }
  };
  /* ================= PLATFORM BADGE ================= */

  //   const platformIcon =
  //     meeting.platform === 'Zoom'
  //       ? 'logos:zoom-icon'
  //       : meeting.platform === 'Google Meet'
  //         ? 'logos:google-meet'
  //         : 'tabler:users';

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="2xl">
      {/* HEADER */}
      <Modal.Header>
        <div className="flex items-center gap-2">
          <Icon icon="tabler:calendar-event" width={22} />
          Meeting Overview
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
          {/* TITLE SECTION */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-xl p-5">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="tabler:briefcase" width={20} />
              {meeting.meeting_title}
            </h3>

            <div className="flex gap-3 mt-3 flex-wrap">
              <Badge color={statusColor}>{meeting.status}</Badge>

              {/* <Badge color="info" className="flex items-center gap-1">
                {meeting.platform}
              </Badge> */}
            </div>
          </div>

          {/* COUNTDOWN CARD */}
          {meeting.status !== 'Completed' && (
            <MeetingCountdown date={meeting.date} time={meeting.time} />
          )}

          {/* DETAILS GRID */}
          <div className="grid md:grid-cols-2 gap-5">
            <InfoItem icon="tabler:calendar" label="Date" value={meeting.date} />

            <InfoItem icon="tabler:clock" label="Time" value={meeting.time} />

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="tabler:users" width={20} />
                <p className="font-medium">
                  {isClientMeeting ? 'Client Participants' : 'Internal Participants'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {participant.length > 0 ? (
                  participant.map((p: any, index: number) => (
                    <Badge
                      key={index}
                      color="gray"
                      className="flex items-center gap-2 px-3 py-2 text-sm"
                    >
                      {isClientMeeting ? p?.email || p?.client_email : p?.users?.username}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No participants added</p>
                )}
              </div>
            </div>

            <InfoItem icon="tabler:building" label="Meeting Type" value={meeting.meeting_type} />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-3 border-t pt-4">
            {meeting.meeting_link && (
              <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
                <Button color="primary" className="flex gap-2 items-center">
                  <Icon icon="tabler:video" width={18} />
                  Join Meeting
                </Button>
              </a>
            )}

            {permissions?.edit && meeting.status !== 'Completed' && (
              <Button
                color="success"
                className="flex gap-2 items-center"
                onClick={() => handleComplete(meeting.id)}
              >
                <Icon icon="tabler:check" width={18} />
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button color="gray" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/* ================= REUSABLE INFO ITEM ================= */

const InfoItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
    <Icon icon={icon} width={20} className="text-primary" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  </div>
);

export default MeetingViewModal;
