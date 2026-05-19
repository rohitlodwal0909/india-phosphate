import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

const MeetingCountdown = ({ date, time }: any) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!date || !time) return;

    const updateCountdown = () => {
      const meetingTime = new Date(`${date}T${time}`).getTime();
      const now = new Date().getTime();
      const diff = meetingTime - now;

      if (diff <= 0) {
        setCountdown('Meeting Started');
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [date, time]);

  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <Icon icon="tabler:clock-hour-4" width={24} />
      <div>
        <p className="text-sm text-gray-500">Meeting Starts In</p>
        <p className="font-semibold text-lg">{countdown}</p>
      </div>
    </div>
  );
};

export default MeetingCountdown;
