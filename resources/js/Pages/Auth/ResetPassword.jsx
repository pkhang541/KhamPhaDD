import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <GuestLayout
            title="Đặt lại mật khẩu"
            description="Vui lòng thiết lập mật khẩu mới của bạn để bảo mật tài khoản."
        >
            <Head title="Đặt lại mật khẩu" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#003d9b] tracking-tight mb-2">Mật khẩu mới</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Thiết lập mật khẩu mạnh chứa ít nhất 8 ký tự bao gồm chữ và số.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-bold text-gray-600">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all outline-none"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-xs font-bold text-gray-600">Mật khẩu mới</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all outline-none"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="text-xs text-rose-500 font-medium mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="password_confirmation" className="text-xs font-bold text-gray-600">Nhập lại mật khẩu</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all outline-none"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    {errors.password_confirmation && (
                        <p className="text-xs text-rose-500 font-medium mt-1">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#003d9b] hover:bg-[#002d72] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                    Đặt lại mật khẩu
                </button>
            </form>
        </GuestLayout>
    );
}
