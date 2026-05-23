import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SAMPLE_IMAGES = [
    { name: 'Cà phê', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80' },
    { name: 'Học tập', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
    { name: 'Mua sắm', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
    { name: 'Tham quan', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
    { name: 'Ẩm thực', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
];

function MapEvents({ onChange }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
        },
    });

    return null;
}

function ChangeMapView({ center }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);

    return null;
}

export default function Create({ categories, cities = [] }) {
    const defaultLat = 10.254;
    const defaultLng = 105.961;
    const fileInputRef = useRef(null);

    const [imagesList, setImagesList] = useState([]);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [inputUrl, setInputUrl] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_ids: categories[0]?.id ? [categories[0].id] : [],
        city_id: cities[0]?.id || '',
        address: '',
        latitude: defaultLat,
        longitude: defaultLng,
        avg_rating: 0,
        description: '',
        image: '',
        image_file: null,
        gallery: [],
        gallery_files: [],
    });

    useEffect(() => {
        const firstError = Object.keys(errors)[0];
        if (!firstError) return;

        const baseError = firstError.split('.')[0];
        const aliases = {
            gallery: 'image',
            gallery_files: 'image',
            image_file: 'image',
        };
        const targetField = aliases[baseError] || baseError;

        window.setTimeout(() => {
            const target = document.querySelector(`[data-error-field="${targetField}"]`);
            if (!target) return;

            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.querySelector('input, select, textarea, button')?.focus({ preventScroll: true });
        }, 80);
    }, [errors]);

    useEffect(() => {
        const mainImage = imagesList.find(img => img.isMain);
        const otherImages = imagesList.filter(img => !img.isMain);

        setData(prev => ({
            ...prev,
            image: mainImage ? (mainImage.type === 'url' ? mainImage.url : '') : '',
            image_file: mainImage ? (mainImage.type === 'file' ? mainImage.file : null) : null,
            gallery: otherImages.filter(img => img.type === 'url').map(img => img.url),
            gallery_files: otherImages.filter(img => img.type === 'file').map(img => img.file),
        }));

        if (imagesList.length > 0 && !imagesList.some(img => img.id === selectedImageId)) {
            setSelectedImageId(imagesList[0].id);
        } else if (imagesList.length === 0) {
            setSelectedImageId(null);
        }
    }, [imagesList]);

    const addImageFile = (file) => {
        const newImg = {
            id: Date.now() + Math.random(),
            type: 'file',
            file,
            preview: URL.createObjectURL(file),
            isMain: imagesList.length === 0,
        };

        setImagesList(prev => [...prev, newImg]);
        setSelectedImageId(newImg.id);
    };

    const addImageUrl = (url) => {
        if (!url) return;

        const newImg = {
            id: Date.now() + Math.random(),
            type: 'url',
            url,
            isMain: imagesList.length === 0,
        };

        setImagesList(prev => [...prev, newImg]);
        setSelectedImageId(newImg.id);
        setInputUrl('');
    };

    const removeImage = (id) => {
        setImagesList(prev => {
            const updated = prev.filter(img => img.id !== id);
            if (prev.find(img => img.id === id)?.isMain && updated.length > 0) {
                updated[0].isMain = true;
            }
            return updated;
        });
    };

    const setMainImage = (id) => {
        setImagesList(prev => prev.map(img => ({
            ...img,
            isMain: img.id === id,
        })));
    };

    const handleMapClick = async (lat, lng) => {
        setData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
        }));

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
                headers: { 'Accept-Language': 'vi' },
            });
            const result = await res.json();

            if (!result?.display_name) return;

            setData(prev => {
                const next = { ...prev, address: result.display_name };
                const address = result.address || {};
                const fields = [address.city, address.state, address.town, address.village, address.county].filter(Boolean);

                for (const name of fields) {
                    const normalizedAddress = name.toLowerCase().replace(/^(thành phố|tỉnh|huyện|quận)\s+/i, '').trim();

                    for (const city of cities) {
                        const normalizedCityName = city.name.toLowerCase().replace(/^(thành phố|tỉnh|huyện|quận)\s+/i, '').trim();
                        if (normalizedAddress.includes(normalizedCityName) || normalizedCityName.includes(normalizedAddress)) {
                            next.city_id = city.id;
                            break;
                        }
                    }

                    if (next.city_id !== prev.city_id) break;
                }

                return next;
            });
        } catch (error) {
            console.error('Error fetching reverse geocoding:', error);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleImageFileChange = (event) => {
        const file = event.target.files[0];
        if (file) addImageFile(file);
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.places.store'));
    };

    const latVal = parseFloat(data.latitude) || defaultLat;
    const lngVal = parseFloat(data.longitude) || defaultLng;

    return (
        <AdminLayout>
            <Head title="Thêm Địa Điểm Mới — Admin" />

            <div className="mb-12">
                <Link href={route('admin.places.index')} className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-[#003d9b]">
                    ← Quay lại danh sách
                </Link>
                <h1 className="font-serif text-4xl font-black tracking-tight text-[#0f172a]">Thêm địa điểm.</h1>
                <p className="mt-1.5 text-xs text-slate-400">Đóng góp một địa điểm khám phá thú vị mới vào bản đồ cộng đồng.</p>
            </div>

            <div className="w-full max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm xl:p-10">
                <form onSubmit={submit} className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-3" data-error-field="name">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Tên địa điểm</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="VD: Tiệm Cà Phê Gió Trầm"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold text-[#0f172a] placeholder-slate-400 transition-all focus:border-[#003d9b] focus:bg-white focus:outline-none"
                            />
                            {errors.name && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="city_id">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Thành phố / Tỉnh thành</label>
                            <select
                                value={data.city_id}
                                onChange={e => setData('city_id', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold text-[#0f172a] transition-all focus:border-[#003d9b] focus:bg-white focus:outline-none"
                            >
                                <option value="" disabled>-- Chọn Thành Phố / Tỉnh --</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                            {errors.city_id && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.city_id}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="category_ids">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh mục phân loại (Chọn nhiều)</label>
                            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                                {categories.map(cat => {
                                    const checked = data.category_ids.includes(cat.id);

                                    return (
                                        <button
                                            type="button"
                                            key={cat.id}
                                            onClick={() => {
                                                setData('category_ids', checked
                                                    ? data.category_ids.filter(id => id !== cat.id)
                                                    : [...data.category_ids, cat.id]
                                                );
                                            }}
                                            className={`flex min-h-[58px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-black transition-all ${
                                                checked
                                                    ? 'border-[#003d9b] bg-[#003d9b]/5 text-[#003d9b] shadow-sm ring-4 ring-[#003d9b]/10'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-[#003d9b]/40 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${
                                                checked ? 'bg-[#003d9b] text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {cat.icon}
                                            </span>
                                            <span className="leading-tight">{cat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.category_ids && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.category_ids}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="avg_rating">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Số sao đánh giá</label>
                            <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                                <div className="flex flex-wrap gap-2">
                                    {[0, 1, 2, 3, 4, 5].map(star => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setData('avg_rating', star)}
                                            className={`rounded-xl border px-3 py-2 text-sm font-black transition-all ${
                                                Number(data.avg_rating) === star
                                                    ? 'border-amber-300 bg-amber-50 text-amber-600 shadow-sm'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200 hover:text-amber-500'
                                            }`}
                                        >
                                            {star === 0 ? 'Chưa có sao' : `${star} ★`}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={data.avg_rating}
                                        onChange={e => setData('avg_rating', e.target.value)}
                                        className="w-28 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#0f172a] focus:border-[#003d9b] focus:outline-none"
                                    />
                                    <span className="text-xs font-semibold text-slate-400">Có thể nhập 4.5, 3.8...</span>
                                </div>
                            </div>
                            {errors.avg_rating && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.avg_rating}</p>}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/30 p-6">
                        <div className="space-y-2" data-error-field="address">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Địa chỉ chi tiết</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">📍</span>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="Tìm kiếm địa chỉ hoặc kéo ghim trên bản đồ"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-5 text-sm font-semibold text-[#0f172a] placeholder-slate-400 transition-all focus:border-[#003d9b] focus:outline-none"
                                />
                            </div>
                            {errors.address && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.address}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn vị trí trên bản đồ</label>
                            <div className="relative z-0 h-64 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
                                <MapContainer center={[latVal, lngVal]} zoom={13} className="h-full w-full">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[latVal, lngVal]} />
                                    <MapEvents onChange={handleMapClick} />
                                    <ChangeMapView center={[latVal, lngVal]} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2" data-error-field="latitude">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Vĩ độ (Latitude)</label>
                                <input
                                    type="number"
                                    step="any"
                                    min="-90"
                                    max="90"
                                    value={data.latitude}
                                    onChange={e => setData('latitude', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-[#0f172a] transition-all focus:border-[#003d9b] focus:outline-none"
                                />
                                {errors.latitude && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.latitude}</p>}
                            </div>
                            <div className="space-y-2" data-error-field="longitude">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Kinh độ (Longitude)</label>
                                <input
                                    type="number"
                                    step="any"
                                    min="-180"
                                    max="180"
                                    value={data.longitude}
                                    onChange={e => setData('longitude', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-[#0f172a] transition-all focus:border-[#003d9b] focus:outline-none"
                                />
                                {errors.longitude && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.longitude}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6" data-error-field="image">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-[#0f172a]">Quản lý hình ảnh ({imagesList.length})</h3>
                            <p className="mt-0.5 text-[11px] text-slate-400">Ảnh đầu tiên hoặc ảnh được chọn sẽ làm ảnh đại diện chính.</p>
                        </div>

                        <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
                            {selectedImageId ? (() => {
                                const selectedImg = imagesList.find(img => img.id === selectedImageId);
                                if (!selectedImg) return null;
                                const previewUrl = selectedImg.type === 'file' ? selectedImg.preview : selectedImg.url;

                                return (
                                    <>
                                        <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6">
                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white ${selectedImg.isMain ? 'bg-blue-600' : 'bg-slate-700/80'}`}>
                                                    {selectedImg.isMain ? '★ Ảnh đại diện' : 'Ảnh phụ'}
                                                </span>
                                                <div className="flex gap-2">
                                                    {!selectedImg.isMain && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setMainImage(selectedImg.id)}
                                                            className="rounded-xl bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-800 shadow-sm transition-all hover:bg-white"
                                                        >
                                                            Chọn làm ảnh đại diện
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(selectedImg.id)}
                                                        className="rounded-xl bg-red-600/90 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition-all hover:bg-red-600"
                                                    >
                                                        Xóa ảnh này
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })() : (
                                <div className="p-8 text-center">
                                    <p className="text-xs font-bold text-slate-500">Chưa có ảnh nào được chọn</p>
                                    <p className="mt-1 text-[10px] text-slate-400">Chọn nhanh ảnh mẫu hoặc tải ảnh lên bên dưới để bắt đầu</p>
                                </div>
                            )}
                        </div>

                        {imagesList.length > 0 && (
                            <div className="space-y-2">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Danh sách ảnh ({imagesList.length})</label>
                                <div className="flex flex-wrap gap-3">
                                    {imagesList.map(img => {
                                        const previewUrl = img.type === 'file' ? img.preview : img.url;
                                        const isSelected = img.id === selectedImageId;

                                        return (
                                            <button
                                                type="button"
                                                key={img.id}
                                                onClick={() => setSelectedImageId(img.id)}
                                                className={`relative h-20 w-24 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                                                    isSelected ? 'scale-95 border-blue-600 shadow-md ring-4 ring-blue-500/20' : 'border-slate-200 hover:border-slate-400'
                                                }`}
                                            >
                                                <img src={previewUrl} className="h-full w-full object-cover" alt="Thumb" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 border-t border-slate-100 pt-2 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Tải ảnh lên từ thiết bị</label>
                                <button
                                    type="button"
                                    onClick={triggerFileSelect}
                                    className="flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center transition-all hover:bg-slate-50"
                                >
                                    <p className="text-xs font-bold text-slate-700">Thêm ảnh từ thiết bị</p>
                                    <p className="mt-1 text-[9px] text-slate-400">Hỗ trợ JPG, PNG, WEBP</p>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Thêm bằng URL hình ảnh</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputUrl}
                                            onChange={e => setInputUrl(e.target.value)}
                                            placeholder="VD: https://images.unsplash.com/photo-..."
                                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#003d9b] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => addImageUrl(inputUrl)}
                                            className="shrink-0 rounded-xl bg-[#003d9b] px-4 text-xs font-bold text-white transition-all hover:bg-[#002a6c]"
                                        >
                                            + Thêm
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn nhanh ảnh mẫu</span>
                                    <div className="grid grid-cols-5 gap-2">
                                        {SAMPLE_IMAGES.map((img, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => addImageUrl(img.url)}
                                                className="group relative h-12 overflow-hidden rounded-lg border border-slate-200 transition-all hover:border-slate-400"
                                            >
                                                <img src={img.url} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2" data-error-field="description">
                        <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Mô tả chi tiết</label>
                        <textarea
                            rows="6"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Mô tả không gian, bầu không khí, thời điểm ghé thăm lý tưởng..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold leading-relaxed text-[#0f172a] placeholder-slate-400 transition-all focus:border-[#003d9b] focus:bg-white focus:outline-none"
                        />
                        {errors.description && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-rose-500">{errors.description}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-6 border-t border-slate-100 pt-4 xl:col-span-2">
                        <Link href={route('admin.places.index')} className="text-sm font-bold text-slate-500 transition-colors hover:text-slate-700">
                            Lưu bản nháp
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#003d9b] px-8 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-md transition-all hover:bg-[#002a6e] disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {processing ? 'Đang gửi...' : 'Đăng địa điểm'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
