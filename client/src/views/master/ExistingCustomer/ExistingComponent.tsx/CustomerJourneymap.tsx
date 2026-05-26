import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'src/store';
import { customerJourneydata } from 'src/features/master/Customer/CustomerSlice';

/*
=====================================================
DATE FORMATTER
=====================================================
*/

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/*
=====================================================
CREATE DYNAMIC JOURNEY STAGES
=====================================================
*/

const createJourneyData = (data: any) => {
  return [
    {
      key: 'customer',
      title: 'Customer',
      icon: 'solar:user-plus-outline',
      color: 'bg-yellow-500',
      active: !!data?.customer,
      date: data?.customer?.created_at,
      left: '5%',
      top: '220px',
    },

    /*
    =========================================
    ENQUIRY AFTER PO
    =========================================
    */

    {
      key: 'development',
      title: 'Development',
      icon: 'solar:clipboard-text-outline',
      color: 'bg-pink-500',
      active: !!data?.development,
      date: data?.development?.created_at,
      left: '18%',
      top: '110px',
    },

    {
      key: 'samplerequest',
      title: 'Sample Request',
      icon: 'solar:file-text-outline',
      color: 'bg-fuchsia-500',
      active: !!data?.samplerequest,
      date: data?.samplerequest?.created_at,
      left: '30%',
      top: '300px',
    },

    {
      key: 'po',
      title: 'Purchase Order',
      icon: 'solar:bag-check-outline',
      color: 'bg-emerald-500',
      active: !!data?.po,
      date: data?.po?.created_at,
      left: '45%',
      top: '140px',
      extra: data?.po?.id ? `PO-${data.po.id}` : null,
    },

    /*
    =========================================
    ENQUIRY AFTER PO
    =========================================
    */

    {
      key: 'enquiry',
      title: 'Enquiry',
      icon: 'solar:chat-round-dots-outline',
      color: 'bg-orange-500',
      active: !!data?.enquiry,
      date: data?.enquiry?.created_at,
      left: '56%',
      top: '280px',
    },

    {
      key: 'workOrder',
      title: 'Work Order',
      icon: 'solar:document-outline',
      color: 'bg-cyan-500',
      active: !!data?.workOrder,
      date: data?.workOrder?.created_at,
      left: '66%',
      top: '120px',
      extra: data?.workOrder?.work_order_no,
    },

    {
      key: 'manufacturing',
      title: 'Manufacturing',
      icon: 'solar:settings-outline',
      color: 'bg-indigo-500',
      active: !!data?.manufacturing,
      date: data?.manufacturing?.created_at,
      left: '76%',
      top: '290px',
    },

    {
      key: 'dispatch',
      title: 'Dispatch',
      icon: 'solar:delivery-outline',
      color: 'bg-blue-500',
      active: !!data?.dispatch,
      date: data?.dispatch?.dispatch_date,
      left: '86%',
      top: '120px',
    },

    {
      key: 'accounts',
      title: 'Accounts',
      icon: 'solar:wallet-money-outline',
      color: 'bg-green-600',
      active: !!data?.accounts,
      date: data?.accounts?.created_at,
      left: '93%',
      top: '260px',
    },

    /*
    =========================================
    REJECTION
    =========================================
    */

    {
      key: 'rejection',
      title: 'Rejection',
      icon: 'solar:danger-triangle-outline',
      color: 'bg-red-500',
      active: !!data?.rejection,
      date: data?.rejection?.created_at,
      left: '70%',
      bottom: '90px',
      isBottom: true,
    },
  ];
};

/*
=====================================================
COMPONENT
=====================================================
*/

interface Props {
  selectedRow: any;
}

