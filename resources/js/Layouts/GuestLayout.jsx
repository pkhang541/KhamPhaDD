import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, image, title, description }) {
    const defaultImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";
    const bgImage = image || defaultImage;

    return (
        <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-between font-sans">
            <div className="flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
                <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-gray-100/50">
                    
                    {/* Left Column - Image & Branding */}
                    <div className="relative w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 text-white bg-gray-900 overflow-hidden min-h-[300px] md:min-h-auto">
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: `url('${bgImage}')` }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent" />
                        
                        {/* Logo */}
                        <div className="relative z-10">
                            <Link href="/" className="inline-flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-white text-[#003d9b] rounded-lg flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform">K</div>
                                <span className="font-black text-lg tracking-tight text-white group-hover:text-white/90">
                                    KhamPhaDD
                                </span>
                            </Link>
                        </div>
                        
                        {/* Slogan / Slogan Text */}
                        <div className="relative z-10 mt-auto">
                            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3 leading-tight drop-shadow-sm">
                                {title || "Bắt đầu hành trình mới"}
                            </h2>
                            <p className="text-sm text-white/90 font-medium leading-relaxed drop-shadow-sm max-w-md">
                                {description || "Khám phá những điểm đến tuyệt vời nhất và lên kế hoạch cho chuyến đi mơ ước của bạn cùng KhamPhaDD."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                        {children}
                    </div>

                </div>
            </div>

            {/* Bottom Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-gray-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#003d9b] tracking-tight">KhamPhaDD</span>
                    <span>&copy; 2026 KhamPhaDD. Bảo lưu mọi quyền.</span>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-[#003d9b] transition-colors">About Us</a>
                    <a href="#" className="hover:text-[#003d9b] transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-[#003d9b] transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-[#003d9b] transition-colors">Help Center</a>
                    <a href="#" className="hover:text-[#003d9b] transition-colors">Contact</a>
                </div>
            </footer>
        </div>
    );
}
