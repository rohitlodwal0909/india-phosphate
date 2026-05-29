import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Card } from 'flowbite-react';

import { TabItem, Tabs } from 'flowbite-react';

import { Icon } from '@iconify/react';
import { ImageUrl } from 'src/constants/contant';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const VisitPlannerView = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  const visits = selectedRow?.visits || [];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border border-red-200';

      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';

      case 'low':
        return 'bg-green-100 text-green-700 border border-green-200';

      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border border-green-200';

      case 'hold':
        return 'bg-red-100 text-red-700 border border-red-200';

      case 'planned':
        return 'bg-orange-100 text-orange-700 border border-orange-200';

      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <Modal
      show={placeModal}
      size="7xl"
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      popup
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <ModalHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center shadow-lg">
            <Icon icon="solar:map-point-wave-bold" height={30} />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Visit Planner</h2>

            <p className="text-gray-500 text-sm mt-1">
              Professional customer meeting & planning overview
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="bg-[#f8f7f4]">
        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-7">
          <Card className="border-0 shadow-md rounded-3xl bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Visits</p>

                <h3 className="text-4xl font-extrabold text-gray-900 mt-2">{visits.length}</h3>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg">
                <Icon icon="solar:calendar-bold" height={30} />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md rounded-3xl bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>

                <h3 className="text-4xl font-extrabold text-green-700 mt-2">
                  {visits.filter((x: any) => x.status === 'completed').length}
                </h3>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shadow">
                <Icon icon="solar:check-circle-bold" height={30} />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md rounded-3xl bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Planned</p>

                <h3 className="text-4xl font-extrabold text-orange-600 mt-2">
                  {visits.filter((x: any) => x.status === 'planned').length}
                </h3>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shadow">
                <Icon icon="solar:clock-circle-bold" height={30} />
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-md rounded-3xl bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">On Hold</p>

                <h3 className="text-4xl font-extrabold text-red-600 mt-2">
                  {visits.filter((x: any) => x.status === 'hold').length}
                </h3>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shadow">
                <Icon icon="solar:danger-bold" height={30} />
              </div>
            </div>
          </Card>
        </div>

        {/* =====================================================
            TABS
        ===================================================== */}

        <Tabs variant="underline" className="bg-white rounded-3xl shadow-md p-4">
          {/* =====================================================
              VISIT DETAILS
          ===================================================== */}

          <TabItem
            active
            title="Visit Details"
            icon={() => <Icon icon="solar:map-point-bold-duotone" height={20} />}
          >
            <div className="space-y-6 mt-5">
              {visits.length > 0 ? (
                visits.map((item: any, index: number) => (
                  <Card
                    key={index}
                    className="rounded-3xl border-0 shadow-lg bg-white overflow-hidden"
                  >
                    {/* TOP */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 border-b border-gray-100 pb-5">
                      <div className="flex gap-5">
                        <div className="min-w-[70px] h-[70px] rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                          {item.visit_order}
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {item.customer?.company_name || '-'}
                          </h2>

                          <div className="flex items-center gap-2 text-gray-500 mt-2">
                            <Icon icon="solar:map-point-outline" height={18} />

                            <p>{item.address || '-'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getPriorityStyle(
                            item.priority,
                          )}`}
                        >
                          {item.priority || 'N/A'}
                        </span>

                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                            item.status,
                          )}`}
                        >
                          {item.status || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                      <div className="rounded-2xl bg-[#fafafa] border p-5">
                        <p className="text-xs uppercase text-gray-400 font-semibold">
                          Sales Person
                        </p>

                        <h3 className="text-lg font-bold text-gray-900 mt-2">
                          {item.sales_person?.username || '-'}
                        </h3>
                      </div>

                      <div className="rounded-2xl bg-[#fafafa] border p-5">
                        <p className="text-xs uppercase text-gray-400 font-semibold">Visit Date</p>

                        <h3 className="text-lg font-bold text-gray-900 mt-2">
                          {item.visit_date || '-'}
                        </h3>
                      </div>

                      <div className="rounded-2xl bg-[#fafafa] border p-5">
                        <p className="text-xs uppercase text-gray-400 font-semibold">
                          Followup Date
                        </p>

                        <h3 className="text-lg font-bold text-gray-900 mt-2">
                          {item.followup_date || '-'}
                        </h3>
                      </div>

                      <div className="rounded-2xl bg-[#fafafa] border p-5">
                        <p className="text-xs uppercase text-gray-400 font-semibold">
                          Productivity
                        </p>

                        <h3 className="text-lg font-bold text-gray-900 mt-2">
                          {item.productivity || '-'}
                        </h3>
                      </div>
                    </div>

                    {/* DESCRIPTION BOXES */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-7">
                      <div className="rounded-3xl bg-[#f4f4f4] p-6 border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                            <Icon icon="solar:clipboard-text-bold" height={22} />
                          </div>

                          <h3 className="text-lg font-bold text-gray-900">Meeting Purpose</h3>
                        </div>

                        <p className="text-gray-700 leading-7 whitespace-pre-line">
                          {item.meeting_purpose || '-'}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f4f4f4] p-6 border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                            <Icon icon="solar:notebook-bold" height={22} />
                          </div>

                          <h3 className="text-lg font-bold text-gray-900">Agenda</h3>
                        </div>

                        <p className="text-gray-700 leading-7 whitespace-pre-line">
                          {item.agenda || '-'}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f4f4f4] p-6 border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                            <Icon icon="solar:notes-bold" height={22} />
                          </div>

                          <h3 className="text-lg font-bold text-gray-900">Discussion Notes</h3>
                        </div>

                        <p className="text-gray-700 leading-7 whitespace-pre-line">
                          {item.discussion_notes || '-'}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#f4f4f4] p-6 border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                            <Icon icon="solar:rocket-bold" height={22} />
                          </div>

                          <h3 className="text-lg font-bold text-gray-900">Next Action Plan</h3>
                        </div>

                        <p className="text-gray-700 leading-7 whitespace-pre-line">
                          {item.next_action || '-'}
                        </p>
                      </div>
                    </div>

                    {/* PDF */}
                    <div className="mt-7">
                      <div className="rounded-3xl bg-[#fafafa] border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
                            <Icon icon="solar:file-text-bold" height={28} />
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900">Uploaded Document</h3>

                            <p className="text-sm text-gray-500">PDF Attachment</p>
                          </div>
                        </div>

                        {item.file ? (
                          <a
                            href={`${ImageUrl}uploads/visit-planner/${item.file}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button color="dark" pill className="shadow-lg">
                              <Icon icon="solar:eye-bold" height={18} className="mr-2" />
                              View PDF
                            </Button>
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No PDF Uploaded</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="rounded-3xl border-0 shadow-md py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon
                        icon="solar:folder-open-outline"
                        className="text-gray-400"
                        height={55}
                      />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-gray-800">No Visit Data Found</h3>

                    <p className="text-gray-500 mt-2">No customer visit details available</p>
                  </div>
                </Card>
              )}
            </div>
          </TabItem>

          {/* =====================================================
              AI PREPARATION
          ===================================================== */}

          <TabItem
            title="AI Preparation"
            icon={() => <Icon icon="solar:stars-bold-duotone" height={20} />}
          >
            <Card className="rounded-3xl border-0 shadow-lg mt-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center shadow-lg">
                  <Icon icon="solar:stars-bold" height={30} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI Meeting Preparation</h3>

                  <p className="text-gray-500 mt-1">
                    Smart planning & customer engagement recommendations
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-[#f7f7f7] border p-7 whitespace-pre-line text-gray-700 leading-8">
                {selectedRow?.ai_preparation_brief || 'No AI preparation brief available'}
              </div>
            </Card>
          </TabItem>
        </Tabs>
      </ModalBody>

      <ModalFooter className="border-t bg-white justify-end">
        <Button color="dark" pill onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VisitPlannerView;
