import AppLayout from '@/Layouts/AppLayout';
import PlaceCard from '@/Components/PlaceCard';
import { Head, Link } from '@inertiajs/react';

export default function Index({ category, places }) {
    return (
        <AppLayout>
            <Head title={`${category.name} – KhamPhaDD`} />

            {/* HEADER */}
            <section className="bg-white pt-28 pb-8 border-b border-[#E5E1DA]">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <span className="text-6xl block mb-4">{category.icon}</span>
                    <h1 className="text-4xl md:text-5xl font-black font-serif text-[#1A1A1A] tracking-tight mb-4">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-gray-500 max-w-2xl mx-auto">{category.description}</p>
                    )}
                </div>
            </section>

            {/* KẾT QUẢ GRID 4 CỘT */}
            <section className="bg-[#FBFBFB] py-12 min-h-[60vh]">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-sm font-bold text-gray-500">
                            Có {places?.total ?? 0} địa điểm trong danh mục này
                        </p>
                        <Link 
                            href={route('places.search')} 
                            className="text-sm font-bold text-[#1B3022] hover:underline"
                        >
                            Tìm kiếm nâng cao →
                        </Link>
                    </div>

                    {(places?.data ?? []).length === 0 ? (
                        <div className="bg-white rounded-3xl p-20 text-center border border-[#E5E1DA] max-w-2xl mx-auto mt-12">
                            <span className="text-6xl block mb-6">🏜️</span>
                            <h3 className="text-2xl font-black font-serif text-[#1A1A1A] mb-3">Chưa có địa điểm nào</h3>
                            <p className="text-gray-500 mb-8">Hiện tại chưa có địa điểm nào thuộc danh mục này.</p>
                            <Link href={route('home')} className="bg-[#1B3022] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1A1A1A] transition-colors">
                                Về trang chủ
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                {(places?.data ?? []).map(place => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {(places?.links ?? []).length > 3 && (
                                <div className="mt-16 flex justify-center gap-2 flex-wrap">
                                    {places.links.filter(link => link.url).map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${link.active ? 'bg-[#1B3022] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </AppLayout>
    );
}
