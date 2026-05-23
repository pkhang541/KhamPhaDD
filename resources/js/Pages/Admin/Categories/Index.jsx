import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const destroy = (id, name) => {
        if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Quản Lý Danh Mục — Admin" />

            <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black font-serif text-[#0f172a] tracking-tight">Quản lý danh mục.</h1>
                    <p className="text-slate-400 text-xs mt-1.5">Quản lý phân loại các địa điểm check-in và dịch vụ du lịch.</p>
                </div>
                <Link
                    href={route('admin.categories.create')}
                    className="bg-[#003d9b] text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#002a6e] transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 duration-150 flex items-center gap-2"
                >
                    ➕ Thêm danh mục mới
                </Link>
            </div>

            {/* Places Grid/Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50/75 border-b border-slate-200/60">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Số địa điểm</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-16 text-slate-400 text-sm font-semibold">
                                        Chưa có danh mục nào được khởi tạo.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr 
                                        key={cat.id} 
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                                                    {cat.icon || '🏷️'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-[#0f172a]">{cat.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <code className="text-xs font-mono bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                                                {cat.slug}
                                            </code>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs text-slate-500 max-w-xs truncate" title={cat.description}>
                                                {cat.description || 'Không có mô tả.'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {cat.places_count} địa điểm
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2 whitespace-nowrap">
                                            <Link
                                                href={route('admin.categories.edit', cat.id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-[#003d9b] hover:text-white hover:border-[#003d9b] transition-all shadow-sm active:scale-95 duration-150"
                                                title="Sửa"
                                            >
                                                ✏️
                                            </Link>
                                            <button
                                                onClick={() => destroy(cat.id, cat.name)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95 duration-150"
                                                title="Xóa"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
