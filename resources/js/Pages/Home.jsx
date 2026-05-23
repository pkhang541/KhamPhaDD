import AppLayout from '@/Layouts/AppLayout';
import PlaceCard from '@/Components/PlaceCard';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { 
    Search, MapPin, Building2, Grid, Star, ArrowRight,
    Utensils, Coffee, Compass, Trees, Gamepad2, ShoppingBag, 
    Moon, Dumbbell, BookOpen, Hotel, Church
} from 'lucide-react';

const getCategoryIcon = (name) => {
    const key = name?.toLowerCase().trim() || '';
    if (key.includes('học')) return BookOpen;
    if (key.includes('cà phê') || key.includes('cafe')) return Coffee;
    if (key.includes('ăn vặt')) return Utensils;
    if (key.includes('ăn uống') || key.includes('nhà hàng') || key.includes('ăn chay') || key.includes('ẩm thực') || key.includes('ăn')) return Utensils;
    if (key.includes('mua sắm') || key.includes('siêu thị') || key.includes('sieu thi') || key.includes('chợ')) return ShoppingBag;
    if (key.includes('đêm') || key.includes('bar') || key.includes('club')) return Moon;
    if (key.includes('tham quan') || key.includes('du lịch') || key.includes('check-in')) return Compass;
    if (key.includes('nghỉ dưỡng') || key.includes('khách sạn') || key.includes('resort') || key.includes('homestay')) return Hotel;
    if (key.includes('sinh thái') || key.includes('thiên nhiên') || key.includes('vườn') || key.includes('công viên')) return Trees;
    if (key.includes('tôn giáo') || key.includes('chùa') || key.includes('nhà thờ') || key.includes('tâm linh')) return Church;
    return Compass;
};

