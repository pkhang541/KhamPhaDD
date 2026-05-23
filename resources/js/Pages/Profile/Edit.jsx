import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Camera, Check, Copy, User } from 'lucide-react';

export default function Edit({ reviewsCount = 0, favoritesCount = 0, tripsCount = 0 }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [copied, setCopied] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const form = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
    });

    const avatarForm = useForm({
        avatar: null,
    });

    const copyUid = async () => {
        if (!user.uid) return;
        await navigator.clipboard.writeText(user.uid);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const submit = (event) => {
        event.preventDefault();
        form.patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target.result);
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('avatar', file);
        router.post(route('profile.avatar'), formData, {
            preserveScroll: true,
            onSuccess: () => setAvatarPreview(null),
        });
    };

    const avatarUrl = user.avatar ? `/storage/${user.avatar}` : null;
    const displayAvatar = avatarPreview || avatarUrl;

    return (
        <AppLayout>
            <Head title="Hồ sơ cá nhân" />

            <div className="bg-[#FBFBFB] pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-[#003d9b]">Tài khoản</p>
                        <h1 className="text-3xl font-black text-[#1A1A1A] mt-1">Hồ sơ của bạn</h1>
                        <p className="text-sm text-gray-500 mt-2">Quản lý thông tin cá nhân và mã mời bạn bè.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sidebar - Avatar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 flex flex-col items-center">
                                {/* Avatar */}
                                <div className="relative group mb-4">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-[#003d9b] to-[#0052cc]">
                                        {displayAvatar ? (
                                            <img
                                                src={displayAvatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#003d9b] hover:bg-[#002a6e] text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer"
                                        title="Đổi ảnh đại diện"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                <h2 className="text-lg font-black text-[#1A1A1A] truncate max-w-full">{user.name}</h2>
                                <p className="text-sm text-gray-500 truncate max-w-full mt-1">{user.email}</p>
                                <p className="text-xs text-gray-400 mt-3 text-center">Bấm vào biểu tượng máy ảnh để đổi ảnh đại diện</p>
                                <p className="text-[10px] text-gray-300 mt-1">JPG, PNG hoặc WebP • Tối đa 2MB</p>

                                {/* Statistics */}
                                <div className="w-full border-t border-[#F5F5F5] mt-6 pt-6 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Chuyến đi đã tạo</span>
                                        <span className="font-bold text-[#1A1A1A]">{tripsCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Đã yêu thích</span>
                                        <span className="font-bold text-[#1A1A1A]">{favoritesCount} địa điểm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            {/* UID Card */}
                            <div className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#F5F5F5]">
                                    <h2 className="font-bold text-sm text-[#1A1A1A]">Mã mời bạn bè</h2>
                                </div>
                                <div className="p-6">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">UID của bạn</label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                                            <span className="font-mono text-lg font-black tracking-wider text-[#003d9b]">{user.uid || 'Chưa có UID'}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={copyUid}
                                            disabled={!user.uid}
                                            className="px-5 py-3 rounded-xl bg-[#003d9b] text-white text-sm font-bold hover:bg-[#002a6e] transition-colors disabled:opacity-50 flex items-center gap-2 justify-center"
                                        >
                                            {copied ? <><Check className="w-4 h-4" /> Đã copy</> : <><Copy className="w-4 h-4" /> Copy UID</>}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">Bạn bè có thể dùng UID này hoặc email để mời bạn vào chuyến đi.</p>
                                </div>
                            </div>

                            {/* Profile Info Form */}
                            <form onSubmit={submit} className="bg-white border border-[#E5E1DA] rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-[#F5F5F5]">
                                    <h2 className="font-bold text-sm text-[#1A1A1A]">Thông tin cá nhân</h2>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Họ và tên</label>
                                        <input
                                            type="text"
                                            value={form.data.name}
                                            onChange={(event) => form.setData('name', event.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#003d9b] focus:ring-[#003d9b]/10"
                                        />
                                        {form.errors.name && <p className="text-xs text-red-500 mt-1">{form.errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            value={form.data.email}
                                            onChange={(event) => form.setData('email', event.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#003d9b] focus:ring-[#003d9b]/10"
                                        />
                                        {form.errors.email && <p className="text-xs text-red-500 mt-1">{form.errors.email}</p>}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="px-5 py-3 rounded-xl bg-[#003d9b] text-white text-sm font-bold hover:bg-[#002a6e] transition-colors disabled:opacity-50"
                                        >
                                            {form.processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                        {form.recentlySuccessful && <span className="text-sm font-semibold text-emerald-600">Đã lưu ✓</span>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