export default function CustomerJourneyMap({ selectedRow }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const { customerJourney } = useSelector((state: RootState) => state.customer) as any;
  /*
  =====================================================
  API CALL
  =====================================================
  */

  useEffect(() => {
    if (selectedRow?.id) {
      dispatch(customerJourneydata({ id: selectedRow.id }));
    }
  }, [dispatch, selectedRow?.id]);

  /*
  =====================================================
  STAGES
  =====================================================
  */

  const stages = createJourneyData(customerJourney || {});

  const completedStages = stages.filter((x) => x.active).length;

  const completionPercentage = Math.round((completedStages / stages.length) * 100);

  return (
    <div className="bg-[#f4f7fb] rounded-[35px] p-10 overflow-x-auto border border-gray-200 shadow-inner">
      <div className="min-w-[1800px] relative h-[820px]">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">Customer Journey Mapping</h2>

              <p className="text-gray-500 mt-3 text-lg">CRM + ERP Workflow Tracking</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl shadow-lg px-5 py-4 border border-gray-100 min-w-[180px]">
                <p className="text-xs text-gray-400">Work Order No</p>

                <h3 className="font-bold text-gray-800 mt-1 text-lg">
                  {customerJourney?.workOrder?.work_order_no || '-'}
                </h3>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg px-6 py-4 min-w-[180px]">
                <p className="text-xs opacity-80">Journey Completion</p>

                <h3 className="font-bold mt-1 text-2xl">{completionPercentage}%</h3>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SIDE LABELS
        ===================================================== */}

        <div className="absolute left-0 top-[120px] rotate-[-90deg] origin-left">
          <div className="bg-white shadow-lg border border-gray-100 text-gray-700 px-5 py-3 rounded-full text-sm font-semibold">
            CRM Activities
          </div>
        </div>

        <div className="absolute left-0 bottom-[150px] rotate-[-90deg] origin-left">
          <div className="bg-white shadow-lg border border-gray-100 text-gray-700 px-5 py-3 rounded-full text-sm font-semibold">
            ERP / Operations
          </div>
        </div>

        {/* =====================================================
            SVG CURVES
        ===================================================== */}

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1800 820" fill="none">
          {/* TOP CURVE */}

          <path
            d="
              M 100 360
              C 200 80, 360 80, 470 360
              S 760 620, 920 360
              S 1180 80, 1360 360
              S 1600 620, 1720 260
            "
            stroke="#d1d5db"
            strokeWidth="5"
            strokeDasharray="14 10"
            fill="none"
          />

          {/* BOTTOM CURVE */}

          <path
            d="
              M 120 520
              C 280 760, 480 760, 620 520
              S 920 220, 1080 520
              S 1380 760, 1640 520
            "
            stroke="#d1d5db"
            strokeWidth="5"
            strokeDasharray="14 10"
            fill="none"
          />
        </svg>

        {/* =====================================================
            MAIN STAGES
        ===================================================== */}

        <div className="absolute top-[360px] left-0 right-0 flex items-center px-24 z-20">
          {stages
            .filter((x) => !x.isBottom)
            .map((stage, index) => (
              <div
                key={stage.key}
                className={`
                  relative flex items-center justify-center
                  h-24 flex-1 text-white font-bold tracking-wide
                  ${stage.active ? stage.color : 'bg-gray-300'}
                  ${index !== 0 ? 'ml-3' : ''}
                  shadow-2xl
                `}
                style={{
                  clipPath:
                    index !== stages.filter((x) => !x.isBottom).length - 1
                      ? 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)'
                      : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8% 50%)',
                }}
              >
                <div className="flex flex-col items-center z-10">
                  <Icon icon={stage.icon} width={34} />

                  <span className="mt-2 text-sm font-bold text-center px-2">{stage.title}</span>
                </div>
              </div>
            ))}
        </div>

        {/* =====================================================
            TOP ACTIVITIES
        ===================================================== */}

        {stages
          .filter((x) => !x.isBottom)
          .map((item) => (
            <div
              key={item.key}
              className="absolute z-30"
              style={{
                top: item.top,
                left: item.left,
              }}
            >
              <div className="flex flex-col items-center">
                {/* NODE */}

                <div className="relative">
                  <div
                    className={`
                      w-6 h-6 rounded-full bg-white
                      border-[6px] shadow-2xl
                      ${item.active ? 'border-blue-500' : 'border-gray-400'}
                    `}
                  />

                  {item.active && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-300 opacity-40" />
                  )}
                </div>

                {/* CARD */}

                <div
                  className={`
                    mt-4 shadow-2xl border rounded-2xl
                    px-5 py-4 whitespace-nowrap
                    hover:scale-105 transition-all duration-300
                    ${
                      item.active
                        ? 'bg-white border-gray-100'
                        : 'bg-gray-100 border-gray-200 opacity-70'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`
                        w-2 h-2 rounded-full
                        ${item.active ? 'bg-green-500' : 'bg-gray-400'}
                      `}
                    />

                    <p className="text-[11px] text-gray-400">{formatDate(item.date)}</p>
                  </div>

                  <p className="text-sm font-semibold text-gray-700">{item.title}</p>

                  {item.extra && <p className="text-xs text-gray-400 mt-2">{item.extra}</p>}
                </div>
              </div>
            </div>
          ))}

        {/* =====================================================
            BOTTOM ACTIVITIES
        ===================================================== */}

        {stages
          .filter((x) => x.isBottom)
          .map((item) => (
            <div
              key={item.key}
              className="absolute z-30"
              style={{
                left: item.left,
                bottom: item.bottom,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className={`
                      w-6 h-6 rounded-full bg-white
                      border-[6px] shadow-2xl
                      ${item.active ? 'border-pink-500' : 'border-gray-400'}
                    `}
                  />

                  {item.active && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-pink-300 opacity-40" />
                  )}
                </div>

                <div
                  className={`
                    mt-4 shadow-2xl border rounded-2xl
                    px-5 py-4 whitespace-nowrap
                    hover:translate-y-1 transition-all duration-300
                    ${
                      item.active
                        ? 'bg-white border-gray-100'
                        : 'bg-gray-100 border-gray-200 opacity-70'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`
                        w-2 h-2 rounded-full
                        ${item.active ? 'bg-pink-500' : 'bg-gray-400'}
                      `}
                    />

                    <p className="text-[11px] text-gray-400">{formatDate(item.date)}</p>
                  </div>

                  <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                </div>
              </div>
            </div>
          ))}

        {/* =====================================================
            START
        ===================================================== */}

        <div className="absolute left-0 top-[390px] -translate-x-8 z-40">
          <div className="bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl font-bold tracking-wide animate-bounce">
            START
          </div>
        </div>

        {/* =====================================================
            END
        ===================================================== */}

        <div className="absolute right-0 top-[390px] translate-x-8 z-40">
          <div className="bg-red-500 text-white px-6 py-4 rounded-full shadow-2xl font-bold tracking-wide animate-pulse">
            SUCCESS
          </div>
        </div>

        {/* =====================================================
            LEGEND
        ===================================================== */}

        <div className="absolute bottom-0 right-0 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500" />

            <span className="text-sm text-gray-600 font-medium">Completed Stage</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-400" />

            <span className="text-sm text-gray-600 font-medium">Pending Stage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
