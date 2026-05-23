import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { assetUrl } from '@/lib/assets';

export default function PlaceCard({ place }) {
    if (!place) return null;
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;
    const [fav, setFav] = useState(!!place.is_favorited);

    useEffect(() => {
        setFav(!!place.is_favorited);
    }, [place.is_favorited]);

    const targetUrl = isLoggedIn ? `/places/${place.slug}` : '/login';

    const img = assetUrl(place.image, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=75');
    const rating = place.avg_rating || place.rating || 0;

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFav(v => !v);
        router.post(route('places.favorite', place.id), {}, {
            preserveScroll: true,
            onError: () => {
                setFav(!!place.is_favorited);
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col group border border-gray-100 hover:border-[#003d9b]/25 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 shadow-sm relative">
            <Link href={targetUrl} className="block w-full">
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={img} alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                    {/* Category badge - top-left */}
                    {place.category?.name && (
                        <div className="absolute top-3 left-3 bg-black/35 backdrop-blur-sm text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                            {place.category.name}
                        </div>
                    )}

                    {/* Rating badge - bottom-3 left-3 */}
                    {rating > 0 && (
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                            <span className="text-amber-400 text-xs">★</span>
                            <span className="text-xs font-black text-gray-800">{Number(rating).toFixed(1)}</span>
                        </div>
                    )}

                    {/* Favorite button - top-right */}
                    <button 
                        onClick={handleFavorite}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 ${fav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                        <svg 
                            className={`w-4 h-4 transition-colors ${fav ? 'text-[#003d9b] fill-[#003d9b]' : 'text-gray-400 hover:text-[#003d9b]'}`}
                            fill={fav ? 'currentColor' : 'none'}
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </Link>

            {/* Info */}
            <div className="p-4 flex flex-col flex-grow">
                <Link href={targetUrl}>
                    <h3 className="font-bold text-[14px] leading-snug text-gray-900 mb-1.5 line-clamp-1 hover:text-[#003d9b] transition-colors">
                        {place.name}
                    </h3>
                </Link>
                <div className="flex items-center text-gray-400 mb-2 gap-1 text-[11px]">
                    <span>📍</span>
                    <span className="truncate">{place.city?.name || place.address?.split(',').pop()?.trim()}</span>
                </div>
                {place.description && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed flex-grow mb-4">{place.description}</p>
                )}
                
                {/* Bottom Buttons */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.dispatchEvent(new Event('open-chatbot'));
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#003d9b] py-2 text-[11px] font-bold text-white transition-all hover:bg-[#002f78] shadow-sm active:scale-95"
                    >
                        <span>🤖</span> Hỏi AI
                    </button>
                    <Link 
                        href={targetUrl}
                        className="flex-1 flex items-center justify-center rounded-lg border border-gray-200 bg-white py-2 text-[11px] font-bold text-[#003d9b] transition-all hover:bg-slate-50 hover:border-[#003d9b]/25 active:scale-95 text-center"
                    >
                        Chi tiết
                    </Link>
                </div>
            </div>
        </div>
    );
}
