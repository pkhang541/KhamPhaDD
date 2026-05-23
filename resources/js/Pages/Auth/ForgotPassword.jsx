import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout
            title="Quên mật khẩu"
            description="Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục lại tài khoản một cách dễ dàng."
        >
            <Head title="Quên mật khẩu" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#003d9b] tracking-tight mb-2">Khôi phục mật khẩu</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu mới.
                </p>
            </div>

            {status && <div className="mb-6 font-medium text-sm text-green-600">{status}</div>}

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

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#003d9b] hover:bg-[#002d72] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                    Gửi liên kết khôi phục
                </button>

                <div className="text-center pt-2">
                    <Link href={route('login')} className="text-xs font-bold text-gray-500 hover:text-[#003d9b] transition-colors">
                        Quay lại trang Đăng nhập
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
