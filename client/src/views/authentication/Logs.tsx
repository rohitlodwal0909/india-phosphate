import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardBox from 'src/components/shared/CardBox';
import { GetallLogs } from 'src/features/authentication/AuthenticationSlice';
import { AppDispatch } from 'src/store';
import { formatDate, formatTime } from 'src/utils/Datetimeformate';

type LogType = {
  id: number;
  message: string;
  createdAt: string;
};

const Logs: React.FC = () => {
  const logsdata = useSelector((state: any) => state.authentication?.logdata);
  const [logs, setLogs] = useState<LogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 30;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (logsdata?.data) {
      setLogs(logsdata.data);
    }
  }, [logsdata?.data]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        await dispatch(GetallLogs()).unwrap();
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const cleanMessage = (message: string) => {
    let clean = message.replace(/'/g, '');

    const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/;
    const timeRegex = /\b\d{2}:\d{2}:\d{2}\b/;

    const dateMatch = clean.match(dateRegex);
    const timeMatch = clean.match(timeRegex);

    const date = dateMatch ? dateMatch[0] : '';
    const time = timeMatch ? timeMatch[0] : '';

    clean = clean.replace(dateRegex, '').replace(timeRegex, '').replace(/\s+at\s+/, '').replace(/\s+on\s+/, '');

    return {
      cleanMessage: clean.trim().replace(/\s+/g, ' '),
      date,
      time,
    };
  };

  // Pagination calculations
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <CardBox>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Logs</h1>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-gray-500">No logs found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left ">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 border-b">#</th>
                  <th className="py-3 px-4 border-b">Message</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, idx) => {
                  const { cleanMessage: msg, date, time } = cleanMessage(log.message);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{indexOfFirstLog + idx + 1}</td>
                      <td className="py-2 px-4 border-b">{msg}</td>
                      <td className="py-2 px-4 border-b">{date ? formatDate(date) : '-'}</td>
                      <td className="py-2 px-4 border-b">{time ? formatTime(time) : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </CardBox>
  );
};

export default Logs;
