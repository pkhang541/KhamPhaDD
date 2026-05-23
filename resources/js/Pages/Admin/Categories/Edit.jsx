import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        icon: category.icon || '🏷️',
        description: category.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout>
            <Head title={`Chỉnh Sửa Danh Mục - ${category.name}`} />

            <div className="mb-12">
                <Link href={route('admin.categories.index')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#003d9b] flex items-center gap-2 mb-6 transition-colors">
                    ← Quay lại danh sách
                </Link>
                <h1 className="text-4xl font-black font-serif text-[#0f172a] tracking-tight">Chỉnh sửa danh mục.</h1>
                <p className="text-slate-400 text-sm mt-2">{category.name}</p>
            </div>

            <div className="max-w-xl bg-white rounded-[2rem] border border-slate-200 p-12 shadow-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên danh mục</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="VD: Cà phê, Ăn uống, Khách sạn..."
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold placeholder-slate-400 focus:outline-none focus:border-[#003d9b] focus:bg-white transition-all text-sm"
                        />
                        {errors.name && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Biểu tượng (Icon hoặc Emoji)</label>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={e => setData('icon', e.target.value)}
                            placeholder="VD: ☕, 🍔, 🏨..."
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold focus:outline-none focus:border-[#003d9b] focus:bg-white transition-all text-sm"
                        />
                        {errors.icon && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.icon}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mô tả danh mục</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Mô tả ngắn gọn về danh mục phân loại này..."
                            rows="4"
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold placeholder-slate-400 focus:outline-none focus:border-[#003d9b] focus:bg-white transition-all text-sm resize-none"
                        />
                        {errors.description && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.description}</p>}
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Link
                            href={route('admin.categories.index')}
                            className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#003d9b] text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#002a6e] transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
