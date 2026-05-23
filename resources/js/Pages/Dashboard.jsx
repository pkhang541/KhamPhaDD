import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const joinDate = user.created_at 
        ? new Date(user.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) 
        : 'Tháng 12, 2023';

    const isVerified = user.email_verified_at !== null;

    return (
        <AppLayout>
            <Head title="Trang cá nhân – KhamPhaDD" />

            <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">

                    {/* Header Banner & Profile Info */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Avatar container */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 bg-gradient-to-br from-[#003d9b] to-[#0052cc] flex items-center justify-center">
                                    {user.avatar ? (
                                        <img 
                                            src={`/storage/${user.avatar}`} 
                                            alt={user.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-white text-3xl font-black">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <Link 
                                    href={route('profile.edit')}
                                    className="absolute bottom-0 right-0 bg-[#003d9b] text-white p-2 rounded-full shadow-md hover:bg-[#002f78] transition-colors border-2 border-white"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </Link>
                            </div>

                            {/* User details */}
                            <div>
                                <p className="text-xs font-semibold text-slate-400 mb-1">Xin chào trở lại,</p>
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{user.name}</h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003d9b] bg-blue-50/70 border border-blue-100/50 px-2.5 py-1 rounded-full">
                                        🛡️ Thành viên
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Đang hoạt động
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Settings Button */}
                        <Link 
                            href={route('profile.edit')}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#003d9b] text-white font-bold text-sm px-5 py-3 shadow-sm hover:bg-[#002f78] hover:shadow transition-all self-start sm:self-center"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Thiết lập
                        </Link>
                    </div>

                    {/* Main Content Layout */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Sidebar (col-span-4) */}
                        <div className="col-span-12 md:col-span-4 space-y-6">
                            {/* Membership Status card */}
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <h2 className="text-base font-bold text-slate-800 mb-4">Membership Status</h2>
                                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-4 border border-slate-100">
                                    <span className="text-xs font-semibold text-slate-400">Hạng hiện tại</span>
                                    <span className="text-sm font-black text-slate-800">Thành viên</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                    Cảm ơn bạn đã tham gia cộng đồng KhamPhaDD. Hãy bắt đầu khám phá ngay!
                                </p>
                                <button className="w-full py-3 rounded-xl border-2 border-[#003d9b] text-[#003d9b] font-bold text-xs hover:bg-blue-50/50 active:scale-95 transition-all">
                                    Nâng cấp Premium
                                </button>
                            </div>

                            {/* Two small stats cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <Link 
                                    href="/favorites"
                                    className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-center hover:shadow hover:-translate-y-0.5 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-black text-slate-800 mb-0.5">{stats?.favorites_count ?? 0}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Địa điểm lưu</p>
                                </Link>

                                <Link 
                                    href="/search"
                                    className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm text-center hover:shadow hover:-translate-y-0.5 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-black text-slate-800 mb-0.5">{stats?.reviews_count ?? 0}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Đánh giá</p>
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Main Content (col-span-8) */}
                        <div className="col-span-12 md:col-span-8 space-y-6">
                            {/* Quick Access */}
                            <div>
                                <h2 className="text-base font-bold text-slate-800 mb-4">Truy cập nhanh</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Link 
                                        href="/search"
                                        className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#003d9b] transition-colors mb-1">Tìm địa điểm mới</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">Khám phá các điểm đến hot nhất</p>
                                    </Link>

                                    <Link 
                                        href="/map"
                                        className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#003d9b] transition-colors mb-1">Xem bản đồ</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">Định vị hành trình của bạn</p>
                                    </Link>

                                    <Link 
                                        href="/favorites"
                                        className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 flex flex-col group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center mb-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#003d9b] transition-colors mb-1">Danh sách lưu</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">Các địa điểm bạn đã yêu thích</p>
                                    </Link>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-base font-bold text-slate-800">Thông tin tài khoản</h2>
                                    <Link 
                                        href={route('profile.edit')}
                                        className="text-xs font-bold text-[#003d9b] hover:underline"
                                    >
                                        Chỉnh sửa
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tên hiển thị</label>
                                        <div className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-xl px-4 py-3.5 text-xs font-semibold">
                                            {user.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Địa chỉ Email</label>
                                        <div className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-xl px-4 py-3.5 text-xs font-semibold truncate">
                                            {user.email}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Trạng thái</label>
                                        <div className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-xl px-4 py-3.5 text-xs font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            {isVerified || true ? 'Đã xác minh' : 'Chưa xác minh'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ngày tham gia</label>
                                        <div className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-xl px-4 py-3.5 text-xs font-semibold">
                                            {joinDate}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Banner: Bắt đầu chuyến hành trình */}
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center flex flex-col items-center justify-center">
                                {/* Mountain/Travel SVG Illustration */}
                                <div className="w-20 h-14 flex items-center justify-center mb-5 text-[#003d9b]">
                                    <svg className="w-20 h-12 text-[#003d9b]/25 stroke-current" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M3 20l7-12 5 9" />
                                        <path d="M8 20l6-10 7 10" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-black text-slate-800 mb-2">Bắt đầu chuyến hành trình của bạn</h3>
                                <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed mb-6">
                                    {stats?.favorites_count > 0 
                                        ? `Bạn đã lưu ${stats.favorites_count} địa điểm yêu thích. Hãy lên lịch trình ngay hôm nay để bắt đầu chuyến đi tuyệt vời!`
                                        : 'Bạn chưa có địa điểm nào được lưu. Hãy bắt đầu tìm kiếm những địa điểm tuyệt vời cho chuyến đi tiếp theo của mình!'
                                    }
                                </p>
                                <Link 
                                    href="/search"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#003d9b] text-white font-bold text-xs px-6 py-3 shadow-sm hover:bg-[#002f78] hover:shadow active:scale-95 transition-all"
                                >
                                    Khám phá ngay
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
