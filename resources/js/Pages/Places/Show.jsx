import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { assetUrl } from '@/lib/assets';

const AMENITY_MAP = {
    wifi:         { icon: '📶', label: 'WiFi miễn phí' },
    parking:      { icon: '🅿️', label: 'Bãi đỗ xe' },
    ac:           { icon: '❄️', label: 'Máy lạnh' },
    outdoor:      { icon: '🌿', label: 'Ngoài trời' },
    music:        { icon: '🎵', label: 'Nhạc sống' },
    takeaway:     { icon: '🛍️', label: 'Mang đi' },
    pet_friendly: { icon: '🐾', label: 'Thú cưng OK' },
    power_outlet: { icon: '🔌', label: 'Ồ cắm điện' },
    private_room: { icon: '🚭', label: 'Phòng riêng' },
    vegetarian:   { icon: '🥗', label: 'Món chay' },
    delivery:     { icon: '🛵', label: 'Giao hàng' },
    reservation:  { icon: '📅', label: 'Đặt bàn' },
    toilet:       { icon: '🚿', label: 'Vệ sinh' },
    guide:        { icon: '🧭', label: 'Hướng dẫn viên' },
    wheelchair:   { icon: '♿', label: 'Xe lăn' },
    photo_spot:   { icon: '📸', label: 'Sống ảo' },
    souvenir:     { icon: '🎁', label: 'Lưu niệm' },
    pool:         { icon: '🏊', label: 'Hồ bơi' },
    elevator:     { icon: '🔼', label: 'Thang máy' },
};

