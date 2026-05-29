import { Modal, Button, Badge } from 'flowbite-react';
import { Icon } from '@iconify/react';
import MeetingCountdown from './MeetingCountdown';
import { useDispatch } from 'react-redux';
import { meetingComplete } from 'src/features/marketing/CalanderSlice';
import { toast } from 'react-toastify';

const UpcomingMeeting = ({ open, setOpen, upcomingMeeting, permissions }: any) => {
  const dispatch = useDispatch<any>();

  if (!upcomingMeeting) return null;

  const meetings = Array.isArray(upcomingMeeting) ? upcomingMeeting : [upcomingMeeting];

  /* ================= COMPLETE ================= */

  const handleComplete = async (id: number) => {
    try {
      await dispatch(meetingComplete({ id })).unwrap();

      toast.success('Meeting completed successfully ✅');
    } catch (error: any) {
      console.error(error);

      toast.error(error?.message || 'Failed to complete meeting ❌');
    }
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'success';

    if (status === 'Pending') return 'warning';

    return 'failure';
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="7xl">
      <Modal.Header>
        <div className="flex items-center gap-2">
          <Icon icon="tabler:calendar-event" width={22} />
          Upcoming Meetings
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left font-semibold">#</th>

                <th className="p-4 text-left font-semibold">Meeting Title</th>

                <th className="p-4 text-left font-semibold">Type</th>

                <th className="p-4 text-left font-semibold">Date</th>

                <th className="p-4 text-left font-semibold">Time</th>

                <th className="p-4 text-left font-semibold">Participants</th>

                <th className="p-4 text-left font-semibold">Status</th>

                <th className="p-4 text-left font-semibold">Countdown</th>

                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {meetings.length > 0 ? (
                meetings.map((meeting: any, index: number) => {
                  const isClientMeeting = meeting?.meeting_type === 'client';

                  const participants = meeting?.invites_meetings || [];

                  return (
                    <tr key={meeting.id} className="border-t hover:bg-gray-50 transition">
                      {/* SR */}
                      <td className="p-4 font-semibold text-gray-700">{index + 1}</td>

                      {/* TITLE */}
                      <td className="p-4 min-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {meeting.meeting_title}
                          </span>

                          {meeting.meeting_link && (
                            <a
                              href={meeting.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-gray-500 mt-1 hover:underline"
                            >
                              Join Link Available
                            </a>
                          )}
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="p-4">
                        <Badge color="gray">{meeting.meeting_type || '-'}</Badge>
                      </td>

                      {/* DATE */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Icon icon="tabler:calendar" width={16} className="text-gray-500" />

                          {meeting.date}
                        </div>
                      </td>

                      {/* TIME */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Icon icon="tabler:clock" width={16} className="text-gray-500" />

                          {meeting.time}
                        </div>
                      </td>

                      {/* PARTICIPANTS */}
                      <td className="p-4 min-w-[260px]">
                        <div className="flex flex-wrap gap-2">
                          {participants.length > 0 ? (
                            participants.map((p: any, i: number) => (
                              <Badge key={i} color="light" className="px-2 py-1">
                                {isClientMeeting ? p?.email || p?.client_email : p?.users?.username}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No Participants</span>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <Badge color={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                      </td>

                      {/* COUNTDOWN */}
                      <td className="p-4 min-w-[220px]">
                        {meeting.status !== 'Completed' ? (
                          <MeetingCountdown date={meeting.date} time={meeting.time} />
                        ) : (
                          <span className="text-green-600 font-medium text-sm">Completed</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          {meeting.meeting_link && (
                            <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
                              <Button size="xs" color="gray" className="w-full">
                                <div className="flex items-center gap-2">
                                  <Icon icon="tabler:video" width={16} />
                                  Join
                                </div>
                              </Button>
                            </a>
                          )}

                          {permissions?.edit && meeting.status !== 'Completed' && (
                            <Button
                              size="xs"
                              color="success"
                              onClick={() => handleComplete(meeting.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Icon icon="tabler:check" width={16} />
                                Complete
                              </div>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    No Upcoming Meetings Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default UpcomingMeeting;
