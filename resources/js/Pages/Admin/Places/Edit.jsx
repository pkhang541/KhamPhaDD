import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix Leaflet marker icons
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
    }, [center]);
    return null;
}

const ALL_AMENITIES = [
    { key: 'wifi', label: 'WiFi' },
    { key: 'parking', label: 'Bãi đỗ xe' },
    { key: 'ac', label: 'Điều hòa' },
    { key: 'outdoor', label: 'Chỗ ngồi ngoài trời' },
    { key: 'music', label: 'Nhạc sống' },
    { key: 'pet_friendly', label: 'Cho phép thú cưng' },
    { key: 'power_outlet', label: 'Ổ cắm điện' },
    { key: 'private_room', label: 'Phòng riêng' },
    { key: 'vegetarian', label: 'Món chay' },
    { key: 'delivery', label: 'Giao hàng' },
    { key: 'reservation', label: 'Đặt chỗ trước' },
    { key: 'change_room', label: 'Phòng thay đồ' },
    { key: 'guide', label: 'Hướng dẫn viên' },
    { key: 'wheelchair', label: 'Lối đi xe lăn' },
    { key: 'photo_spot', label: 'Điểm chụp ảnh đẹp' },
    { key: 'souvenir', label: 'Quầy quà lưu niệm' },
];

function parseAmenities(raw) {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw) || []; } catch { return []; }
}

