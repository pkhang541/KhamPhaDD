import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [agree, setAgree] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!agree) {
            alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
            return;
        }
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            image="https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=1200&q=80"
            title="Bắt đầu hành trình mới"
            description="Khám phá những điểm đến tuyệt vời nhất và lên kế hoạch cho chuyến đi mơ ước của bạn cùng KhamPhaDD."
        >
            <Head title="Đăng ký tài khoản" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#003d9b] tracking-tight mb-2">Đăng ký tài khoản</h1>
                <p className="text-sm text-gray-500 font-medium">Tham gia cộng đồng du lịch thông minh ngay hôm nay.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Họ tên */}
                <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-bold text-gray-600">Họ tên</label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-white border border-gray-200 focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] rounded-xl px-4 py-3 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 outline-none"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <div className="text-xs font-bold text-rose-500">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-bold text-gray-600">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="email@example.com"
                        className="w-full bg-white border border-gray-200 focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] rounded-xl px-4 py-3 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 outline-none"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <div className="text-xs font-bold text-rose-500">{errors.email}</div>}
                </div>

                {/* Password Grid (Confirm password side by side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mật khẩu */}
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-xs font-bold text-gray-600">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="••••••••"
                            className="w-full bg-white border border-gray-200 focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] rounded-xl px-4 py-3 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 outline-none"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <div className="text-xs font-bold text-rose-500">{errors.password}</div>}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="space-y-1">
                        <label htmlFor="password_confirmation" className="text-xs font-bold text-gray-600">Xác nhận mật khẩu</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="••••••••"
                            className="w-full bg-white border border-gray-200 focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] rounded-xl px-4 py-3 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 outline-none"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        {errors.password_confirmation && <div className="text-xs font-bold text-rose-500">{errors.password_confirmation}</div>}
                    </div>
                </div>

                {/* Điều khoản */}
                <div className="flex items-start py-1">
                    <input
                        id="agree"
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-[#003d9b] shadow-sm focus:ring-[#003d9b]"
                    />
                    <label htmlFor="agree" className="ml-2.5 text-[11px] text-gray-500 leading-normal font-medium select-none">
                        Tôi đồng ý với các <a href="#" className="text-[#003d9b] font-semibold hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-[#003d9b] font-semibold hover:underline">Chính sách bảo mật</a> của KhamPhaDD.
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#003d9b] hover:bg-[#002d72] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 duration-150"
                    >
                        {processing ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-gray-400 font-medium">Hoặc đăng ký bằng</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-center overflow-hidden rounded-xl">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const { data } = await axios.post(route('auth.google'), {
                                        credential: credentialResponse.credential
                                    });
                                    if (data.redirect) {
                                        window.location.href = data.redirect;
                                    }
                                } catch (error) {
                                    console.error('Lỗi đăng ký Google', error);
                                    alert('Đăng ký bằng Google thất bại. Vui lòng thử lại.');
                                }
                            }}
                            onError={() => {
                                console.log('Registration Failed');
                            }}
                            shape="rectangular"
                            size="large"
                            text="signup_with"
                        />
                    </div>
                    <div className="flex items-center justify-center overflow-hidden rounded-xl">
                        <FacebookLogin
                            appId="855242993689609"
                            onSuccess={async (response) => {
                                try {
                                    const { data } = await axios.post(route('auth.facebook.token'), {
                                        access_token: response.accessToken
                                    });
                                    if (data.redirect) {
                                        window.location.href = data.redirect;
                                    }
                                } catch (error) {
                                    console.error('Lỗi đăng ký Facebook', error);
                                    const errorMsg = error.response?.data?.message || error.message;
                                    alert('Đăng ký bằng Facebook thất bại: ' + errorMsg);
                                }
                            }}
                            onFail={(error) => {
                                console.log('Registration Failed!', error);
                            }}
                            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700 shadow-sm"
                            children={
                                <>
                                    <svg className="w-4 h-4 mr-2 shrink-0 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </>
                            }
                        />
                    </div>
                </div>

                {/* Footer Switch Link */}
                <div className="text-center pt-4">
                    <p className="text-xs font-medium text-gray-400">
                        Đã có tài khoản?
                        <Link href={route('login')} className="text-[#003d9b] font-bold hover:underline ml-1">Đăng nhập ngay</Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
