import React, { useEffect, useMemo, useState } from 'react';
import { GoogleMap, InfoWindow, OverlayView, useJsApiLoader } from '@react-google-maps/api';

import CountUp from 'react-countup';

import DashboardInsights from './DashboardInsights';

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

interface CustomerMapProps {
  totalcustomers: any[];
  orders: any;
}
const getCoordinatesFromAddress = async (address: string) => {
  try {
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];

          const location = result.geometry.location;

          let city = '';
          let state = '';
          let country = '';

          result.address_components.forEach((component) => {
            const types = component.types;

            // CITY
            if (types.includes('locality') || types.includes('administrative_area_level_2')) {
              city = component.long_name;
            }

            // STATE
            if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }

            // COUNTRY
            if (types.includes('country')) {
              country = component.long_name;
            }
          });

          resolve({
            lat: location.lat(),
            lng: location.lng(),
            city,
            state,
            country,
          });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

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

const CustomerMap: React.FC<CustomerMapProps> = ({ totalcustomers, orders }) => {
  const [customerLocations, setCustomerLocations] = useState<any[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<CustomerLocation | null>(null);

  // const [selectedState, setSelectedState] = useState('');
  /* ======================================================
     GOOGLE MAP LOAD
  ====================================================== */

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDCMSpgVe_hEoTs5__0f2yoiaHDKm0D7AI',
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

  useEffect(() => {
    if (!isLoaded || !totalcustomers?.length) return;

    const loadLocations = async () => {
      const grouped: any = {};

      for (const item of totalcustomers) {
        if (!item.company_address) continue;

        const geoData: any = await getCoordinatesFromAddress(item.company_address);

        if (!geoData || !geoData.state) continue;

        // STATE WISE GROUPING
        const key = `${geoData.state}-${geoData.country}`;

        if (!grouped[key]) {
          grouped[key] = {
            city: geoData.city,
            state: geoData.state,
            country: geoData.country,

            latitudeSum: 0,
            longitudeSum: 0,
            locationCount: 0,

            totalCustomers: 0,
            totalLeads: 0,
            leadsWon: 0,
            opportunities: 0,
          };
        }

        grouped[key].latitudeSum += geoData.lat;
        grouped[key].longitudeSum += geoData.lng;
        grouped[key].locationCount += 1;

        grouped[key].totalLeads += 1;

        if (item.convert_to_customer == 0 && item.potential_opportunity == 0) {
          grouped[key].totalCustomers += 1;
        }

        if (item.convert_to_customer == 1) {
          grouped[key].leadsWon += 1;
        }

        if (item.potential_opportunity == 1) {
          grouped[key].opportunities += 1;
        }
      }

      const finalLocations = Object.values(grouped).map((item: any) => ({
        city: item.state,
        state: item.state,
        country: item.country,

        latitude: item.latitudeSum / item.locationCount,
        longitude: item.longitudeSum / item.locationCount,

        totalCustomers: item.totalCustomers,
        totalLeads: item.totalLeads,
        leadsWon: item.leadsWon,
        opportunities: item.opportunities,
      }));

      setCustomerLocations(finalLocations);
    };

    loadLocations();
  }, [isLoaded, totalcustomers]);

  return (
    <div className="space-y-6">
      {/* <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="">All States</option>
        <option value="Rajasthan">Rajasthan</option>
        <option value="Gujarat">Gujarat</option>
        <option value="Maharashtra">Maharashtra</option>
      </select> */}
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

      <DashboardInsights orders={orders} />
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
