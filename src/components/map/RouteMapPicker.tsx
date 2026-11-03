import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, Text, Pressable, Platform, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { WebView } from 'react-native-webview';
import { MapPin, GraduationCap, Navigation, Search, X, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/hooks/useTheme';

export interface SectorLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  lat: number;
  lng: number;
  distance: string;
  estTime: string;
}

export const UDES_DESTINATION = {
  name: 'Campus Lagos del Cacique',
  shortName: 'Lagos del Cacique',
  address: 'Calle 70 # 55-210, UDES',
  lat: 7.105336,
  lng: -73.094745,
};

export const BUCARAMANGA_SECTORS: SectorLocation[] = [
  {
    id: 'cabecera',
    name: 'Cabecera del Llano',
    shortName: 'Cabecera',
    address: 'Cra. 33 # 48-12, Cabecera',
    lat: 7.1170,
    lng: -73.1110,
    distance: '5.8 km',
    estTime: '12 min',
  },
  {
    id: 'provenza',
    name: 'Provenza',
    shortName: 'Provenza',
    address: 'Calle 105 # 23-40, Provenza',
    lat: 7.0850,
    lng: -73.1150,
    distance: '4.6 km',
    estTime: '12 min',
  },
  {
    id: 'canaveral',
    name: 'Cañaveral (Floridablanca)',
    shortName: 'Cañaveral',
    address: 'C.C. Cañaveral, Floridablanca',
    lat: 7.0650,
    lng: -73.1050,
    distance: '6.1 km',
    estTime: '15 min',
  },
  {
    id: 'real_minas',
    name: 'Real de Minas',
    shortName: 'Real de Minas',
    address: 'Av. Samanes # 55-08, Real de Minas',
    lat: 7.1050,
    lng: -73.1280,
    distance: '5.2 km',
    estTime: '14 min',
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    shortName: 'San Francisco',
    address: 'Cra. 22 # 18-35, San Francisco',
    lat: 7.1350,
    lng: -73.1230,
    distance: '6.8 km',
    estTime: '18 min',
  },
  {
    id: 'giron',
    name: 'Girón',
    shortName: 'Girón',
    address: 'Parque Principal, Girón',
    lat: 7.0700,
    lng: -73.1700,
    distance: '11.5 km',
    estTime: '24 min',
  },
  {
    id: 'piedecuesta',
    name: 'Piedecuesta',
    shortName: 'Piedecuesta',
    address: 'Autopista Piedecuesta, La Rioja',
    lat: 7.0050,
    lng: -73.0500,
    distance: '14.2 km',
    estTime: '28 min',
  },
];

export interface AddressSuggestion {
  id: string;
  title: string;
  subtitle: string;
  address: string;
  lat: number;
  lng: number;
  sectorId?: string;
}

