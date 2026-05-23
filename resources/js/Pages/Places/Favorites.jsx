import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PlaceCard from '@/Components/PlaceCard';
import { Head, Link } from '@inertiajs/react';

export default function Favorites({ places }) {
    const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'alphabetical'

    // Sắp xếp danh sách địa điểm theo tab được chọn
    const sortedPlaces = [...places].sort((a, b) => {
        if (sortBy === 'alphabetical') {
            return a.name.localeCompare(b.name, 'vi');
        }
        return 0; // Giữ nguyên thứ tự từ backend (ngày lưu gần nhất)
    });

    return (
        <AppLayout>
            <Head title="Địa điểm yêu thích – KhamPhaDD" />

            <div className="bg-[#F8FAFC] min-h-screen pt-28 pb-16">
                <div className="max-w-[1400px] mx-auto px-6">
                    
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 mb-1">
                                Địa điểm yêu thích
                            </h1>
                            <p className="text-xs font-bold text-slate-400">
                                Bạn đã lưu {places.length} địa điểm
                            </p>
                        </div>

                        {/* Sort Tabs */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    sortBy === 'recent'
                                        ? 'bg-[#003d9b] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Gần đây
                            </button>
                            <button
                                onClick={() => setSortBy('alphabetical')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    sortBy === 'alphabetical'
                                        ? 'bg-[#003d9b] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                                Theo bảng chữ cái
                            </button>
                        </div>
                    </div>

                    {/* Places Grid */}
                    {sortedPlaces.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 max-w-2xl mx-auto my-6 shadow-sm">
                            <span className="text-5xl block mb-4">🗂️</span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Bộ sưu tập trống</h3>
                            <p className="text-xs text-slate-400 mb-6">Hãy khám phá thêm và lưu lại những địa điểm bạn yêu thích nhé.</p>
                            <Link href={route('places.search')} className="bg-[#003d9b] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#002f78] transition-colors shadow-sm inline-block">
                                Khám phá ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {sortedPlaces.map(place => (
                                <PlaceCard key={place.id} place={place} />
                            ))}
                        </div>
                    )}

                    {/* Bottom Dotted Discovery Banner */}
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11h-6m3-3v6" />
                        </svg>
                        <p className="text-xs font-bold text-slate-500 max-w-md leading-relaxed mb-4">
                            Khám phá thêm nhiều địa điểm mới và lưu lại hành trình của bạn.
                        </p>
                        <Link 
                            href="/search"
                            className="inline-flex items-center rounded-xl bg-[#003d9b] text-white font-bold text-xs px-6 py-3 shadow-sm hover:bg-[#002f78] hover:shadow active:scale-95 transition-all"
                        >
                            Khám phá ngay
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
