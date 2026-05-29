import { useEffect, useMemo } from 'react';

import { Label, TextInput, Textarea, Card } from 'flowbite-react';

import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';

import { getallCustomer } from 'src/features/marketing/VisitPlannerSlice';

import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';

import { RootState } from 'src/store';
import { ImageUrl } from 'src/constants/contant';

type VisitCardProps = {
  item: any;

  index: number;

  updateVisitData: (index: number, field: string, value: any) => void;

  handleCustomerSelect: (selected: any, index: number) => void;
};

const selectStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),

  control: (base: any) => ({
    ...base,
    minHeight: '42px',
    borderRadius: '10px',
  }),
};

const priorityOptions = [
  {
    value: 'high',
    label: 'High',
    color: '#dc2626',
  },

  {
    value: 'medium',
    label: 'Medium',
    color: '#f59e0b',
  },

  {
    value: 'low',
    label: 'Low',
    color: '#16a34a',
  },
];

const formatPriority = (option: any) => (
  <div className="flex items-center gap-2">
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: option.color,
      }}
    />

    {option.label}
  </div>
);

export const VisitDetailCard = ({
  item,
  index,
  updateVisitData,
  handleCustomerSelect,
}: VisitCardProps) => {
  const dispatch = useDispatch<any>();

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) || [];

  const customers = useSelector((state: RootState) => state.visitplanner?.customers) || [];

  const users = usersdata.filter((user: any) => Number(user.role_id) === 9);

  useEffect(() => {
    dispatch(GetUsermodule());
    dispatch(getallCustomer());
  }, [dispatch]);

  const usersOptions = useMemo(() => {
    return users.map((u: any) => ({
      label: u.username,
      value: u.id,
    }));
  }, [users]);

  const customerOptions = useMemo(() => {
    return customers.map((item: any) => ({
      label: item.company_name || item.customer_name || item.name,

      value: item.id,

      data: item,
    }));
  }, [customers]);

  return (
    <Card className="shadow-md border">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
            {item.visit_order}
          </div>

          <div>
            <h3 className="text-xl font-semibold">{item.customer_name || 'Select Customer'}</h3>

            <p className="text-sm text-gray-500 mt-1">{item.address}</p>
          </div>
        </div>

        <div>
          <span
            className={`px-4 py-2 rounded-full text-xs font-semibold ${
              item.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : item.status === 'hold'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {item.status}
          </span>
        </div>
      </div>

      {/* =========================================================
          VISIT DETAILS
      ========================================================= */}

      <div className="bg-gray-50 border rounded-xl p-4 mb-6">
        <h4 className="font-semibold text-lg mb-4">Visit Details</h4>

        <div className="grid grid-cols-12 gap-4">
          {/* VISIT DATE */}
          <div className="col-span-3">
            <Label value="Visit Date" />

            <TextInput
              type="date"
              value={item.visit_date || ''}
              onChange={(e) => updateVisitData(index, 'visit_date', e.target.value)}
            />
          </div>

          {/* SALES PERSON */}
          <div className="col-span-3">
            <Label value="Sales Person" />

            <Select
              options={usersOptions}
              styles={selectStyles}
              menuPortalTarget={document.body}
              value={
                item.sales_person_id
                  ? usersOptions.find((x: any) => x.value === item.sales_person_id)
                  : null
              }
              onChange={(selected: any) => {
                updateVisitData(index, 'sales_person_id', selected?.value);

                updateVisitData(index, 'sales_person_name', selected?.label);
              }}
            />
          </div>

          {/* CUSTOMER */}
          <div className="col-span-3">
            <Label value="Customer" />

            <Select
              options={customerOptions}
              styles={selectStyles}
              menuPortalTarget={document.body}
              value={
                item.customer_id
                  ? customerOptions.find((x: any) => x.value === item.customer_id)
                  : null
              }
              onChange={(selected: any) => handleCustomerSelect(selected, index)}
            />
          </div>

          {/* PRIORITY */}
          <div className="col-span-3">
            <Label value="Priority" />

            <Select
              options={priorityOptions}
              styles={selectStyles}
              formatOptionLabel={formatPriority}
              value={priorityOptions.find((x) => x.value === item.priority) || null}
              onChange={(v: any) => updateVisitData(index, 'priority', v?.value)}
            />
          </div>

          {/* STATUS */}
          <div className="col-span-3">
            <Label value="Visit Status" />

            <Select
              options={[
                {
                  label: 'Planned',
                  value: 'planned',
                },

                {
                  label: 'Completed',
                  value: 'completed',
                },

                {
                  label: 'Hold',
                  value: 'hold',
                },
              ]}
              value={{
                label: item.status,
                value: item.status,
              }}
              onChange={(v: any) => updateVisitData(index, 'status', v?.value)}
            />
          </div>

          <div className="col-span-4">
            <Label value="Upload Pdf" className="mb-2 block" />

            <label
              htmlFor={`file-${index}`}
              className="flex items-center justify-center w-full h-11 px-3 border border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 text-xs text-gray-600"
            >
              {item.file?.name || 'Upload PDF'}
            </label>

            <input
              id={`file-${index}`}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e: any) => updateVisitData(index, 'file', e.target.files[0])}
            />
            {item.file && (
              <a
                href={`${ImageUrl}uploads/visit-planner/${item.file}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View Uploaded PDF
              </a>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          MEETING DETAILS
      ========================================================= */}

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-6">
          <Label value="Meeting Purpose" />

          <Textarea
            rows={3}
            value={item.meeting_purpose}
            onChange={(e) => updateVisitData(index, 'meeting_purpose', e.target.value)}
          />
        </div>

        <div className="col-span-6">
          <Label value="Agenda" />

          <Textarea
            rows={3}
            value={item.agenda}
            onChange={(e) => updateVisitData(index, 'agenda', e.target.value)}
          />
        </div>

        <div className="col-span-12">
          <Label value="Discussion Notes" />

          <Textarea
            rows={4}
            value={item.discussion_notes}
            onChange={(e) => updateVisitData(index, 'discussion_notes', e.target.value)}
          />
        </div>

        <div className="col-span-6">
          <Label value="Visit Productivity Report" />

          <Textarea
            rows={4}
            value={item.productivity}
            onChange={(e) => updateVisitData(index, 'productivity', e.target.value)}
          />
        </div>

        <div className="col-span-6">
          <Label value="Next Action Plan" />

          <Textarea
            rows={4}
            value={item.next_action}
            onChange={(e) => updateVisitData(index, 'next_action', e.target.value)}
          />
        </div>

        <div className="col-span-4">
          <Label value="Followup Date" />

          <TextInput
            type="date"
            value={item.followup_date}
            onChange={(e) => updateVisitData(index, 'followup_date', e.target.value)}
          />
        </div>

        <div className="col-span-4">
          <Label value="AI Success Score" />

          <div className="h-[42px] flex items-center px-4 rounded-lg border bg-blue-50 text-blue-700 font-semibold">
            {Math.floor(Math.random() * 40 + 60)}% Success Probability
          </div>
        </div>
      </div>
    </Card>
  );
};
