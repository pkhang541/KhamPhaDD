import { useState, useEffect } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { assetUrl } from '@/lib/assets';

const getPlaceImg = (place) => {
    return assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70');
};

function SortablePlaceCard({ place, index, onRemove, day, daysCount, onDayChange }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: place.id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

    return (
        <div ref={setNodeRef} style={style} className={`relative flex gap-3 p-3 bg-gray-50 border ${isDragging ? 'border-[#003d9b] shadow-md opacity-80' : 'border-gray-100'} rounded-xl group hover:border-gray-200 transition-all`}>
            <div {...attributes} {...listeners} className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#003d9b] text-white flex items-center justify-center text-xs font-black cursor-grab active:cursor-grabbing shadow-sm z-10" title="Kéo để đổi vị trí">
                {index + 1}
            </div>
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img src={getPlaceImg(place)} alt={place.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-800 truncate">{place.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{place.address?.split(',')[0] || 'Việt Nam'}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {daysCount >= 2 ? (
                        <select 
                            value={day || ''}
                            onChange={(e) => onDayChange(e.target.value ? Number(e.target.value) : null)}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border outline-none cursor-pointer appearance-none text-center ${
                                day 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                            }`}
                            style={{ backgroundImage: 'none' }} // Remove default select arrow for a clean badge look
                        >
                            <option value="">+ Chọn ngày</option>
                            {Array.from({ length: daysCount }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>Ngày {d}</option>
                            ))}
                        </select>
                    ) : (
                        day ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Ngày {day}</span>
                        ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Chưa phân ngày</span>
                        )
                    )}
                    {place.category && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{place.category.name}</span>
                    )}
                </div>
            </div>
            <button type="button" onClick={() => onRemove(place.id)}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] hover:bg-red-100 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                ✕
            </button>
        </div>
    );
}


const COVER_OPTIONS = [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80',
];

export default function CreateForm({ allPlaces, onCancel }) {
    const { auth } = usePage().props;
    const pad2 = (value) => String(value).padStart(2, '0');
    const formatDateInput = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    const formatTimeInput = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    const now = new Date();
    const today = formatDateInput(now);
    const currentTime = formatTimeInput(now);

    const form = useForm({
        title: '', start_date: '', end_date: '',
        members: 2, budget: '', currency: 'VND',
        departure_time: '', return_time: '', is_public: false, place_ids: [],
        cover_image: null, cover_image_url: COVER_OPTIONS[0],
    });

    const [coverImage, setCoverImage] = useState(COVER_OPTIONS[0]);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [memberIdentifier, setMemberIdentifier] = useState('');
    const [memberIdentifierError, setMemberIdentifierError] = useState('');
    const [isInvitingMember, setIsInvitingMember] = useState(false);
    const [invitedMembers, setInvitedMembers] = useState([]);
    // dayPlaces: { 1: [placeId, ...], 2: [...], ... }
    const [dayPlaces, setDayPlaces] = useState({});
    const [activeDay, setActiveDay] = useState(1);
    const [pickedPlaces, setPickedPlaces] = useState([]);
    const [showPlacePicker, setShowPlacePicker] = useState(false);
    const [searchQ, setSearchQ] = useState('');
    const [pickerDay, setPickerDay] = useState(1);

    // Restore picked IDs and form data from sessionStorage (after returning from Search page)
    useEffect(() => {
        try {
            const savedIds = sessionStorage.getItem('trip_picked_ids');
            if (savedIds) {
                const ids = JSON.parse(savedIds);
                if (Array.isArray(ids) && ids.length > 0) setSelectedIds(ids);
            }
            const savedPlaces = sessionStorage.getItem('trip_picked_places');
            if (savedPlaces) {
                const plist = JSON.parse(savedPlaces);
                if (Array.isArray(plist) && plist.length > 0) setPickedPlaces(plist);
            }
            const savedDayPlaces = sessionStorage.getItem('trip_day_places');
            if (savedDayPlaces) {
                const dp = JSON.parse(savedDayPlaces);
                if (dp) setDayPlaces(dp);
            }
            const savedFormData = sessionStorage.getItem('trip_form_data');
            if (savedFormData) {
                const data = JSON.parse(savedFormData);
                if (data) form.setData(data);
                if (data?.cover_image_url) setCoverImage(data.cover_image_url);
            }
        } catch {}
    }, []);

    const selectedPlaces = selectedIds.map(id => {
        const foundInProp = allPlaces.find(p => p.id === id);
        if (foundInProp) return foundInProp;
        const foundInStorage = pickedPlaces.find(p => p.id === id);
        return foundInStorage || null;
    }).filter(Boolean);

    const days = (() => {
        if (!form.data.start_date || !form.data.end_date) return null;
        return Math.ceil((new Date(form.data.end_date) - new Date(form.data.start_date)) / 86400000) + 1;
    })();
    const isMultiDay = days !== null && days >= 2;
    const minDepartureTime = form.data.start_date === today ? currentTime : undefined;
    const isDepartureTimePast = Boolean(
        form.data.start_date === today
        && form.data.departure_time
        && form.data.departure_time < currentTime
    );
    const isLateDepartureTime = Boolean(form.data.departure_time && form.data.departure_time >= '22:00');

    // Init day slots when days change
    useEffect(() => {
        if (days === null) return; // Do not clear when dates are not set yet
        if (days < 2) { setDayPlaces({}); return; }
        
        setDayPlaces(prev => {
            const next = { ...prev };
            for (let d = 1; d <= days; d++) {
                if (!next[d]) next[d] = [];
            }
            // Optional: clean up days beyond current days limit
            for (const d in next) {
                if (Number(d) > days) delete next[d];
            }
            return next;
        });
        setActiveDay(d => Math.min(d, days));
    }, [days]);

    // Sync dayPlaces to sessionStorage
    useEffect(() => {
        if (Object.keys(dayPlaces).length > 0 || days >= 2) {
            sessionStorage.setItem('trip_day_places', JSON.stringify(dayPlaces));
        }
    }, [dayPlaces, days]);

    // Day assignment helpers
    const getPlaceDay = (id) => {
        for (const [d, ids] of Object.entries(dayPlaces)) {
            if (ids.includes(id)) return Number(d);
        }
        return null;
    };
    const assignToDay = (placeId, day) => {
        setDayPlaces(prev => {
            const next = {};
            for (const [d, ids] of Object.entries(prev)) {
                next[d] = ids.filter(id => id !== placeId);
            }
            if (day) next[day] = [...(next[day] || []), placeId];
            return next;
        });
    };
    const removeFromDay = (placeId, day) => {
        setDayPlaces(prev => ({ ...prev, [day]: (prev[day] || []).filter(id => id !== placeId) }));
    };
    const movePlaceInDay = (day, fromIdx, toIdx) => {
        setSelectedIds(prev => {
            const dayIds = prev.filter(id => (dayPlaces[day] || []).includes(id));
            const item = dayIds[fromIdx];
            const targetItem = dayIds[toIdx];
            
            if (!item || !targetItem) return prev;
            
            const oldIndex = prev.indexOf(item);
            const newIndex = prev.indexOf(targetItem);
            
            const next = [...prev];
            next[oldIndex] = targetItem;
            next[newIndex] = item;
            
            sessionStorage.setItem('trip_picked_ids', JSON.stringify(next));
            return next;
        });
    };

    const togglePlace = (id) => {
        setSelectedIds(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            sessionStorage.setItem('trip_picked_ids', JSON.stringify(next));
            if (prev.includes(id)) assignToDay(id, null);
            return next;
        });
        setPickedPlaces(prev => {
            const next = prev.filter(p => p.id !== id);
            sessionStorage.setItem('trip_picked_places', JSON.stringify(next));
            return next;
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const overDay = getPlaceDay(over.id);
            const activeDay = getPlaceDay(active.id);
            if (activeDay !== overDay) {
                // Assign to new day
                setDayPlaces(prev => {
                    const next = {};
                    for (const [d, ids] of Object.entries(prev)) {
                        next[d] = ids.filter(id => id !== active.id);
                    }
                    if (overDay) next[overDay] = [...(next[overDay] || []), active.id];
                    return next;
                });
            }

            setSelectedIds((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const next = arrayMove(items, oldIndex, newIndex);
                sessionStorage.setItem('trip_picked_ids', JSON.stringify(next));
                return next;
            });
        }
    };

    const handleInvite = async () => {
        const identifier = memberIdentifier.trim();
        const normalizedIdentifier = identifier.toLowerCase();
        setMemberIdentifierError('');

        if (!identifier) return;
        if (
            normalizedIdentifier === auth?.user?.email?.toLowerCase() ||
            normalizedIdentifier === auth?.user?.uid?.toLowerCase()
        ) {
            setMemberIdentifierError('Bạn đã là chủ chuyến đi, không cần mời chính mình.');
            return;
        }
        if (invitedMembers.find(m => m.email.toLowerCase() === normalizedIdentifier || m.uid?.toLowerCase() === normalizedIdentifier)) {
            setMemberIdentifier('');
            return;
        }

        setIsInvitingMember(true);
        try {
            const { data: user } = await axios.get(route('users.byEmail'), { params: { identifier } });
            setInvitedMembers(prev => [...prev, { id: user.id, uid: user.uid, name: user.name, email: user.email }]);
            setMemberIdentifier('');
        } catch (error) {
            setMemberIdentifierError(error.response?.data?.message || 'Email hoặc UID này chưa có tài khoản. Người được mời cần đăng ký trước.');
        } finally {
            setIsInvitingMember(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isDepartureTimePast) {
            form.setError('departure_time', 'Giờ xuất phát không được nhỏ hơn giờ hiện tại.');
            return;
        }
        if (selectedIds.length === 0) {
            form.setError('place_ids', 'Vui lòng chọn ít nhất một địa điểm trước khi lưu chuyến đi.');
            return;
        }
        form.transform(data => {
            const tripPlacesList = [];
            
            // Loop through all days and their assigned place IDs
            Object.entries(dayPlaces).forEach(([dayNum, ids]) => {
                if (Array.isArray(ids)) {
                    ids.forEach((placeId, idx) => {
                        tripPlacesList.push({
                            place_id: placeId,
                            day_number: parseInt(dayNum),
                            order: idx
                        });
                    });
                }
            });

            // Find any selected places that were not assigned to any day, and assign them to day 1
            const assignedIds = tripPlacesList.map(tp => tp.place_id);
            selectedIds.forEach((placeId, idx) => {
                if (!assignedIds.includes(placeId)) {
                    tripPlacesList.push({
                        place_id: placeId,
                        day_number: 1,
                        order: tripPlacesList.filter(tp => tp.day_number === 1).length
                    });
                }
            });

            return {
                ...data,
                place_ids: selectedIds,
                trip_places: tripPlacesList,
                invited_emails: invitedMembers.map(member => member.email),
                members: invitedMembers.length + 1,
            };
        });
        form.post(route('trips.store'), {
            onSuccess: () => {
                sessionStorage.removeItem('trip_picked_ids');
                sessionStorage.removeItem('trip_picked_places');
                sessionStorage.removeItem('trip_day_places');
                sessionStorage.removeItem('trip_form_data');
            }
        });
    };

    const goToSearch = () => {
        if (!form.data.start_date || !form.data.end_date) {
            alert('Vui lòng chọn thời gian đi (ngày đi và ngày về) trước khi chọn địa điểm!');
            const startInput = document.querySelector('input[type="date"]');
            if (startInput) {
                startInput.focus();
                startInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        // Save current form state, selected IDs, day assignments & picked places, then navigate to Search
        sessionStorage.setItem('trip_picked_ids', JSON.stringify(selectedIds));
        sessionStorage.setItem('trip_picked_places', JSON.stringify(selectedPlaces));
        sessionStorage.setItem('trip_day_places', JSON.stringify(dayPlaces));
        sessionStorage.setItem('trip_form_data', JSON.stringify({ ...form.data, cover_image: null }));
        window.location.href = '/search?picking=1';
    };

    const handleQuickAddPlace = (place) => {
        const id = place.id;
        if (!selectedIds.includes(id)) {
            const nextIds = [...selectedIds, id];
            setSelectedIds(nextIds);
            sessionStorage.setItem('trip_picked_ids', JSON.stringify(nextIds));

            const nextPicked = [...pickedPlaces, place];
            setPickedPlaces(nextPicked);
            sessionStorage.setItem('trip_picked_places', JSON.stringify(nextPicked));

            // Assign to pickerDay
            setDayPlaces(prev => {
                const nextDays = { ...prev };
                if (!nextDays[pickerDay]) nextDays[pickerDay] = [];
                if (!nextDays[pickerDay].includes(id)) nextDays[pickerDay].push(id);
                sessionStorage.setItem('trip_day_places', JSON.stringify(nextDays));
                return nextDays;
            });
        }
    };

    const filteredPickerPlaces = allPlaces.filter(p =>
        !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase())
    ).slice(0, 20);

    const firstCoords = selectedPlaces.find(p => p.latitude && p.longitude);

    return (
        <>
        <div className="min-h-screen bg-[#F5F6FA] pt-16 pb-20">

            {/* ── HERO BANNER ── */}
            <div className="relative h-[220px] sm:h-[260px] w-full overflow-hidden">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
                    <div className="max-w-[1200px] mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Hành trình mới của bạn</h1>
                        <p className="text-white/70 text-sm">Bắt đầu lập kế hoạch cho chuyến đi tuyệt vời nhất.</p>
                    </div>
                </div>
                <div className="absolute bottom-5 right-6">
                    <button type="button" onClick={() => setShowCoverPicker(v => !v)}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/30 transition-all border border-white/20">
                        📷 Thay đổi ảnh bìa
                    </button>
                    {showCoverPicker && (
                        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/45 px-4" onClick={() => setShowCoverPicker(false)}>
                            <div className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-2xl border border-gray-100" onClick={(e) => e.stopPropagation()}>
                                <p className="text-xs font-bold text-gray-600 mb-3">Chọn ảnh bìa</p>
                                <button type="button"
                                    onClick={() => setShowCoverPicker(false)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                                    ×
                                </button>
                                <label className="mb-4 mt-2 flex items-center justify-center h-14 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-sm font-bold text-gray-500 cursor-pointer hover:border-[#003d9b] hover:text-[#003d9b] hover:bg-blue-50/40 transition-all">
                                    Tải ảnh từ máy
                                    <input type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setCoverImage(URL.createObjectURL(file));
                                            form.setData(prev => ({ ...prev, cover_image: file, cover_image_url: '' }));
                                            setShowCoverPicker(false);
                                        }} />
                                </label>
                                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Hoặc chọn ảnh mẫu</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {COVER_OPTIONS.map((img, i) => (
                                        <button key={i} type="button" onClick={() => {
                                            setCoverImage(img);
                                            form.setData(prev => ({ ...prev, cover_image: null, cover_image_url: img }));
                                            setShowCoverPicker(false);
                                        }}
                                            className={`h-20 rounded-lg overflow-hidden border-2 transition-all bg-gray-100 ${coverImage === img ? 'border-[#003d9b] ring-2 ring-[#003d9b]/20' : 'border-transparent hover:border-gray-300'}`}>
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto px-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── LEFT COLUMN ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Card: Thông tin cơ bản */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="font-bold text-base text-gray-900 mb-5 flex items-center gap-2">
                                <span className="text-lg">✏️</span> Thông tin cơ bản
                            </h2>
                            <div className="mb-5">
                                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tên chuyến đi</label>
                                <input type="text" value={form.data.title} onChange={e => form.setData('title', e.target.value)}
                                    placeholder="Ví dụ: Khám phá Tây Bắc mùa lúa chín" required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#003d9b] focus:bg-white focus:ring-1 focus:ring-[#003d9b]/10 outline-none transition-all" />
                                {form.errors.title && <p className="text-red-500 text-xs mt-1">{form.errors.title}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Thời gian</label>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                                        <span className="text-gray-400 text-sm">📅</span>
                                        <input type="date" value={form.data.start_date} min={today}
                                            onChange={e => form.setData(prev => ({
                                                ...prev,
                                                start_date: e.target.value,
                                                end_date: prev.end_date < e.target.value ? e.target.value : prev.end_date,
                                                departure_time: e.target.value === today && prev.departure_time && prev.departure_time < currentTime ? currentTime : prev.departure_time,
                                            }))}
                                            className="flex-1 border-0 bg-transparent text-sm text-gray-800 focus:ring-0 outline-none p-0 min-w-0" />
                                        <span className="text-gray-300 text-xs flex-shrink-0">-</span>
                                        <input type="date" value={form.data.end_date} min={form.data.start_date || today}
                                            onChange={e => form.setData('end_date', e.target.value)}
                                            className="flex-1 border-0 bg-transparent text-sm text-gray-800 focus:ring-0 outline-none p-0 min-w-0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Giờ xuất phát</label>
                                    <div className={`flex items-center gap-2 bg-gray-50 border rounded-xl px-3 py-2.5 ${
                                        isDepartureTimePast || form.errors.departure_time ? 'border-red-300 bg-red-50/40' : 'border-gray-200'
                                    }`}>
                                        <span className="text-gray-400 text-sm">🕒</span>
                                        <input type="time"
                                            value={form.data.departure_time}
                                            min={minDepartureTime}
                                            onChange={e => form.setData('departure_time', e.target.value)}
                                            className="flex-1 border-0 bg-transparent text-sm text-gray-800 focus:ring-0 outline-none p-0" />
                                    </div>
                                    {(isDepartureTimePast || form.errors.departure_time) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {form.errors.departure_time || 'Giờ xuất phát không được nhỏ hơn giờ hiện tại.'}
                                        </p>
                                    )}
                                    {!isDepartureTimePast && !form.errors.departure_time && isLateDepartureTime && (
                                        <p className="text-amber-600 text-xs mt-1">
                                            Xuất phát sau 22:00, nhiều quán có thể đã đóng cửa. Bạn nên cân nhắc lại lịch trình.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Ngân sách dự kiến (VND)</label>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                                        <span className="text-gray-400 text-sm">💰</span>
                                        <input type="text" placeholder="10.000.000"
                                            value={form.data.budget ? Number(form.data.budget).toLocaleString('vi-VN') : ''}
                                            onChange={e => form.setData('budget', e.target.value.replace(/\D/g, ''))}
                                            className="flex-1 border-0 bg-transparent text-sm text-gray-800 focus:ring-0 outline-none p-0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Thành viên chuyến đi */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="font-bold text-base text-gray-900 mb-5 flex items-center gap-2">
                                <span className="text-lg">👥</span> Thành viên chuyến đi
                            </h2>
                            <label className="text-xs font-semibold text-gray-500 block mb-1.5">Thêm thành viên bằng email hoặc UID</label>
                            <div className="flex gap-2 mb-5">
                                <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                                    <span className="text-gray-400 text-sm">✉️</span>
                                    <input type="text" value={memberIdentifier} onChange={e => { setMemberIdentifier(e.target.value); setMemberIdentifierError(''); }}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleInvite())}
                                        placeholder="Nhập email hoặc UID..."
                                        className="flex-1 border-0 bg-transparent text-sm text-gray-800 focus:ring-0 outline-none p-0" />
                                </div>
                                <button type="button" onClick={handleInvite} disabled={isInvitingMember}
                                    className="bg-[#003d9b] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#002a6e] transition-all flex-shrink-0 disabled:opacity-60">
                                    {isInvitingMember ? 'Đang kiểm tra...' : 'Mời'}
                                </button>
                            </div>
                            {(memberIdentifierError || form.errors.invited_emails || form.errors['invited_emails.0']) && (
                                <p className="text-red-500 text-xs -mt-3 mb-4">
                                    {memberIdentifierError || form.errors.invited_emails || form.errors['invited_emails.0']}
                                </p>
                            )}
                            <div className="space-y-0 divide-y divide-gray-50">
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#003d9b] text-white flex items-center justify-center text-sm font-bold">
                                            {auth?.user?.name?.charAt(0)?.toUpperCase() || 'B'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Bạn (Tôi)</p>
                                            <p className="text-xs text-gray-400">{auth?.user?.email} · UID {auth?.user?.uid}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#003d9b]">Trưởng Đoàn</span>
                                </div>
                                {invitedMembers.map((m, i) => (
                                    <div key={i} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">
                                                {m.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                                                <p className="text-xs text-gray-400">{m.email} · UID {m.uid}</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setInvitedMembers(prev => prev.filter(x => x.email !== m.email))}
                                            className="text-gray-300 hover:text-red-400 transition-colors p-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card: Điểm đến nổi bật */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                                    <span className="text-lg">📍</span> Điểm đến nổi bật
                                </h2>
                                {selectedPlaces.length > 1 && (
                                    <button type="button" className="text-xs font-semibold text-[#003d9b] hover:underline">Sắp xếp lại</button>
                                )}
                            </div>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                {!isMultiDay && selectedPlaces.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <SortableContext items={selectedIds} strategy={rectSortingStrategy}>
                                            {selectedPlaces.map((place, index) => (
                                                <SortablePlaceCard
                                                    key={place.id}
                                                    place={place}
                                                    index={index}
                                                    day={1}
                                                    daysCount={1}
                                                    onDayChange={() => {}}
                                                    onRemove={togglePlace}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>
                                )}
                                {/* Group by days */}
                                {isMultiDay && Array.from({ length: days || 1 }, (_, i) => i + 1).map(day => {
                                    const dayIds = selectedIds.filter(pid => (dayPlaces[day] || []).includes(pid));
                                    if (dayIds.length === 0) return null;
                                    return (
                                        <div key={day} className="mb-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <h3 className="font-bold text-gray-800 text-[15px]">Ngày {day}</h3>
                                                <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">{dayIds.length} điểm</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <SortableContext items={dayIds} strategy={rectSortingStrategy}>
                                                    {dayIds.map((pid, index) => {
                                                        const place = selectedPlaces.find(p => p.id === pid);
                                                        return <SortablePlaceCard 
                                                            key={place.id} 
                                                            place={place} 
                                                            index={index} 
                                                            day={day} 
                                                            daysCount={days}
                                                            onDayChange={(newDay) => {
                                                                if (newDay) {
                                                                    assignToDay(place.id, newDay);
                                                                } else {
                                                                    removeFromDay(place.id, day);
                                                                }
                                                            }}
                                                            onRemove={togglePlace} 
                                                        />;
                                                    })}
                                                </SortableContext>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Unassigned Group */}
                                {isMultiDay && (() => {
                                    const assigned = Object.values(dayPlaces).flat();
                                    const unassignedIds = selectedIds.filter(id => !assigned.includes(id));
                                    if (unassignedIds.length === 0) return null;
                                    return (
                                        <div className="mb-6 bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
                                            <div className="flex items-center gap-2 mb-3">
                                                <h3 className="font-bold text-amber-800 text-[15px] flex items-center gap-1.5">
                                                    <span>⚠️</span> Chưa phân ngày
                                                </h3>
                                                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">{unassignedIds.length} điểm</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <SortableContext items={unassignedIds} strategy={rectSortingStrategy}>
                                                    {unassignedIds.map((pid, index) => {
                                                        const place = selectedPlaces.find(p => p.id === pid);
                                                        return <SortablePlaceCard 
                                                            key={place.id} 
                                                            place={place} 
                                                            index={index} 
                                                            day={null} 
                                                            daysCount={days}
                                                            onDayChange={(newDay) => {
                                                                if (newDay) assignToDay(place.id, newDay);
                                                            }}
                                                            onRemove={togglePlace} 
                                                        />;
                                                    })}
                                                </SortableContext>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </DndContext>
                            {selectedPlaces.length === 0 && (
                                <p className="text-sm text-gray-400 mb-4">Chưa có điểm đến nào. Nhấn nút bên dưới để tìm và thêm.</p>
                            )}
                            <div className="w-full">
                                <button type="button" onClick={goToSearch}
                                    disabled={!form.data.start_date || !form.data.end_date}
                                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
                                        !form.data.start_date || !form.data.end_date
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            : 'bg-[#e6edf7] text-[#003d9b] hover:bg-[#d2e2f5]'
                                    }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    Khám phá & Chọn địa điểm
                                </button>
                            </div>
                            {(!form.data.start_date || !form.data.end_date) && (
                                <p className="mt-2 text-xs text-amber-500 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Vui lòng chọn ngày đi và ngày về trước khi thêm địa điểm
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="font-bold text-base text-gray-900 mb-4">Quản lý lộ trình</h2>

                            {/* Open Search page for picking */}
                            <button type="button" onClick={goToSearch}
                                className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 mb-4 text-sm text-gray-400 hover:border-[#003d9b] hover:text-[#003d9b] transition-all">
                                <span>🔍</span> Tìm và thêm địa điểm...
                            </button>

                            {/* ── DAY-BY-DAY PLANNER (multi-day) ── */}
                            {isMultiDay && selectedPlaces.length > 0 ? (
                                <div className="mb-5">
                                    {/* Day tabs */}
                                    <div className="flex gap-1 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                                        {Array.from({ length: days }, (_, i) => i + 1).map(d => {
                                            const count = (dayPlaces[d] || []).length;
                                            return (
                                                <button key={d} type="button" onClick={() => setActiveDay(d)}
                                                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                        activeDay === d
                                                            ? 'bg-[#003d9b] text-white shadow-sm'
                                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}>
                                                    Ngày {d}
                                                    {count > 0 && (
                                                        <span className={`ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                                                            activeDay === d ? 'bg-white/20 text-white' : 'bg-[#003d9b]/10 text-[#003d9b]'
                                                        }`}>{count}</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Active day's places */}
                                    <div className="space-y-2 min-h-[60px]">
                                        {(() => {
                                            const activeDayIds = selectedIds.filter(pid => (dayPlaces[activeDay] || []).includes(pid));
                                            if (activeDayIds.length === 0) {
                                                return (
                                                    <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                                                        <p className="text-xs text-gray-400">Chưa có địa điểm cho Ngày {activeDay}</p>
                                                        <p className="text-[10px] text-gray-300 mt-0.5">Phân ngày từ phần Điểm đến bên trái</p>
                                                    </div>
                                                );
                                            }
                                            return activeDayIds.map((pid, idx) => {
                                                const place = selectedPlaces.find(p => p.id === pid);
                                                if (!place) return null;
                                                return (
                                                    <div key={pid} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 group">
                                                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white ${
                                                            idx === 0 ? 'bg-[#003d9b]' : idx === activeDayIds.length - 1 ? 'bg-emerald-500' : 'bg-amber-400'
                                                        }`}>{idx + 1}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-gray-800 truncate">{place.name}</p>
                                                            <p className="text-[10px] text-gray-400 truncate">{place.address?.split(',')[0] || ''}</p>
                                                        </div>
                                                        {/* Move up/down */}
                                                        <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button type="button" disabled={idx === 0}
                                                                onClick={() => movePlaceInDay(activeDay, idx, idx - 1)}
                                                                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-[#003d9b] disabled:opacity-20 transition-colors">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"/></svg>
                                                            </button>
                                                            <button type="button" disabled={idx === activeDayIds.length - 1}
                                                                onClick={() => movePlaceInDay(activeDay, idx, idx + 1)}
                                                                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-[#003d9b] disabled:opacity-20 transition-colors">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                                                            </button>
                                                        </div>
                                                        <button type="button" onClick={() => removeFromDay(pid, activeDay)}
                                                            className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                        </button>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>

                                    {/* Unassigned places summary */}
                                    {(() => {
                                        const assigned = Object.values(dayPlaces).flat();
                                        const unassignedIds = selectedIds.filter(id => !assigned.includes(id));
                                        if (unassignedIds.length === 0) return null;
                                        
                                        return (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1.5 mb-2">
                                                    <span className="text-sm">⚠️</span> {unassignedIds.length} địa điểm chưa được phân ngày
                                                </p>
                                                <div className="space-y-1.5">
                                                    {unassignedIds.map(uid => {
                                                        const p = selectedPlaces.find(x => x.id === uid);
                                                        if (!p) return null;
                                                        return (
                                                            <div key={p.id} className="flex items-center justify-between bg-amber-50/50 p-2 rounded-xl border border-amber-100/50">
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                                        <img src={assetUrl(p.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=60')} alt={p.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <span className="text-xs font-bold text-gray-700 truncate">{p.name}</span>
                                                                </div>
                                                                <button type="button" onClick={() => assignToDay(p.id, activeDay)}
                                                                    className="text-[10px] font-bold bg-white text-[#003d9b] border border-[#003d9b]/20 px-2 py-1.5 rounded-lg whitespace-nowrap shadow-sm hover:bg-[#003d9b] hover:text-white transition-colors">
                                                                    + Thêm vào Ngày {activeDay}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            ) : selectedPlaces.length > 0 ? (
                                /* Single-day simple timeline */
                                <div className="mb-5 pt-1">
                                    {selectedPlaces.map((place, idx) => (
                                        <div key={place.id} className="flex items-start gap-3 relative">
                                            {idx < selectedPlaces.length - 1 && (
                                                <div className="absolute left-[13px] top-7 w-0.5 bg-gray-200" style={{ height: 'calc(100% - 4px)' }} />
                                            )}
                                            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white z-10 ${
                                                idx === 0 ? 'bg-[#003d9b]' : idx === selectedPlaces.length - 1 ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`}>{idx + 1}</div>
                                            <div className="flex-1 pb-5">
                                                <p className="text-sm font-bold text-gray-800">{place.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {idx === 0 ? 'Khởi hành' : idx === selectedPlaces.length - 1 ? 'Kết thúc' : `Điểm ${idx + 1}`}
                                                </p>
                                            </div>
                                            <button type="button" onClick={() => togglePlace(place.id)} className="text-gray-300 hover:text-red-400 mt-1" title="Xóa">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Map preview */}
                            <div className="rounded-xl overflow-hidden border border-gray-100 mb-5">
                                <div className="h-40 bg-gray-100 relative">
                                    {firstCoords ? (
                                        <iframe
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${firstCoords.longitude-0.02}%2C${firstCoords.latitude-0.02}%2C${firstCoords.longitude+0.02}%2C${firstCoords.latitude+0.02}&layer=mapnik&marker=${firstCoords.latitude}%2C${firstCoords.longitude}`}
                                            className="w-full h-full border-0" loading="lazy" title="Bản đồ" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                            <span className="text-2xl mb-1">🗺️</span>
                                            <p className="text-xs text-gray-400">Bản đồ hiển thị khi có điểm đến</p>
                                        </div>
                                    )}
                                </div>
                                <button type="button" className="w-full py-2.5 text-xs font-bold text-[#003d9b] bg-white hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors border-t border-gray-100">
                                    📍 Xem bản đồ chi tiết
                                </button>
                            </div>

                            {/* Submit */}
                            {(() => {
                                const assignedIds = Object.values(dayPlaces).flat();
                                const hasNoPlaces = selectedIds.length === 0;
                                const hasUnassigned = selectedIds.some(id => !assignedIds.includes(id));
                                const hasEmptyDays = isMultiDay && Array.from({ length: days }, (_, i) => i + 1).some(d => (dayPlaces[d] || []).length === 0);
                                const isSaveDisabled = form.processing || isDepartureTimePast || (!hasNoPlaces && isMultiDay && (hasUnassigned || hasEmptyDays));

                                return (
                                    <>
                                        <button type="submit" disabled={isSaveDisabled}
                                            className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                                                isSaveDisabled 
                                                    ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' 
                                                    : 'bg-[#003d9b] text-white hover:bg-[#002a6e] active:scale-[0.98] shadow-blue-900/10'
                                            }`}>
                                            {form.processing ? 'Đang lưu...' : 'Lưu chuyến đi'}
                                        </button>
                                        {(form.errors.place_ids || hasNoPlaces) && (
                                            <p className="text-xs text-red-500 mt-2 flex items-center justify-center gap-1">
                                                <span>!</span> {form.errors.place_ids || 'Vui lòng chọn ít nhất một địa điểm trước khi lưu chuyến đi.'}
                                            </p>
                                        )}
                                        {!hasNoPlaces && isMultiDay && hasEmptyDays && (
                                            <p className="text-xs text-red-500 mt-2 flex items-center justify-center gap-1">
                                                <span>⚠️</span> Vui lòng phân địa điểm cho tất cả các ngày
                                            </p>
                                        )}
                                        {!hasNoPlaces && isMultiDay && hasUnassigned && !hasEmptyDays && (
                                            <p className="text-xs text-amber-500 mt-2 flex items-center justify-center gap-1">
                                                <span>⚠️</span> Vẫn còn địa điểm chưa được phân ngày
                                            </p>
                                        )}
                                    </>
                                );
                            })()}
                            <button type="button" onClick={onCancel}
                                className="w-full mt-2 py-3 rounded-2xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        </>
    );
}
