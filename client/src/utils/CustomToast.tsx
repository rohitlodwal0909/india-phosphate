import { Toast } from 'flowbite-react';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

interface CustomToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const CustomToast = ({ message, type = 'success', onClose }: CustomToastProps) => {
  const isError = type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50">
      <Toast
        className={`p-4 rounded-sm shadow-lg ${isError ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}
      >
        {isError ? (
          <HiExclamationCircle className="h-6 w-6 text-red-500" />
        ) : (
          <HiCheckCircle className="h-6 w-6 text-green-500" />
        )}
        <div className={`ml-3 text-sm font-medium ${isError ? 'text-red-800' : 'text-green-800'}`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ×
        </button>
      </Toast>
    </div>
  );
};

export default CustomToast;
