# Tech stack audit - KhamPhaDD

Ngày kiểm tra: 21/05/2026  
Phạm vi: `composer.json`, `package.json`, cấu hình Vite/Tailwind/PostCSS, routes, controllers, services, models, Inertia pages, build và test hiện tại.

## 1. Tổng quan stack đang dùng

### Backend

| Nhóm | Công nghệ | Ghi nhận |
| --- | --- | --- |
| Ngôn ngữ | PHP 8.2.12 | `composer.json` yêu cầu `^8.2`. |
| Framework | Laravel 12.58.0 | App theo kiểu Laravel monolith. |
| Routing/UI bridge | Inertia Laravel 3.1.0 | Backend render Inertia pages cho phần lớn màn hình. |
| Auth scaffold | Laravel Breeze 2.4.1 | Đang dùng controller/test từ Breeze, nhưng một số route vẫn trỏ Blade view cũ. |
| Route helper JS | Tighten Ziggy 2.6.2 | Blade dùng `@routes`, frontend gọi global `route()`. |
| DB local | MySQL theo `.env` | `.env` đang dùng `DB_CONNECTION=mysql`, database `khamphadd`. |
| DB test | SQLite in-memory | `phpunit.xml` dùng `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`. |
| Queue/session/cache | Database driver | `.env` dùng `QUEUE_CONNECTION=database`, `SESSION_DRIVER=database`, `CACHE_STORE=database`. |
| API | Laravel API routes | Có `routes/api.php`, nhưng route protected đang dùng `auth:sanctum` trong khi project chưa khai báo package/config Sanctum. |
| Kiến trúc app | Controller + Service + Repository | Có `PlaceService`, `ReviewService`, `RecommendationService`, `PlaceRepositoryInterface`. |

### Frontend

| Nhóm | Công nghệ | Ghi nhận |
| --- | --- | --- |
| UI | React 19.2.6, React DOM 19.2.6 | Dùng Inertia React 3.1.1. |
| Bundler | Vite 7.3.2 + `laravel-vite-plugin` 2.1.0 | Entry chính là `resources/js/app.jsx`. |
| Styling | Tailwind CSS 3.4.19 | Dùng `tailwind.config.js` + `postcss.config.js`. |
| Form styling | `@tailwindcss/forms` | Đã được import trong `tailwind.config.js`. |
| Map | Leaflet 1.9.4, React Leaflet 5.0.0, React Leaflet Cluster 4.1.3 | Page map đang tách thành chunk riêng. |
| Icon | `lucide-react` | Đang dùng ở `Home.jsx`. |
| Utility class | `clsx`, `tailwind-merge` | Dùng trong `resources/js/lib/utils.js`. |
| HTTP bootstrap | Axios | Được import qua `resources/js/bootstrap.js`. |
| Font | Be Vietnam Pro, Playfair Display | Load qua Google Fonts trong `resources/views/app.blade.php`. |

## 2. Stack có nên tối ưu không?

### Nên giữ

- Laravel 12 + Inertia + React là lựa chọn phù hợp cho dự án kiểu CRUD/travel discovery vì giữ được tốc độ phát triển của Laravel nhưng vẫn có trải nghiệm SPA.
- Vite + code splitting hiện đang hoạt động. `npm run build` build thành công.
- React Leaflet hợp lý cho tính năng bản đồ. Chunk map đã được tách riêng, không dồn toàn bộ Leaflet vào các page khác.
- Service/Repository đang có ích ở phần địa điểm, đánh giá và recommendation vì logic không bị nhét hết vào controller.

### Nên tối ưu

