import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

// ── Fix Leaflet default icon ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Marker đỏ – vị trí người dùng
const userIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative;width:20px;height:20px;">
            <div style="
                width:20px;height:20px;
                background:#ef4444;
                border:3px solid white;
                border-radius:50%;
                box-shadow:0 2px 8px rgba(239,68,68,0.5);
                animation:userPulse 2s ease-in-out infinite;
            "></div>
        </div>
        <style>
            @keyframes userPulse {
                0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,0.4); }
                50%      { box-shadow:0 0 0 10px rgba(239,68,68,0); }
            }
        </style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// Marker địa điểm
// Màu theo danh mục
const CATEGORY_STYLES = {
    'ca-phe': { bg: '#92400e', emoji: '☕' }, // nâu – cà phê
    'hoc-tap': { bg: '#2563eb', emoji: '📖' }, // xanh dương – học tập
    'mua-sam': { bg: '#7c3aed', emoji: '🛍️' }, // tím – mua sắm
    've-dem': { bg: '#1d4ed8', emoji: '🌙' }, // xanh đậm – về đêm
    'tham-quan': { bg: '#d97706', emoji: '📸' }, // vàng – tham quan
};

function getCategoryIcon(place) {
    const slug = place.category?.slug || '';
    const style = CATEGORY_STYLES[slug] || { bg: '#003d9b', emoji: '📍' };
    return L.divIcon({
        className: '',
        html: `
            <div style="
                position:relative;
                display:flex;flex-direction:column;align-items:center;
            ">
                <div style="
                    width:40px;height:40px;
                    background:${style.bg};
                    border:3px solid white;
                    border-radius:14px;
                    display:flex;align-items:center;justify-content:center;
                    font-size:18px;
                    box-shadow:0 4px 12px rgba(0,0,0,0.25);
                ">${style.emoji}</div>
                <div style="
                    width:0;height:0;
                    border-left:6px solid transparent;
                    border-right:6px solid transparent;
                    border-top:7px solid ${style.bg};
                    margin-top:-1px;
                "></div>
            </div>`,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -52],
    });
}

