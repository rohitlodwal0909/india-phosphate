import { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import Portal from 'src/utils/Portal';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import CalanderModal from './CalanderModal';

interface MeetingType {
  id: number;
  title: string;
  meeting_date: string;
  meeting_time: string;
  meeting_type: string;
  invited_person: string;
  status: string;
}

const CalendarTable = () => {
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(
    () => getPermissions(logindata, selectedIconId, 5),
    [logindata, selectedIconId],
  );

  /* ================= STATES ================= */

  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  /* ================= DEMO DATA ================= */

  useEffect(() => {
    setMeetings([
      {
        id: 1,
        title: 'Client Discussion',
        meeting_date: '2026-04-29',
        meeting_time: '11:00',
        meeting_type: 'Google Meet',
        invited_person: 'client@gmail.com',
        status: 'Pending',
      },
      {
        id: 2,
        title: 'Internal Sales Meeting',
        meeting_date: '2026-04-30',
        meeting_time: '15:30',
        meeting_type: 'Zoom',
        invited_person: 'team@company.com',
        status: 'Completed',
      },
    ]);
  }, []);

  /* ================= CALENDAR EVENTS ================= */

  const calendarEvents = useMemo(() => {
    return meetings.map((m) => {
      let color = '#1a73e8'; // default

      if (m.status === 'Completed') color = '#22c55e';
      if (m.status === 'Pending') color = '#f59e0b';
      if (m.status === 'Cancelled') color = '#ef4444';

      return {
        id: String(m.id),
        title: m.title,
        start: `${m.meeting_date}T${m.meeting_time}`,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          platform: m.meeting_type,
          invited: m.invited_person,
          status: m.status,
        },
      };
    });
  }, [meetings]);

  /* ================= HANDLERS ================= */

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setOpenAdd(true);
  };

  const handleEventClick = (info: any) => {
    alert(`Meeting: ${info.event.title}`);
  };

  /* ================= STATS ================= */

  const today = new Date().toISOString().slice(0, 10);

  const totalMeetings = meetings.length;
  const todayMeetings = meetings.filter((m) => m.meeting_date === today).length;

  const upcomingMeetings = totalMeetings - todayMeetings;

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between flex-wrap gap-3 items-center">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Icon icon="tabler:calendar-event" width={26} />
            Teams Calendar
          </h2>
          <p className="text-sm text-gray-500">Schedule internal & client meetings</p>
        </div>

        {permissions?.add && (
          <Button onClick={() => setOpenAdd(true)} className="flex gap-2 items-center bg-primary">
            <Icon icon="tabler:calendar-plus" width={18} />
            Create Meeting
          </Button>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Total Meetings</p>
          <h3 className="text-2xl font-semibold">{totalMeetings}</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Today Meetings</p>
          <h3 className="text-2xl font-semibold">{todayMeetings}</h3>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm">Upcoming</p>
          <h3 className="text-2xl font-semibold">{upcomingMeetings}</h3>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="flex-1 bg-white rounded-2xl shadow border p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          editable
          height="80vh"
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          nowIndicator
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: true,
          }}
        />
      </div>

      {/* MODAL */}
      {openAdd && (
        <Portal>
          <CalanderModal
            openModal={openAdd}
            setOpenModal={setOpenAdd}
            selectedDate={selectedDate}
          />
        </Portal>
      )}
    </div>
  );
};

export default CalendarTable;
