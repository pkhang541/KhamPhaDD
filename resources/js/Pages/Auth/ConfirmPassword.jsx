import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <GuestLayout
            title="Xác nhận mật khẩu"
            description="Đây là khu vực bảo mật. Vui lòng xác nhận mật khẩu của bạn trước khi tiếp tục."
        >
            <Head title="Xác nhận mật khẩu" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#003d9b] tracking-tight mb-2">Xác nhận bảo mật</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Vui lòng nhập mật khẩu của bạn để xác thực quyền truy cập vào tính năng này.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1">
                    <label htmlFor="password" className="text-xs font-bold text-gray-600">Mật khẩu</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#003d9b]/20 focus:border-[#003d9b] transition-all outline-none animate-pulse-once"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="text-xs text-rose-500 font-medium mt-1">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#003d9b] hover:bg-[#002d72] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                    Xác nhận
                </button>
            </form>
        </GuestLayout>
    );
}
