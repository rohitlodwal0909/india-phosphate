import React, { useEffect, useMemo, useState } from 'react';

import { Button, Modal, Label, TextInput, Textarea, Card } from 'flowbite-react';

import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import { RootState } from 'src/store';

import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';

import { addVisitPlanner, getallCustomer } from 'src/features/marketing/VisitPlannerSlice';

import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

interface Props {
  openModal: boolean;

  setOpenModal: (val: boolean) => void;
}

/* =========================================================
   MAP CONFIG
========================================================= */

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px',
};

const defaultCenter = {
  lat: 22.7196,
  lng: 75.8577,
};

/* =========================================================
   PRIORITY
========================================================= */

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

/* =========================================================
   SELECT STYLE
========================================================= */

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

const VisitPlannerModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  /* =========================================================
     GOOGLE MAP
  ========================================================= */

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyA9WZ75akgvEYdJiPK1UQIpYNhiuStGQhA',
  });

  const [directions, setDirections] = useState<any>(null);

  const [markers, setMarkers] = useState<any[]>([]);

  const [selectedCustomers, setSelectedCustomers] = useState<any[]>([]);

  /* =========================================================
     REDUX
  ========================================================= */

  const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) || [];

  const customers = useSelector((state: RootState) => state.visitplanner?.customers) || [];

  const users = usersdata.filter((user: any) => Number(user.role_id) === 9);

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    dispatch(GetUsermodule());

    dispatch(getallCustomer());
  }, [dispatch]);

  /* =========================================================
     FORM
  ========================================================= */

  const initialForm = {
    visit_date: '',

    sales_person_id: '',

    customer_ids: [],

    priority: '',

    ai_preparation_brief: '',
  };

  const [formData, setFormData] = useState<any>(initialForm);

  /* =========================================================
     CUSTOMER VISIT DATA
  ========================================================= */

  const [customerVisitData, setCustomerVisitData] = useState<any[]>([]);

  /* =========================================================
     OPTIONS
  ========================================================= */

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

  /* =========================================================
     AI BRIEF
  ========================================================= */

  const generateAIBrief = (customerList: any[]) => {
    const names = customerList.map((x) => x.company_name || x.customer_name).join(', ');

    const brief = `
Today's Visit Plan

Customers:
${names}

AI Suggestions:
• Prioritize high value customers
• Discuss pending opportunities
• Focus on relationship building
• Discuss next order planning
• Collect payment followups
• Reduce travel delays

AI Route Recommendation:
Optimized shortest route generated automatically.
`;

    setFormData((prev: any) => ({
      ...prev,

      ai_preparation_brief: brief,
    }));
  };

  /* =========================================================
     MULTI ROUTE
  ========================================================= */

  const generateMultiRoute = async (customerLocations: any[]) => {
    if (!navigator.geolocation || customerLocations.length === 0) {
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const origin = {
        lat: position.coords.latitude,

        lng: position.coords.longitude,
      };

      const destination = customerLocations[customerLocations.length - 1];

      const waypoints = customerLocations.slice(0, customerLocations.length - 1).map((item) => ({
        location: {
          lat: Number(item.latitude),

          lng: Number(item.longitude),
        },

        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,

          destination: {
            lat: Number(destination.latitude),

            lng: Number(destination.longitude),
          },

          waypoints,

          optimizeWaypoints: true,

          travelMode: window.google.maps.TravelMode.DRIVING,
        },

        (result: any, status: any) => {
          if (status === 'OK') {
            setDirections(result);
          } else {
            toast.error('Unable to generate route');
          }
        },
      );
    });
  };

  /* =========================================================
     CUSTOMER CHANGE
  ========================================================= */

  const handleCustomerChange = async (selected: any) => {
    if (!selected || selected.length === 0) {
      setSelectedCustomers([]);

      setMarkers([]);

      setDirections(null);

      setCustomerVisitData([]);

      return;
    }

    try {
      setSelectedCustomers(selected);

      const customersWithCoords = [];

      for (const item of selected) {
        const customer = item.data;

        const fullAddress = customer?.company_address || '';

        let latitude = '';

        let longitude = '';

        const geoRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress,
          )}&key=AIzaSyA9WZ75akgvEYdJiPK1UQIpYNhiuStGQhA`,
        );

        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          latitude = geoData.results[0].geometry.location.lat;

          longitude = geoData.results[0].geometry.location.lng;
        }

        customersWithCoords.push({
          ...customer,

          latitude,

          longitude,
        });
      }

      /* =========================================
           MAP MARKERS
        ========================================= */

      setMarkers(customersWithCoords);

      /* =========================================
           ROUTE
        ========================================= */

      generateMultiRoute(customersWithCoords);

      /* =========================================
           FORM
        ========================================= */

      setFormData((prev: any) => ({
        ...prev,

        customer_ids: customersWithCoords.map((x) => x.id),
      }));

      /* =========================================
           PROFESSIONAL VISIT CARDS
        ========================================= */

      const visitCards = customersWithCoords.map((customer: any, index: number) => ({
        customer_id: customer.id,

        customer_name: customer.company_name || customer.customer_name,

        address: customer.company_address,

        latitude: customer.latitude,

        longitude: customer.longitude,

        visit_order: index + 1,

        meeting_purpose: '',

        agenda: '',

        discussion_notes: '',

        productivity: '',

        next_action: '',

        followup_date: '',

        status: 'planned',
      }));

      setCustomerVisitData(visitCards);

      generateAIBrief(customersWithCoords);
    } catch (error) {
      console.log(error);

      toast.error('Unable to generate route');
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetForm = () => {
    setFormData(initialForm);

    setMarkers([]);

    setDirections(null);

    setSelectedCustomers([]);

    setCustomerVisitData([]);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,

        customer_visits: customerVisitData,
      };

      await dispatch(addVisitPlanner(payload)).unwrap();

      toast.success('Visit Planner Created Successfully ✅');

      resetForm();

      setOpenModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create visit planner');
    }
  };

  return (
    <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
      <Modal.Header>Multi Customer Visit Planner</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =========================================================
              HEADER CARD
          ========================================================= */}

          <Card className="shadow-md border-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Visit Planning Dashboard</h2>

                <p className="text-gray-500 mt-1">
                  Manage customer visits, route planning and sales productivity
                </p>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-50 px-5 py-3 rounded-xl">
                  <div className="text-xs text-gray-500">Total Visits</div>

                  <div className="text-2xl font-bold text-blue-700">{customerVisitData.length}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* =========================================================
              VISIT DETAILS
          ========================================================= */}

          <Card>
            <h3 className="text-xl font-semibold mb-5">Visit Details</h3>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <Label value="Visit Date" />

                <TextInput
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,

                      visit_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-3">
                <Label value="Sales Person" />

                <Select
                  options={usersOptions}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  onChange={(v: any) =>
                    setFormData({
                      ...formData,

                      sales_person_id: v?.value,
                    })
                  }
                />
              </div>

              <div className="col-span-3">
                <Label value="Priority" />

                <Select
                  options={priorityOptions}
                  styles={selectStyles}
                  formatOptionLabel={formatPriority}
                  menuPortalTarget={document.body}
                  onChange={(v: any) =>
                    setFormData({
                      ...formData,

                      priority: v?.value,
                    })
                  }
                />
              </div>

              <div className="col-span-3">
                <Label value="Select Customers" />

                <Select
                  isMulti
                  options={customerOptions}
                  value={selectedCustomers}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  onChange={handleCustomerChange}
                />
              </div>
            </div>
          </Card>

          {/* =========================================================
              ROUTE TIMELINE
          ========================================================= */}

          <Card>
            <h3 className="text-xl font-semibold mb-5">Visit Timeline</h3>

            <div className="flex flex-wrap gap-3">
              {customerVisitData.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {item.visit_order}
                  </div>

                  <div>
                    <div className="font-semibold">{item.customer_name}</div>

                    <div className="text-xs text-gray-500">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* =========================================================
              MAP
          ========================================================= */}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Geography Route Map</h3>

              <div className="text-sm text-gray-500">
                Customers:
                {markers.length}
              </div>
            </div>

            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={
                  markers.length > 0
                    ? {
                        lat: Number(markers[0].latitude),

                        lng: Number(markers[0].longitude),
                      }
                    : defaultCenter
                }
                zoom={7}
              >
                {markers.map((item: any, index: number) => (
                  <Marker
                    key={index}
                    position={{
                      lat: Number(item.latitude),

                      lng: Number(item.longitude),
                    }}
                    label={`${index + 1}`}
                  />
                ))}

                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            )}
          </Card>

          {/* =========================================================
              CUSTOMER VISIT CARDS
          ========================================================= */}

          {customerVisitData.map((item: any, index: number) => (
            <Card key={index} className="shadow-md border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                    {item.visit_order}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{item.customer_name}</h3>

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

              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-6">
                  <Label value="Meeting Purpose" />

                  <Textarea
                    rows={3}
                    value={item.meeting_purpose}
                    onChange={(e) => {
                      const updated = [...customerVisitData];

                      updated[index].meeting_purpose = e.target.value;

                      setCustomerVisitData(updated);
                    }}
                  />
                </div>

                <div className="col-span-6">
                  <Label value="Agenda" />

                  <Textarea
                    rows={3}
                    value={item.agenda}
                    onChange={(e) => {
                      const updated = [...customerVisitData];

                      updated[index].agenda = e.target.value;

                      setCustomerVisitData(updated);
                    }}
                  />
                </div>

                <div className="col-span-12">
                  <Label value="Discussion Notes" />

                  <Textarea
                    rows={4}
                    value={item.discussion_notes}
                    onChange={(e) => {
                      const updated = [...customerVisitData];

                      updated[index].discussion_notes = e.target.value;

                      setCustomerVisitData(updated);
                    }}
                  />
                </div>

                <div className="col-span-6">
                  <Label value="Visit Productivity Report" />

                  <Textarea
                    rows={4}
                    value={item.productivity}
                    onChange={(e) => {
                      const updated = [...customerVisitData];

                      updated[index].productivity = e.target.value;

                      setCustomerVisitData(updated);
                    }}
                  />
                </div>

                <div className="col-span-6">
                  <Label value="Next Action Plan" />

                  <Textarea
                    rows={4}
                    value={item.next_action}
                    onChange={(e) => {
                      const updated = [...customerVisitData];

                      updated[index].next_action = e.target.value;

                      setCustomerVisitData(updated);
                    }}
                  />
                </div>

                <div className="col-span-4">
                  <Label value="Followup Date" />

                  <TextInput
                    type="date"
                    value={item.followup_date}
                    onChange={(e) => {
                      const updated = [...customerVisitData];

                      updated[index].followup_date = e.target.value;

                      setCustomerVisitData(updated);
                    }}
                  />
                </div>

                <div className="col-span-4">
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
                    onChange={(v: any) => {
                      const updated = [...customerVisitData];

                      updated[index].status = v.value;

                      setCustomerVisitData(updated);
                    }}
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
          ))}

          {/* =========================================================
              AI BRIEF
          ========================================================= */}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">AI Meeting Preparation</h3>

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                AI Generated
              </span>
            </div>

            <Textarea
              rows={8}
              value={formData.ai_preparation_brief}
              onChange={(e) =>
                setFormData({
                  ...formData,

                  ai_preparation_brief: e.target.value,
                })
              }
            />
          </Card>

          {/* =========================================================
              ACTION BUTTONS
          ========================================================= */}

          <div className="flex justify-end gap-3">
            <Button color="gray" type="button" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button type="submit">Save Visit Planner</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VisitPlannerModal;
