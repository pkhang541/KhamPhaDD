import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }) {
    const { auth, flash } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-[#090f1d] text-white flex flex-col shrink-0 border-r border-slate-800">
                {/* Brand Logo */}
                <div className="p-8 pb-10">
                    <Link href="/" className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-1.5">
                        <span className="text-white">KhamPha</span>
                        <span className="text-[#003d9b] bg-white px-2 py-0.5 rounded-lg not-italic">DD</span>
                    </Link>
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">HỆ THỐNG QUẢN TRỊ</span>
                </div>

                {/* Navigation Categories */}
                <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
                    {/* General Section */}
                    <div className="space-y-1.5">
                        <span className="px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Công cụ chính</span>
                        
                        <Link 
                            href={route('admin.places.index')} 
                            className={cn(
                                "flex items-center gap-3.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                route().current('admin.places.*') 
                                    ? "bg-[#003d9b] text-white shadow-lg shadow-[#003d9b]/25 translate-x-1" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <span className="text-sm">📍</span> Quản lý địa điểm
                        </Link>

                        <Link 
                            href={route('admin.categories.index')} 
                            className={cn(
                                "flex items-center gap-3.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                                route().current('admin.categories.*') 
                                    ? "bg-[#003d9b] text-white shadow-lg shadow-[#003d9b]/25 translate-x-1" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <span className="text-sm">🏷️</span> Quản lý danh mục
                        </Link>
                    </div>

                    {/* Community Section */}
                    <div className="space-y-1.5">
                        <span className="px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Cộng đồng</span>
                        
                        <button 
                            disabled
                            className="w-full flex items-center gap-3.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 cursor-not-allowed text-left"
                        >
                            <span className="text-sm">💬</span> Kiểm duyệt đánh giá
                        </button>

                        <button 
                            disabled
                            className="w-full flex items-center gap-3.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 cursor-not-allowed text-left"
                        >
                            <span className="text-sm">👥</span> Quản lý thành viên
                        </button>
                    </div>

                    {/* Exit Section */}
                    <div className="space-y-1.5">
                        <span className="px-6 text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Thoát</span>
                        
                        <Link 
                            href="/dashboard"
                            className="flex items-center gap-3.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            <span className="text-sm">🏠</span> Về trang người dùng
                        </Link>
                    </div>
                </nav>

                {/* Footer User Info */}
                <div className="p-6 border-t border-slate-800 bg-[#060a14]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-[#003d9b] to-[#0052cc] rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/10 border border-white/10">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black uppercase tracking-widest truncate">{auth.user.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Quản trị viên</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-100 px-12 py-5 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                        {route().current('admin.places.index') && 'Danh Sách Địa Điểm'}
                        {route().current('admin.places.create') && 'Thêm Địa Điểm Mới'}
                        {route().current('admin.places.edit') && 'Chỉnh Sửa Địa Điểm'}
                        {route().current('admin.categories.index') && 'Danh Sách Danh Mục'}
                        {route().current('admin.categories.create') && 'Thêm Danh Mục Mới'}
                        {route().current('admin.categories.edit') && 'Chỉnh Sửa Danh Mục'}
                    </h2>

                    {flash.success && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-fade-up shadow-sm">
                            🎉 {flash.success}
                        </div>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
