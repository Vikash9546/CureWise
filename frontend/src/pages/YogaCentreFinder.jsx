import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Globe, Loader2, Search, Navigation2, Flower2, Wind, ArrowRight, Clock, Map as MapIcon, List as ListIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const zenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper component to recenter the map
function RecenterMap({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lon], zoom, {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, zoom, map]);
    return null;
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function YogaCentreFinder() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null);
    const [centres, setCentres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);
    const [searchLocationName, setSearchLocationName] = useState('');
    const [nameQuery, setNameQuery] = useState('');
    const [viewMode, setViewMode] = useState('split'); // 'map', 'list', 'split'
    const [selectedCentre, setSelectedCentre] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
    }, [user, authLoading, navigate]);

    const getMyLocation = () => {
        setGeoLoading(true);
        setError(null);
        setSearchQuery('');
        setSearchLocationName('Your Live Location');
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setGeoLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                fetchCentres(latitude, longitude);
                setGeoLoading(false);
            },
            (err) => {
                toast.error('Failed to get location');
                setGeoLoading(false);
            }
        );
    };

    const handleManualSearch = async (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;

        setSearching(true);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);

                setUserLocation({ lat: latitude, lon: longitude });
                setSearchLocationName(display_name.split(',')[0]);
                fetchCentres(latitude, longitude);
            } else {
                toast.error('Location not found. Please be more specific.');
                setError('Location not found.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Search failed. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    const fetchCentres = async (lat, lon) => {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            // 100% FREE Overpass API Query - Adjusted to exact 10km radius
            const radius = 10000;
            const query = `[out:json][timeout:25];
                (
                  nwr["leisure"="yoga_studio"](around:${radius},${lat},${lon});
                  nwr["amenity"="meditation_centre"](around:${radius},${lat},${lon});
                  nwr["leisure"="fitness_centre"]["name"~"Yoga|Meditation",i](around:${radius},${lat},${lon});
                  nwr["amenity"="community_centre"]["name"~"Yoga|Meditation",i](around:${radius},${lat},${lon});
                );
                out center;`;
            const encodedQuery = encodeURIComponent(query);

            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodedQuery}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Free map server busy. Please try again.');

            const data = await response.json();

            const getSafeHostname = (url) => {
                if (!url) return null;
                try {
                    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                    return new URL(formattedUrl).hostname;
                } catch (e) {
                    return url.replace(/^https?:\/\//, '').split('/')[0];
                }
            };

            const centreList = data.elements.map(el => {
                const cLat = el.lat || (el.center && el.center.lat);
                const cLon = el.lon || (el.center && el.center.lon);

                if (!cLat || !cLon || !el.tags) return null;

                const distance = calculateDistance(lat, lon, cLat, cLon);

                return {
                    id: el.id,
                    name: el.tags.name || 'Zen Wellness Space',
                    address: el.tags['addr:full'] || el.tags['addr:street'] || 'Nearby Area',
                    phone: el.tags['phone'] || el.tags['contact:phone'] || null,
                    website: el.tags['website'] || el.tags['contact:website'] || null,
                    safeWebsiteHost: getSafeHostname(el.tags['website'] || el.tags['contact:website']),
                    openingHours: el.tags['opening_hours'] || null,
                    distance: distance,
                    lat: cLat,
                    lon: cLon,
                    image: `https://images.unsplash.com/photo-${el.id % 2 === 0 ? '1545208393-59637cba8d35' : '1506126613408-eca07ce68773'}?w=800&q=80`
                };
            }).filter(c => c !== null).sort((a, b) => a.distance - b.distance);

            setCentres(centreList);
            if (centreList.length === 0) toast('No results found within 10km');
            else toast.success(`Found ${centreList.length} wellness spaces within 10km!`);
        } catch (err) {
            clearTimeout(timeoutId);
            toast.error('Free service temporarily busy');
            setError('Service unavailable');
        } finally {
            setLoading(false);
        }
    };



    const filteredCentres = centres.filter(c =>
        c.name.toLowerCase().includes(nameQuery.toLowerCase())
    );

    if (authLoading) {
        return (
            <div className="max-w-6xl mx-auto p-8 animate-pulse">
                <div className="flex justify-center mb-10"><div className="w-20 h-20 bg-orange-50 rounded-full"></div></div>
                <div className="h-10 bg-slate-200 rounded-full w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2 mx-auto mb-16"></div>
                <div className="max-w-3xl mx-auto bg-white border border-slate-100 h-[60px] rounded-2xl shadow-sm mb-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white border text-center border-slate-100 h-[450px] rounded-[3rem] shadow-sm"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mb-12 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/5 rounded-full blur-[80px] -z-10"></div>
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-sm">
                    <Flower2 className="w-8 h-8 text-orange-600" />
                </div>
                <h1 className="text-4xl font-bold mb-3 text-slate-900 font-playfair">Zen Space Finder</h1>
                <p className="text-orange-600/80 font-medium max-w-2xl mx-auto uppercase text-xs tracking-widest">Discover Yoga & Meditation Centres Near You</p>
            </div>

            <div className="max-w-3xl mx-auto mb-16">
                <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-xl border border-slate-100 group focus-within:border-orange-500/30 transition-all duration-500">
                    <form onSubmit={handleManualSearch} className="flex-1 flex items-center gap-3 px-4">
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            className="bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 w-full py-3 outline-none"
                            placeholder="Find Zen in your area..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={searching || loading}
                            className="hidden md:block px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all disabled:opacity-50"
                        >
                            {searching ? '...' : 'Search'}
                        </button>
                    </form>
                    <div className="h-px md:h-8 w-full md:w-px bg-slate-100 my-1 md:my-auto"></div>
                    <button
                        onClick={getMyLocation}
                        disabled={geoLoading || loading}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-orange-600 transition-all"
                    >
                        {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation2 className="w-5 h-5 text-orange-500" />}
                        Near Me
                    </button>
                </div>

                {userLocation && (
                    <div className="mt-8 flex flex-col items-center gap-6 animate-in fade-in slide-in-from-top-2 duration-700">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                            Current Zone: <span className="text-orange-600">{searchLocationName}</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                                className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                            >
                                {viewMode === 'map' ? <ListIcon className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                                {viewMode === 'map' ? 'Switch to List' : 'Switch to Map'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Section */}
            {userLocation && viewMode !== 'list' && (
                <div className="mb-16 animate-in fade-in zoom-in duration-1000">
                    <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl border border-slate-50 overflow-hidden relative" style={{ height: '500px' }}>
                        <MapContainer
                            center={[userLocation.lat, userLocation.lon]}
                            zoom={13}
                            style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            <RecenterMap center={userLocation} zoom={13} />

                            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                                <Popup>
                                    <div className="p-1 font-bold text-slate-800">Your Current Location</div>
                                </Popup>
                            </Marker>

                            {/* Center Markers removed as per request to only show current location on map */}
                        </MapContainer>

                        {/* Overlay Map UI */}
                        <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{centres.length} Zen Spaces Found</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {centres.length > 0 && viewMode !== 'map' && (
                <div className="max-w-md mx-auto mb-10">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter centres by name..."
                            className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                            value={nameQuery}
                            onChange={(e) => setNameQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center max-w-md mx-auto mb-10">
                    <p className="text-rose-600 font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white h-[450px] rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>
                    ))
                ) : filteredCentres.map(centre => (
                    <div key={centre.id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-500 flex flex-col h-full shadow-sm">
                        {/* Image Header */}
                        <div className="relative h-48 overflow-hidden grayscale-[30%] group-hover:grayscale-0 transition-all duration-700">
                            <img src={centre.image} alt={centre.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {/* Removed type as it's not available from Google Places API directly */}
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-orange-400" />
                                    {centre.distance.toFixed(1)} KM
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-1">
                            <div className="mb-6 flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1 font-playfair">
                                    {centre.name}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start text-slate-400">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-orange-50 transition-colors">
                                            <Navigation2 className="w-4 h-4 text-slate-300 group-hover:text-orange-400" />
                                        </div>
                                        <p className="text-xs font-medium leading-relaxed">
                                            {centre.address}
                                        </p>
                                    </div>
                                    {centre.openingHours && (
                                        <div className="flex gap-3 items-center text-emerald-600">
                                            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Hours: {centre.openingHours}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest text-center shadow-xl shadow-orange-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Get Directions
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <div className="flex gap-2">
                                    {centre.phone && (
                                        <a href={`tel:${centre.phone}`} className="flex-1 p-3 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-xl border border-slate-100 transition-all hover:bg-white flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest" title="Call Center">
                                            <Phone className="w-4 h-4" /> Call
                                        </a>
                                    )}
                                    {centre.website && (
                                        <a href={centre.website} target="_blank" rel="noopener noreferrer" className="flex-1 p-3 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-xl border border-slate-100 transition-all hover:bg-white flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest" title="Visit Website">
                                            <Globe className="w-4 h-4" /> {centre.safeWebsiteHost || 'Website'}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
