import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

const MapController = ({ userPos, stepPos, isNavigating, recenterConfig }) => {
    const map = useMap();
    const prevTrigger = useRef(0);
    const prevStep = useRef(null);

    useEffect(() => {
        // 1. Handle Manual Recenter (Highest Priority)
        if (recenterConfig && recenterConfig.trigger > prevTrigger.current) {
            prevTrigger.current = recenterConfig.trigger;

            if (recenterConfig.target === 'user' && userPos) {
                map.flyTo(userPos, 18, { duration: 1.0 });
            }
            return;
        }

        // 2. Handle Step Changes (Auto-Follow)
        // Only if stepPos genuinely changed
        if (stepPos && stepPos !== prevStep.current) {
            prevStep.current = stepPos;
            map.flyTo(stepPos, 17, { duration: 1.5 });
        }

        // 3. Initial Load
        if (!prevStep.current && stepPos) {
            prevStep.current = stepPos;
            map.flyTo(stepPos, 17);
        }

    }, [userPos, stepPos, recenterConfig, map]);

    return null;
};

const FitBounds = ({ route }) => {
    const map = useMap();
    useEffect(() => {
        if (route && route.coordinates) {
            const bounds = L.geoJSON(route).getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [route, map]);
    return null;
}

const MapComponent = ({ userPos, stepPos, routeData, isNavigating, recenterConfig, scrollWheelZoom = true }) => {
    const initialCenter = userPos || [20.59, 78.96];

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={initialCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                scrollWheelZoom={scrollWheelZoom}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Roadmap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap'
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='Tiles &copy; Esri'
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                {userPos && <Marker position={userPos} />}
                {stepPos && <Marker position={stepPos} opacity={0.6} />}

                <MapController
                    userPos={userPos}
                    stepPos={stepPos}
                    isNavigating={isNavigating}
                    recenterConfig={recenterConfig}
                />

                {routeData && (
                    <Polyline
                        positions={L.geoJSON(routeData.geometry).getLayers()[0].getLatLngs()}
                        color="#3b82f6"
                        weight={6}
                        opacity={0.8}
                    />
                )}
                {routeData && !isNavigating && <FitBounds route={routeData.geometry} />}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
