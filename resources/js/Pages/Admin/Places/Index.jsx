import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { assetUrl } from '@/lib/assets';

export default function Index({ places, stats }) {
    const [search, setSearch] = useState('');
    const debounce = useRef(null);

    // Read search query from URL on load
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSearch(params.get('search') || '');
    }, []);

    const handleSearchChange = (val) => {
        setSearch(val);
        clearTimeout(debounce.current);
        debounce.current = setTimeout(() => {
            router.get(route('admin.places.index'), { search: val }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 350);
    };

    const destroy = (id) => {
        if (confirm('Bạn có chắc chắn muốn lưu trữ địa điểm này?')) {
            router.delete(route('admin.places.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const restore = (id) => {
        router.patch(route('admin.places.restore', id), {
            preserveScroll: true,
        });
    };

    const getCategoryText = (place) => {
        if (!place.category?.name) return 'Chưa phân loại';
        const totalCount = Array.isArray(place.category_ids) ? place.category_ids.length : 1;
        if (totalCount > 1) {
            return `${place.category.name} (+${totalCount - 1})`;
        }
        return place.category.name;
    };

    // Fallback safe values for stats
    const totalPlaces = stats?.total ?? 0;
    const activePlaces = stats?.active ?? 0;
    const archivedPlaces = stats?.archived ?? 0;
    const categoriesCount = stats?.categories ?? 0;

    return (
        <AdminLayout>
            <Head title="Quản Lý Địa Điểm — Admin" />

            {/* Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black font-serif text-[#0f172a] tracking-tight">Cơ sở dữ liệu.</h1>
                    <p className="text-slate-400 text-sm mt-1.5">Quản lý toàn bộ danh sách địa điểm khám phá, thông tin tọa độ và bộ lọc danh mục của hệ thống.</p>
                </div>
                <Link href={route('admin.places.create')} className="shrink-0">
                    <button className="bg-[#003d9b] text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#002a6e] transition-all shadow-md active:scale-95 flex items-center gap-2">
                        <span>➕</span> Thêm địa điểm mới
                    </button>
                </Link>
            </div>

            {/* Premium Dashboard Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Stat 1: Total Discoveries */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng địa điểm</span>
                        <h3 className="text-3xl font-black text-[#0f172a] mt-2 font-serif">{totalPlaces}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Địa điểm trong hệ thống</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-[#003d9b] rounded-xl flex items-center justify-center text-xl shadow-inner">
                        🗺️
                    </div>
                </div>

                {/* Stat 2: Active Locations */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoạt động</span>
                        <h3 className="text-3xl font-black text-emerald-600 mt-2 font-serif">{activePlaces}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Hiển thị trên bản đồ</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-inner">
                        🟢
                    </div>
                </div>

                {/* Stat 3: Archived Entries */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đã Lưu trữ</span>
                        <h3 className="text-3xl font-black text-rose-500 mt-2 font-serif">{archivedPlaces}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Đang ẩn khỏi tìm kiếm</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center text-xl shadow-inner">
                        📁
                    </div>
                </div>

                {/* Stat 4: Categories */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</span>
                        <h3 className="text-3xl font-black text-indigo-500 mt-2 font-serif">{categoriesCount}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Danh mục phân loại chính</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-xl shadow-inner">
                        🏷️
                    </div>
                </div>
            </div>

            {/* Search and Quick Filters bar */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        placeholder="Tìm kiếm theo tên địa điểm..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0f172a] font-semibold focus:outline-none focus:border-[#003d9b] transition-all placeholder-slate-400"
                    />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Hiển thị <span className="text-[#003d9b] font-black">{places.data.length}</span> địa điểm trên trang này
                </div>
            </div>

            {/* Places Grid/Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/75 border-b border-slate-200/60">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Địa điểm</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {places.data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-16 text-slate-400 text-sm font-semibold">
                                        Không tìm thấy địa điểm nào phù hợp với từ khóa tìm kiếm.
                                    </td>
                                </tr>
                            ) : (
                                places.data.map((place) => (
                                    <tr 
                                        key={place.id} 
                                        className={`hover:bg-slate-50/50 transition-colors ${place.deleted_at ? 'opacity-65' : ''}`}
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={assetUrl(place.image || place.image_url, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80')} 
                                                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shadow-inner flex-shrink-0"
                                                    onError={e => {
                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&q=80';
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-[#0f172a] truncate">{place.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">
                                                        📍 {place.city?.name || 'Vĩnh Long'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3.5 py-1.5 bg-[#003d9b]/5 text-[#003d9b] border border-[#003d9b]/10 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm">
                                                {getCategoryText(place)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {place.deleted_at ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Lưu trữ
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hoạt động
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2 whitespace-nowrap">
                                            {!place.deleted_at ? (
                                                <>
                                                    <Link 
                                                        href={route('admin.places.edit', place.id)} 
                                                        className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Sửa
                                                    </Link>
                                                    <button 
                                                        onClick={() => destroy(place.id)} 
                                                        className="inline-flex items-center justify-center px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Lưu trữ
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => restore(place.id)} 
                                                    className="inline-flex items-center justify-center px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Khôi phục
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {places.links.length > 3 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-center gap-1.5 flex-wrap">
                        {places.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                    !link.url ? 'text-slate-300 pointer-events-none' :
                                    link.active 
                                        ? 'bg-[#003d9b] text-white shadow-md shadow-[#003d9b]/25' 
                                        : 'text-slate-400 hover:bg-white hover:text-[#0f172a]'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
