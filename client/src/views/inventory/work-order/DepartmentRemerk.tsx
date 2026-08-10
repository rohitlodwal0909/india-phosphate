import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Textarea,
} from 'flowbite-react';

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { departaddRemark } from 'src/features/marketing/PurchaseOrderSlice';
import { AppDispatch } from 'src/store';

interface AddModalProps {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
}

interface Department {
  name: string;
  color: string;
}

const DepartmentRemerk: React.FC<AddModalProps> = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [remark, setRemark] = useState('');
  const [department, setDepartment] = useState('');
  const [showDepartments, setShowDepartments] = useState(false);

  // =========================
  // Departments
  // =========================

  const departments: Department[] = [
    {
      name: 'Marketing',
      color: '#1976D2',
    },
    {
      name: 'Dispatch',
      color: '#6A1B9A',
    },
    {
      name: 'Production',
      color: '#16844A',
    },
    {
      name: 'Customer',
      color: '#5A4215',
    },
    {
      name: 'QA',
      color: '#A54E00',
    },
  ];

  // =========================
  // Load Existing Data
  // =========================

  useEffect(() => {
    if (selectedRow?.workNo?.department_remark) {
      setRemark(selectedRow.workNo.department_remark);
    } else {
      setRemark('');
    }

    if (selectedRow?.workNo?.department) {
      setDepartment(selectedRow.workNo.department);
    } else {
      setDepartment('');
    }

    setShowDepartments(false);
  }, [selectedRow]);

  // =========================
  // Close Dropdown Outside
  // =========================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDepartments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // =========================
  // Selected Department
  // =========================

  const selectedDepartment = departments.find((item) => item.name === department);

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!department) {
      toast.error('Please select department');
      return;
    }

    if (!remark.trim()) {
      toast.error('Remark is required');
      return;
    }

    try {
      const payload = {
        id: selectedRow?.workNo?.id || null,
        po_id: selectedRow?.id || null,
        department: department,
        remark: remark.trim(),
      };

      const result = await dispatch(departaddRemark(payload)).unwrap();

      toast.success(result?.message || 'Remark submitted!');

      // Close modal
      setPlaceModal(false);
      // Reset form
      setRemark('');
      setDepartment('');
      setShowDepartments(false);
    } catch (err: any) {
      toast.error(err?.message || err || 'Something went wrong');
    }
  };

  // =========================
  // Cancel
  // =========================

  const handleCancel = () => {
    setPlaceModal(false);
    setRemark('');
    setDepartment('');
    setShowDepartments(false);
  };

  // =========================
  // JSX
  // =========================

  return (
    <Modal show={placeModal} position="center" onClose={handleCancel} className="large">
      <ModalHeader>Add Remark</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          {/* =========================
              Department
          ========================= */}

          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="department" value="Department" />

              <span className="text-red-700 ps-1">*</span>
            </div>

            <div ref={dropdownRef} className="relative">
              {/* Selected Department */}
              <button
                type="button"
                id="department"
                onClick={() => setShowDepartments(!showDepartments)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <div className="flex items-center gap-2">
                  {selectedDepartment ? (
                    <>
                      {/* Color */}
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: selectedDepartment.color,
                        }}
                      />

                      {/* Name */}
                      <span>{selectedDepartment.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Select Department</span>
                  )}
                </div>

                {/* Arrow */}
                <svg
                  className={`h-4 w-4 transition-transform ${showDepartments ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* =========================
                  Dropdown Options
              ========================= */}

              {showDepartments && (
                <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  {departments.map((item) => {
                    const isSelected = department === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setDepartment(item.name);

                          setShowDepartments(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                          isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Color */}
                        <span
                          className="h-5 w-5 rounded-full"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />

                        {/* Department Name */}
                        <span className="font-medium text-gray-700">{item.name}</span>

                        {/* Selected Tick */}
                        {isSelected && (
                          <svg
                            className="ml-auto h-5 w-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* =========================
              Remark
          ========================= */}

          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="remark" value="Remark" />

              <span className="text-red-700 ps-1">*</span>
            </div>

            <Textarea
              id="remark"
              placeholder="Enter Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              required
              rows={4}
            />
          </div>

          {/* =========================
              Buttons
          ========================= */}

          <div className="col-span-12 flex items-center justify-end gap-4">
            <Button type="button" color="error" onClick={handleCancel}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>

      <ModalFooter />
    </Modal>
  );
};

export default DepartmentRemerk;