export default function Home({ featuredPlaces = [], recentPlaces = [], categories = [], cities = [] }) {
    const [search, setSearch] = useState('');
    const [cityId, setCityId] = useState('');
    const [catId, setCatId] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSug, setShowSug] = useState(false);
    const sugRef = useRef(null);
    const debounce = useRef(null);

    useEffect(() => {
        clearTimeout(debounce.current);
        if (search.length < 2) { setSuggestions([]); return; }
        debounce.current = setTimeout(async () => {
            try {
                const res = await fetch(`/places/autocomplete?q=${encodeURIComponent(search)}`);
                setSuggestions(await res.json());
                setShowSug(true);
            } catch { setSuggestions([]); }
        }, 280);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (cityId) params.set('city_id', cityId);
        if (catId) params.set('category_id', catId);
        router.get(`/search?${params.toString()}`);
    };

    const allFeatured = [...(featuredPlaces || []), ...(recentPlaces || [])].slice(0, 8);

    return (
        <AppLayout>
            <Head title="KhamPhaDD – Khám phá địa điểm thú vị">
                <meta name="description" content="Hệ thống khám phá chuyên nghiệp giúp bạn tìm kiếm, lập kế hoạch và tận hưởng những trải nghiệm tuyệt vời nhất." />
            </Head>

            {/* ── Hero ── */}
            <section className="relative w-full h-[620px] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/40 to-gray-950/20 backdrop-blur-[1px]" />
                
                <div className="relative z-10 max-w-[1200px] w-full px-6 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-5 tracking-tight font-bold drop-shadow-sm leading-[1.15] max-w-4xl animate-fade-up">
                        Khám phá địa điểm thú vị cùng KhamPhaDD
                    </h1>
                    <p className="text-base md:text-lg text-white/90 mb-10 max-w-2xl drop-shadow-sm font-medium">
                        Hệ thống khám phá chuyên nghiệp giúp bạn tìm kiếm, lập kế hoạch và tận hưởng những trải nghiệm tuyệt vời nhất.
                    </p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch}
                        className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-2 border border-white/20 flex flex-col md:flex-row items-stretch gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Địa điểm */}
                        <div className="flex-1 flex items-center px-4 py-3 relative group">
                            <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-[#003d9b] mr-3 transition-colors shrink-0" />
                            <div className="flex flex-col w-full text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Địa điểm</label>
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onFocus={() => suggestions.length > 0 && setShowSug(true)}
                                    onBlur={() => setTimeout(() => setShowSug(false), 150)}
                                    placeholder="Bạn muốn đi đâu?"
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-800 placeholder-gray-400 outline-none font-medium"
                                />
                            </div>
                            {showSug && suggestions.length > 0 && (
                                <div ref={sugRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto">
                                    {suggestions.map(s => (
                                        <button key={s.id} type="button"
                                            onMouseDown={() => { setSearch(s.name); setShowSug(false); }}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm border-b border-gray-50 last:border-0">
                                            <MapPin className="text-[#003d9b] w-4 h-4 shrink-0" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{s.name}</p>
                                                <p className="text-xs text-gray-400">{s.city?.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thành phố */}
                        <div className="flex-1 flex items-center px-4 py-3 group">
                            <Building2 className="w-5 h-5 text-gray-400 group-focus-within:text-[#003d9b] mr-3 transition-colors shrink-0" />
                            <div className="flex flex-col w-full text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Tỉnh / Thành</label>
                                <select value={cityId} onChange={e => setCityId(e.target.value)}
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-800 outline-none appearance-none cursor-pointer font-medium pr-6">
                                    <option value="">Tất cả tỉnh thành</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Danh mục */}
                        <div className="flex-1 flex items-center px-4 py-3 group">
                            <Grid className="w-5 h-5 text-gray-400 group-focus-within:text-[#003d9b] mr-3 transition-colors shrink-0" />
                            <div className="flex flex-col w-full text-left">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Danh mục</label>
                                <select value={catId} onChange={e => setCatId(e.target.value)}
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-800 outline-none appearance-none cursor-pointer font-medium pr-6">
                                    <option value="">Tất cả trải nghiệm</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="px-3 py-2 flex items-center shrink-0">
                            <button type="submit"
                                className="w-full md:w-auto bg-gradient-to-r from-[#003d9b] to-[#0052cc] hover:from-[#002d72] hover:to-[#003d9b] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 duration-150">
                                <Search className="w-4 h-4" />
                                Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-14">
                <h2 className="text-center text-[10px] font-extrabold uppercase tracking-[0.3em] text-gray-400 mb-8">
                    Khám phá theo danh mục
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 justify-center">
                    {categories.slice(0, 7).map(cat => {
                        const IconComponent = getCategoryIcon(cat.name);
                        return (
                            <Link key={cat.id} href={`/search?category_id=${cat.id}`}
                                className="flex flex-col items-center group cursor-pointer p-4 rounded-2xl bg-white border border-gray-100/80 shadow-sm hover:shadow-md hover:border-[#003d9b]/25 hover:scale-[1.03] transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#003d9b]/5 group-hover:text-[#003d9b] transition-all duration-300 mb-3">
                                    <IconComponent className="w-5 h-5 stroke-[1.5]" />
                                </div>
                                <span className="text-xs text-gray-600 font-semibold group-hover:text-gray-900 transition-colors text-center leading-tight">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ── Featured Places ── */}
            <section className="bg-[#f8f9fb] py-16 border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif tracking-tight">Địa điểm nổi bật</h2>
                            <p className="text-gray-500 mt-1.5 text-sm font-medium">Những điểm đến được đánh giá cao nhất bởi cộng đồng.</p>
                        </div>
                        <a href="/search" className="text-sm font-bold text-[#003d9b] hover:text-[#0052cc] transition-colors flex items-center gap-1 group">
                            Xem tất cả 
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>

                    {allFeatured.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {allFeatured.map(p => <PlaceCard key={p.id} place={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-gray-400">
                            <Compass className="w-12 h-12 mx-auto mb-4 stroke-[1.25] text-gray-300" />
                            <p className="font-semibold text-gray-500">Chưa có địa điểm nào. Hãy thêm dữ liệu!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-16 mb-6">
                <div className="bg-gradient-to-br from-[#002d72] via-[#003d9b] to-[#0052cc] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
                    <div className="p-10 md:p-16 relative z-10 flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">Ghi lại hành trình của bạn</h2>
                        <p className="text-base md:text-lg text-white/80 mb-8 max-w-lg mx-auto md:mx-0 font-medium">
                            Lưu trữ những kỷ niệm, chia sẻ đánh giá và quản lý danh sách điểm đến yêu thích của bạn một cách dễ dàng.
                        </p>
                        <a href="/trips"
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#003d9b] font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] duration-150 text-sm">
                            Bắt đầu ngay
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    {/* Decorative mockup */}
                    <div className="hidden md:flex flex-1 justify-center p-10 relative z-10">
                        <div className="w-56 h-72 bg-white/10 rounded-2xl shadow-2xl rotate-3 transform border border-white/20 p-4 flex flex-col gap-3 backdrop-blur-sm">
                            <div className="w-full h-28 bg-white/20 rounded-xl" />
                            <div className="w-3/4 h-3 bg-white/30 rounded" />
                            <div className="w-1/2 h-3 bg-white/20 rounded" />
                            <div className="mt-auto w-full h-9 bg-white/25 rounded-lg flex items-center justify-center text-[10px] text-white/95 font-bold uppercase tracking-wider">
                                Journeys
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
