import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { assetUrl } from '@/lib/assets';

// ── Helpers ──
function diffDays(start, end) {
    if (!start || !end) return null;
    return Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
}
function fmtTime(t) { return t ? t.slice(0, 5) : null; }

const formatCurrency = (val) => {
    if (val === null || val === undefined || val === '' || Number(val) <= 0) return 'Chưa có';
    return Number(val).toLocaleString('vi-VN') + ' VND';
};

// ── Một item địa điểm trong ngày ──
function PlaceItem({ tp }) {
    return (
        <div className="ml-8 mb-4 bg-white border border-gray-100 rounded-2xl p-3 flex gap-4 shadow-sm hover:shadow-md transition-shadow relative">
            {/* Ảnh */}
            <div className="w-32 h-24 flex-shrink-0">
                <img
                    src={assetUrl(tp.place?.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=70')}
                    alt={tp.place?.name}
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            {/* Content */}
            <div className="flex-1 py-1 relative">
                <p className="text-[10px] font-bold text-[#008A8A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <span>{tp.place?.category?.icon || '📍'}</span> {tp.place?.category?.name || 'Tham quan'}
                </p>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{tp.place?.name}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                    {tp.place?.description || 'Thưởng thức phong cảnh tuyệt đẹp và trải nghiệm văn hóa địa phương đặc sắc tại điểm đến này.'}
                </p>
            </div>
        </div>
    );
}

// ── Một cột ngày ──
function DaySection({ dayNumber, dateLabel, items }) {
    return (
        <div className="relative mb-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-5 h-5 rounded-full bg-[#003d9b] border-4 border-[#e6edf7] flex-shrink-0 z-10" />
                <h3 className="text-sm font-bold text-gray-900">
                    Ngày {dayNumber}: {dateLabel || 'Khám phá'}
                </h3>
            </div>
            
            {items.length > 0 ? (
                <div>
                    {items.map(tp => (
                        <PlaceItem key={tp.id} tp={tp} />
                    ))}
                </div>
            ) : (
                <div className="ml-8 text-xs text-gray-400 py-2">
                    Chưa có hoạt động nào trong ngày này.
                </div>
            )}
        </div>
    );
}

// ── Main ──
export default function TripShow({ trip }) {
    const tripPlaces = trip.trip_places || [];

    const daysCount = trip.start_date && trip.end_date
        ? Math.max(1, Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1)
        : Math.max(1, ...tripPlaces.map(t => t.day_number), 1);

    const days = Array.from({ length: daysCount }, (_, i) => i + 1);

    const byDay = (d) => [...tripPlaces]
        .filter(t => t.day_number === d)
        .sort((a, b) => a.order - b.order);

    const formatShortDate = (dStr) => {
        if (!dStr) return '';
        const d = new Date(dStr);
        return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}, ${d.getFullYear()}`;
    };

    const budget = trip.budget;
    const membersCount = trip.members || 1;
    const avgBudget = budget && Number(budget) > 0 ? Math.round(budget / membersCount) : null;

    const handleDeleteMember = () => {
        if (membersCount <= 1) return;
        if (confirm('Bạn có chắc muốn xóa thành viên này khỏi chuyến đi? Số lượng người sẽ giảm đi 1.')) {
            router.put(route('trips.update', trip.id), { members: membersCount - 1 }, {
                preserveScroll: true
            });
        }
    };

    return (
        <AppLayout>
            <Head title={`${trip.title} – Chi tiết`} />

            {/* ── HERO BANNER ── */}
            <div className="relative h-[250px] sm:h-[350px] w-full overflow-hidden bg-black">
                <img 
                    src={assetUrl(trip.cover_image, 'https://images.unsplash.com/photo-1528127269322-539811f0a35c?w=1200&q=80')} 
                    alt="Cover" 
                    className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <span className="inline-block bg-[#003d9b] text-white text-[9px] font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">
                            Chuyến đi đặc biệt
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{trip.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-300">
                            <span className="flex items-center gap-1.5">
                                📅 {formatShortDate(trip.start_date)} {trip.end_date && `- ${formatShortDate(trip.end_date)}`}
                            </span>
                            <span className="flex items-center gap-1.5">
                                🕒 {daysCount} ngày{daysCount > 1 ? `, ${daysCount-1} đêm` : ''}
                            </span>
                            <span className="flex items-center gap-1.5">
                                📍 {tripPlaces.map(p => p.place?.city?.name || '').filter((v,i,a)=>v && a.indexOf(v)===i).join(' - ') || 'Nhiều điểm đến'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="bg-[#F5F6FA] min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT COLUMN: LỊCH TRÌNH */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-bold text-[#003d9b]">Lịch trình chi tiết</h2>
                                <button className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#003d9b] hover:border-[#003d9b] transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/></svg>
                                </button>
                            </div>

                            <div className="relative pl-1">
                                {/* Vertical line */}
                                <div className="absolute top-2 bottom-0 left-[11px] w-0.5 bg-gray-200" />
                                
                                {days.map(d => (
                                    <DaySection
                                        key={d}
                                        dayNumber={d}
                                        dateLabel={byDay(d)[0]?.place?.city?.name || null}
                                        items={byDay(d)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SIDEBAR */}
                        <div className="space-y-6">
                            
                            {/* Overview */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-[#003d9b] mb-4">Tổng quan chuyến đi</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Tổng ngân sách</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(budget)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Số người</span>
                                        <span className="font-bold text-gray-900">{membersCount} người</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Trung bình/Người</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(avgBudget)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Members */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-[#003d9b] mb-4">Thành viên ({membersCount})</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(trip.user?.name || 'Trưởng đoàn')}&background=003d9b&color=fff`} className="w-8 h-8 rounded-full bg-gray-200" alt="Avatar" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{trip.user?.name || 'Bạn'} (Trưởng đoàn)</p>
                                            <p className="text-[10px] text-gray-500">Đang hoạt động</p>
                                        </div>
                                    </div>
                                    {membersCount > 1 && Array.from({ length: membersCount - 1 }).map((_, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1 group">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`Thành viên ${idx + 2}`)}&background=6b7280&color=fff`} className="w-8 h-8 rounded-full bg-gray-200" alt="Avatar" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-bold text-gray-900 truncate">Thành viên {idx + 2}</p>
                                                    <p className="text-[10px] text-gray-500">Đã tham gia</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleDeleteMember}
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
                                                title="Xóa thành viên"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-[#003d9b] mb-1">Bản đồ lộ trình</h3>
                                <p className="text-[10px] text-gray-500 mb-4">
                                    Tuyến đường: {tripPlaces.length > 0 ? (tripPlaces[0].place?.city?.name + ' → ' + tripPlaces[tripPlaces.length-1].place?.city?.name) : 'Đang cập nhật'}
                                </p>
                                <div className="relative rounded-xl overflow-hidden h-32 bg-[#1A232C] flex items-center justify-center group cursor-pointer">
                                    <div className="absolute inset-0 opacity-50 bg-[url('https://maps.wikimedia.org/osm-intl/6/50/28.png')] bg-cover bg-center" />
                                    <button className="relative z-10 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-[#003d9b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        Xem bản đồ lớn
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Link href={route('trips.edit', trip.id)} className="flex-1 py-3 bg-white border border-[#003d9b] text-[#003d9b] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#003d9b] hover:text-white transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    Sửa
                                </Link>
                                <button className="flex-1 py-3 bg-[#003d9b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#002a6e] transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                                    Chia sẻ
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
