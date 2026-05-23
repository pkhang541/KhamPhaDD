import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            image="https://images.unsplash.com/photo-1509060464153-44667396260f?w=1200&q=80"
            title="Chào mừng quay lại"
            description="Tiếp tục khám phá những địa điểm thú vị và chia sẻ hành trình trải nghiệm của riêng bạn cùng KhamPhaDD."
        >
            <Head title="Đăng nhập tài khoản" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#003d9b] tracking-tight mb-2">Đăng nhập tài khoản</h1>
                <p className="text-sm text-gray-500 font-medium">Đăng nhập để tiếp tục trải nghiệm và lưu giữ hành trình.</p>
            </div>

            {status && <div className="mb-6 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
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

                {/* Password */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className="text-xs font-bold text-gray-600">Mật khẩu</label>
                        <Link href={route('password.request')} className="text-xs font-semibold text-[#003d9b] hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-200 focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] rounded-xl px-4 py-3 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 outline-none"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <div className="text-xs font-bold text-rose-500">{errors.password}</div>}
                </div>

                {/* Remember Me */}
                <div className="flex items-center py-1">
                    <input
                        id="remember"
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="rounded border-gray-300 text-[#003d9b] shadow-sm focus:ring-[#003d9b]"
                    />
                    <label htmlFor="remember" className="ml-2.5 text-xs text-gray-500 font-medium select-none">
                        Ghi nhớ đăng nhập
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#003d9b] hover:bg-[#002d72] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm active:scale-95 duration-150"
                    >
                        {processing ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-gray-400 font-medium">Hoặc đăng nhập bằng</span>
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
                                    console.error('Lỗi đăng nhập Google', error);
                                    alert('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
                                }
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            shape="rectangular"
                            size="large"
                            text="signin_with"
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
                                    console.error('Lỗi đăng nhập Facebook', error);
                                    const errorMsg = error.response?.data?.message || error.message;
                                    alert('Đăng nhập bằng Facebook thất bại: ' + errorMsg);
                                }
                            }}
                            onFail={(error) => {
                                console.log('Login Failed!', error);
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
                        Chưa có tài khoản?
                        <Link href={route('register')} className="text-[#003d9b] font-bold hover:underline ml-1">Đăng ký ngay</Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