export const POPULAR_ADDRESS_SUGGESTIONS: AddressSuggestion[] = [
  {
    id: 'cabecera-san-pio',
    title: 'Parque San Pío',
    subtitle: 'Cra. 33 con Calle 45, Cabecera',
    address: 'Cra. 33 con Calle 45, Cabecera',
    lat: 7.1195,
    lng: -73.1098,
    sectorId: 'cabecera',
  },
  {
    id: 'cabecera-cuarta-etapa',
    title: 'C.C. Cuarta Etapa',
    subtitle: 'Cra. 33 # 48-12, Cabecera del Llano',
    address: 'Cra. 33 # 48-12, Cabecera',
    lat: 7.1170,
    lng: -73.1110,
    sectorId: 'cabecera',
  },
  {
    id: 'provenza-central',
    title: 'Provenza Central',
    subtitle: 'Calle 105 # 23-40, Provenza',
    address: 'Calle 105 # 23-40, Provenza',
    lat: 7.0850,
    lng: -73.1150,
    sectorId: 'provenza',
  },
  {
    id: 'canaveral-cc',
    title: 'C.C. Cañaveral',
    subtitle: 'Autopista Floridablanca, Cañaveral',
    address: 'C.C. Cañaveral, Floridablanca',
    lat: 7.0650,
    lng: -73.1050,
    sectorId: 'canaveral',
  },
  {
    id: 'canaveral-caracoli',
    title: 'Parque Caracolí',
    subtitle: 'Cra. 27 # 29-145, Floridablanca',
    address: 'Cra. 27 # 29-145, Floridablanca',
    lat: 7.0620,
    lng: -73.1040,
    sectorId: 'canaveral',
  },
  {
    id: 'real-minas-samanes',
    title: 'Plaza Real / Av. Samanes',
    subtitle: 'Av. Samanes # 55-08, Real de Minas',
    address: 'Av. Samanes # 55-08, Real de Minas',
    lat: 7.1050,
    lng: -73.1280,
    sectorId: 'real_minas',
  },
  {
    id: 'san-francisco-carrera-22',
    title: 'San Francisco',
    subtitle: 'Cra. 22 # 18-35, San Francisco',
    address: 'Cra. 22 # 18-35, San Francisco',
    lat: 7.1350,
    lng: -73.1230,
    sectorId: 'san_francisco',
  },
  {
    id: 'sotomayor-parque-palmas',
    title: 'Parque de las Palmas / Sotomayor',
    subtitle: 'Cra. 27 # 45-20, Sotomayor',
    address: 'Cra. 27 # 45-20, Sotomayor',
    lat: 7.1130,
    lng: -73.1180,
    sectorId: 'cabecera',
  },
  {
    id: 'diamante-dos',
    title: 'Diamante II',
    subtitle: 'Cra. 24 # 89-10, Diamante II',
    address: 'Cra. 24 # 89-10, Diamante II',
    lat: 7.0820,
    lng: -73.1080,
    sectorId: 'provenza',
  },
  {
    id: 'mutis-calle-55',
    title: 'Barrio Mutis',
    subtitle: 'Calle 55 # 2W-15, Mutis',
    address: 'Calle 55 # 2W-15, Mutis',
    lat: 7.1020,
    lng: -73.1360,
    sectorId: 'real_minas',
  },
  {
    id: 'uis-ciudad-universitaria',
    title: 'UIS - Universidad Industrial',
    subtitle: 'Cra. 27 con Calle 9, Universidad',
    address: 'Cra. 27 con Calle 9, Bucaramanga',
    lat: 7.1400,
    lng: -73.1205,
    sectorId: 'san_francisco',
  },
  {
    id: 'lagos-cacique-barrio',
    title: 'Lagos del Cacique (Cerca a UDES)',
    subtitle: 'Calle 72 # 52-10, Lagos del Cacique',
    address: 'Calle 72 # 52-10, Lagos del Cacique',
    lat: 7.1030,
    lng: -73.0970,
    sectorId: 'cabecera',
  },
  {
    id: 'centro-parque-santander',
    title: 'Parque Santander / Centro',
    subtitle: 'Calle 36 con Cra. 19, Centro',
    address: 'Calle 36 con Cra. 19, Centro Bucaramanga',
    lat: 7.1190,
    lng: -73.1260,
    sectorId: 'san_francisco',
  },
  {
    id: 'giron-parque',
    title: 'Parque Principal de Girón',
    subtitle: 'Calle 30 # 25-10, Girón',
    address: 'Parque Principal, Girón',
    lat: 7.0700,
    lng: -73.1700,
    sectorId: 'giron',
  },
  {
    id: 'piedecuesta-rioja',
    title: 'Piedecuesta / La Rioja',
    subtitle: 'Autopista Piedecuesta, La Rioja',
    address: 'Autopista Piedecuesta, La Rioja',
    lat: 7.0050,
    lng: -73.0500,
    sectorId: 'piedecuesta',
  },
];

