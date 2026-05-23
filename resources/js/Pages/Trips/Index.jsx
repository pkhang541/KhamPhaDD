import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import CreateForm from './CreateForm';
import { assetUrl } from '@/lib/assets';

const STATUS = {
    draft:     { label: 'Bản nháp',  bg: 'bg-amber-100 text-amber-800 border border-amber-200 font-semibold' },
    planned:   { label: 'Sắp tới',    bg: 'bg-blue-600 text-white font-bold' },
    completed: { label: 'Đã đi',      bg: 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold' },
};

const SUGGESTED_TRIPS = [
    {
        title: 'Một ngày chill ở Vĩnh Long',
        subtitle: 'Cafe, tham quan nhẹ và ăn tối gần trung tâm.',
        days: 1,
        budget: 600000,
        members: 2,
        cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        plan: [
            { day: 1, terms: ['cafe', 'coffee', 'chùa', 'văn thánh', 'nhà hàng', 'ẩm thực'] },
        ],
    },
    {
        title: 'Cuối tuần khám phá miền Tây',
        subtitle: '2 ngày cân bằng giữa sinh thái, cafe và đặc sản.',
        days: 2,
        budget: 1800000,
        members: 2,
        cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
        plan: [
            { day: 1, terms: ['du lịch sinh thái', 'vườn', 'cafe', 'coffee'] },
            { day: 2, terms: ['chùa', 'di tích', 'nhà hàng', 'ẩm thực'] },
        ],
    },
    {
        title: 'Cafe và check-in Sài Gòn',
        subtitle: 'Một ngày săn góc chụp đẹp quanh Quận 1 và Quận 10.',
        days: 1,
        budget: 900000,
        members: 3,
        cover: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=80',
        plan: [
            {
                day: 1,
                citySlug: 'tp-ho-chi-minh',
                preferredSlugs: [
                    'the-workshop-coffee',
                    'vom-coffee',
                    'cheese-coffee',
                    'libb-house',
                    'take-coffee',
                    'fc-good-coffee',
                    'tuong-cafe-acoustic',
                    'itune-coffee',
                    'three-oclock',
                    'cu-xa-tra-banh-ca-phe',
                ],
                terms: [
                    'workshop coffee',
                    'vom coffee',
                    'vòm coffee',
                    'cheese coffee',
                    'libb house',
                    'take coffee',
                    'fc good coffee',
                    'tuong cafe',
                    'tượng cafe',
                    'itune coffee',
                    'three oclock',
                    'three o’clock',
                    'cu xa',
                    'cư xá',
                    'check-in',
                    'cafe',
                    'coffee',
                ],
            },
        ],
    },
    {
        title: 'Nghỉ dưỡng nhẹ nhàng 3 ngày',
        subtitle: 'Homestay, sinh thái và điểm tham quan thong thả.',
        days: 3,
        budget: 3500000,
        members: 2,
        cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        plan: [
            { day: 1, terms: ['homestay', 'resort', 'nghỉ dưỡng'] },
            { day: 2, terms: ['du lịch sinh thái', 'vườn', 'farmstay'] },
            { day: 3, terms: ['di tích', 'chùa', 'nhà hàng'] },
        ],
    },
];

export default function TripsIndex({ trips, places, cities }) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.includes('?') ? url.substring(url.indexOf('?')) : '');
    const initialStep = parseInt(searchParams.get('step') || '0', 10);

    const tripList = Array.isArray(trips) ? trips : (trips?.data ?? []);
    const allPlaces = Array.isArray(places) ? places : [];

    const [step, setStep] = useState(initialStep);
    const [activeTab, setActiveTab] = useState('all');
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Multi-select trips
    const [selectMode, setSelectMode] = useState(false);
    const [checkedTrips, setCheckedTrips] = useState([]);

    const toggleTripCheck = (id) => setCheckedTrips(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    const allChecked = checkedTrips.length === tripList.length && tripList.length > 0;
    const toggleAll = () => setCheckedTrips(allChecked ? [] : tripList.map(t => t.id));

    const deleteTrip = (id, title) => {
        if (confirm(`Xóa chuyến đi "${title}"?`)) router.delete(route('trips.destroy', id));
    };
    const deleteChecked = () => {
        if (checkedTrips.length === 0) return;
        if (!confirm(`Xóa ${checkedTrips.length} chuyến đi đã chọn? Không thể hoàn tác.`)) return;
        router.post(route('trips.batchDestroy'), { ids: checkedTrips }, {
            onSuccess: () => { setCheckedTrips([]); setSelectMode(false); }
        });
    };

    const getTripCoverImage = (title, coverImage) => {
        if (coverImage) return assetUrl(coverImage);
        const t = title?.toLowerCase() || '';
        if (t.includes('hạ long')) return 'https://images.unsplash.com/photo-1524230507669-e29d73c56e83?w=600&q=80';
        if (t.includes('phú quốc')) return 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=600&q=80';
        if (t.includes('đà lạt')) return 'https://images.unsplash.com/photo-1588668214407-6ea9a6d7c862?w=600&q=80';
        if (t.includes('hà nội')) return 'https://images.unsplash.com/photo-1509060464153-44667396260f?w=600&q=80';
        return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80';
    };

    const formatTripDates = (startDate, endDate) => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;
        const fmt = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!end || startDate === endDate) return `${fmt(start)}/${start.getFullYear()}`;
        return `${fmt(start)} - ${fmt(end)}/${end.getFullYear()}`;
    };

    const getDaysRemaining = (startDate) => {
        if (!startDate) return null;
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const now = new Date(); now.setHours(0,0,0,0);
        const diff = Math.ceil((start - now) / 86400000);
        if (diff < 0) return null;
        if (diff === 0) return 'Bắt đầu hôm nay';
        return `Còn ${diff} ngày`;
    };

    const getSortedTrips = (list) => [...list].sort((a, b) => {
        if (!a.start_date && !b.start_date) return 0;
        if (!a.start_date) return 1;
        if (!b.start_date) return -1;
        return new Date(a.start_date) - new Date(b.start_date);
    });

    const formatCurrency = (val) => {
        if (val === null || val === undefined || val === '' || Number(val) <= 0) return 'Chưa có';
        return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + 'đ';
    };

    const getTripBudget = (trip) => {
        if (trip.budget && Number(trip.budget) > 0) return Number(trip.budget);
        return null;
    };

    const addDays = (date, daysToAdd) => {
        const next = new Date(date);
        next.setDate(next.getDate() + daysToAdd);
        return next.toISOString().split('T')[0];
    };

    const matchesTemplateSlot = (place, slot) => {
        const text = [
            place.name,
            place.slug,
            place.address,
            place.city?.slug,
            place.city?.name,
            place.category?.slug,
            place.category?.name,
        ].filter(Boolean).join(' ').toLowerCase();

        const cityOk = !slot.citySlug || place.city?.slug === slot.citySlug;
        const preferredOk = slot.preferredSlugs?.includes(place.slug);
        const termOk = slot.terms.some(term => text.includes(term.toLowerCase()));
        if (slot.preferredSlugs?.length) return cityOk && (preferredOk || termOk);
        return cityOk && termOk;
    };

    const pickSuggestedPlaces = (template) => {
        const picked = [];
        const dayPlaces = {};

        template.plan.forEach(slot => {
            const preferredOrder = slot.preferredSlugs || [];
            const matches = allPlaces
                .filter(place => !picked.some(selected => selected.id === place.id))
                .filter(place => matchesTemplateSlot(place, slot))
                .sort((a, b) => {
                    const aIndex = preferredOrder.indexOf(a.slug);
                    const bIndex = preferredOrder.indexOf(b.slug);
                    if (aIndex === -1 && bIndex === -1) return 0;
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;
                    return aIndex - bIndex;
                })
                .slice(0, template.days === 1 ? 5 : 3);

            dayPlaces[slot.day] = matches.map(place => place.id);
            picked.push(...matches);
        });

        return { picked, dayPlaces };
    };

    const useSuggestedTrip = (template) => {
        const startDate = addDays(new Date(), 1);
        const endDate = addDays(new Date(), template.days);
        const { picked, dayPlaces } = pickSuggestedPlaces(template);
        const pickedIds = picked.map(place => place.id);

        sessionStorage.setItem('trip_picked_ids', JSON.stringify(pickedIds));
        sessionStorage.setItem('trip_picked_places', JSON.stringify(picked));
        sessionStorage.setItem('trip_day_places', JSON.stringify(dayPlaces));
        sessionStorage.setItem('trip_form_data', JSON.stringify({
            title: template.title,
            start_date: startDate,
            end_date: endDate,
            departure_time: '08:00',
            members: template.members,
            budget: String(template.budget),
            currency: 'VND',
            return_time: '',
            is_public: false,
            place_ids: pickedIds,
            cover_image: null,
            cover_image_url: template.cover,
        }));
        setStep(1);
    };

    // ── STEP 0: TRIP LIST ──
    if (step === 0) return (
        <AppLayout>
            <Head title="Chuyến đi của tôi – KhamPhaDD" />
            <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                                Chuyến đi của tôi
                            </h1>
                            <p className="text-gray-500 text-sm mt-2 font-medium">
                                Quản lý các hành trình khám phá và kỷ niệm của bạn.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {tripList.length > 0 && (
                                <button onClick={() => { setSelectMode(v => !v); setCheckedTrips([]); }}
                                    className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                                        selectMode
                                            ? 'bg-red-50 border-red-200 text-red-600'
                                            : 'bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                                    }`}>
                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                    Chọn
                                </button>
                            )}
                            {selectMode && checkedTrips.length > 0 && (
                                <button onClick={deleteChecked}
                                    className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-md">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    Xóa ({checkedTrips.length})
                                </button>
                            )}
                            <button onClick={() => setStep(1)}
                                className="flex items-center gap-2 bg-[#003d9b] text-white px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#002561] transition-all shadow-md">
                                <span>+</span> Tạo chuyến đi mới
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-3 mb-8 pt-4">
                        {[
                            { id: 'all', label: 'Tất cả' },
                            { id: 'upcoming', label: 'Sắp tới' },
                            { id: 'completed', label: 'Đã đi' },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-[#003d9b] text-white shadow-sm font-bold'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                                }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <section className="mb-10">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-gray-900">Gợi ý lịch trình mẫu</h2>
                                <p className="text-xs font-medium text-gray-500 mt-1">
                                    Chọn nhanh một mẫu, hệ thống sẽ điền sẵn ngày, ngân sách và vài địa điểm phù hợp.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {SUGGESTED_TRIPS.map((template) => {
                                const preview = pickSuggestedPlaces(template).picked.slice(0, 3);
                                return (
                                    <article key={template.title} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                        <div className="relative h-32">
                                            <img src={template.cover} alt={template.title} className="h-full w-full object-cover" />
                                            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#003d9b] shadow-sm">
                                                {template.days} ngày
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-black text-gray-900 line-clamp-1">{template.title}</h3>
                                            <p className="mt-1 min-h-[34px] text-[11px] leading-relaxed text-gray-500 line-clamp-2">{template.subtitle}</p>
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {preview.length > 0 ? preview.map(place => (
                                                    <span key={place.id} className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-[#003d9b]">
                                                        {place.name}
                                                    </span>
                                                )) : (
                                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500">
                                                        Sẽ gợi ý khi có địa điểm phù hợp
                                                    </span>
                                                )}
                                            </div>
                                            <button type="button"
                                                onClick={() => useSuggestedTrip(template)}
                                                className="mt-4 w-full rounded-2xl bg-[#003d9b] px-4 py-2.5 text-xs font-black text-white hover:bg-[#002561] transition-colors">
                                                Dùng lịch trình này
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    {/* Select all bar */}
                    {selectMode && tripList.length > 0 && (
                        <div className="flex items-center gap-4 mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 shadow-sm">
                            <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 accent-[#003d9b] cursor-pointer" />
                            <span className="text-sm font-bold text-amber-800">
                                {allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'} ({checkedTrips.length}/{tripList.length})
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getSortedTrips(tripList).filter(trip => {
                            if (trip.status === 'draft') return false;
                            if (activeTab === 'all') return true;
                            if (activeTab === 'upcoming') return trip.status === 'planned';
                            if (activeTab === 'completed') return trip.status === 'completed';
                            return true;
                        }).map(trip => (
                            <div key={trip.id} className={`group relative bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[340px] cursor-pointer ${
                                checkedTrips.includes(trip.id) ? 'ring-4 ring-[#003d9b]/35 border-transparent' : 'shadow-sm'
                            }`}>
                                {/* Checkbox */}
                                {selectMode && (
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTripCheck(trip.id); }}
                                        className={`absolute top-4 left-4 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all z-20 ${
                                            checkedTrips.includes(trip.id)
                                                ? 'bg-[#003d9b] border-[#003d9b] text-white'
                                                : 'border-white/60 bg-black/30 text-transparent'
                                        }`}>
                                        {checkedTrips.includes(trip.id) && <span className="text-white text-xs font-black">✓</span>}
                                    </button>
                                )}

                                {/* Image */}
                                <div className="h-40 w-full relative overflow-hidden">
                                    <img src={getTripCoverImage(trip.title, trip.cover_image)} alt={trip.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded shadow-sm ${STATUS[trip.status]?.bg}`}>
                                        {STATUS[trip.status]?.label?.toUpperCase() || 'BẢN NHÁP'}
                                    </span>

                                    {/* Menu */}
                                    <div className="absolute top-3 right-3 z-20">
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMenuId(prev => prev === trip.id ? null : trip.id); }}
                                            className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                        </button>
                                        {activeMenuId === trip.id && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                                                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-40 text-left">
                                                    <Link href={route('trips.edit', trip.id)}
                                                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                        Chỉnh sửa
                                                    </Link>
                                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectMode(true); toggleTripCheck(trip.id); setActiveMenuId(null); }}
                                                        className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100">
                                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                                        Chọn nhiều
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteTrip(trip.id, trip.title); setActiveMenuId(null); }}
                                                        className="w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100">
                                                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                        Xóa chuyến đi
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <span className="absolute bottom-2 right-3 text-[9px] font-bold text-white/50 tracking-widest uppercase pointer-events-none">
                                        {trip.title?.slice(0, 15)}
                                    </span>
                                </div>

                                <Link href={route('trips.show', trip.id)}
                                    className="block w-full h-full flex flex-col justify-between flex-1 p-5 pt-3"
                                    onClick={e => selectMode && (e.preventDefault(), toggleTripCheck(trip.id))}>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-[15px] leading-snug line-clamp-2 h-10 mb-2 mt-1 group-hover:text-[#003d9b] transition-colors" title={trip.title}>
                                            {trip.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-1.5">
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Ngân sách: {formatCurrency(getTripBudget(trip))}
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                {trip.start_date ? formatTripDates(trip.start_date, trip.end_date) : 'Chưa có ngày đi'}
                                            </div>
                                            {trip.status === 'planned' && getDaysRemaining(trip.start_date) && (
                                                <span className="text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 rounded-full text-[9px] border border-blue-100 uppercase tracking-wider">
                                                    {getDaysRemaining(trip.start_date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            {trip.trip_places_count || 0} Địa điểm
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                            {trip.members || 1} người
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}

                        {/* Placeholder Create Card */}
                        <div onClick={() => setStep(1)}
                            className="group cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#003d9b]/50 bg-transparent rounded-3xl h-[340px] flex flex-col items-center justify-center text-center transition-all p-6">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-[#003d9b] group-hover:text-[#003d9b] transition-all mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-sm text-gray-800">Lên kế hoạch mới</h4>
                            <p className="text-xs text-gray-400 mt-1">Bắt đầu hành trình tiếp theo của bạn</p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-12">
                        <button className="text-[#003d9b] hover:text-[#002561] text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                            Xem thêm chuyến đi cũ <span>▼</span>
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );

    // ── STEP 1: TRIP CREATION FORM ──
    return (
        <AppLayout>
            <Head title="Tạo chuyến đi – KhamPhaDD" />
            <CreateForm allPlaces={allPlaces} onCancel={() => {
                sessionStorage.removeItem('trip_picked_ids');
                sessionStorage.removeItem('trip_picked_places');
                sessionStorage.removeItem('trip_form_data');
                setStep(0);
            }} />
        </AppLayout>
    );
}