export default function Edit({ place, categories, cities = [] }) {
    const defaultLat = 10.254;
    const defaultLng = 105.961;
    const fileInputRef = useRef(null);

    const getInitialImagesList = () => {
        const list = [];
        if (place.image) {
            list.push({
                id: 'main_existing',
                type: 'url',
                url: place.image,
                isMain: true
            });
        }
        
        let existingGallery = [];
        if (place.gallery) {
            if (Array.isArray(place.gallery)) {
                existingGallery = place.gallery;
            } else {
                try {
                    existingGallery = JSON.parse(place.gallery) || [];
                } catch (e) {
                    existingGallery = [];
                }
            }
        }
        
        existingGallery.forEach((url, index) => {
            list.push({
                id: `gallery_existing_${index}`,
                type: 'url',
                url: url,
                isMain: false
            });
        });
        
        return list;
    };

    const [imagesList, setImagesList] = useState(getInitialImagesList());
    const [selectedImageId, setSelectedImageId] = useState(imagesList[0]?.id || null);
    const [inputUrl, setInputUrl] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: place.name || '',
        category_ids: Array.isArray(place.category_ids) 
            ? place.category_ids 
            : (place.category_id ? [place.category_id] : []),
        city_id: place.city_id || cities[0]?.id || '',
        address: place.address || '',
        latitude: place.latitude || defaultLat,
        longitude: place.longitude || defaultLng,
        avg_rating: place.avg_rating ?? 0,
        description: place.description || '',
        image: place.image || '',
        image_file: null,
        gallery: [],
        gallery_files: [],
        amenities: parseAmenities(place.amenities),
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
            gallery_files: otherImages.filter(img => img.type === 'file').map(img => img.file)
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
            file: file,
            preview: URL.createObjectURL(file),
            isMain: imagesList.length === 0
        };
        setImagesList(prev => [...prev, newImg]);
        setSelectedImageId(newImg.id);
    };

    const addImageUrl = (url) => {
        if (!url) return;
        const newImg = {
            id: Date.now() + Math.random(),
            type: 'url',
            url: url,
            isMain: imagesList.length === 0
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
            isMain: img.id === id
        })));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.places.update', place.id));
    };

    const toggleAmenity = (key) => {
        setData('amenities', data.amenities.includes(key)
            ? data.amenities.filter(item => item !== key)
            : [...data.amenities, key]
        );
    };

    const handleMapClick = async (lat, lng) => {
        setData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
                headers: {
                    'Accept-Language': 'vi'
                }
            });
            const dataResult = await res.json();
            if (dataResult && dataResult.display_name) {
                setData(prev => {
                    const next = { ...prev, address: dataResult.display_name };
                    
                    const addressObj = dataResult.address;
                    if (addressObj && cities && cities.length > 0) {
                        const fields = [
                            addressObj.city,
                            addressObj.state,
                            addressObj.town,
                            addressObj.village,
                            addressObj.county
                        ];
                        
                        for (const name of fields) {
                            if (!name) continue;
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
                    }
                    return next;
                });
            }
        } catch (error) {
            console.error('Error fetching reverse geocoding:', error);
        }
    };


    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            addImageFile(file);
        }
    };

    const latVal = parseFloat(data.latitude) || defaultLat;
    const lngVal = parseFloat(data.longitude) || defaultLng;

    return (
        <AdminLayout>
            <Head title={`Chỉnh Sửa Địa Điểm - ${place.name}`} />

            <div className="mb-12">
                <Link href={route('admin.places.index')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#003d9b] flex items-center gap-2 mb-6 transition-colors">
                    ← Quay lại danh sách
                </Link>
                <h1 className="text-4xl font-black font-serif text-[#0f172a] tracking-tight">Chỉnh sửa địa điểm.</h1>
                <p className="text-slate-400 text-sm mt-2">{place.name}</p>
            </div>

            <div className="w-full max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm xl:p-10">
                <form onSubmit={submit} className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <div className="space-y-6">
                        <div className="space-y-2" data-error-field="name">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên địa điểm</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="VD: Tiệm Cà Phê Gió Trầm"
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold placeholder-slate-400 focus:outline-none focus:border-[#003d9b] focus:bg-white transition-all text-sm"
                            />
                            {errors.name && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="city_id">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thành phố / Tỉnh thành</label>
                            <select
                                value={data.city_id}
                                onChange={e => setData('city_id', e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold focus:outline-none focus:border-[#003d9b] focus:bg-white transition-all text-sm"
                            >
                                <option value="" disabled>-- Chọn Thành Phố / Tỉnh --</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                            {errors.city_id && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.city_id}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="category_ids">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Danh mục phân loại (Chọn nhiều)</label>
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
                            {errors.category_ids && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.category_ids}</p>}
                        </div>

                        <div className="space-y-2" data-error-field="avg_rating">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Số sao đánh giá</label>
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
                            {errors.avg_rating && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.avg_rating}</p>}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/30 p-6">
                        <div className="space-y-2" data-error-field="address">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Địa chỉ chi tiết</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📍</span>
                                <input 
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="Tìm kiếm địa chỉ hoặc kéo ghim trên bản đồ"
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-5 py-3.5 text-[#0f172a] font-semibold placeholder-slate-400 focus:outline-none focus:border-[#003d9b] transition-all text-sm"
                                />
                            </div>
                            {errors.address && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.address}</p>}
                        </div>

                        {/* Interactive Selection Map */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chọn vị trí trên bản đồ (Click vào bản đồ để chọn nhanh)</label>
                            <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vĩ độ (Latitude)</label>
                                <input
                                    type="number"
                                    step="any"
                                    min="-90"
                                    max="90"
                                    value={data.latitude}
                                    onChange={e => setData('latitude', e.target.value)}
                                    placeholder="10.776900"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold focus:outline-none focus:border-[#003d9b] transition-all text-sm"
                                />
                                {errors.latitude && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.latitude}</p>}
                            </div>
                            <div className="space-y-2" data-error-field="longitude">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kinh độ (Longitude)</label>
                                <input
                                    type="number"
                                    step="any"
                                    min="-180"
                                    max="180"
                                    value={data.longitude}
                                    onChange={e => setData('longitude', e.target.value)}
                                    placeholder="106.700900"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold focus:outline-none focus:border-[#003d9b] transition-all text-sm"
                                />
                                {errors.longitude && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.longitude}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Quản lý hình ảnh nâng cao */}
                    <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6" data-error-field="image">
                        <div>
                            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">Quản lý hình ảnh ({imagesList.length})</h3>
                            <p className="text-slate-400 text-[11px] mt-0.5">Thêm nhiều hình ảnh cho địa điểm của bạn. Ảnh đầu tiên hoặc ảnh được tích chọn sẽ làm ảnh đại diện chính.</p>
                        </div>

                        {/* Vùng xem ảnh lớn (Chọn ảnh hiện to lên) */}
                        <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center group shadow-md">
                            {selectedImageId ? (() => {
                                const selectedImg = imagesList.find(img => img.id === selectedImageId);
                                if (!selectedImg) return null;
                                const previewUrl = selectedImg.type === 'file' ? selectedImg.preview : selectedImg.url;
                                return (
                                    <>
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${selectedImg.isMain ? 'bg-blue-600' : 'bg-slate-700/80'}`}>
                                                        {selectedImg.isMain ? '★ Ảnh đại diện' : 'Ảnh phụ (Thư viện)'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!selectedImg.isMain && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setMainImage(selectedImg.id)}
                                                            className="bg-white/95 hover:bg-white text-slate-800 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                                                        >
                                                            Chọn làm ảnh đại diện
                                                        </button>
                                                    )}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeImage(selectedImg.id)}
                                                        className="bg-red-600/90 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                                                    >
                                                        Xóa ảnh này
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })() : (
                                <div className="text-center p-8">
                                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs font-bold text-slate-500">Chưa có ảnh nào được chọn</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Chọn nhanh ảnh mẫu hoặc tải ảnh lên bên dưới để bắt đầu</p>
                                </div>
                            )}
                        </div>

                        {/* Danh sách ảnh thu nhỏ (Thumbnails) */}
                        {imagesList.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Danh sách ảnh ({imagesList.length}) — Click để xem to</label>
                                <div className="flex flex-wrap gap-3">
                                    {imagesList.map((img) => {
                                        const previewUrl = img.type === 'file' ? img.preview : img.url;
                                        const isSelected = img.id === selectedImageId;
                                        return (
                                            <div 
                                                key={img.id}
                                                onClick={() => setSelectedImageId(img.id)}
                                                className={`relative w-24 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                                    isSelected ? 'border-blue-600 ring-4 ring-blue-500/20 scale-95 shadow-md' : 'border-slate-200 hover:border-slate-400'
                                                }`}
                                            >
                                                <img src={previewUrl} className="w-full h-full object-cover" alt="Thumb" />
                                                {img.isMain && (
                                                    <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5 shadow">
                                                        <span className="text-[8px] px-1 font-black block">★</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Khu vực thêm ảnh mới */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                            {/* Cột Trái: Tải ảnh lên */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tải ảnh lên từ thiết bị</label>
                                <div 
                                    onClick={triggerFileSelect}
                                    className="border-2 border-dashed border-slate-200 bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-all group min-h-[140px]"
                                >
                                    <svg className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-xs font-bold text-slate-700">Thêm ảnh từ thiết bị</p>
                                    <p className="text-[9px] text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)</p>
                                </div>
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                {errors.image_file && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.image_file}</p>}
                                {errors.gallery_files && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.gallery_files}</p>}
                            </div>

                            {/* Cột Phải: Thêm bằng URL */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thêm bằng URL Hình Ảnh</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={inputUrl}
                                            onChange={e => setInputUrl(e.target.value)}
                                            placeholder="VD: https://images.unsplash.com/photo-..."
                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-[#003d9b] transition-all text-xs"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => addImageUrl(inputUrl)}
                                            className="bg-[#003d9b] hover:bg-[#002a6c] text-white text-xs font-bold px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center shrink-0"
                                        >
                                            + Thêm
                                        </button>
                                    </div>
                                    {errors.image && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.image}</p>}
                                </div>

                                {/* Chọn nhanh ảnh mẫu */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chọn nhanh ảnh mẫu</span>
                                    <div className="grid grid-cols-5 gap-2">
                                        {SAMPLE_IMAGES.map((img, idx) => (
                                            <button
                                                type="button"
                                                key={idx}
                                                onClick={() => addImageUrl(img.url)}
                                                className="group relative h-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-400 transition-all"
                                            >
                                                <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[7px] font-black text-white uppercase tracking-wider">{img.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2" data-error-field="description">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mô tả chi tiết</label>
                        <textarea 
                            rows="6"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Mô tả không gian, bầu không khí, thời điểm ghé thăm lý tưởng và các lời khuyên hữu ích khác cho mọi người..."
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-5 py-3.5 text-[#0f172a] font-semibold placeholder-slate-400 focus:outline-none focus:border-[#003d9b] focus:bg-white transition-all resize-none text-sm leading-relaxed"
                        ></textarea>
                        {errors.description && <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">{errors.description}</p>}
                    </div>

                    <div className="space-y-4 xl:col-span-2" data-error-field="amenities">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tiện ích đi kèm</label>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#003d9b]">
                                Đã chọn {data.amenities.length}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {ALL_AMENITIES.map(({ key, label }) => {
                                const checked = data.amenities.includes(key);

                                return (
                                    <button
                                        type="button"
                                        key={key}
                                        onClick={() => toggleAmenity(key)}
                                        className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                            checked
                                                ? 'border-[#003d9b] bg-[#003d9b]/5 text-[#003d9b] shadow-sm'
                                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                        }`}
                                    >
                                        <span>{checked ? '✓' : '+'}</span>
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-6 border-t border-slate-100 pt-4 xl:col-span-2">
                        <Link href={route('admin.places.index')} className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                            Lưu bản nháp
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="bg-[#003d9b] text-white px-8 py-3.5 rounded-xl text-sm font-black hover:bg-[#002a6e] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest"
                        >
                            {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
