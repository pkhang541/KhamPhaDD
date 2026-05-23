import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { assetUrl } from '@/lib/assets';

// Phân loại tỉnh theo miền (khớp với tên trong DB)
const MIEN_BAC = [
    'Hà Nội','Hải Phòng','Quảng Ninh','Hải Dương','Hưng Yên','Bắc Ninh',
    'Vĩnh Phúc','Thái Nguyên','Bắc Giang','Phú Thọ','Lào Cai','Yên Bái',
    'Điện Biên','Lai Châu','Sơn La','Hòa Bình','Hà Giang','Cao Bằng',
    'Bắc Kạn','Tuyên Quang','Lạng Sơn','Thái Bình','Nam Định','Ninh Bình',
    'Hà Nam',
];
const MIEN_TRUNG = [
    'Thanh Hóa','Nghệ An','Hà Tĩnh','Quảng Bình','Quảng Trị','Thừa Thiên Huế',
    'Đà Nẵng','Quảng Nam','Quảng Ngãi','Bình Định','Phú Yên','Khánh Hòa',
    'Ninh Thuận','Bình Thuận','Kon Tum','Gia Lai','Đắk Lắk','Đắk Nông','Lâm Đồng',
];
const MIEN_NAM = [
    'TP. Hồ Chí Minh','Hồ Chí Minh','Bình Dương','Đồng Nai','Bà Rịa - Vũng Tàu',
    'Tây Ninh','Bình Phước','Long An','Tiền Giang','Bến Tre','Trà Vinh',
    'Vĩnh Long','Đồng Tháp','An Giang','Kiên Giang','Cần Thơ','Hậu Giang',
    'Sóc Trăng','Bạc Liêu','Cà Mau',
];

function getRegion(cityName) {
    if (!cityName) return 'khac';
    const n = String(cityName).trim();
    if (MIEN_BAC.some(t => n.includes(t) || t.includes(n))) return 'bac';
    if (MIEN_TRUNG.some(t => n.includes(t) || t.includes(n))) return 'trung';
    if (MIEN_NAM.some(t => n.includes(t) || t.includes(n))) return 'nam';
    return 'khac';
}

