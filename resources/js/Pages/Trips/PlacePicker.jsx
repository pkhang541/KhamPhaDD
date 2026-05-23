import { useState } from 'react';
import { assetUrl } from '@/lib/assets';

export default function PlacePicker({ allPlaces, selectedIds, onToggle, onClose }) {
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState(null);

    // Extract unique categories
    const categories = [];
    const catSet = new Set();
    allPlaces.forEach(p => {
        if (p.category && !catSet.has(p.category.id)) {
            catSet.add(p.category.id);
            categories.push(p.category);
        }
    });

    const filtered = allPlaces.filter(p => {
        const matchCat = !activeCat || p.category?.id === activeCat;
        const q = search.toLowerCase();
        const matchSearch = !search || p.name.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q) || p.city?.name?.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    const getImg = (place) => {
        return assetUrl(place.image, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70');
    };

    const selectedCount = selectedIds.length;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#F5F6FA]">

            {/* ── TOP BAR ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-extrabold text-gray-900">Chọn điểm đến</h1>
                            <p className="text-xs text-gray-400">Tìm và thêm địa điểm vào chuyến đi của bạn</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Tìm địa điểm, thành phố, danh lam..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#003d9b] focus:bg-white focus:ring-1 focus:ring-[#003d9b]/10 outline-none transition-all" />
                        </div>
                    </div>

                    {/* Done button */}
                    <button onClick={onClose}
                        className="bg-[#003d9b] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#002a6e] transition-all flex items-center gap-2 flex-shrink-0">
                        ✓ Xong ({selectedCount} đã chọn)
                    </button>
                </div>
            </div>

            {/* ── CATEGORY FILTER PILLS ── */}
            <div className="bg-white border-b border-gray-50 flex-shrink-0">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <button onClick={() => setActiveCat(null)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                            !activeCat ? 'bg-[#003d9b] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        Tất cả
                    </button>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                                activeCat === cat.id ? 'bg-[#003d9b] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── SELECTED PLACES BAR ── */}
            {selectedCount > 0 && (
                <div className="bg-blue-50/80 border-b border-blue-100 flex-shrink-0">
                    <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        <span className="text-xs font-bold text-[#003d9b] flex-shrink-0">Đã chọn:</span>
                        {allPlaces.filter(p => selectedIds.includes(p.id)).map(place => (
                            <span key={place.id}
                                className="flex items-center gap-1.5 bg-white border border-blue-200 text-[#003d9b] pl-3 pr-1.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 shadow-sm">
                                {place.name}
                                <button onClick={() => onToggle(place.id)}
                                    className="w-5 h-5 rounded-full bg-blue-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-[10px] transition-colors">
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── PLACE GRID ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto px-6 py-6">
                    <p className="text-xs text-gray-400 font-medium mb-4">
                        Hiển thị <strong className="text-gray-700">{filtered.length}</strong> địa điểm
                    </p>

                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                            <span className="text-5xl block mb-4">🔭</span>
                            <h3 className="text-lg font-black text-gray-900 mb-2">Không tìm thấy địa điểm</h3>
                            <p className="text-gray-400 text-sm">Thử đổi bộ lọc hoặc từ khóa khác.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filtered.map(place => {
                                const isSelected = selectedIds.includes(place.id);
                                const rating = Number(place.avg_rating || 0);
                                return (
                                    <div key={place.id}
                                        onClick={() => onToggle(place.id)}
                                        className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                                            isSelected
                                                ? 'border-[#003d9b] ring-2 ring-[#003d9b]/15 shadow-md'
                                                : 'border-gray-100 hover:border-gray-200'
                                        }`}>
                                        {/* Image */}
                                        <div className="relative h-36 overflow-hidden bg-gray-100">
                                            <img src={getImg(place)} alt={place.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                            {/* Selected badge */}
                                            {isSelected && (
                                                <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-[#003d9b] rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Category tag */}
                                            {place.category && (
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
                                                    {place.category.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-3">
                                            {place.city?.name && (
                                                <p className="text-[10px] font-bold text-[#003d9b] uppercase tracking-wide mb-0.5 flex items-center gap-1">
                                                    📍 {place.city.name}
                                                </p>
                                            )}
                                            <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 group-hover:text-[#003d9b] transition-colors">
                                                {place.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{place.address || ''}</p>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-amber-400 text-xs">★</span>
                                                    <span className="text-xs font-bold text-gray-600">
                                                        {rating > 0 ? rating.toFixed(1) : '—'}
                                                    </span>
                                                </div>
                                                {isSelected ? (
                                                    <span className="text-[10px] font-bold text-[#003d9b] bg-blue-50 px-2 py-0.5 rounded-full">Đã chọn</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#003d9b] transition-colors">+ Thêm</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