// Marker tạm – khi click để thêm địa điểm
const tempIcon = L.divIcon({
    className: '',
    html: `<div style="
        width:36px;height:36px;
        background:#f59e0b;
        border:3px solid white;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:16px;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
        animation:bounce 1s infinite alternate;
    ">✨</div>
    <style>
        @keyframes bounce {
            from { transform:translateY(0); }
            to   { transform:translateY(-6px); }
        }
    </style>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
});

// ── Sub-components ──
function MapClickHandler({ onClick }) {
    useMapEvents({ click: onClick });
    return null;
}

function FlyController({ target }) {
    const map = useMap();
    useEffect(() => {
        if (target) map.flyTo([target.lat, target.lng], 16, { duration: 1.4 });
    }, [target]);
    return null;
}

// ── Main Component ──
export default function Map({ places, categories }) {
    const { auth } = usePage().props;

    // Filter
    const [selectedCats, setSelectedCats] = useState([]);

    const handleCatToggle = (catId) => {
        setSelectedCats(prev => {
            if (prev.includes(catId)) {
                return prev.filter(id => id !== catId);
            } else {
                return [...prev, catId];
            }
        });
    };

    // Modal thêm địa điểm
    const [showModal, setShowModal] = useState(false);
    const [tempCoords, setTempCoords] = useState(null);

    // Vị trí người dùng
    const [userLoc, setUserLoc] = useState(null);
    const [locLoading, setLocLoading] = useState(false);
    const [locError, setLocError] = useState('');
    const [flyTarget, setFlyTarget] = useState(null);
    const [mapStyle, setMapStyle] = useState('voyager');
    const [showLabels, setShowLabels] = useState(true); // hiện tên quán

    const TILE_STYLES = {
        voyager: {
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            label: '🎨 Màu sắc',
        },
        light: {
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            label: '☀️ Sáng',
        },
        dark: {
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            label: '🌙 Tối',
        },
    };

    const { data, setData, post, processing, reset } = useForm({
        name: '', category_ids: categories[0]?.id ? [categories[0].id] : [],
        address: '', latitude: '', longitude: '', description: '',
    });

    // Tự lấy vị trí khi load trang (không fly)
    useEffect(() => { getLocation(false); }, []);

    const getLocation = useCallback((fly = true) => {
        if (!navigator.geolocation) { setLocError('Trình duyệt không hỗ trợ GPS.'); return; }
        setLocLoading(true); setLocError('');
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const loc = { lat: coords.latitude, lng: coords.longitude };
                setUserLoc(loc);
                setLocLoading(false);
                if (fly) setFlyTarget({ ...loc, ts: Date.now() });
            },
            () => { setLocError('Không lấy được vị trí.'); setLocLoading(false); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const handleMapClick = async (e) => {
        if (!auth?.user) {
            alert('Vui lòng đăng nhập bằng tài khoản Admin để thêm địa điểm!');
            window.location.href = route('login');
            return;
        }
        if (auth.user.role !== 'admin') {
            alert('Chỉ tài khoản Admin mới có quyền thêm địa điểm mới trên bản đồ.');
            return;
        }
        const { lat, lng } = e.latlng;
        setTempCoords({ lat, lng });
        setData(prev => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const json = await res.json();
            setData(prev => ({ ...prev, address: json.display_name || '', latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
        } catch { }
        setShowModal(true);
    };

    const submitDiscovery = (e) => {
        e.preventDefault();
        post(route('map.discovery'), {
            onSuccess: () => { setShowModal(false); reset(); setTempCoords(null); }
        });
    };

    const filtered = selectedCats.length === 0
        ? places
        : places.filter(p => {
            const matchesPrimary = selectedCats.map(Number).includes(Number(p.category_id));
            const pCats = Array.isArray(p.category_ids) ? p.category_ids.map(Number) : [];
            const matchesSecondary = pCats.some(id => selectedCats.map(Number).includes(id));
            return matchesPrimary || matchesSecondary;
        });

    const mapCenter = userLoc ? [userLoc.lat, userLoc.lng] : [10.2500, 105.9700];

    return (
        <AppLayout>
            <Head title="Bản đồ khám phá – KhamPhaDD" />

            <div className="flex flex-col pt-16" style={{ height: '100vh' }}>
                <div className="relative flex-1 overflow-hidden">

                    {/* ── MAP ── */}
                    <MapContainer
                        center={mapCenter}
                        zoom={userLoc ? 15 : 13}
                        className="h-full w-full"
                        zoomControl={false}
                    >
                        <TileLayer
                            url={TILE_STYLES[mapStyle].url}
                            attribution="&copy; OpenStreetMap &copy; CARTO"
                        />

                        <FlyController target={flyTarget} />
                        {auth?.user?.role === 'admin' && (
                            <MapClickHandler onClick={handleMapClick} />
                        )}

                        {/* Marker vị trí người dùng */}
                        {userLoc && (
                            <>
                                <Circle
                                    center={[userLoc.lat, userLoc.lng]}
                                    radius={100}
                                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.08, weight: 1 }}
                                />
                                <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                                    <Popup>
                                        <div className="text-center p-1">
                                            <p className="font-bold text-sm">📡 Vị trí của bạn</p>
                                            <p className="text-xs text-gray-500 mt-1">{userLoc.lat.toFixed(5)}, {userLoc.lng.toFixed(5)}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </>
                        )}

                        {/* Markers địa điểm */}
                        <MarkerClusterGroup
                            chunkedLoading
                            maxClusterRadius={40}
                            showCoverageOnHover={false}
                        >
                            {filtered.map(place => {
                                // Tính khoảng cách thẳng nếu có GPS
                                let distText = null;
                                if (userLoc) {
                                    const R = 6371;
                                    const dLat = (place.latitude - userLoc.lat) * Math.PI / 180;
                                    const dLon = (place.longitude - userLoc.lng) * Math.PI / 180;
                                    const a = Math.sin(dLat / 2) ** 2 + Math.cos(userLoc.lat * Math.PI / 180) * Math.cos(place.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
                                    const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                    distText = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
                                }
                                const directionsUrl = userLoc
                                    ? `https://www.google.com/maps/dir/${userLoc.lat},${userLoc.lng}/${place.latitude},${place.longitude}`
                                    : `https://www.google.com/maps/dir//${place.latitude},${place.longitude}`;

                                return (
                                    <Marker 
                                        key={place.id} 
                                        position={[place.latitude, place.longitude]} 
                                        icon={getCategoryIcon(place)}
                                        draggable={auth?.user?.role === 'admin'}
                                        eventHandlers={{
                                            dragend: (e) => {
                                                const marker = e.target;
                                                const position = marker.getLatLng();
                                                const confirmUpdate = window.confirm(
                                                    `Bạn có chắc chắn muốn cập nhật tọa độ mới cho "${place.name}" không?\nTọa độ mới: (${position.lat.toFixed(6)}, ${position.lng.toFixed(6)})`
                                                );
                                                if (confirmUpdate) {
                                                    router.patch(route('places.updateCoordinates', place.id), {
                                                        latitude: position.lat,
                                                        longitude: position.lng,
                                                    }, {
                                                        preserveScroll: true,
                                                    });
                                                } else {
                                                    // Trả marker về vị trí cũ nếu hủy
                                                    marker.setLatLng([place.latitude, place.longitude]);
                                                }
                                            }
                                        }}
                                    >
                                        {showLabels && (
                                            <Tooltip
                                                permanent
                                                direction="bottom"
                                                offset={[0, 4]}
                                                className="map-label"
                                            >
                                                <span className="text-[10px] font-bold whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis block">
                                                    {place.name}
                                                </span>
                                            </Tooltip>
                                        )}
                                        <Popup minWidth={240}>
                                            <div className="p-3">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#003d9b] block mb-1">
                                                    {place.category?.name}
                                                </span>
                                                <h3 className="font-bold text-base text-gray-900 mb-1 leading-tight">{place.name}</h3>
                                                <p className="text-xs text-gray-500 mb-2">📍 {place.address}</p>

                                                {distText && (
                                                    <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1.5 mb-3">
                                                        <span className="text-sm">📡</span>
                                                        <span className="text-xs font-bold text-blue-700">Cách bạn {distText}</span>
                                                    </div>
                                                )}

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/places/${place.slug}`}
                                                        className="flex-1 text-center bg-[#003d9b] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#001b44] transition-colors"
                                                    >
                                                        Chi tiết
                                                    </Link>
                                                    <a
                                                        href={directionsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 text-center bg-blue-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        🗺️ Chỉ đường
                                                    </a>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MarkerClusterGroup>

                        {/* Marker tạm */}
                        {tempCoords && (
                            <Marker position={[tempCoords.lat, tempCoords.lng]} icon={tempIcon} />
                        )}
                    </MapContainer>

                    {/* ── FILTER PANEL (top-left) ── */}
                    <div className="absolute top-4 left-4 z-[400]">
                        <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-lg p-4 max-w-[260px]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                Lọc danh mục
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    onClick={() => setSelectedCats([])}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${selectedCats.length === 0 ? 'bg-[#003d9b] text-white border-[#003d9b]' : 'border-gray-200 text-gray-500 hover:border-[#003d9b]'}`}
                                >
                                    🗺️ Tất cả ({places.length})
                                </button>
                                {categories.map(cat => {
                                    const isSelected = selectedCats.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCatToggle(cat.id)}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${isSelected ? 'bg-[#003d9b] text-white border-[#003d9b]' : 'border-gray-200 text-gray-500 hover:border-[#003d9b]'}`}
                                        >
                                            {cat.icon} {cat.name} {isSelected && '✓'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── LOCATE BUTTON (top-right) ── */}
                    <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
                        <button
                            onClick={() => getLocation(true)}
                            disabled={locLoading}
                            title="Về vị trí của tôi"
                            className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50"
                        >
                            {locLoading ? (
                                <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                            )}
                        </button>
                        {userLoc && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow">
                                📡 Đang theo dõi
                            </span>
                        )}
                        {locError && (
                            <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-1 rounded-lg max-w-[90px] text-center leading-tight">
                                {locError}
                            </span>
                        )}
                    </div>

                    {/* Toggle labels + Style switcher - bottom left */}
                    <div className="absolute bottom-6 left-4 z-[400] flex gap-1.5">
                        <button
                            onClick={() => setShowLabels(v => !v)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all shadow ${showLabels
                                    ? 'bg-[#003d9b] text-white border-[#003d9b]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#003d9b]'
                                }`}
                        >
                            🏷️ Tên quán
                        </button>
                        {Object.entries(TILE_STYLES).map(([key, style]) => (
                            <button
                                key={key}
                                onClick={() => setMapStyle(key)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all shadow ${mapStyle === key
                                        ? 'bg-[#003d9b] text-white border-[#003d9b]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#003d9b]'
                                    }`}
                            >
                                {style.label}
                            </button>
                        ))}
                    </div>

                    {/* ── INFO PANEL (bottom-right) ── */}
                    <div className="absolute bottom-6 right-4 z-[400]">
                        <div className="bg-[#003d9b] text-white rounded-2xl shadow-xl p-4 max-w-[220px]">
                            {userLoc ? (
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Vị trí của bạn</p>
                                        <p className="text-xs font-bold text-white">{userLoc.lat.toFixed(4)}°N</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Chưa định vị</p>
                                </div>
                            )}
                            <p className="text-white/70 text-[10px] leading-relaxed border-t border-white/10 pt-2 mt-1">
                                {auth?.user?.role === 'admin' 
                                    ? "Nhấp vào bản đồ để thêm địa điểm mới hoặc kéo thả các ghim địa điểm để cập nhật tọa độ." 
                                    : "Bản đồ hiển thị các địa điểm du lịch & ẩm thực của Vĩnh Long."
                                }
                            </p>
                            <div className="flex gap-3 mt-2 text-[9px] font-bold text-white/40">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white inline-block" />&nbsp;Địa điểm</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />&nbsp;Bạn</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── MODAL THÊM ĐỊA ĐIỂM ── */}
            {showModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-black text-[#001b44]">Thêm địa điểm mới</h2>
                                <p className="text-xs text-gray-400 mt-1">Đóng góp cho cộng đồng KhamPhaDD</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submitDiscovery} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tên địa điểm *</label>
                                <input
                                    type="text" required value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="VD: Quán cà phê Sông Quê"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d9b] focus:outline-none transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Danh mục (Chọn nhiều) *</label>
                                    <div className="flex flex-wrap gap-2.5 max-h-[160px] overflow-y-auto pr-1 pt-1">
                                        {categories.map(cat => {
                                            const checked = data.category_ids.includes(cat.id);
                                            return (
                                                <button
                                                    type="button"
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setData('category_ids', checked
                                                            ? data.category_ids.filter(id => id !== cat.id)
                                                            : [...data.category_ids, cat.id]
                                                        );
                                                    }}
                                                    className={`px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                                        checked
                                                            ? 'border-[#003d9b] bg-[#003d9b]/5 text-[#003d9b] shadow-sm'
                                                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <span>{cat.icon}</span>
                                                    <span>{cat.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tọa độ</label>
                                    <div className="flex gap-2">
                                        <input readOnly value={data.latitude} className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-[10px] text-gray-400 text-center font-mono" />
                                        <input readOnly value={data.longitude} className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-[10px] text-gray-400 text-center font-mono" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Địa chỉ *</label>
                                <input
                                    required value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="Địa chỉ đầy đủ"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d9b] focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Mô tả</label>
                                <textarea
                                    rows={3} value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Mô tả ngắn về địa điểm..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#003d9b] focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit" disabled={processing}
                                className="w-full bg-[#003d9b] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#001b44] transition-all disabled:opacity-60"
                            >
                                {processing ? 'Đang gửi...' : '📍 Đóng góp địa điểm'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