function generateLeafletHtml(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  originName: string,
  isDark = false
): string {
  const mapBg = isDark ? '#121214' : '#F8FAFC';
  const tileBase = isDark
    ? 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    : 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
  const tileRef = isDark
    ? 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
    : 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
  const originPinBg = isDark ? '#1C1C20' : '#FFFFFF';
  const popupBg = isDark ? '#1C1C20' : '#FFFFFF';
  const popupColor = isDark ? '#F5F5F7' : '#0A0A0A';
  const zoomBg = isDark ? '#1C1C20' : '#FFFFFF';
  const zoomColor = isDark ? '#F5F5F7' : '#0A0A0A';
  const primaryColor = isDark ? '#3B82F6' : '#2563EB';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; }
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #map { width: 100%; height: 100%; background: ${mapBg}; }
    .custom-pin-dest {
      background: ${primaryColor};
      color: #FFFFFF;
      border-radius: 999px;
      width: 44px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.5px;
      border: 2px solid ${isDark ? '#2D2D32' : '#FFFFFF'};
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4);
    }
    .custom-pin-origin {
      background: ${originPinBg};
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3.5px solid ${primaryColor};
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      background: ${primaryColor};
      border-radius: 50%;
    }
    .leaflet-popup-content-wrapper {
      background: ${popupBg} !important;
      color: ${popupColor} !important;
      border-radius: 12px;
      font-size: 12px;
      padding: 4px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
    }
    .leaflet-popup-tip {
      background: ${popupBg} !important;
    }
    .leaflet-control-zoom {
      border: none !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25) !important;
      border-radius: 10px !important;
      overflow: hidden;
    }
    .leaflet-control-zoom a {
      background: ${zoomBg} !important;
      color: ${zoomColor} !important;
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var destLat = ${destLat};
    var destLng = ${destLng};
    var curLat = ${originLat};
    var curLng = ${originLng};

    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([(curLat + destLat)/2, (curLng + destLng)/2], 13);

    // Tiles adaptables (Esri Canvas Light / Dark)
    L.tileLayer('${tileBase}', {
      maxZoom: 16,
      attribution: 'Esri Canvas'
    }).addTo(map);

    L.tileLayer('${tileRef}', {
      maxZoom: 16
    }).addTo(map);

    // Pin de Destino Fijo (UDES Lagos del Cacique)
    var destIcon = L.divIcon({
      className: 'custom-pin-dest',
      html: 'UDES',
      iconSize: [44, 24],
      iconAnchor: [22, 12]
    });
    var destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
    destMarker.bindPopup('<b>Campus Lagos del Cacique</b><br>Universidad de Santander (UDES)');

    // Pin de Origen Activo
    var originIcon = L.divIcon({
      className: 'custom-pin-origin',
      html: '<div class="pulse-dot"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    var originMarker = L.marker([curLat, curLng], {
      icon: originIcon,
      draggable: true
    }).addTo(map);
    originMarker.bindPopup('<b>Origen Habitual</b><br>${originName}');

    // Capa de relieve y trazado de ruta real sobre las calles
    var routeBackdrop = L.polyline([], {
      color: '#1D4ED8',
      weight: 6.5,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    var routeLine = L.polyline([[curLat, curLng], [destLat, destLng]], {
      color: '#2563EB',
      weight: 4,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    function notifyLocation(lat, lng) {
      var msg = JSON.stringify({ type: 'LOCATION_CHANGED', lat: lat, lng: lng });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      }
      if (window.parent) {
        window.parent.postMessage(msg, '*');
      }
    }

    function notifyRouteInfo(distKm, durMin) {
      var msg = JSON.stringify({ type: 'ROUTE_INFO', distance: distKm + ' km', estTime: durMin + ' min' });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      }
      if (window.parent) {
        window.parent.postMessage(msg, '*');
      }
    }

    // Trazar la ruta exacta por las vías de Bucaramanga con OSRM (100% open source)
    function fetchRoute(startLat, startLng, endLat, endLng) {
      var url = 'https://router.project-osrm.org/route/v1/driving/' + 
        startLng + ',' + startLat + ';' + endLng + ',' + endLat + 
        '?geometries=geojson&overview=full';

      fetch(url)
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (data && data.code === 'Ok' && data.routes && data.routes.length > 0) {
            var route = data.routes[0];
            var coords = route.geometry.coordinates; // [lng, lat]
            var latLngs = coords.map(function(c) { return [c[1], c[0]]; });
            routeBackdrop.setLatLngs(latLngs);
            routeLine.setLatLngs(latLngs);
            routeLine.setStyle({ dashArray: null, color: '#2563EB', weight: 4.5 });

            var distKm = (route.distance / 1000).toFixed(1);
            var durMin = Math.max(1, Math.round(route.duration / 60));
            notifyRouteInfo(distKm, durMin);

            var bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
          } else {
            var fallback = [[startLat, startLng], [endLat, endLng]];
            routeBackdrop.setLatLngs([]);
            routeLine.setLatLngs(fallback);
            routeLine.setStyle({ dashArray: '6, 6', color: '#2563EB', weight: 3 });
          }
        })
        .catch(function() {
          var fallback = [[startLat, startLng], [endLat, endLng]];
          routeBackdrop.setLatLngs([]);
          routeLine.setLatLngs(fallback);
          routeLine.setStyle({ dashArray: '6, 6', color: '#2563EB', weight: 3 });
        });
    }

    // Trazar ruta inicial al cargar
    fetchRoute(curLat, curLng, destLat, destLng);

    // Al arrastrar el pin
    originMarker.on('dragend', function(e) {
      var pt = e.target.getLatLng();
      curLat = pt.lat;
      curLng = pt.lng;
      fetchRoute(curLat, curLng, destLat, destLng);
      notifyLocation(curLat, curLng);
    });

    // Al hacer click/tap en cualquier parte del mapa real
    map.on('click', function(e) {
      curLat = e.latlng.lat;
      curLng = e.latlng.lng;
      originMarker.setLatLng(e.latlng);
      fetchRoute(curLat, curLng, destLat, destLng);
      notifyLocation(curLat, curLng);
    });

    // Recibir mensajes desde React Native para centrar y recalcular ruta
    function updatePosition(lat, lng) {
      curLat = lat;
      curLng = lng;
      originMarker.setLatLng([curLat, curLng]);
      fetchRoute(curLat, curLng, destLat, destLng);
    }

    window.addEventListener('message', function(event) {
      try {
        var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'SET_ORIGIN') {
          updatePosition(data.lat, data.lng);
        }
      } catch(e){}
    });
    document.addEventListener('message', function(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'SET_ORIGIN') {
          updatePosition(data.lat, data.lng);
        }
      } catch(e){}
    });
  </script>
