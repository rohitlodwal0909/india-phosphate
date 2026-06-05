import React, { useEffect, useState } from 'react';
import { GoogleMap, InfoWindow, OverlayView, useJsApiLoader } from '@react-google-maps/api';

interface CustomerLocation {
  label: string;

  city?: string;
  state?: string;
  country?: string;

  latitude: number;
  longitude: number;

  totalAmount: number;
}

interface CustomerMapProps {
  customer: any[];
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

const getMarkerColor = (amount: number) => {
  if (amount >= 10000000) return '#16a34a'; // >1Cr

  if (amount >= 5000000) return '#2563eb'; // >50L

  if (amount >= 1000000) return '#f59e0b'; // >10L

  return '#dc2626';
};

/* ======================================================
   MAIN COMPONENT
====================================================== */

const CustomerMapRevenue: React.FC<CustomerMapProps> = ({ customer }: any) => {
  const [allLocations, setAllLocations] = useState<any[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<CustomerLocation | null>(null);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const customerLocations = React.useMemo(() => {
    const grouped: Record<string, any> = {};

    allLocations.forEach((item) => {
      let key = '';
      let label = '';

      if (selectedState) {
        key = item.city;
        label = item.city;
      } else if (selectedCountry) {
        key = item.state;
        label = item.state;
      } else {
        key = item.country;
        label = item.country;
      }

      if (!grouped[key]) {
        grouped[key] = {
          label,

          country: item.country,
          state: item.state,
          city: item.city,

          latitudeSum: 0,
          longitudeSum: 0,
          count: 0,

          totalAmount: 0,
        };
      }

      grouped[key].latitudeSum += item.latitude;
      grouped[key].longitudeSum += item.longitude;

      grouped[key].count += 1;

      grouped[key].totalAmount += item.amount;
    });

    return Object.values(grouped).map((item: any) => ({
      label: item.label,

      country: item.country,
      state: item.state,
      city: item.city,

      latitude: item.latitudeSum / item.count,
      longitude: item.longitudeSum / item.count,

      totalAmount: item.totalAmount,
    }));
  }, [allLocations, selectedCountry, selectedState]);

  const getTotalAmount = (productsString: string) => {
    try {
      const products = JSON.parse(productsString || '[]');

      return products.reduce((sum: number, item: any) => sum + Number(item.total || 0), 0);
    } catch {
      return 0;
    }
  };

  const countries = [...new Set(allLocations.map((x) => x.country))];
  const states = [
    ...new Set(allLocations.filter((x) => x.country === selectedCountry).map((x) => x.state)),
  ];
  const cities = [
    ...new Set(
      allLocations
        .filter((x) => x.country === selectedCountry && x.state === selectedState)
        .map((x) => x.city),
    ),
  ];

  const filteredLocations = customerLocations.filter((item) => {
    if (selectedCountry && item.country !== selectedCountry) return false;

    if (selectedState && item.state !== selectedState) return false;

    if (selectedCity && item.city !== selectedCity) return false;

    return true;
  });

  const getMarkerSize = (revenue: number) => {
    if (revenue >= 10000000) return 70;

    if (revenue >= 5000000) return 60;

    if (revenue >= 1000000) return 50;

    return 40;
  };

  const mapCenter = React.useMemo(() => {
    if (!filteredLocations.length) return center;

    return {
      lat: filteredLocations.reduce((s, x) => s + x.latitude, 0) / filteredLocations.length,

      lng: filteredLocations.reduce((s, x) => s + x.longitude, 0) / filteredLocations.length,
    };
  }, [filteredLocations]);

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

  useEffect(() => {
    if (!isLoaded || !customer?.length) return;

    const loadLocations = async () => {
      const locations = [];

      for (const item of customer) {
        if (!item.company_address) continue;

        const geoData: any = await getCoordinatesFromAddress(item.company_address);

        if (!geoData) continue;

        const amount = getTotalAmount(item.products);

        locations.push({
          country: geoData.country,
          state: geoData.state,
          city: geoData.city,

          latitude: geoData.lat,
          longitude: geoData.lng,

          amount,
        });
      }

      setAllLocations(locations);
    };

    loadLocations();
  }, [isLoaded, customer]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
        {/* HEADER */}

        <div className="p-6 border-b bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Customer Diversification Map</h2>

              <p className="text-sm text-slate-500 mt-1">
                Country, State & City wise customer revenue distribution
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Revenue Map
              </span>

              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Geo Analytics
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Country</label>

              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState('');
                  setSelectedCity('');
                }}
              >
                <option value="">🌍 All Countries</option>

                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">State</label>

              <select
                disabled={!selectedCountry}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
              >
                <option value="">🏢 All States</option>

                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">City</label>

              <select
                disabled={!selectedState}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">📍 All Cities</option>

                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCountry && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                Country: {selectedCountry}
              </span>
            )}

            {selectedState && (
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                State: {selectedState}
              </span>
            )}

            {selectedCity && (
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                City: {selectedCity}
              </span>
            )}
          </div>
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
              center={mapCenter}
              zoom={selectedCity ? 10 : selectedState ? 7 : selectedCountry ? 5 : 3}
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

              {filteredLocations.map((location, index) => {
                const markerColor = getMarkerColor(location.totalAmount);
                const markerSize = getMarkerSize(location.totalAmount);

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
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{
                          backgroundColor: markerColor,
                          width: markerSize + 10,
                          height: markerSize + 10,
                          left: '-5px',
                          top: '-5px',
                        }}
                      />

                      <div
                        className="relative flex items-center justify-center text-white font-bold shadow-xl border-4 border-white group-hover:scale-110 transition-all"
                        style={{
                          backgroundColor: markerColor,
                          width: markerSize,
                          height: markerSize,
                          borderRadius: '999px',
                          fontSize: '12px',
                        }}
                      >
                        {location.totalAmount >= 10000000
                          ? `₹${(location.totalAmount / 10000000).toFixed(1)}Cr`
                          : `₹${(location.totalAmount / 100000).toFixed(1)}L`}
                      </div>

                      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow text-xs font-semibold whitespace-nowrap">
                        {location.label}
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

                    <div className="mb-4 border-b pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📍</span>

                        <div>
                          <h2 className="text-lg font-bold text-slate-800">
                            {selectedState
                              ? selectedLocation.city
                              : selectedCountry
                                ? selectedLocation.state
                                : selectedLocation.country}
                          </h2>

                          <p className="text-sm text-slate-500">
                            {selectedState
                              ? `${selectedLocation.city}, ${selectedLocation.state}, ${selectedLocation.country}`
                              : selectedCountry
                                ? `${selectedLocation.state}, ${selectedLocation.country}`
                                : selectedLocation.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STATS */}

                    <div className="grid grid-cols-2 gap-3">
                      <PopupCard
                        title="Amount"
                        value={
                          selectedLocation?.totalAmount >= 10000000
                            ? `₹${(selectedLocation.totalAmount / 10000000).toFixed(2)} Cr`
                            : `₹${(selectedLocation.totalAmount / 100000).toFixed(2)} L`
                        }
                        bg="bg-green-50"
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

export default CustomerMapRevenue;

interface PopupCardProps {
  title: string;
  value: string | number;
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
