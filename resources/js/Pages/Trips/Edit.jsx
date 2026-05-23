import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { assetUrl } from '@/lib/assets';

export default function EditTrip({ trip, places }) {
    const allPlaces = Array.isArray(places) ? places : [];

    const { data, setData, post, processing, errors } = useForm({
        title: trip.title || '',
        start_date: trip.start_date ? trip.start_date.split('T')[0] : '',
        end_date: trip.end_date ? trip.end_date.split('T')[0] : '',
        budget: trip.budget || '',
        members: trip.members || 1,
        is_public: trip.is_public || false,
        cover_image: null,
        _method: 'PUT',
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [showPlacePicker, setShowPlacePicker] = useState(false);
    const [searchQ, setSearchQ] = useState('');
    const [selectedDay, setSelectedDay] = useState(1);
    const fileInputRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('trips.update', trip.id), {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('trips.show', trip.id));
            }
        });
    };

    // Calculate days/nights based on dates
    const getDurationText = () => {
        if (!data.start_date || !data.end_date) return '';
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays <= 0) return '';
        const nights = diffDays - 1;
        return `${diffDays} ngày${nights > 0 ? `, ${nights} đêm` : ''}`;
    };

    // Helper for formatting budget display
    const formatCurrencyDisplay = (val) => {
        if (!val) return '';
        return new Intl.NumberFormat('vi-VN').format(val) + ' VND';
    };

    const handleBudgetChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('budget', value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover_image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const coverImage = assetUrl(trip.cover_image, 'https://images.unsplash.com/photo-1524230507669-e29d73c56e83?w=1000&q=80'); // Ha Long bay default

    const tripPlaces = Array.isArray(trip.trip_places) ? trip.trip_places : [];
    const maxPlaceDay = Math.max(1, ...tripPlaces.map(tp => Number(tp.day_number) || 1));

    const getDaysCount = () => {
        let dateDays = 1;

        if (data.start_date && data.end_date) {
            const start = new Date(data.start_date);
            const end = new Date(data.end_date);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            dateDays = Number.isFinite(diff) && diff > 0 ? diff : 1;
        }

        return Math.max(1, Number(trip.days_count) || 1, dateDays, maxPlaceDay);
    };

    const daysCount = getDaysCount();
    const days = Array.from({ length: daysCount }, (_, i) => i + 1);

    const formatDayDate = (day) => {
        if (!data.start_date) return null;

        const date = new Date(data.start_date);
        date.setDate(date.getDate() + day - 1);

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    const sortedTripPlaces = [...tripPlaces]
        .filter(tp => tp.place)
        .sort((a, b) => {
            const dayDiff = (Number(a.day_number) || 1) - (Number(b.day_number) || 1);
            if (dayDiff !== 0) return dayDiff;
            return (Number(a.order) || 0) - (Number(b.order) || 0);
        });

    const tripPlacesByDay = days.map(day => ({
        day,
        dateLabel: formatDayDate(day),
        items: sortedTripPlaces.filter(tp => (Number(tp.day_number) || 1) === day),
    }));

    const filteredPlaces = allPlaces.filter(p => 
        !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase())
    ).slice(0, 15);

    const handleAddPlace = (placeId) => {
        router.post(route('trips.addPlace', trip.id), {
            place_id: placeId,
            day_number: selectedDay,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPlacePicker(false);
                setSearchQ('');
            }
        });
    };

    return (
        <AppLayout>
            <Head title={`Sửa chuyến đi - ${trip.title}`} />
            
            <div className="min-h-screen bg-[#FBFBFB] pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-6">
                    
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">
                                Sửa chuyến đi
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Tùy chỉnh hành trình khám phá Việt Nam của bạn
                            </p>
                        </div>
                        <Link href={route('trips.show', trip.id)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            ← Quay lại chi tiết
                        </Link>
                    </div>

                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* ── LEFT COLUMN (Form) ── */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Cover Image Section */}
                            <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-sm group">
                                <img 
                                    src={previewImage || coverImage} 
                                    alt="Cover" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                                <div className="absolute bottom-6 right-6">
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white/95 backdrop-blur text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        Thay đổi ảnh bìa
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="space-y-6">
                                    {/* Trip Name */}
                                    <div>
                                        <label className="text-[13px] font-bold text-gray-700 block mb-2">Tên chuyến đi</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] outline-none transition-all placeholder:text-gray-400"
                                            placeholder="Nhập tên chuyến đi..."
                                            required
                                        />
                                        {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
                                    </div>

                                    {/* Duration, Budget & Members Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="text-[13px] font-bold text-gray-700 block mb-2">Thời gian (Chọn ngày)</label>
                                            <div className="relative mb-2">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={getDurationText() || 'Chưa xác định'}
                                                    readOnly
                                                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] text-gray-900 bg-gray-50/50 outline-none"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 outline-none focus:border-[#003d9b]"/>
                                                <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 outline-none focus:border-[#003d9b]"/>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-bold text-gray-700 block mb-2">Ngân sách dự kiến</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formatCurrencyDisplay(data.budget)}
                                                    onChange={handleBudgetChange}
                                                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] text-gray-900 focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] outline-none transition-all placeholder:text-gray-400"
                                                    placeholder="Ví dụ: 12.000.000"
                                                />
                                            </div>
                                            {errors.budget && <p className="text-red-500 text-xs mt-1.5">{errors.budget}</p>}
                                        </div>

                                        <div>
                                            <label className="text-[13px] font-bold text-gray-700 block mb-2">Số người tham gia</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                                </div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    value={data.members}
                                                    onChange={e => setData('members', parseInt(e.target.value) || 1)}
                                                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] text-gray-900 focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] outline-none transition-all"
                                                />
                                            </div>
                                            {errors.members && <p className="text-red-500 text-xs mt-1.5">{errors.members}</p>}
                                        </div>
                                    </div>

                                    {/* Privacy Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                                        <div>
                                            <h4 className="text-[14px] font-bold text-gray-900 mb-0.5">Chế độ công khai</h4>
                                            <p className="text-xs text-gray-500">Cho phép người khác xem hành trình này</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={data.is_public} onChange={e => setData('is_public', e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#003d9b]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003d9b]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-[#003d9b] text-white py-3.5 rounded-2xl text-[15px] font-bold hover:bg-[#002561] transition-colors shadow-md disabled:opacity-70"
                                >
                                    {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                                <Link
                                    href={route('trips.show', trip.id)}
                                    className="px-8 py-3.5 rounded-2xl border border-gray-200 text-[15px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </Link>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN (Destinations) ── */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900">Các điểm đến</h3>
                                <span className="bg-[#e5f6fd] text-[#00a9e2] text-xs font-bold px-3 py-1 rounded-full">
                                    {sortedTripPlaces.length} điểm
                                </span>
                            </div>

                            <div className="space-y-5 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
                                {tripPlacesByDay.map(({ day, dateLabel, items }) => (
                                    <div key={day} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Ngày {day}</h4>
                                                {dateLabel && <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{dateLabel}</p>}
                                            </div>
                                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                                {items.length} điểm
                                            </span>
                                        </div>

                                        {items.length > 0 ? (
                                            <div className="space-y-3">
                                                {items.map((tripPlace) => {
                                                    const place = tripPlace.place;

                                                    return (
                                                        <div key={tripPlace.id} className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group bg-white">
                                                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                                                <img
                                                                    src={assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=60')}
                                                                    alt={place.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-sm text-gray-900 truncate">{place.name}</h4>
                                                                <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                                                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                                    {place.city?.name || place.address || 'Việt Nam'}
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (confirm('Bạn có chắc chắn muốn xóa điểm đến này khỏi ngày này?')) {
                                                                        router.delete(route('trips.removePlace', [trip.id, tripPlace.id]), { preserveScroll: true });
                                                                    }
                                                                }}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-3 text-center">
                                                <p className="text-xs font-semibold text-gray-400">Chưa có điểm đến trong ngày này</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {sortedTripPlaces.length === 0 && (
                                    <div className="text-center py-2">
                                        <p className="text-sm text-gray-400">Chưa có điểm đến nào</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowPlacePicker(true)}
                                    className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 hover:text-[#003d9b] hover:border-[#003d9b]/30 hover:bg-gray-50 flex items-center justify-center gap-2 text-[13px] font-bold transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                    Thêm nhanh địa điểm
                                </button>

                                <Link 
                                    href={route('places.search', { trip_id: trip.id })}
                                    className="w-full py-3.5 rounded-2xl bg-[#e6edf7] text-[#003d9b] hover:bg-[#d2e2f5] flex items-center justify-center gap-2 text-[13px] font-black transition-all shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    Khám phá & Chọn trên bản đồ
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            {/* Place Picker Modal */}
            {showPlacePicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-900">Thêm điểm đến mới</h2>
                            <button onClick={() => setShowPlacePicker(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-600 block mb-2">Chọn ngày ghé thăm</label>
                            <select 
                                value={selectedDay} 
                                onChange={e => setSelectedDay(Number(e.target.value))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
                            >
                                {days.map(d => (
                                    <option key={d} value={d}>Ngày {d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-600 block mb-2">Tìm kiếm địa điểm</label>
                            <input 
                                type="text" 
                                placeholder="🔍 Nhập tên địa điểm..." 
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
                            />
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {filteredPlaces.map(place => (
                                <button
                                    key={place.id}
                                    type="button"
                                    onClick={() => handleAddPlace(place.id)}
                                    className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img 
                                            src={assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=60')} 
                                            alt={place.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-xs text-gray-900 truncate group-hover:text-[#003d9b]">{place.name}</h4>
                                        <p className="text-[10px] text-gray-500 truncate">{place.category?.name || 'Tham quan'}</p>
                                    </div>
                                    <span className="text-[#003d9b] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity pr-2">+ Thêm</span>
                                </button>
                            ))}
                            {filteredPlaces.length === 0 && (
                                <p className="text-center text-xs text-gray-400 py-6">Không tìm thấy địa điểm nào</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
