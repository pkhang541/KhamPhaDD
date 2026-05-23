import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Chatbot from '@/Components/Chatbot';

// Icon components nhỏ gọn
const IconHome    = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const IconSearch  = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
const IconHeart   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;
const IconMap     = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>;
const IconUser    = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
const IconMenu    = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>;
const IconClose   = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconLogout  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;

const navLinks = [
    { href: '/',          label: 'Trang chủ',   icon: <IconHome /> },
    { href: '/search',    label: 'Khám phá',    icon: <IconSearch />, guestRedirect: true },
    { href: '/map',       label: 'Bản đồ',      icon: <IconMap />, guestRedirect: true },
    { href: '/favorites', label: 'Đã lưu',      icon: <IconHeart />, authRequired: true },
    { href: '/trips',     label: 'Chuyến đi',   icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>, authRequired: true },
];

export default function AppLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [scrolled,    setScrolled]    = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);
    const [userMenu,    setUserMenu]    = useState(false);
    const [showFlash,   setShowFlash]   = useState(!!flash?.success || !!flash?.error);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    // Các trang không có hero ảnh → navbar luôn solid
    const SOLID_PATHS  = ['/map', '/search', '/favorites', '/dashboard', '/profile', '/admin', '/trips'];
    const alwaysSolid  = SOLID_PATHS.some(p => currentPath.startsWith(p))
                      || currentPath.startsWith('/places/'); // trang chi tiết
    const solidNav     = scrolled || alwaysSolid;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Đóng mobile menu khi navigate
    useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [currentPath]);

    // Tự ẩn flash sau 4 giây
    useEffect(() => {
        if (showFlash) {
            const t = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(t);
        }
    }, [showFlash]);

    const handleLogout = () => {
        router.post('/logout');
    };

    const isActive = (href) => {
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    return (
        <div className="bg-[#FBFBFB] text-[#1A1A1A] antialiased min-h-screen">

            {/* ── FLASH NOTIFICATION ── */}
            {showFlash && (flash?.success || flash?.error) && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
                    flash?.success ? 'bg-[#1B3022] text-white' : 'bg-red-500 text-white'
                }`}>
                    <span>{flash?.success || flash?.error}</span>
                    <button onClick={() => setShowFlash(false)} className="opacity-70 hover:opacity-100 ml-2">✕</button>
                </div>
            )}

            {/* ── NAVBAR ── */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
                solidNav
                    ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-18">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-[#003d9b] rounded-lg flex items-center justify-center text-white font-black text-sm">K</div>
                            <span className={`font-black text-lg tracking-tight transition-colors ${solidNav ? 'text-[#003d9b]' : 'text-white'} group-hover:opacity-80`}>
                                KhamPhaDD
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map(link => {
                                if (link.authRequired && !auth?.user) return null;
                                const active = isActive(link.href);
                                const resolvedHref = (link.guestRedirect && !auth?.user) ? '/login' : link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={resolvedHref}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            active
                                                ? 'text-[#003d9b] font-bold border-b-2 border-[#003d9b] rounded-none pb-1'
                                                : solidNav
                                                    ? 'text-gray-600 hover:text-[#003d9b]'
                                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenu(v => !v)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            solidNav
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#003d9b] text-white text-xs font-black flex items-center justify-center">
                                            {auth.user.avatar ? (
                                                <img 
                                                    src={`/storage/${auth.user.avatar}`} 
                                                    alt={auth.user.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                auth.user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="hidden sm:block max-w-[100px] truncate">{auth.user.name}</span>
                                        <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                    </button>

                                    {/* Dropdown */}
                                    {userMenu && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E5E1DA] py-2 z-50">
                                            <div className="px-4 py-3 border-b border-[#F5F5F5]">
                                                <p className="font-bold text-sm text-[#1A1A1A] truncate">{auth.user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                                            </div>
                                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#F5F5F3] hover:text-[#1B3022] transition-colors">
                                                <IconUser /> Trang cá nhân
                                            </Link>
                                            {auth.user.role === 'admin' && (
                                                <Link href="/admin/places" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors font-bold">
                                                    🔑 Quản trị hệ thống
                                                </Link>
                                            )}
                                            <Link href="/favorites" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#F5F5F3] hover:text-[#1B3022] transition-colors">
                                                <IconHeart /> Địa điểm đã lưu
                                            </Link>
                                            <Link href="/trips" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#F5F5F3] hover:text-[#1B3022] transition-colors">
                                                🗺️ Chuyến đi của tôi
                                            </Link>
                                            <div className="border-t border-[#F5F5F5] mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <IconLogout /> Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className={`hidden sm:block px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        solidNav ? 'text-gray-600 hover:text-[#003d9b]' : 'text-white/90 hover:text-white'
                                    }`}>
                                        Đăng nhập
                                    </Link>
                                    <Link href="/register" className="px-4 py-2 bg-[#003d9b] text-white rounded-xl text-sm font-bold hover:bg-[#0052cc] transition-all">
                                        Đăng ký
                                    </Link>
                                </div>
                            )}

                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setMobileOpen(v => !v)}
                                className={`lg:hidden p-2 rounded-xl transition-colors ${
                                    solidNav ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                                }`}
                                aria-label="Menu"
                            >
                                {mobileOpen ? <IconClose /> : <IconMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div className="lg:hidden bg-white border-t border-[#E5E1DA] shadow-xl">
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            {navLinks.map(link => {
                                if (link.authRequired && !auth?.user) return null;
                                const active = isActive(link.href);
                                const resolvedHref = (link.guestRedirect && !auth?.user) ? '/login' : link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={resolvedHref}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            active ? 'bg-[#1B3022] text-white' : 'text-gray-600 hover:bg-[#F5F5F3] hover:text-[#1B3022]'
                                        }`}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                );
                            })}
                            {!auth?.user && (
                                <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-[#F5F5F3]">
                                    <IconUser /> Đăng nhập
                                </Link>
                            )}
                            {auth?.user && (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <IconLogout /> Đăng xuất
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* ── MAIN CONTENT ── */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* ── BOTTOM NAV (mobile) ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-[#E5E1DA] px-2 pb-safe">
                <div className="flex items-center justify-around py-2">
                    {navLinks.filter(l => !l.authRequired || auth?.user).map(link => {
                        const active = isActive(link.href);
                        const resolvedHref = (link.guestRedirect && !auth?.user) ? '/login' : link.href;
                        return (
                            <Link
                                key={link.href}
                                href={resolvedHref}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                                    active ? 'text-[#1B3022]' : 'text-gray-400'
                                }`}
                            >
                                <span className={active ? 'scale-110' : ''}>{link.icon}</span>
                                <span className="text-[10px] font-semibold">{link.label}</span>
                            </Link>
                        );
                    })}
                    <Link
                        href={auth?.user ? '/dashboard' : '/login'}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                            isActive('/dashboard') || isActive('/login') ? 'text-[#1B3022]' : 'text-gray-400'
                        }`}
                    >
                        <IconUser />
                        <span className="text-[10px] font-semibold">{auth?.user ? 'Tôi' : 'Đăng nhập'}</span>
                    </Link>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="bg-[#1A1A1A] text-white py-16 lg:pb-16 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#1B3022] rounded-lg flex items-center justify-center text-white font-black text-sm">K</div>
                                <span className="font-black text-lg">KhamPhaDD</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Nền tảng khám phá địa điểm cộng đồng — nơi chia sẻ những trải nghiệm thật sự tại Việt Nam.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm mb-5 text-gray-300">Khám phá</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link href="/"         className="hover:text-white transition-colors">Trang chủ</Link></li>
                                <li><Link href="/search"   className="hover:text-white transition-colors">Tìm kiếm địa điểm</Link></li>
                                <li><Link href="/map"      className="hover:text-white transition-colors">Bản đồ tương tác</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm mb-5 text-gray-300">Tài khoản</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                {auth?.user ? (
                                    <>
                                        <li><Link href="/dashboard"  className="hover:text-white transition-colors">Trang cá nhân</Link></li>
                                        <li><Link href="/favorites"  className="hover:text-white transition-colors">Địa điểm đã lưu</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link href="/login"    className="hover:text-white transition-colors">Đăng nhập</Link></li>
                                        <li><Link href="/register" className="hover:text-white transition-colors">Đăng ký miễn phí</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                        <p>© 2026 KhamPhaDD. Bảo lưu mọi quyền.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
                            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
                        </div>
                    </div>
                </div>
            </footer>

            <Chatbot />
        </div>
    );
}