| Ưu tiên | Vấn đề | Khuyến nghị |
| --- | --- | --- |
| Cao | Stack Tailwind đang bị lẫn Tailwind 3 và package Tailwind 4 | Project đang dùng Tailwind 3 qua PostCSS, nhưng có `@tailwindcss/vite` 4.x không được dùng. Nên chọn một hướng: giữ Tailwind 3 và gỡ `@tailwindcss/vite`, hoặc migrate hẳn sang Tailwind 4. |
| Cao | Breeze/Inertia chưa đồng nhất | Một số controller auth/profile vẫn `return view(...)` tới Blade view không tồn tại. Nên đổi sang `Inertia::render(...)` hoặc tạo lại các Blade view tương ứng. |
| Cao | API protected dùng `auth:sanctum` nhưng chưa có Sanctum | Nếu cần API token/mobile client thì cài và cấu hình Sanctum. Nếu không cần, bỏ route protected hoặc đổi middleware phù hợp. |
| Trung bình | `alpinejs` và `resources/js/app.js` còn sót từ Blade stack | App hiện chạy React/Inertia qua `app.jsx`. Nếu không dùng Alpine, nên gỡ dependency và file entry cũ. |
| Trung bình | Runtime dependency nằm trong `devDependencies` | `axios` đang được bundle runtime nhưng nằm ở `devDependencies`. Nên chuyển sang `dependencies` nếu còn dùng. |
| Trung bình | `ziggy-js` npm package chưa thấy import trực tiếp | Frontend đang dùng global `route()` từ `@routes`. Nếu không import `ziggy-js` ở JS, package npm này có thể dư; composer package `tightenco/ziggy` vẫn cần. |
| Trung bình | `leaflet.markercluster` khai báo trực tiếp dù chỉ dùng qua `react-leaflet-cluster` | Có thể bỏ dependency trực tiếp nếu wrapper đã kéo dependency này ổn định. Kiểm tra lại sau khi `npm install` và build. |
| Thấp | `laravel/sail` không thấy docker-compose/Sail workflow trong repo | Nếu không dùng Docker/Sail, có thể gỡ khỏi `require-dev` để nhẹ dev install. |
| Thấp | Cache/queue/session dùng database | Ổn cho local/demo. Nếu production có traffic lớn, cân nhắc Redis cho cache/queue/session. |

## 3. File hoặc dependency nghi dư/không được dùng

### Khả năng dư cao

| File/dependency | Lý do | Hướng xử lý |
| --- | --- | --- |
| `resources/js/app.js` | Không được Vite input nạp; Blade đang dùng `resources/js/app.jsx`. File này chỉ khởi động Alpine. | Xóa nếu không dùng Alpine. |
| `alpinejs` | Chỉ được import trong `resources/js/app.js`, mà file này không được nạp. | Gỡ khỏi `package.json` nếu không có kế hoạch dùng Alpine. |
| `@tailwindcss/vite` | Không được import trong `vite.config.js`; project vẫn dùng Tailwind 3 + PostCSS. | Gỡ nếu giữ Tailwind 3. |
| `resources/js/Pages/Trips/PlacePicker.jsx` | Không thấy controller `Inertia::render('Trips/PlacePicker')` và không thấy component nào import file này. Do nằm trong `Pages`, Vite vẫn sinh chunk. | Xóa hoặc chuyển thành component và import ở nơi dùng thật. |
| `app/View/Components/AppLayout.php` | Không thấy Blade `<x-app-layout>` hoặc view component tương ứng; layout thực tế là React `resources/js/Layouts/AppLayout.jsx`. | Xóa nếu không quay lại Blade layout. |
| `app/View/Components/GuestLayout.php` | Tương tự, layout thực tế là React `resources/js/Layouts/GuestLayout.jsx`. | Xóa nếu không quay lại Blade layout. |
| `.phpunit.result.cache` | File cache sinh bởi PHPUnit. | Không commit, có thể xóa khi cần sạch workspace. |
| `public/hot` | File marker sinh bởi Vite dev server. | Không commit, có thể xóa khi không chạy dev server. |

### Nghi dư hoặc đang là code cho tính năng chưa hoàn chỉnh

| File/dependency | Lý do | Hướng xử lý |
| --- | --- | --- |
| `database/migrations/2026_05_18_125258_create_bookings_table.php` | Không thấy `Booking` model, controller, route, service hoặc UI dùng bảng `bookings`. | Giữ nếu sắp làm booking; nếu không, tránh migrate hoặc xóa trước khi production. |
| `database/migrations/2026_05_18_125259_create_coupons_table.php` | Không thấy `Coupon` model, controller, route, service hoặc UI dùng bảng `coupons`. | Giữ nếu sắp làm coupon; nếu không, bỏ khỏi migration set. |
| `app/Policies/TripPolicy.php` | Không thấy `authorize()`/`can()`/`Gate` dùng policy cho Trip. | Dùng policy trong `TripController` hoặc xóa nếu không cần phân quyền riêng. |
| `app/Policies/ReviewPolicy.php` | Có đăng ký trong `AppServiceProvider`, nhưng route update/delete review chưa được khai báo và service đang tự check quyền. | Nếu muốn chuẩn Laravel, dùng `$this->authorize(...)`; nếu không thì policy đang thừa. |
| `database/database.sqlite` | `.env` hiện dùng MySQL, test dùng SQLite `:memory:`. File sqlite này có thể là dữ liệu local cũ. | Chỉ giữ nếu cần local sqlite fallback. |
| `merge_places.php` | Script một lần để merge dữ liệu, không nằm trong composer script hoặc seeder runtime. | Chuyển vào `scripts/` hoặc xóa sau khi đã sinh `places_raw.json`. |
| `database/data/places_part1.json`, `places_part2.json`, `places_part3.json` | Chỉ được `merge_places.php` đọc; seeder dùng `places_raw.json`. | Có thể archive nếu không cần tái merge dữ liệu. |
| `TECHNOLOGIES.md` | Nội dung bị lỗi mã hóa và có thông tin sai/lệch như Laravel 11, React 18, MySQL mặc định. | Thay bằng file audit này hoặc viết lại nội dung. |