</body>
</html>`;
}

export interface RouteMapPickerProps {
  selectedSectorName: string;
  onSelectSector?: (sector: SectorLocation) => void;
  originAddress?: string;
  onChangeOriginAddress?: (address: string) => void;
  className?: string;
  mapHeight?: number;
  mapOnly?: boolean;
}

export const RouteMapPicker: React.FC<RouteMapPickerProps> = ({
  selectedSectorName,
  onSelectSector,
  originAddress,
  onChangeOriginAddress,
  className = '',
  mapHeight = 260,
  mapOnly = false,
}) => {
  const { isDark, colors } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [liveRouteInfo, setLiveRouteInfo] = useState<{ distance: string; estTime: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [remoteSuggestions, setRemoteSuggestions] = useState<AddressSuggestion[]>([]);
  const [isFetchingRemote, setIsFetchingRemote] = useState(false);

  const currentSector =
    BUCARAMANGA_SECTORS.find(
      (s) =>
        s.shortName.toLowerCase() === selectedSectorName.toLowerCase() ||
        s.name.toLowerCase() === selectedSectorName.toLowerCase() ||
        s.id.toLowerCase() === selectedSectorName.toLowerCase()
    ) ?? BUCARAMANGA_SECTORS[0];

  const htmlContent = generateLeafletHtml(
    currentSector.lat,
    currentSector.lng,
    UDES_DESTINATION.lat,
    UDES_DESTINATION.lng,
    currentSector.name,
    isDark
  );

  const sendCoordsToMap = useCallback((lat: number, lng: number) => {
    if (Platform.OS === 'web' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SET_ORIGIN', lat, lng },
        '*'
      );
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: 'SET_ORIGIN', lat, lng })
      );
    }
  }, []);

  useEffect(() => {
    sendCoordsToMap(currentSector.lat, currentSector.lng);
  }, [currentSector.lat, currentSector.lng, sendCoordsToMap]);

  const handleSectorChange = useCallback(
    (sector: SectorLocation) => {
      onSelectSector?.(sector);
      onChangeOriginAddress?.(sector.address);
      setLiveRouteInfo(null);
      sendCoordsToMap(sector.lat, sector.lng);
    },
    [onSelectSector, onChangeOriginAddress, sendCoordsToMap]
  );

  const handleSearchAddress = useCallback(
    async (queryText?: string) => {
      const query = (queryText ?? originAddress ?? currentSector.address).trim();
      if (!query || query.length < 3) return;

      setIsSearching(true);
      setSearchError(null);

      try {
        // 1. Revisar si coincide con algún sector de Bucaramanga por nombre
        const matchedSector = BUCARAMANGA_SECTORS.find(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.shortName.toLowerCase().includes(query.toLowerCase())
        );

        if (matchedSector) {
          onSelectSector?.(matchedSector);
          onChangeOriginAddress?.(matchedSector.address);
          sendCoordsToMap(matchedSector.lat, matchedSector.lng);
          setIsSearching(false);
          return;
        }

        // 2. Geocodificar con Nominatim OpenStreetMap en Bucaramanga
        const encoded = encodeURIComponent(`${query}, Bucaramanga, Colombia`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
          { headers: { 'User-Agent': 'AmigoUDES/1.0' } }
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          const closest = BUCARAMANGA_SECTORS.reduce((prev, curr) => {
            const prevDist = Math.hypot(prev.lat - lat, prev.lng - lng);
            const currDist = Math.hypot(curr.lat - lat, curr.lng - lng);
            return currDist < prevDist ? curr : prev;
          });

          onSelectSector?.({
            ...closest,
            address: query,
            lat,
            lng,
          });
          sendCoordsToMap(lat, lng);
        } else {
          setSearchError('No encontramos esa dirección exacta en Bucaramanga.');
        }
      } catch {
        // Fallback silencioso
      } finally {
        setIsSearching(false);
      }
    },
    [originAddress, currentSector.address, onSelectSector, onChangeOriginAddress, sendCoordsToMap]
  );

  // Filtro de sugerencias locales y remotas
  const query = (originAddress ?? '').trim().toLowerCase();

  const filteredLocal = POPULAR_ADDRESS_SUGGESTIONS.filter((item) => {
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query)
    );
  });

  const validRemote =
    query.length >= 3 && showSuggestions ? remoteSuggestions : [];

  const allSuggestions: AddressSuggestion[] = [
    ...filteredLocal.slice(0, 4),
    ...validRemote
      .filter((r) => !filteredLocal.some((l) => Math.hypot(l.lat - r.lat, l.lng - r.lng) < 0.003))
      .slice(0, 3),
  ];

  // Búsqueda remota con debounce en OpenStreetMap Nominatim
  useEffect(() => {
    const q = (originAddress ?? '').trim();
    if (!showSuggestions || q.length < 3) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsFetchingRemote(true);
        const encoded = encodeURIComponent(`${q}, Bucaramanga, Santander, Colombia`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=4&addressdetails=1`,
          { headers: { 'User-Agent': 'AmigoUDES/1.0' } }
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: AddressSuggestion[] = data.map((item, idx) => {
            const road =
              item.address?.road ||
              item.address?.neighbourhood ||
              item.name ||
              item.display_name.split(',')[0];
            const neighbourhood =
              item.address?.neighbourhood ||
              item.address?.suburb ||
              item.address?.city ||
              'Bucaramanga';
            const cleanAddress = `${road}, ${neighbourhood}`;
            return {
              id: `remote-${item.place_id ?? idx}`,
              title: road,
              subtitle: neighbourhood,
              address: cleanAddress,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            };
          });
          setRemoteSuggestions(mapped);
        }
      } catch {
        // Fallback silencioso
      } finally {
        setIsFetchingRemote(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [originAddress, showSuggestions]);

  const handleSelectSuggestion = useCallback(
    (item: AddressSuggestion) => {
      onChangeOriginAddress?.(item.address);
      setSearchError(null);
      setShowSuggestions(false);
      Keyboard.dismiss();

      // Encontrar el sector más cercano para sincronizar
      const closest = BUCARAMANGA_SECTORS.reduce((prev, curr) => {
        const prevDist = Math.hypot(prev.lat - item.lat, prev.lng - item.lng);
        const currDist = Math.hypot(curr.lat - item.lat, curr.lng - item.lng);
        return currDist < prevDist ? curr : prev;
      });

      onSelectSector?.({
        ...closest,
        name: item.title,
        address: item.address,
        lat: item.lat,
        lng: item.lng,
      });
      sendCoordsToMap(item.lat, item.lng);
    },
    [onChangeOriginAddress, onSelectSector, sendCoordsToMap]
  );

  // Escuchar clicks/taps en el mapa real (Web)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWebMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'ROUTE_INFO') {
          setLiveRouteInfo({ distance: data.distance, estTime: data.estTime });
        } else if (data.type === 'LOCATION_CHANGED') {
          // Encontrar el sector más cercano
          const closest = BUCARAMANGA_SECTORS.reduce((prev, curr) => {
            const prevDist = Math.hypot(prev.lat - data.lat, prev.lng - data.lng);
            const currDist = Math.hypot(curr.lat - data.lat, curr.lng - data.lng);
            return currDist < prevDist ? curr : prev;
          });
          onSelectSector?.(closest);
          onChangeOriginAddress?.(closest.address);
        }
      } catch {
        // Mensaje no relacionado
      }
    };

    window.addEventListener('message', handleWebMessage);
    return () => window.removeEventListener('message', handleWebMessage);
  }, [onSelectSector, onChangeOriginAddress]);

  return (
    <View className={`w-full gap-3 ${className}`.trim()}>
      {/* Visor de Mapa REAL OpenStreetMap */}
      <View
        style={{ height: mapHeight }}
        className="w-full rounded-2xl overflow-hidden border border-hairline bg-canvas relative shadow-xs"
      >
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Mapa Real OpenStreetMap Bucaramanga"
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={{ flex: 1, backgroundColor: 'transparent' }}
            scrollEnabled={false}
            onMessage={(e) => {
              try {
                const data = JSON.parse(e.nativeEvent.data);
                if (data.type === 'ROUTE_INFO') {
                  setLiveRouteInfo({ distance: data.distance, estTime: data.estTime });
                } else if (data.type === 'LOCATION_CHANGED') {
                  const closest = BUCARAMANGA_SECTORS.reduce((prev, curr) => {
                    const prevDist = Math.hypot(prev.lat - data.lat, prev.lng - data.lng);
                    const currDist = Math.hypot(curr.lat - data.lat, curr.lng - data.lng);
                    return currDist < prevDist ? curr : prev;
                  });
                  onSelectSector?.(closest);
                  onChangeOriginAddress?.(closest.address);
                }
              } catch {
                // Ignore
              }
            }}
          />
        )}

        {/* Micro-etiqueta flotante con distancia y tiempo calculados en ruta real */}
        <View
          style={{ position: 'absolute', top: 10, right: 10 }}
          className="flex-row items-center gap-1.5 bg-paper/95 px-3 py-1.5 rounded-pill border border-hairline shadow-sm"
        >
          <Icon icon={Navigation} size="sm" color="primary" />
          <Text className="text-[12px] font-semibold text-primary">
            {liveRouteInfo?.distance ?? currentSector.distance} · {liveRouteInfo?.estTime ?? currentSector.estTime}
          </Text>
        </View>
      </View>

      {!mapOnly && (
        <>
          {/* Tarjeta de Resumen: Dirección de Origen Editable y Destino */}
          <View className="bg-paper rounded-2xl p-4 border border-hairline shadow-xs">
        <View className="gap-3">
          {/* Fila Origen con Input Editable */}
          <View>
            <View className="flex-row items-center justify-between mb-1.5 px-0.5">
              <Text className="text-[11px] font-medium uppercase tracking-[0.5px] text-mid-gray">
                Dirección de origen
              </Text>
              <Text className="text-[11px] font-semibold text-primary">
                {currentSector.shortName}
              </Text>
            </View>

            <View className="flex-row items-center bg-canvas rounded-xl px-3 h-11 border border-hairline">
              <View className="mr-2">
                <Icon icon={MapPin} size="sm" color="primary" />
              </View>
              <TextInput
                value={originAddress ?? currentSector.address}
                onFocus={() => setShowSuggestions(true)}
                onChangeText={(text) => {
                  onChangeOriginAddress?.(text);
                  if (!showSuggestions) setShowSuggestions(true);
                  if (searchError) setSearchError(null);
                }}
                onSubmitEditing={() => {
                  setShowSuggestions(false);
                  handleSearchAddress();
                }}
                placeholder="Escribe tu dirección (ej. Cra. 33 # 48-12)"
                placeholderTextColor={colors.midGray}
                className="flex-1 text-[13px] text-ink font-normal h-full"
                returnKeyType="search"
              />
              {originAddress && originAddress.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Borrar dirección"
                  onPress={() => {
                    onChangeOriginAddress?.('');
                    setShowSuggestions(true);
                  }}
                  className="mr-1 w-6 h-6 rounded-full items-center justify-center active:bg-hairline"
                >
                  <Icon icon={X} size="xs" color="mid-gray" />
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Buscar dirección en el mapa"
                onPress={() => {
                  setShowSuggestions(false);
                  handleSearchAddress();
                }}
                className="ml-1 w-8 h-8 rounded-pill bg-paper border border-hairline items-center justify-center active:bg-hairline"
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Icon icon={Search} size="xs" color="ink" />
                )}
              </Pressable>
            </View>

            {/* Lista Desplegable de Sugerencias en Bucaramanga */}
            {showSuggestions && allSuggestions.length > 0 ? (
              <View className="mt-2 bg-canvas rounded-xl border border-hairline overflow-hidden shadow-xs">
                <View className="flex-row items-center justify-between px-3 py-2 bg-hairline/30 border-b border-hairline">
                  <View className="flex-row items-center gap-1.5">
                    <Icon icon={Navigation} size="xs" color="primary" />
                    <Text className="text-[11px] font-semibold text-mid-gray uppercase tracking-[0.5px]">
                      Sugerencias en Bucaramanga
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {isFetchingRemote ? (
                      <ActivityIndicator size="small" color="#2563EB" />
                    ) : null}
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ocultar sugerencias"
                      onPress={() => setShowSuggestions(false)}
                      className="px-1.5 py-0.5 rounded active:bg-hairline"
                    >
                      <Text className="text-[11px] font-medium text-mid-gray">Ocultar</Text>
                    </Pressable>
                  </View>
                </View>

                {allSuggestions.map((item, index) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelectSuggestion(item)}
                    className={`flex-row items-center px-3 py-2.5 active:bg-hairline/60 ${
                      index < allSuggestions.length - 1 ? 'border-b border-hairline/50' : ''
                    }`}
                  >
                    <View className="w-7 h-7 rounded-full bg-paper border border-hairline items-center justify-center mr-2.5">
                      <Icon icon={MapPin} size="xs" color="primary" />
                    </View>
                    <View className="flex-1 mr-2">
                      <Text className="text-[13px] font-semibold text-ink" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="text-[11px] text-mid-gray" numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Icon icon={ChevronRight} size="xs" color="mid-gray" />
                  </Pressable>
                ))}
              </View>
            ) : null}

            {searchError ? (
              <Text className="text-[11px] text-destructive mt-1 px-1">{searchError}</Text>
            ) : null}
          </View>

          {/* Divisor vertical sutil */}
          <View className="h-[1px] bg-hairline" />

          {/* Fila Destino */}
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-pill bg-canvas items-center justify-center border border-hairline">
              <Icon icon={GraduationCap} size="sm" color="ink" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-medium uppercase tracking-[0.5px] text-mid-gray">
                Destino institucional
              </Text>
              <Text className="text-[13px] font-semibold text-ink leading-tight">
                {UDES_DESTINATION.name} ({UDES_DESTINATION.address})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chips Rápidos de Selección de Sector */}
      <View>
        <Text className="text-[11px] font-medium uppercase tracking-[0.5px] text-mid-gray mb-2 px-1">
          Sectores frecuentes en Bucaramanga
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {BUCARAMANGA_SECTORS.map((sector) => {
            const isSelected = sector.id === currentSector.id;
            return (
              <Pressable
                key={sector.id}
                onPress={() => handleSectorChange(sector)}
                className={`py-2 px-3 rounded-pill border ${
                  isSelected
                    ? 'bg-primary-soft border-primary'
                    : 'bg-paper border-hairline active:bg-hairline'
                }`}
              >
                <Text
                  className={`text-[12px] ${
                    isSelected ? 'text-primary font-semibold' : 'text-ink-soft font-medium'
                  }`}
                >
                  {sector.shortName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  )}
</View>
  );
};