function RegionGroup({ label, cities, currentCities = [], onToggle, defaultOpen = false }) {
    const hasActive = cities.some(c => currentCities.includes(String(c.id)));
    const [open, setOpen] = useState(defaultOpen || hasActive);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button type="button" onClick={() => setOpen(v => !v)}
                className={`w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider transition-colors ${hasActive ? 'text-[#003d9b]' : 'text-gray-500 hover:text-[#003d9b]'}`}>
                <span>{label} {hasActive && '●'}</span>
                <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open && (
                <div className="pb-2 space-y-1.5 pl-1">
                    {cities.map(city => {
                        const isChecked = currentCities.includes(String(city.id));
                        return (
                            <label key={city.id} className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox"
                                    checked={isChecked}
                                    onChange={() => onToggle(city.id)}
                                    className="rounded border-gray-300 text-[#003d9b] focus:ring-[#003d9b] flex-shrink-0" />
                                <span className={`text-xs font-medium leading-tight transition-colors ${isChecked ? 'text-[#003d9b] font-bold' : 'text-gray-600 group-hover:text-[#003d9b]'}`}>
                                    {city.name}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function PlaceCardRow({ place, picking, isSelected, assignedDay, assignedDays = [], onToggle, activeTrip, activeDay, isAlreadyAdded, isAdmin = false }) {
    if (!place) return null;
    const [added, setAdded] = useState(false);
    const pickedDays = assignedDays.length
        ? assignedDays.map(Number)
        : (assignedDay ? [Number(assignedDay)] : []);
    const isPickedForTargetDay = picking && pickedDays.includes(Number(activeDay));

    const img = assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75');
    const rating = Number(place.avg_rating || place.rating || 0);
    const reviews = place.review_count || 0;

    const handleClick = (e) => {
        if (picking) {
            e.preventDefault();
            onToggle?.(place.id);
        }
    };

    return (
        <div onClick={handleClick}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group ${
                isPickedForTargetDay ? 'border-[#003d9b] ring-2 ring-[#003d9b]/15 cursor-pointer' : picking ? 'border-transparent hover:border-[#003d9b]/30 cursor-pointer' : 'border-gray-100'
            }`}>
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
                <img src={img} alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {picking && isSelected ? (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-[#003d9b] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                ) : picking ? (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm group-hover:border-[#003d9b] transition-colors" />
                ) : null}
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-1 min-h-[22px]">
                    {(place.city?.name || place.address) && (
                        <div className="flex items-center gap-1">
                            <span className="text-[#003d9b] text-[10px]"></span>
                            <span className="text-[10px] font-bold text-[#003d9b] uppercase tracking-wider">
                                {place.city?.name || place.address?.split(',').pop()?.trim()}
                            </span>
                        </div>
                    )}
                    {(isAlreadyAdded || (picking && isSelected)) && (
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 uppercase tracking-widest shadow-sm">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Đã chọn
                        </span>
                    )}
                </div>
                {picking ? (
                    <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-1.5 line-clamp-1 group-hover:text-[#003d9b] transition-colors">{place.name}</h3>
                ) : (
                    <a href={`/places/${place.slug}`}>
                        <h3 className="font-bold text-[15px] text-gray-900 leading-snug mb-1.5 line-clamp-1 group-hover:text-[#003d9b] transition-colors">{place.name}</h3>
                    </a>
                )}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {place.description || 'Khám phá địa điểm thú vị này tại Việt Nam.'}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-xs font-bold text-gray-700">{rating > 0 ? rating.toFixed(1) : '—'}</span>
                        {reviews > 0 && (
                            <span className="text-[11px] text-gray-400">({reviews > 999 ? `${(reviews / 1000).toFixed(1)}k+` : reviews} đánh giá)</span>
                        )}
                    </div>
                    {activeTrip ? (
                        <button
                            disabled={isAlreadyAdded}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.post(route('trips.addPlace', activeTrip.id), {
                                    place_id: place.id,
                                    day_number: activeDay,
                                }, {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        setAdded(true);
                                        setTimeout(() => setAdded(false), 2000);
                                    }
                                });
                            }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1 ${
                                added 
                                    ? 'bg-[#10B981] text-white shadow' 
                                    : isAlreadyAdded
                                        ? 'bg-emerald-50 text-emerald-500 border border-emerald-100 cursor-not-allowed opacity-80 font-black'
                                        : 'bg-[#003d9b] text-white hover:bg-[#002a6e]'
                            }`}
                        >
                            {added ? '✓ Đã thêm' : isAlreadyAdded ? '✓ Đã chọn' : '+ Thêm'}
                        </button>
                    ) : picking ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onToggle?.(place.id);
                            }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1 ${
                                isPickedForTargetDay 
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-black' 
                                    : 'bg-[#003d9b] text-white hover:bg-[#002a6e]'
                            }`}
                        >
                            {isPickedForTargetDay ? `✓ Ngày ${activeDay}` : isSelected ? `+ Thêm ngày ${activeDay}` : '+ Thêm'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <Link
                                    href={route('admin.places.edit', place.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-100"
                                >
                                    Sửa
                                </Link>
                            )}
                            <a href={`/places/${place.slug}`} className="text-xs font-bold text-[#003d9b] hover:underline transition-colors">Chi tiết</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Search({ places, search: query, cities, categories, activeTrip }) {
    const { url, props } = usePage();
    const { auth } = props;
    const isAdmin = auth?.user?.role === 'admin';
    const searchParams = new URLSearchParams(url.includes('?') ? url.substring(url.indexOf('?')) : '');

    // ── Picking mode for trip creation ──
    const picking = searchParams.get('picking') === '1';

    const placeList = places?.data ?? [];

    const tripData = (() => {
        try {
            const saved = sessionStorage.getItem('trip_form_data');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    })();

    const tripDays = (() => {
        if (!tripData?.start_date || !tripData?.end_date) return 1;
        return Math.ceil((new Date(tripData.end_date) - new Date(tripData.start_date)) / 86400000) + 1;
    })();

    const [targetDay, setTargetDay] = useState(1);

    const [dayPlaces, setDayPlaces] = useState(() => {
        try {
            const saved = sessionStorage.getItem('trip_day_places');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });

    const [pickedIds, setPickedIds] = useState(() => {
        if (!picking) return [];
        try {
            const saved = sessionStorage.getItem('trip_picked_ids');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const togglePick = (id) => {
        setPickedIds(prev => {
            const isSelected = prev.includes(id);

            // If already selected, check if we should reassign day or deselect
            if (isSelected) {
                // Find current assigned day
                const isPickedForTargetDay = Array.isArray(dayPlaces[targetDay]) && dayPlaces[targetDay].includes(id);

                // Same day or no day → deselect
                setDayPlaces(prevDays => {
                    const nextDays = { ...prevDays };
                    if (!nextDays[targetDay]) nextDays[targetDay] = [];
                    if (isPickedForTargetDay) {
                        nextDays[targetDay] = nextDays[targetDay].filter(x => x !== id);
                    } else if (!nextDays[targetDay].includes(id)) {
                        nextDays[targetDay].push(id);
                    }
                    sessionStorage.setItem('trip_day_places', JSON.stringify(nextDays));
                    return nextDays;
                });

                if (!isPickedForTargetDay) return prev;

                const hasOtherDays = Object.entries(dayPlaces).some(([day, ids]) => (
                    Number(day) !== Number(targetDay) && Array.isArray(ids) && ids.includes(id)
                ));
                if (hasOtherDays) return prev;

                const next = prev.filter(x => x !== id);
                sessionStorage.setItem('trip_picked_ids', JSON.stringify(next));

                try {
                    const savedPlaces = JSON.parse(sessionStorage.getItem('trip_picked_places') || '[]');
                    sessionStorage.setItem('trip_picked_places', JSON.stringify(savedPlaces.filter(p => p.id !== id)));
                } catch {}

                return next;
            }

            // Not selected → add and assign to targetDay
            const next = [...prev, id];
            sessionStorage.setItem('trip_picked_ids', JSON.stringify(next));

            try {
                const savedPlaces = JSON.parse(sessionStorage.getItem('trip_picked_places') || '[]');
                let nextPlaces = [...savedPlaces];
                const pObj = placeList.find(p => p.id === id);
                if (pObj && !nextPlaces.some(p => p.id === id)) {
                    nextPlaces.push(pObj);
                }
                sessionStorage.setItem('trip_picked_places', JSON.stringify(nextPlaces));
            } catch {}

            setDayPlaces(prevDays => {
                const nextDays = { ...prevDays };
                if (!nextDays[targetDay]) nextDays[targetDay] = [];
                if (!nextDays[targetDay].includes(id)) nextDays[targetDay].push(id);
                sessionStorage.setItem('trip_day_places', JSON.stringify(nextDays));
                return nextDays;
            });

            return next;
        });
    };

    const handlePickingDone = () => {
        sessionStorage.setItem('trip_picked_ids', JSON.stringify(pickedIds));
        sessionStorage.setItem('trip_day_places', JSON.stringify(dayPlaces));
        window.location.href = '/trips?step=1';
    };
    // Parse current categories (multi-select)
    const currentCategories = [];
    for (const [key, value] of searchParams.entries()) {
        if (key === 'category_id' || key === 'category_id[]') {
            if (value && value.includes(',')) {
                currentCategories.push(...value.split(',').map(v => v.trim()).filter(v => v && v !== ''));
            } else if (value && value.trim() !== '') {
                currentCategories.push(value.trim());
            }
        }
    }
    
    // Parse current cities
    const currentCities = [];
    for (const [key, value] of searchParams.entries()) {
        if (key === 'city_id' || key === 'city_id[]') {
            if (value && value.includes(',')) {
                currentCities.push(...value.split(',').map(v => v.trim()).filter(v => v && v !== ''));
            } else if (value && value.trim() !== '') {
                currentCities.push(value.trim());
            }
        }
    }
    
    const currentSearch = searchParams.get('search') || query || '';
    const currentMinRating = searchParams.get('min_rating') || '';
    const currentMaxRating = searchParams.get('max_rating') || '';
    const currentAmenities = [];
    for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('amenities') && value) currentAmenities.push(value);
    }

    const [searchInput, setSearchInput] = useState(currentSearch);
    const [activeDay, setActiveDay] = useState(1);

    // Keep searchInput in sync with url keyword updates (e.g. if cleared)
    useEffect(() => {
        setSearchInput(currentSearch);
    }, [currentSearch]);

    const allCats = Array.isArray(categories) ? categories : [];
    const allCities = Array.isArray(cities) ? cities : [];

    const existingPlaceIds = activeTrip && activeTrip.trip_places 
        ? activeTrip.trip_places.map(tp => tp.place_id) 
        : [];

    const daysCount = activeTrip && activeTrip.start_date && activeTrip.end_date
        ? Math.max(1, Math.ceil((new Date(activeTrip.end_date) - new Date(activeTrip.start_date)) / 86400000) + 1)
        : 1;

    const updateFilters = (updates) => {
        const payload = {
            search: currentSearch,
            city_id: currentCities.filter(v => v !== '').join(','),
            category_id: currentCategories.filter(v => v !== '').join(','),
            min_rating: currentMinRating,
            max_rating: currentMaxRating,
            amenities: currentAmenities,
            ...updates,
        };
        if (picking) payload.picking = '1';
        if (activeTrip) payload.trip_id = activeTrip.id;
        if (!payload.search) delete payload.search;
        if (!payload.city_id) delete payload.city_id;
        if (!payload.category_id) delete payload.category_id;
        if (!payload.min_rating) delete payload.min_rating;
        if (!payload.max_rating) delete payload.max_rating;
        if (!payload.amenities?.length) delete payload.amenities;
        router.get(route('places.search'), payload, { preserveState: true, preserveScroll: true });
    };

    const handleCategoryToggle = (catId) => {
        const idStr = String(catId);
        const filtered = currentCategories.filter(id => id && id.trim() !== '');
        let newCats;
        if (filtered.includes(idStr)) {
            newCats = filtered.filter(id => id !== idStr);
        } else {
            newCats = [...filtered, idStr];
        }
        updateFilters({ category_id: newCats.join(',') });
    };

    const handleCityToggle = (cityId) => {
        const idStr = String(cityId);
        const filteredCities = currentCities.filter(id => id && id.trim() !== '');
        let newCities;
        if (filteredCities.includes(idStr)) {
            newCities = filteredCities.filter(id => id !== idStr);
        } else {
            newCities = [...filteredCities, idStr];
        }
        updateFilters({ city_id: newCities.join(',') });
    };

    const resetAllFilters = () => {
        const payload = {};
        if (activeTrip) payload.trip_id = activeTrip.id;
        router.get(route('places.search'), payload, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateFilters({ search: searchInput });
    };

    // Active filter chips for display
    const activeChips = [];
    if (currentCities.length > 0) {
        currentCities.forEach(cityId => {
            const city = allCities.find(c => c.id == cityId);
            if (city) {
                activeChips.push({
                    label: city.name,
                    clear: () => {
                        const newCities = currentCities.filter(id => id !== String(cityId));
                        updateFilters({ city_id: newCities.join(',') });
                    }
                });
            }
        });
    }
    if (currentCategories.length > 0) {
        currentCategories.forEach(catId => {
            const cat = allCats.find(c => c.id == catId);
            if (cat) {
                activeChips.push({
                    label: cat.name,
                    clear: () => {
                        const newCats = currentCategories.filter(id => id !== String(catId));
                        updateFilters({ category_id: newCats.join(',') });
                    }
                });
            }
        });
    }
    if (currentMinRating || currentMaxRating) {
        const label = currentMinRating && currentMaxRating
            ? `${currentMinRating}★ - ${currentMaxRating}★`
            : currentMinRating
                ? `Từ ${currentMinRating}★`
                : `Đến ${currentMaxRating}★`;
        activeChips.push({ label, clear: () => updateFilters({ min_rating: '', max_rating: '' }) });
    }


    return (
        <AppLayout>
            <Head title="Khám phá điểm đến – KhamPhaDD">
                <meta name="description" content="Khám phá hàng nghìn địa điểm thú vị tại Việt Nam." />
            </Head>

            {/* HERO BANNER */}
            <div className="relative w-full h-[320px] bg-[#001b44] flex flex-col justify-center items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fb] via-transparent to-transparent"></div>
                
                <div className="relative z-10 px-6 animate-fade-up">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight font-serif drop-shadow-lg">
                        Khám phá điểm đến
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto font-medium drop-shadow-md">
                        Tìm kiếm hàng nghìn địa điểm thú vị, từ những quán cafe nhỏ xinh đến các nhà hàng sang trọng trên khắp Việt Nam.
                    </p>
                </div>
            </div>

            <div className="bg-[#f8f9fb] min-h-screen pb-12 -mt-12 relative z-20">
                <div className="max-w-[1300px] mx-auto px-6">

                    {/* Active Trip Banner or Picking mode Banner */}
                    {(activeTrip || picking) && (
                        <div className="bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white py-4 px-6 rounded-2xl mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4 border border-blue-400/30 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner animate-bounce">🗺️</div>
                                <div>
                                    <h4 className="text-base font-black tracking-wide">
                                        Thêm địa điểm cho: <span className="text-amber-300">{activeTrip ? activeTrip.title : (tripData?.title || 'Chuyến đi mới')}</span>
                                    </h4>
                                    <p className="text-xs text-blue-100 font-medium mt-0.5">Chọn địa điểm bên dưới để thêm trực tiếp vào lịch trình.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-black/10 p-2.5 rounded-xl border border-white/10">
                                <label className="text-xs font-bold text-white flex items-center gap-2">
                                    Thêm vào:
                                    <select 
                                        value={activeTrip ? activeDay : targetDay} 
                                        onChange={e => activeTrip ? setActiveDay(Number(e.target.value)) : setTargetDay(Number(e.target.value))}
                                        className="bg-white text-[#003d9b] border-none rounded-lg px-3 py-1.5 text-xs outline-none font-black shadow-sm cursor-pointer"
                                    >
                                        {Array.from({ length: activeTrip ? daysCount : tripDays }, (_, i) => i + 1).map(d => (
                                            <option key={d} value={d} className="font-bold">Ngày {d}</option>
                                        ))}
                                    </select>
                                </label>
                                {activeTrip ? (
                                    <Link 
                                        href={route('trips.edit', activeTrip.id)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black px-5 py-2 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        ✓ Hoàn tất
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={handlePickingDone}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black px-5 py-2 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        ✓ Hoàn tất
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Search Bar - Lifted up */}
                    <form onSubmit={handleSearch} className="relative bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8 flex flex-col md:flex-row items-center gap-3 border border-gray-100/50">
                        <div className="relative flex-1 w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                            <input
                                type="text"
                                placeholder="Bạn muốn đi đâu, ăn gì hôm nay?"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-base text-gray-800 focus:ring-0 outline-none font-medium placeholder-gray-400"
                            />
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <button type="submit"
                                className="w-full md:w-auto bg-[#003d9b] text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-[#002a6e] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
                                Tìm kiếm
                            </button>
                            {auth?.user?.role === 'admin' && (
                                <Link
                                    href={route('admin.places.create')}
                                    className="w-full md:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                >
                                    ➕ Thêm địa điểm
                                </Link>
                            )}
                        </div>
                    </form>

                    {/* Active filter chips */}
                    {activeChips.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mb-6 px-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Đang lọc theo:</span>
                            {activeChips.map((chip, i) => (
                                <button key={i} type="button" onClick={chip.clear}
                                    className="flex items-center gap-1.5 bg-[#003d9b]/5 border border-[#003d9b]/20 text-[#003d9b] px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all shadow-sm group">
                                    {chip.label}
                                    <span className="text-[10px] bg-white rounded-full w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-100">✕</span>
                                </button>
                            ))}
                            <Link href={route('places.search', activeTrip ? { trip_id: activeTrip.id } : {})}
                                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors ml-2 underline underline-offset-2">
                                Xóa tất cả
                            </Link>
                        </div>
                    )}

                    {/* Main layout: sidebar + grid */}
                    <div className="flex gap-6 items-start">

                        {/* ── Sidebar ── */}
                        <aside className="w-44 flex-shrink-0 space-y-6">

                            {/* Khu vực */}
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Khu vực</h3>

                                {/* Toàn quốc */}
                                <label className="flex items-center gap-2 cursor-pointer group mb-3 pb-2 border-b border-gray-100">
                                    <input type="checkbox"
                                        checked={currentCities.length === 0}
                                        onChange={() => updateFilters({ city_id: '' })}
                                        className="rounded border-gray-300 text-[#003d9b] focus:ring-[#003d9b]" />
                                    <span className={`text-xs font-bold transition-colors ${currentCities.length === 0 ? 'text-[#003d9b]' : 'text-gray-600 group-hover:text-[#003d9b]'}`}>
                                        🌍 Toàn quốc
                                    </span>
                                </label>

                                {/* Grouped by region */}
                                {(() => {
                                    const bac = allCities.filter(c => getRegion(c.name) === 'bac');
                                    const trung = allCities.filter(c => getRegion(c.name) === 'trung');
                                    const nam = allCities.filter(c => getRegion(c.name) === 'nam');
                                    const khac = allCities.filter(c => getRegion(c.name) === 'khac');
                                    return (
                                        <div>
                                            {bac.length > 0 && <RegionGroup label="Miền Bắc" cities={bac} currentCities={currentCities} onToggle={handleCityToggle} />}
                                            {trung.length > 0 && <RegionGroup label="Miền Trung" cities={trung} currentCities={currentCities} onToggle={handleCityToggle} />}
                                            {nam.length > 0 && <RegionGroup label="Miền Nam" cities={nam} currentCities={currentCities} onToggle={handleCityToggle} />}
                                            {khac.length > 0 && <RegionGroup label="Khác" cities={khac} currentCities={currentCities} onToggle={handleCityToggle} />}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Danh mục */}
                            {allCats.length > 0 && (
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Danh mục</h3>
                                    <div className="space-y-2">
                                        {/* Tất cả */}
                                        <label className="flex items-center gap-2 cursor-pointer group pb-2 border-b border-gray-100">
                                            <input type="checkbox"
                                                checked={currentCategories.length === 0}
                                                onChange={() => updateFilters({ category_id: '' })}
                                                className="rounded border-gray-300 text-[#003d9b] focus:ring-[#003d9b]" />
                                            <span className={`text-xs font-bold transition-colors ${currentCategories.length === 0 ? 'text-[#003d9b]' : 'text-gray-600 group-hover:text-[#003d9b]'}`}>
                                                Tất cả
                                            </span>
                                        </label>
                                        {allCats.map(cat => {
                                            const isChecked = currentCategories.includes(String(cat.id));
                                            return (
                                                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                                    <input type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleCategoryToggle(cat.id)}
                                                        className="rounded border-gray-300 text-[#003d9b] focus:ring-[#003d9b] flex-shrink-0" />
                                                    <span className={`text-xs font-medium truncate leading-tight transition-colors ${isChecked ? 'text-[#003d9b] font-bold' : 'text-gray-600 group-hover:text-[#003d9b]'}`}>
                                                        {cat.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Đánh giá */}
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Đánh giá</h3>
                                    {(currentMinRating || currentMaxRating) && (
                                        <button
                                            type="button"
                                            onClick={() => updateFilters({ min_rating: '', max_rating: '' })}
                                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Từ sao</label>
                                        <select
                                            value={currentMinRating}
                                            onChange={e => updateFilters({ min_rating: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none transition-all focus:border-[#003d9b] focus:bg-white"
                                        >
                                            <option value="">Không chọn</option>
                                            {['0', '1', '2', '3', '3.5', '4', '4.5', '5'].map(value => (
                                                <option key={value} value={value}>{value} sao</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đến sao</label>
                                        <select
                                            value={currentMaxRating}
                                            onChange={e => updateFilters({ max_rating: e.target.value })}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none transition-all focus:border-[#003d9b] focus:bg-white"
                                        >
                                            <option value="">Không chọn</option>
                                            {['1', '2', '3', '3.5', '4', '4.5', '5'].map(value => (
                                                <option key={value} value={value}>{value} sao</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Nút thiết lập lại */}
                            {activeChips.length > 0 && (
                                <div className="pt-2">
                                    <button
                                        onClick={resetAllFilters}
                                        className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </aside>

                        {/* ── Results grid ── */}
                        <div className="flex-1 min-w-0">
                            {placeList.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                                    <span className="text-5xl block mb-4">🔭</span>
                                    <h3 className="text-lg font-black text-gray-900 mb-2">Không tìm thấy địa điểm</h3>
                                    <p className="text-gray-400 text-sm mb-6">Thử đổi bộ lọc hoặc từ khóa khác.</p>
                                    <Link href={route('places.search', activeTrip ? { trip_id: activeTrip.id } : {})}
                                        className="bg-[#003d9b] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0052cc] transition-colors inline-block">
                                        Xóa bộ lọc
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <p className="text-xs text-gray-400 font-medium mb-4">
                                        Tìm thấy <strong className="text-gray-700">{(places?.total ?? 0).toLocaleString('vi')}</strong> địa điểm
                                    </p>
                                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${picking ? 'mb-28' : 'mb-8'}`}>
                                        {placeList.map(place => {
                                            let assignedDay = null;
                                            const assignedDays = [];
                                            if (picking) {
                                                for (const [d, ids] of Object.entries(dayPlaces)) {
                                                    if (ids.includes(place.id)) {
                                                        assignedDays.push(Number(d));
                                                        if (!assignedDay) assignedDay = d;
                                                    }
                                                }
                                            }
                                            return (
                                                <PlaceCardRow 
                                                    key={place.id} 
                                                    place={place}
                                                    picking={picking} 
                                                    isSelected={pickedIds.includes(place.id)} 
                                                    assignedDay={assignedDay}
                                                    assignedDays={assignedDays}
                                                    onToggle={togglePick}
                                                    activeTrip={activeTrip}
                                                    activeDay={activeTrip ? activeDay : targetDay}
                                                    isAlreadyAdded={existingPlaceIds.includes(place.id)}
                                                    isAdmin={isAdmin}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {(places?.links ?? []).filter(l => l.url).length > 2 && (
                                        <div className="flex justify-center gap-2 flex-wrap">
                                            {(places?.links ?? []).filter(l => l.url).map((link, i) => (
                                                <Link key={i} href={link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                                                        link.active
                                                            ? 'bg-[#003d9b] text-white shadow-sm'
                                                            : 'bg-white text-gray-500 border border-gray-100 hover:border-[#003d9b] hover:text-[#003d9b]'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PICKING FLOATING BAR ── */}
            {picking && (
                <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
                    <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#003d9b] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                                {pickedIds.length}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800">Đã chọn {pickedIds.length} điểm đến</p>
                                <p className="text-xs text-gray-400">Nhấn vào địa điểm để chọn hoặc bỏ chọn</p>
                            </div>
                        </div>

                        {/* Day selector — only shown for multi-day trips */}
                        {tripDays >= 2 && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Thêm vào:</span>
                                <select
                                    value={targetDay}
                                    onChange={e => setTargetDay(Number(e.target.value))}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#003d9b] bg-white outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10 cursor-pointer shadow-sm"
                                >
                                    {Array.from({ length: tripDays }, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>Ngày {d}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button onClick={() => window.location.href = '/trips?step=1'}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
                                Hủy
                            </button>
                            <button onClick={handlePickingDone}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#003d9b] text-white hover:bg-[#002a6e] transition-all shadow-md flex items-center gap-2">
                                ✓ Xong — Thêm vào chuyến đi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
