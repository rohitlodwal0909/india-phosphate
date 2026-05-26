import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, OverlayView, useJsApiLoader } from '@react-google-maps/api';

import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'src/store';
import { gettotalCustomer } from 'src/features/dashboard/DashboardCustomerSlice';

/* ======================================================
   TYPES
====================================================== */

interface CustomerLocation {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  totalCustomers: number;
  totalLeads: number;
  leadsWon: number;
  opportunities: number;
}

interface CustomerData {
  potential_opportunity?: number;
  convert_to_customer?: number;
}

/* ======================================================
   STATIC DATA
====================================================== */

const customerLocations: CustomerLocation[] = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.076,
    longitude: 72.8777,
    totalCustomers: 120,
    totalLeads: 300,
    leadsWon: 95,
    opportunities: 140,
  },

  {
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
    totalCustomers: 80,
    totalLeads: 200,
    leadsWon: 60,
    opportunities: 100,
  },

  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    latitude: 23.0225,
    longitude: 72.5714,
    totalCustomers: 60,
    totalLeads: 150,
    leadsWon: 45,
    opportunities: 75,
  },

  {
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    totalCustomers: 95,
    totalLeads: 240,
    leadsWon: 80,
    opportunities: 120,
  },
];

/* ======================================================
   MAP SETTINGS
====================================================== */

const mapContainerStyle = {
  width: '100%',
  height: '700px',
};

const center = {
  lat: 22.9734,
  lng: 78.6569,
};

/* ======================================================
   PROFESSIONAL MAP STYLE
====================================================== */

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1f2937' }],
  },

  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dbeafe' }],
  },

  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },

  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f8fafc' }],
  },
];

/* ======================================================
   MARKER COLOR
====================================================== */

const getMarkerColor = (customers: number) => {
  if (customers >= 100) return '#dc2626'; // red
  if (customers >= 70) return '#f59e0b'; // yellow
  return '#2563eb'; // blue
};

/* ======================================================
   MAIN COMPONENT
====================================================== */

const CustomerMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<CustomerLocation | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const totalcustomers = useSelector(
    (state: RootState) => state.customerdashboard.totalcustomers,
  ) as CustomerData[];

  useEffect(() => {
    dispatch(gettotalCustomer());
  }, [dispatch]);

  /* ======================================================
     GOOGLE MAP LOAD
  ====================================================== */

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA9WZ75akgvEYdJiPK1UQIpYNhiuStGQhA',
  });

  /* ======================================================
     DASHBOARD STATS
  ====================================================== */

  const stats = useMemo(() => {
    const customers = totalcustomers || [];

    const totalLeads = customers.length;

    const totalCustomers = customers.filter(
      (item) => item.convert_to_customer == 0 && item.potential_opportunity == 0,
    ).length;

    const wonLeads = customers.filter((item) => item.convert_to_customer == 1).length;

    const totalOpportunities = customers.filter((item) => item.potential_opportunity == 1).length;

    return {
      totalCustomers,

      totalLeads,

      leadsWon: totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0,

      totalOpportunities,
    };
  }, [totalcustomers]);

  return (
    <div className="space-y-6">
      {/* ======================================================
          TOP CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Customers"
          value={stats.totalCustomers}
          borderColor="border-blue-500"
          bgColor="bg-blue-50"
        />

        <DashboardCard
          title="Total Leads"
          value={stats.totalLeads}
          borderColor="border-yellow-500"
          bgColor="bg-yellow-50"
        />

        <DashboardCard
          title="Leads Won"
          value={stats.leadsWon}
          suffix="%"
          borderColor="border-green-500"
          bgColor="bg-green-50"
        />

        <DashboardCard
          title="Total Opportunities"
          value={stats.totalOpportunities}
          borderColor="border-purple-500"
          bgColor="bg-purple-50"
        />
      </div>

      {/* ======================================================
          MAP SECTION
      ====================================================== */}

      <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
        {/* HEADER */}

        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">Customer Diversification Map</h2>

          <p className="text-sm text-gray-500 mt-1">
            Location wise customer distribution across India
          </p>
        </div>

        {/* MAP */}

        <div className="p-4">
          {!isLoaded ? (
            <div className="h-[700px] flex items-center justify-center">
              <p className="text-gray-500 text-lg">Loading Map...</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={5}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                zoomControl: true,
                styles: mapStyles,
              }}
            >
              {/* ======================================================
                  CUSTOM PROFESSIONAL MARKERS
              ====================================================== */}

              {customerLocations.map((location, index) => {
                const markerColor = getMarkerColor(location.totalCustomers);

                return (
                  <OverlayView
                    key={index}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      onClick={() => setSelectedLocation(location)}
                      className="relative cursor-pointer group"
                    >
                      {/* Pulse Effect */}

                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{
                          backgroundColor: markerColor,
                          width: '60px',
                          height: '60px',
                          left: '-6px',
                          top: '-6px',
                        }}
                      />

                      {/* Main Pin */}

                      <div
                        className="relative flex items-center justify-center text-white font-bold shadow-2xl border-4 border-white transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: markerColor,
                          width: '48px',
                          height: '48px',
                          borderRadius: '999px',
                          fontSize: '14px',
                        }}
                      >
                        {location.totalCustomers}
                      </div>

                      {/* Label */}

                      <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md text-xs font-semibold whitespace-nowrap">
                        {location.city}
                      </div>
                    </div>
                  </OverlayView>
                );
              })}

              {/* ======================================================
                  INFO WINDOW
              ====================================================== */}

              {selectedLocation && (
                <InfoWindow
                  position={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                  }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="min-w-[260px]">
                    {/* HEADER */}

                    <div className="mb-4 border-b pb-3">
                      <h2 className="text-lg font-bold text-gray-800">{selectedLocation.city}</h2>

                      <p className="text-sm text-gray-500">
                        {selectedLocation.state}, {selectedLocation.country}
                      </p>
                    </div>

                    {/* STATS */}

                    <div className="grid grid-cols-2 gap-3">
                      <PopupCard
                        title="Customers"
                        value={selectedLocation.totalCustomers}
                        bg="bg-blue-50"
                      />

                      <PopupCard
                        title="Leads"
                        value={selectedLocation.totalLeads}
                        bg="bg-yellow-50"
                      />

                      <PopupCard title="Won" value={selectedLocation.leadsWon} bg="bg-green-50" />

                      <PopupCard
                        title="Opportunities"
                        value={selectedLocation.opportunities}
                        bg="bg-purple-50"
                      />
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerMap;

/* ======================================================
   DASHBOARD CARD
====================================================== */

interface DashboardCardProps {
  title: string;
  value: number | string;
  borderColor: string;
  bgColor: string;
  suffix?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  borderColor,
  bgColor,
  suffix = '',
}) => {
  return (
    <div
      className={`rounded-3xl border-l-4 ${borderColor} ${bgColor} p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <p className="text-sm text-gray-500 mb-2">{title}</p>

      <h2 className="text-4xl font-bold text-gray-800">
        <CountUp end={Number(value)} duration={2} decimals={suffix === '%' ? 2 : 0} separator="," />

        {suffix}
      </h2>
    </div>
  );
};

/* ======================================================
   POPUP CARD
====================================================== */

interface PopupCardProps {
  title: string;
  value: number;
  bg: string;
}

const PopupCard: React.FC<PopupCardProps> = ({ title, value, bg }) => {
  return (
    <div className={`${bg} rounded-2xl p-4 shadow-sm`}>
      <p className="text-xs text-gray-500 mb-1">{title}</p>

      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    </div>
  );
};
