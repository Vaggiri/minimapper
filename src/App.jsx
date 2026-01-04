import React, { useState, useEffect } from 'react';
import { Play, Crosshair, MapPin } from 'lucide-react';
import axios from 'axios';
import TransportModeSelector from './components/TransportModeSelector';
import DestinationInput from './components/DestinationInput';
import MapComponent from './components/MapComponent';
import NavigationSheet from './components/NavigationSheet';
import RouteOptions from './components/RouteOptions';
import Navbar from './components/Navbar';
import HistoryModal from './components/HistoryModal';

function App() {
    const [view, setView] = useState('home');
    const [userPos, setUserPos] = useState(null);
    const [locAccuracy, setLocAccuracy] = useState(null);
    const [locStatus, setLocStatus] = useState('Detecting location...');
    const [dest, setDest] = useState(null);

    const [route, setRoute] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentStepPos, setCurrentStepPos] = useState(null);

    const [recenterConfig, setRecenterConfig] = useState({ trigger: 0, target: 'user' });

    const [mode, setMode] = useState('driving');
    const [routeOpts, setRouteOpts] = useState({
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
    });

    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('navHistory') || '[]');
        } catch { return []; }
    });
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);



    const addToHistory = (place) => {
        const newItem = { ...place, timestamp: Date.now() };
        const newHistory = [newItem, ...history.filter(h => h.display_name !== place.display_name)].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('navHistory', JSON.stringify(newHistory));
    };

    const [locError, setLocError] = useState(null);

    const startLocationWatch = (highAccuracy = true) => {
        if (!navigator.geolocation) {
            setLocStatus('Geolocation is not supported by your browser');
            return;
        }

        setLocStatus(highAccuracy ? 'Detecting location (satellite)...' : 'Detecting location (network)...');
        setLocError(null);

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newPos = [pos.coords.latitude, pos.coords.longitude];
                setUserPos(newPos);
                setLocAccuracy(pos.coords.accuracy);
                setLocError(null);
            },
            (err) => {
                console.error("Geolocation error:", err);

                // If timeout and we were trying high accuracy, try again with low accuracy
                if (err.code === 3 && highAccuracy) {
                    console.log("High accuracy timed out, falling back to low accuracy...");
                    navigator.geolocation.clearWatch(watchId);
                    startLocationWatch(false);
                    return;
                }

                let msg = 'Location detection failed';
                if (err.code === 1) msg = 'Location permission denied. Please enable it.';
                else if (err.code === 2) msg = 'Location unavailable via GPS.';
                else if (err.code === 3) msg = 'Location request timed out.';
                setLocStatus(msg);
                setLocError(msg);
            },
            {
                enableHighAccuracy: highAccuracy,
                timeout: 15000, // Increased to 15s
                maximumAge: 0
            }
        );
        return watchId;
    };

    useEffect(() => {
        const watchId = startLocationWatch();
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);



    useEffect(() => {
        if (route && route.steps && route.steps[currentStepIndex]) {
            const step = route.steps[currentStepIndex];
            if (step.location) {
                setCurrentStepPos([step.location[1], step.location[0]]);
            }
        }
    }, [currentStepIndex, route]);

    const startNavigation = async () => {
        if (!userPos || !dest) return alert("Please ensure location and destination are set.");
        addToHistory(dest);

        try {
            const url = `https://router.project-osrm.org/route/v1/${mode}/${userPos[1]},${userPos[0]};${dest.lon},${dest.lat}?overview=full&geometries=geojson&steps=true`;

            const res = await axios.get(url);

            if (res.data.code === 'Ok') {
                const routeData = res.data.routes[0];
                const transformedRoute = {
                    geometry: routeData.geometry,
                    duration_seconds: routeData.duration,
                    distance_meters: routeData.distance,
                    steps: routeData.legs[0].steps.map(s => ({
                        instruction: s.name || s.maneuver.type,
                        distance: Math.round(s.distance),
                        duration: s.duration,
                        location: s.maneuver.location
                    }))
                };
                setRoute(transformedRoute);
                setCurrentStepIndex(0);
                setView('nav');
            }
        } catch (e) {
            alert("Route calculation failed.");
        }
    };

    const handleHistorySelect = (place) => {
        setDest(place);
        setShowHistoryModal(false);
    };

    const handleRecenter = () => {
        setRecenterConfig(prev => ({ trigger: prev.trigger + 1, target: 'user' }));
    };

    return (

        <div className="min-h-screen bg-transparent text-white overflow-x-hidden flex flex-col">

            {showHistoryModal && (
                <HistoryModal
                    history={history}
                    onSelect={handleHistorySelect}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}

            {/* --- HOME VIEW --- */}
            {view === 'home' && !showHistoryModal && (
                <div className="flex-1 flex flex-col">
                    <div className="flex-none z-[1000] animate-in slide-in-from-top duration-700">
                        <Navbar
                            view={view}
                            setView={setView}
                            showHistory={() => setShowHistoryModal(true)}
                        />
                    </div>
                    <div className="flex-grow flex flex-col items-center justify-start pt-24 pb-12 px-4 animate-in fade-in">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent inline-block drop-shadow-sm">
                                MiniMapper
                            </h1>
                            <p className="text-sm lg:text-lg text-gray-400 mt-2">Navigate with style</p>
                        </div>

                        <div className="form-container w-full max-w-lg lg:max-w-2xl lg:p-10 relative z-10 transition-all duration-300">
                            <div className="mb-6 flex flex-col items-center justify-center gap-2">
                                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all shadow-sm
                        ${userPos
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                                        : locError
                                            ? 'bg-red-500/10 border-red-500/20 text-red-300'
                                            : 'bg-orange-500/10 border-orange-500/20 text-orange-300'
                                    }`}
                                >
                                    {userPos ? (
                                        <Crosshair className="w-4 h-4" />
                                    ) : locError ? (
                                        <div className="w-4 h-4 text-red-400">⚠️</div>
                                    ) : (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {userPos
                                            ? `GPS Active (±${Math.round(locAccuracy)}m)`
                                            : locStatus
                                        }
                                    </span>
                                </div>

                                {locError && (
                                    <button
                                        onClick={() => {
                                            setUserPos(null);
                                            startLocationWatch();
                                        }}
                                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Retry Location
                                    </button>
                                )}
                            </div>

                            <DestinationInput
                                placeholder="Where to?"
                                onSelect={setDest}
                                initialValue={dest ? dest.display_name : ''}
                            />

                            <div className="my-6">
                                <TransportModeSelector mode={mode} setMode={setMode} />
                            </div>

                            <div className="mb-8">
                                <RouteOptions options={routeOpts} setOptions={setRouteOpts} />
                            </div>

                            <button
                                onClick={() => startNavigation()}
                                disabled={!userPos || !dest}
                                className="btn-primary w-full flex items-center justify-center gap-2 text-lg shadow-xl py-4 lg:py-5 lg:text-xl"
                            >
                                <Play className="w-6 h-6 lg:w-7 lg:h-7" /> Start Navigation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NAV VIEW --- */}
            {view === 'nav' && (
                <div className="flex flex-col w-full min-h-screen lg:h-screen lg:overflow-hidden">
                    <Navbar
                        view={view}
                        setView={setView}
                        showHistory={() => setShowHistoryModal(true)}
                        hideDesktop={true}
                    />

                    <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden p-4 lg:p-6 gap-6 bg-transparent">
                        {/* MAP CONTAINER */}
                        <div className="w-full lg:w-2/3 h-[45vh] lg:h-full relative z-0 border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl">
                            <MapComponent
                                userPos={userPos}
                                stepPos={currentStepPos}
                                routeData={route}
                                isNavigating={true}
                                recenterConfig={recenterConfig}
                                scrollWheelZoom={true}
                            />

                            <button
                                onClick={handleRecenter}
                                className="absolute bottom-4 right-4 z-[400] bg-gray-900/80 backdrop-blur-md p-3 lg:p-4 rounded-2xl border border-gray-600 text-blue-400 shadow-lg hover:scale-110 transition"
                            >
                                <Crosshair className="w-6 h-6 lg:w-8 lg:h-8" />
                            </button>

                            <div className="absolute top-4 left-4 z-[400] glass-panel px-3 py-1.5 lg:px-5 lg:py-2.5 rounded-full text-xs lg:text-sm font-bold flex items-center gap-2 backdrop-blur-md shadow-lg">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                                <span className="text-white">Live Tracking</span>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="flex-1 lg:w-1/3 w-full bg-black/20 backdrop-blur-xl lg:bg-black/20 lg:overflow-y-auto no-scrollbar relative z-10 pb-32 lg:pb-0 rounded-[32px] border border-gray-800/50 shadow-2xl">
                            <NavigationSheet
                                route={route}
                                stepIndex={currentStepIndex}
                                setStepIndex={setCurrentStepIndex}
                                onRecenter={handleRecenter}
                                onHome={() => setView('home')}
                                onHistory={() => setShowHistoryModal(true)}
                                embeddedMode={true}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Developer Footer */}
            {/* Developer Footer - Only on Home View */}
            {view === 'home' && (
                <div className="fixed bottom-20 left-0 right-0 lg:bottom-4 lg:left-auto lg:right-4 text-center lg:text-right z-[50] pointer-events-none">
                    <p className="text-[10px] lg:text-xs font-medium tracking-widest uppercase animate-text-shimmer text-gray-400">
                        Developed by{" "}
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                            Girisudhan V
                        </span>{" "}
                        ECE 2nd yr
                    </p>
                </div>
            )}

        </div>
    );
}

export default App;
