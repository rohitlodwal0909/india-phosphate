import React, { useState } from 'react';

import { Button, Modal, Textarea, Card } from 'flowbite-react';

import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';

import { addVisitPlanner, getVisitPlanner } from 'src/features/marketing/VisitPlannerSlice';

import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

import { VisitDetailCard } from './VisitDetailCard';

/* =========================================================
   TYPES
========================================================= */

interface Props {
  openModal: boolean;

  setOpenModal: (val: boolean) => void;
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px',
};

const defaultCenter = {
  lat: 22.7196,
  lng: 75.8577,
};

const VisitPlannerModal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  /* =========================================================
     GOOGLE MAP
  ========================================================= */

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDCMSpgVe_hEoTs5__0f2yoiaHDKm0D7AI',
  });

  const [directions, setDirections] = useState<any>(null);

  const [markers, setMarkers] = useState<any[]>([]);

  /* =========================================================
     REDUX
  ========================================================= */

  const initialForm = {
    ai_preparation_brief: '',
  };

  const [formData, setFormData] = useState<any>(initialForm);

  const emptyVisitRow = {
    sales_person_id: '',
    sales_person_name: '',

    customer_id: '',
    customer_name: '',

    address: '',

    latitude: '',
    longitude: '',

    visit_order: 1,

    visit_date: '',

    priority: '',

    meeting_purpose: '',
    agena: '',
    discussion_notes: '',
    productivity: '',
    next_action: '',

    followup_date: '',

    status: 'planned',
  };

  const [customerVisitData, setCustomerVisitData] = useState<any[]>([emptyVisitRow]);

  const updateVisitData = (index: number, field: string, value: any) => {
    const updated = [...customerVisitData];

    updated[index][field] = value;

    setCustomerVisitData(updated);
  };

  const addMoreVisit = () => {
    setCustomerVisitData((prev: any) => [
      ...prev,

      {
        ...emptyVisitRow,

        visit_order: prev.length + 1,
      },
    ]);
  };

  /* =========================================================
     REMOVE
  ========================================================= */

  const removeVisit = (index: number) => {
    const updated = [...customerVisitData];

    updated.splice(index, 1);

    setCustomerVisitData(updated);

    const validLocations = updated.filter((x) => x.latitude && x.longitude);

    setMarkers(validLocations);

    generateMultiRoute(validLocations);
  };

  /* =========================================================
     AI BRIEF
  ========================================================= */

  const generateAIBrief = (customerList: any[]) => {
    const names = customerList.map((x) => x.customer_name || x.company_name).join(', ');

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
     ROUTE
  ========================================================= */

  const generateMultiRoute = async (customerLocations: any[]) => {
    if (!navigator.geolocation || customerLocations.length === 0) {
      setDirections(null);
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
     CUSTOMER SELECT
  ========================================================= */

  const handleCustomerSelect = async (selected: any, index: number) => {
    if (!selected) return;

    const customer = selected.data;

    try {
      const fullAddress = customer?.company_address || '';

      console.log(fullAddress);

      let latitude = '';
      let longitude = '';

      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress,
        )}&key=AIzaSyA9WZ75akgvEYdJiPK1UQIpYNhiuStGQhA`,
      );

      const geoData = await geoRes.json();

      if (geoData.results?.length > 0) {
        latitude = geoData.results[0].geometry.location.lat;

        longitude = geoData.results[0].geometry.location.lng;
      }

      const updated = [...customerVisitData];

      updated[index] = {
        ...updated[index],

        customer_id: customer.id,

        customer_name: customer.company_name || customer.customer_name,

        address: customer.company_address,

        latitude,
        longitude,
      };

      setCustomerVisitData(updated);

      const validLocations = updated.filter((x) => x.latitude && x.longitude);

      setMarkers(validLocations);

      generateMultiRoute(validLocations);

      generateAIBrief(updated);
    } catch (error) {
      toast.error('Unable to fetch customer location');
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetForm = () => {
    setFormData(initialForm);

    setMarkers([]);

    setDirections(null);

    setCustomerVisitData([emptyVisitRow]);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append('customer_visits', JSON.stringify(customerVisitData));

      data.append('ai_preparation_brief', formData.ai_preparation_brief);

      // files mapping
      customerVisitData.forEach((item) => {
        if (item.file) {
          data.append('files', item.file);
        }
      });

      await dispatch(addVisitPlanner(data)).unwrap();
      dispatch(getVisitPlanner());

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
              HEADER
          ========================================================= */}

          <Card className="shadow-md border-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Visit Planning Dashboard</h2>

                <p className="text-gray-500 mt-1">Manage customer visits & productivity</p>
              </div>

              <div className="bg-blue-50 px-5 py-3 rounded-xl">
                <div className="text-xs text-gray-500">Total Visits</div>

                <div className="text-2xl font-bold text-blue-700">{customerVisitData.length}</div>
              </div>
            </div>
          </Card>

          {/* =========================================================
              MAP
          ========================================================= */}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Geography Route Map</h3>

              <div className="text-sm text-gray-500">Customers: {markers.length}</div>
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
              VISIT CARDS
          ========================================================= */}

          {customerVisitData.map((item: any, index: number) => (
            <Card key={index} className="mb-5">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Visit #{index + 1}</h3>

                {customerVisitData.length > 1 && (
                  <Button
                    color="failure"
                    size="xs"
                    type="button"
                    onClick={() => removeVisit(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {/* DETAIL CARD */}
              <VisitDetailCard
                item={item}
                index={index}
                updateVisitData={updateVisitData}
                handleCustomerSelect={handleCustomerSelect}
              />{' '}
            </Card>
          ))}

          {/* =========================================================
              ADD MORE
          ========================================================= */}

          <div className="flex justify-center">
            <Button color="primary" type="button" onClick={addMoreVisit}>
              + Add More Visit
            </Button>
          </div>

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
              ACTIONS
          ========================================================= */}

          <div className="flex justify-end gap-3">
            <Button color="gray" type="button" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Save Visit Planner
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VisitPlannerModal;