### Dependency nên kiểm tra trước khi gỡ

| Dependency | Ghi nhận |
| --- | --- |
| `ziggy-js` | Không thấy import trực tiếp trong `resources/js`; global `route()` đến từ `@routes`. |
| `leaflet.markercluster` | Không import trực tiếp; đang dùng `react-leaflet-cluster`, package này có thể tự kéo markercluster. |
| `laravel/breeze` | Đang ở `require-dev`. Có thể giữ để tham chiếu scaffold/test, nhưng app runtime không phụ thuộc trực tiếp. |
| `laravel/sail` | Chỉ cần nếu dùng Sail/Docker. |

## 4. Rủi ro kỹ thuật phát hiện khi kiểm tra

- Các controller auth còn trả Blade view không tồn tại:
  - `auth.verify-email`
  - `auth.confirm-password`
  - `auth.forgot-password`
  - `auth.reset-password`
- `ProfileController@edit` trả `view('profile.edit')`, nhưng project không có Blade view này. Với stack hiện tại nên đổi sang Inertia page.
- Test auth login/register kỳ vọng redirect `/dashboard`, trong khi controller hiện redirect về route `home`.
- Route `/search` đang yêu cầu auth, nhưng test lại gọi guest và kỳ vọng 200.
- `User` có soft delete, nhưng test profile delete kỳ vọng user bị xóa vật lý.
- Duplicate review hiện trả flash `error`, trong khi test kỳ vọng validation error key `review`.
- API route `POST /api/v1/places/{slug}/reviews` dùng `auth:sanctum`, nhưng project chưa có Sanctum trong composer/config.

## 5. Kết quả lệnh kiểm tra

| Lệnh | Kết quả |
| --- | --- |
| `composer show --direct --no-ansi` | Xác nhận Laravel 12.58, Inertia Laravel 3.1, Ziggy 2.6, Breeze 2.4, PHPUnit 11.5. |
| `npm ls --depth=0` | Xác nhận React 19.2, Vite 7.3, Tailwind 3.4, React Leaflet 5. |
| `php artisan route:list --no-ansi` | 59 routes. |
| `npm run build` | Thành công, 2385 modules transformed. Chunk lớn nhất: `app` khoảng 357.89 kB, gzip 116.43 kB; `Map` khoảng 206.57 kB, gzip 59.27 kB. |
| `php artisan test --no-ansi` | 19 pass, 10 fail. Các fail chủ yếu do view Blade thiếu, redirect test lệch, middleware auth của `/search`, soft delete và duplicate review error format. |

## 6. Thứ tự xử lý đề xuất

1. Sửa đồng bộ Breeze/Profile theo Inertia: đổi các controller còn `return view(...)` sang Inertia page hoặc tạo view Blade thật.
2. Quyết định hướng Tailwind: giữ Tailwind 3 rồi gỡ `@tailwindcss/vite`, hoặc migrate hẳn Tailwind 4.
3. Gỡ phần Alpine cũ: `resources/js/app.js` và `alpinejs` nếu không dùng.
4. Kiểm tra và gỡ dependency nghi dư: `ziggy-js`, `leaflet.markercluster`, `laravel/sail` nếu không cần.
5. Dọn feature chưa hoàn chỉnh: bookings/coupons migration, `TripPolicy`, `ReviewPolicy` tùy roadmap.
6. Cập nhật test theo behavior mong muốn, rồi chạy lại `php artisan test`.
