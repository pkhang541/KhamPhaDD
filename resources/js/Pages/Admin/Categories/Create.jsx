import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

const ICON_PRESETS = ['🏷️', '☕', '🍽️', '🏨', '🛍️', '🌿', '📍', '🏛️', '🎡', '🚌', '🌊', '⛰️'];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        icon: '🏷️',
        description: '',
    });

    useEffect(() => {
        const firstError = Object.keys(errors)[0];
        if (!firstError) return;

        window.setTimeout(() => {
            const target = document.querySelector(`[data-error-field="${firstError}"]`);
            if (!target) return;

            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.querySelector('input, textarea, button')?.focus({ preventScroll: true });
        }, 80);
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout>
            <Head title="Thêm Danh Mục Mới — Admin" />

            <div className="mb-12">
                <Link href={route('admin.categories.index')} className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-[#003d9b]">
                    ← Quay lại danh sách
                </Link>
                <h1 className="font-serif text-4xl font-black tracking-tight text-[#0f172a]">Thêm danh mục.</h1>
                <p className="mt-1.5 text-xs text-slate-400">Tạo nhóm phân loại mới để địa điểm dễ tìm và dễ quản lý hơn.</p>
            </div>

            <div className="w-full max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm xl:p-10">
                <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-6">
                        <div className="space-y-2" data-error-field="name">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Tên danh mục</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="VD: Cà phê, Ăn uống, Khách sạn..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold text-[#0f172a] placeholder-slate-400 transition-all focus:border-[#003d9b] focus:bg-white focus:outline-none"
                            />
                            {errors.name && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-3" data-error-field="icon">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Biểu tượng</label>
                            <div className="flex items-center gap-3">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-2xl">
                                    {data.icon || '🏷️'}
                                </div>
                                <input
                                    type="text"
                                    value={data.icon}
                                    onChange={e => setData('icon', e.target.value)}
                                    placeholder="VD: ☕, 🍽️, 🏨..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold text-[#0f172a] placeholder-slate-400 transition-all focus:border-[#003d9b] focus:bg-white focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
                                {ICON_PRESETS.map(icon => (
                                    <button
                                        type="button"
                                        key={icon}
                                        onClick={() => setData('icon', icon)}
                                        className={`flex h-11 items-center justify-center rounded-xl border text-lg transition-all ${
                                            data.icon === icon
                                                ? 'border-[#003d9b] bg-[#003d9b]/5 shadow-sm ring-4 ring-[#003d9b]/10'
                                                : 'border-slate-200 bg-white hover:border-[#003d9b]/40 hover:bg-slate-50'
                                        }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            {errors.icon && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.icon}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="description">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả danh mục</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Mô tả ngắn gọn về nhóm địa điểm này..."
                                rows="7"
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold leading-relaxed text-[#0f172a] placeholder-slate-400 transition-all focus:border-[#003d9b] focus:bg-white focus:outline-none"
                            />
                            {errors.description && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.description}</p>}
                        </div>
                    </div>

                    <aside className="space-y-5 rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Xem trước</p>
                            <h2 className="mt-1 font-serif text-2xl font-black text-[#0f172a]">Thẻ danh mục</h2>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#003d9b]/5 text-3xl text-[#003d9b] ring-1 ring-[#003d9b]/10">
                                    {data.icon || '🏷️'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#003d9b]">Danh mục mới</p>
                                    <h3 className="mt-1 break-words text-xl font-black text-[#0f172a]">
                                        {data.name || 'Tên danh mục'}
                                    </h3>
                                    <p className="mt-2 break-words text-sm font-medium leading-relaxed text-slate-500">
                                        {data.description || 'Mô tả sẽ hiển thị ở đây để bạn xem nhanh trước khi lưu.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#003d9b]">Gợi ý</h3>
                            <div className="mt-3 space-y-2 text-xs font-semibold leading-relaxed text-slate-600">
                                <p>Đặt tên ngắn, dễ hiểu để bộ lọc ở trang khám phá nhìn gọn hơn.</p>
                                <p>Chọn icon dễ nhận biết vì icon sẽ xuất hiện ở nhiều khu vực của website.</p>
                            </div>
                        </div>
                    </aside>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 lg:col-span-2">
                        <Link
                            href={route('admin.categories.index')}
                            className="rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 transition-colors hover:bg-slate-50"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-[#003d9b] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#002a6e] disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {processing ? 'Đang lưu...' : 'Lưu danh mục'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