/* ── Star row ── */
function Stars({ rating = 0, max = 5 }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={`text-sm ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
            ))}
        </div>
    );
}

/* ── Similar card ── */
function SimilarCard({ place }) {
    if (!place?.slug) return null;
    const img = assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70');
    const rating = Number(place.avg_rating || 0);
    return (
        <a href={`/places/${place.slug}`}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100 hover:-translate-y-0.5">
            <div className="relative h-36 overflow-hidden">
                <img src={img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {rating > 0 && (
                    <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-md text-xs font-black flex items-center gap-1 shadow-sm">
                        <span className="text-amber-400">★</span>{rating.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="p-3">
                <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[#003d9b] transition-colors mb-1">{place.name}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span>📍</span>{place.city?.name || ''}
                </p>
            </div>
        </a>
    );
}

/* ── Q&A item ── */
function QaItem({ qa, placeId }) {
    const [open, setOpen] = useState(false);
    const form = useForm({ body: '', place_id: placeId, parent_id: qa.id });
    return (
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
            <div className="flex gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#003d9b]/10 text-[#003d9b] font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {qa.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-700">{qa.user?.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{qa.body}</p>
                </div>
            </div>
            {qa.answers?.map(a => (
                <div key={a.id} className="ml-11 bg-white border border-gray-100 rounded-lg p-3 mb-2 text-xs">
                    <p className="font-bold text-[#003d9b] mb-0.5">{a.user?.name}</p>
                    <p className="text-gray-600">{a.body}</p>
                </div>
            ))}
            <button onClick={() => setOpen(v => !v)} className="ml-11 text-xs font-bold text-[#003d9b] hover:underline">
                {open ? 'Ẩn' : 'Trả lời'}
            </button>
            {open && (
                <form onSubmit={e => { e.preventDefault(); form.post('/qas', { preserveScroll: true, onSuccess: () => form.reset('body') }); }}
                    className="ml-11 mt-2 flex gap-2">
                    <input value={form.data.body} onChange={e => form.setData('body', e.target.value)}
                        placeholder="Nhập câu trả lời..." required
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#003d9b]" />
                    <button type="submit" disabled={form.processing}
                        className="bg-[#003d9b] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#0052cc] transition-colors">Gửi</button>
                </form>
            )}
        </div>
    );
}

export default function PlaceShow({ place, isFavorite, userReview, similarPlaces, qas }) {
    /* Guard: nếu place undefined thì không render gì */
    if (!place) return (
        <AppLayout>
            <Head title="Không tìm thấy – KhamPhaDD" />
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center"><p className="text-5xl mb-4">🔭</p><h1 className="text-xl font-bold text-gray-700">Không tìm thấy địa điểm</h1><a href="/search" className="mt-4 inline-block text-[#003d9b] font-bold hover:underline">← Quay lại</a></div>
            </div>
        </AppLayout>
    );

    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;
    const similar = similarPlaces || [];
    const qaList = qas || [];

    const [fav, setFav] = useState(!!isFavorite);
    const [showAllQa, setShowAllQa] = useState(false);
    const qaForm = useForm({ body: '', place_id: place.id, parent_id: null });

    const img = assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80');
    const rating = Number(place.avg_rating || 0);

    const toggleFav = () => {
        if (!isLoggedIn) { window.location.href = '/login'; return; }
        router.post(route('places.favorite', place.id), {}, { preserveScroll: true, onSuccess: () => setFav(v => !v) });
    };

    const submitQa = (e) => {
        e.preventDefault();
        qaForm.post('/qas', { preserveScroll: true, onSuccess: () => qaForm.reset('body') });
    };

    const displayQas = showAllQa ? qaList : qaList.slice(0, 3);

    return (
        <AppLayout>
            <Head title={`${place.name} – KhamPhaDD`}>
                <meta name="description" content={place.description?.slice(0, 160) || place.name} />
            </Head>

            {/* ── Hero ── */}
            <section className="relative w-full h-[380px] md:h-[460px] overflow-hidden">
                <img src={img} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)' }} />
                <div className="absolute inset-0 flex flex-col justify-end pb-10">
                    <div className="max-w-[1200px] mx-auto w-full px-6 text-white">
                        {place.category?.name && (
                            <span className="inline-block bg-[#7de2fe]/90 text-[#001f26] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                                {place.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-2 drop-shadow-md">{place.name}</h1>
                        <p className="flex items-center gap-1.5 text-white/90 text-sm">
                            <span>📍</span>
                            <span>{[place.city?.name, 'Việt Nam'].filter(Boolean).join(', ')}</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Content ── */}
            <div className="bg-[#f8f9fb] py-10">
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-8">

                    {/* ── Left column ── */}
                    <div className="flex-1 min-w-0 space-y-8">

                        {/* Giới thiệu */}
                        <section className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-4">Giới thiệu</h2>
                            {place.description ? (
                                <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                                    {place.description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">Chưa có mô tả cho địa điểm này.</p>
                            )}



                            {/* Gallery */}
                            {place.gallery?.length >= 2 && (
                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    {place.gallery.slice(0, 2).map((g, i) => (
                                        <img key={i} src={g} alt={`${place.name} ${i + 1}`}
                                            className="rounded-xl w-full h-44 object-cover shadow-sm" />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Địa điểm tương tự */}
                        {similar.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-black text-gray-900">Địa điểm tương tự</h2>
                                    <a href={`/search?category_id=${place.category?.id || ''}`}
                                        className="text-sm font-bold text-[#003d9b] hover:underline">Xem tất cả</a>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {similar.slice(0, 3).map(p => <SimilarCard key={p.id} place={p} />)}
                                </div>
                            </section>
                        )}

                        {/* Q&A */}
                        <section className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-black text-gray-900 mb-5">Hỏi & Đáp ({qaList.length})</h2>
                            {isLoggedIn && (
                                <form onSubmit={submitQa} className="flex gap-3 mb-5">
                                    <input value={qaForm.data.body} onChange={e => qaForm.setData('body', e.target.value)}
                                        placeholder="Đặt câu hỏi về địa điểm này..." required
                                        className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#003d9b] transition-colors" />
                                    <button type="submit" disabled={qaForm.processing}
                                        className="bg-[#003d9b] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0052cc] transition-colors disabled:opacity-50">Gửi</button>
                                </form>
                            )}
                            <div className="space-y-3">
                                {displayQas.map(qa => <QaItem key={qa.id} qa={qa} placeId={place.id} />)}
                                {qaList.length === 0 && (
                                    <p className="text-gray-400 text-sm text-center py-8">Chưa có câu hỏi nào. Hãy là người đầu tiên!</p>
                                )}
                            </div>
                            {qaList.length > 3 && (
                                <button onClick={() => setShowAllQa(v => !v)}
                                    className="mt-4 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-[#003d9b] hover:text-[#003d9b] transition-all">
                                    {showAllQa ? 'Thu gọn' : `Xem thêm ${qaList.length - 3} câu hỏi`}
                                </button>
                            )}
                        </section>
                    </div>

                    {/* ── Right sidebar ── */}
                    <aside className="w-full lg:w-[300px] flex-shrink-0 space-y-4">

                        {/* Thông tin chi tiết */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h3 className="font-black text-base text-gray-900 mb-4">Thông tin chi tiết</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: '🕐', label: 'Giờ mở cửa', val: place.open_hours || '07:00 – 22:00' },
                                    { icon: '💰', label: 'Mức giá', val: place.price_range || 'Liên hệ', cls: 'text-[#00687b] font-bold' },
                                    place.phone && { icon: '📞', label: 'Điện thoại', val: place.phone },
                                    place.website && { icon: '🌐', label: 'Website', val: place.website, link: true },
                                ].filter(Boolean).map((row, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-[#f0f4ff] rounded-lg flex items-center justify-center flex-shrink-0 text-base">{row.icon}</div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{row.label}</p>
                                            {row.link
                                                ? <a href={row.val} target="_blank" rel="noopener noreferrer" className="text-xs text-[#003d9b] font-bold hover:underline truncate block">{row.val}</a>
                                                : <p className={`text-sm ${row.cls || 'text-gray-700 font-medium'}`}>{row.val}</p>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tiện ích – hiển thị dưới info */}
                            {place.amenities?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tiện ích</p>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-1">
                                        {place.amenities.map((key, i) => {
                                            const label = AMENITY_MAP[key]?.label || key;
                                            return (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <span className="w-4 h-4 rounded-full bg-[#003d9b]/10 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-2.5 h-2.5 text-[#003d9b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                                        </svg>
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-600 truncate">{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Rating */}
                            {rating > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                                    <span className="text-3xl font-black text-[#003d9b]">{rating.toFixed(1)}</span>
                                    <div>
                                        <Stars rating={rating} />
                                        <p className="text-[11px] text-gray-400 mt-0.5">{place.review_count || 0} đánh giá</p>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="mt-5 space-y-2">
                                {place.latitude && place.longitude && (
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full bg-[#003d9b] text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0052cc] transition-colors">
                                        🗺️ Xem bản đồ lớn
                                    </a>
                                )}
                                <button onClick={toggleFav}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${fav ? 'bg-red-50 border-red-300 text-red-500' : 'border-[#003d9b] text-[#003d9b] hover:bg-[#003d9b]/5'}`}>
                                    {fav ? '❤️ Đã lưu yêu thích' : '🤍 Lưu yêu thích'}
                                </button>
                                <a href="/trips"
                                    className="w-full bg-[#00687b] text-white flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm hover:bg-[#004e5d] transition-colors">
                                    ✈️ Thêm vào lịch trình
                                </a>
                            </div>
                        </div>

                        {/* Map embed */}
                        {place.latitude && place.longitude && (
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="h-44">
                                    <iframe
                                        key={`${place.latitude}-${place.longitude}`}
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.002}%2C${place.latitude - 0.002}%2C${place.longitude + 0.002}%2C${place.latitude + 0.002}&layer=mapnik&marker=${place.latitude}%2C${place.longitude}`}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                        title="Bản đồ"
                                    />
                                </div>
                                <div className="px-4 py-3 flex items-center gap-2">
                                    <span className="text-[#003d9b] text-sm">📍</span>
                                    <span className="text-xs font-semibold text-gray-600 truncate">{place.address}</span>
                                </div>
                            </div>
                        )}

                        {/* Weather stub */}
                        <div className="bg-gradient-to-br from-[#314368] to-[#495a81] rounded-2xl p-5 text-white">
                            <p className="text-xs opacity-70 mb-1 font-medium">Thời tiết tại</p>
                            <p className="font-black text-base mb-3">{place.city?.name || 'Việt Nam'}</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-3xl font-black">28°C</p>
                                    <p className="text-xs opacity-75 mt-0.5">Trời có mây</p>
                                </div>
                                <span className="text-4xl">⛅</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
