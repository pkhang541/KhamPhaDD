import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const verificationLinkSent = status === 'verification-link-sent';

    return (
        <GuestLayout
            title="Xác minh Email"
            description="Vui lòng xác minh địa chỉ email của bạn để kích hoạt đầy đủ tài khoản."
        >
            <Head title="Xác minh Email" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold font-serif text-[#003d9b] tracking-tight mb-2">Xác minh Email</h1>
                <p className="text-sm text-gray-500 font-medium">
                    Cảm ơn bạn đã đăng ký! Trước khi bắt đầu, vui lòng kiểm tra hộp thư đến và nhấp vào liên kết xác minh chúng tôi vừa gửi cho bạn. Nếu bạn không nhận được email, chúng tôi sẽ sẵn lòng gửi lại.
                </p>
            </div>

            {verificationLinkSent && (
                <div className="mb-6 font-medium text-sm text-green-600">
                    Một liên kết xác minh mới đã được gửi đến địa chỉ email bạn cung cấp khi đăng ký.
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#003d9b] hover:bg-[#002d72] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm"
                >
                    Gửi lại email xác minh
                </button>

                <div className="flex items-center justify-between pt-2">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors"
                    >
                        Đăng xuất
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
