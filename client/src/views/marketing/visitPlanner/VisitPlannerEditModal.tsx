import React, { useEffect, useState } from 'react';

import { Button, Modal, Textarea, Card } from 'flowbite-react';

import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';

import { getVisitPlanner, updateVisitPlanner } from 'src/features/marketing/VisitPlannerSlice';

import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

import { VisitDetailCard } from './VisitDetailCard';

/* =========================================================
   TYPES
========================================================= */

interface Props {
  openModal: boolean;
  selectedRow: any;
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

const VisitPlannerEditModal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  /* =========================================================
     GOOGLE MAP
  ========================================================= */

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyA9WZ75akgvEYdJiPK1UQIpYNhiuStGQhA',
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

  useEffect(() => {
    if (!selectedRow) return;

    console.log(selectedRow);

    /* =========================
     BASIC FORM
  ========================= */
    setFormData({
      ai_preparation_brief: selectedRow?.ai_preparation_brief || '',
    });

    /* =========================
     VISITS DATA
  ========================= */
    if (selectedRow?.visits?.length > 0) {
      const visits = selectedRow.visits.map((item: any, index: number) => ({
        sales_person_id: item.sales_person_id || '',

        customer_id: item.customer_id || '',

        address: item.address || '',

        latitude: item.latitude || '',
        longitude: item.longitude || '',

        visit_order: item.visit_order || index + 1,

        visit_date: item.visit_date || '',
        priority: item.priority || '',

        meeting_purpose: item.meeting_purpose || '',
        agenda: item.agenda || '',
        discussion_notes: item.discussion_notes || '',
        productivity: item.productivity || '',
        next_action: item.next_action || '',

        followup_date: item.followup_date || '',
        status: item.status || 'planned',

        file: item.file || null,
      }));

      setCustomerVisitData(visits);

      /* =========================
       MAP MARKERS
    ========================= */
      const validMarkers = visits
        .filter((x: any) => x.latitude && x.longitude)
        .map((x: any) => ({
          latitude: x.latitude,
          longitude: x.longitude,
        }));

      setMarkers(validMarkers);

      /* =========================
       ROUTE GENERATION
    ========================= */
      if (validMarkers.length > 0) {
        generateMultiRoute(validMarkers);
      }
    } else {
      setCustomerVisitData([]);
      setMarkers([]);
      setDirections(null);
    }
  }, [selectedRow]);

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

  const handleCustomerSelect = async (selected: any, index: number) => {
    if (!selected) return;

    const customer = selected.data;

    try {
      const fullAddress = customer?.company_address || '';

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

  const resetForm = () => {
    setFormData(initialForm);

    setMarkers([]);

    setDirections(null);

    setCustomerVisitData([emptyVisitRow]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const data = new FormData();

      /* =========================================
       REMOVE FILE OBJECT FROM JSON
    ========================================= */

      const cleanedVisits = customerVisitData.map((item: any) => ({
        ...item,

        // only keep string file name
        file: typeof item.file === 'string' ? item.file : null,
      }));

      /* =========================================
       APPEND JSON
    ========================================= */

      data.append('customer_visits', JSON.stringify(cleanedVisits));

      data.append('ai_preparation_brief', formData.ai_preparation_brief || '');

      /* =========================================
       APPEND FILES
    ========================================= */

      customerVisitData.forEach((item: any, index: number) => {
        if (item.file instanceof File) {
          data.append('files', item.file);

          // IMPORTANT
          data.append('fileIndexes', index.toString());
        }
      });

      /* =========================================
       API CALL
    ========================================= */

      await dispatch(
        updateVisitPlanner({
          id: selectedRow.id,
          data,
        }),
      ).unwrap();

      toast.success('Visit Planner Updated Successfully ✅');
      dispatch(getVisitPlanner());

      resetForm();

      setOpenModal(false);
    } catch (error: any) {
      console.error(error);

      toast.error(error?.message || 'Failed to update visit planner');
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
              Update Visit Planner
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VisitPlannerEditModal;
