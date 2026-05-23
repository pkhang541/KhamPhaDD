# Hướng dẫn dùng Postman cho dự án KhamPhaDD

Ngày tạo: 21/05/2026

## 1. Chuẩn bị server

Chạy server Laravel:

```bash
php artisan serve
```

Mặc định base URL sẽ là:

```text
http://127.0.0.1:8000
```

Nếu cần chạy cả Vite/UI:

```bash
composer run dev
```

Nếu database chưa có dữ liệu:

```bash
php artisan migrate --seed
```

## 2. Tạo Postman Environment

Tạo environment tên `KhamPhaDD Local` với các biến:

| Variable | Initial value |
| --- | --- |
| `base_url` | `http://127.0.0.1:8000` |
| `api_url` | `{{base_url}}/api/v1` |
| `xsrf_token` | để trống |
| `place_slug` | slug của một địa điểm có trong database |
| `place_id` | id của một địa điểm có trong database |
| `category_id` | id của một category có trong database |
| `trip_id` | id chuyến đi sau khi tạo |
| `trip_place_id` | id địa điểm trong chuyến đi |

Header mặc định nên dùng cho API JSON:

| Header | Value |
| --- | --- |
| `Accept` | `application/json` |
| `Content-Type` | `application/json` |

## 3. API public test được ngay

Các route này không cần đăng nhập.

### Lấy danh sách địa điểm

```http
GET {{api_url}}/places
```

Query params có thể dùng:

| Key | Ví dụ | Ghi chú |
| --- | --- | --- |
| `search` | `coffee` | Tìm theo tên/địa chỉ. |
| `category_id` | `1` | Lọc theo category. |
| `sort` | `rating` | Tùy logic trong `PlaceRepository`. |
| `limit` | `10` | Số item mỗi trang nếu service hỗ trợ. |

Ví dụ:

```http
GET {{api_url}}/places?search=coffee&limit=10
```

### Lấy chi tiết địa điểm

```http
GET {{api_url}}/places/{{place_slug}}
```

Nếu slug không tồn tại sẽ trả `404`.

### Lấy danh sách categories

```http
GET {{api_url}}/categories
```

### Autocomplete web JSON

Route này nằm trong `routes/web.php` nhưng trả JSON và không cần đăng nhập:

```http
GET {{base_url}}/autocomplete?q=co
```

`q` phải có ít nhất 2 ký tự, nếu không sẽ trả mảng rỗng.

## 4. Route cần đăng nhập bằng web session

Dự án hiện dùng Laravel web session cho nhiều thao tác như favorite, review, trips, discovery map và admin. Trong Postman cần lấy cookie session và CSRF token trước.

### Bước 1: bật Cookie Jar

Postman thường tự lưu cookie theo domain. Sau khi gọi `GET /login`, kiểm tra tab `Cookies` của request, phải có:

- `XSRF-TOKEN`
- cookie session của Laravel, ví dụ `khamphadd_session`

### Bước 2: lấy CSRF token

Gọi:

```http
GET {{base_url}}/login
```

Sau đó thêm script này ở Collection hoặc request `Pre-request Script`:

```javascript
const xsrf = pm.cookies.get('XSRF-TOKEN');

if (xsrf) {
  pm.environment.set('xsrf_token', decodeURIComponent(xsrf));
}
```

### Bước 3: thêm headers cho request POST/PUT/PATCH/DELETE web

| Header | Value |
| --- | --- |
| `Accept` | `application/json` |
| `Content-Type` | `application/json` |
| `X-Requested-With` | `XMLHttpRequest` |
| `X-XSRF-TOKEN` | `{{xsrf_token}}` |

Nếu bị lỗi `419 Page Expired`, gọi lại `GET {{base_url}}/login`, kiểm tra cookie, rồi gửi lại request.

## 5. Đăng ký, đăng nhập, đăng xuất

### Đăng ký

```http
POST {{base_url}}/register
```

Body JSON:

```json
{
  "name": "Postman User",
  "email": "postman@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

Sau khi đăng ký thành công, Laravel sẽ đăng nhập luôn user đó và lưu cookie session trong Postman.

### Đăng nhập

```http
POST {{base_url}}/login
```

Body JSON:

```json
{
  "email": "postman@example.com",
  "password": "password"
}
```

Controller hiện redirect về trang chủ `/` sau khi login thành công.

### Đăng xuất

```http
POST {{base_url}}/logout
```

Cần gửi kèm CSRF header.

## 6. Test review, favorite và Q&A

Các route dưới đây cần đăng nhập.

### Tạo review bằng web route

```http
POST {{base_url}}/places/{{place_id}}/reviews
```

Body JSON:

```json
{
  "rating": 5,
  "comment": "Địa điểm đẹp, đáng trải nghiệm."
}
```

Validation:

- `rating`: bắt buộc, integer, từ 1 đến 5.
- `comment`: tùy chọn, tối đa 1000 ký tự.

Lưu ý: mỗi user chỉ review một lần cho một địa điểm.

### Toggle favorite

```http
POST {{base_url}}/places/{{place_id}}/favorite
```

Không cần body.

### Lấy danh sách favorite

```http
GET {{base_url}}/favorites
```

Route này trả Inertia response, không phải API JSON thuần.

### Tạo câu hỏi Q&A

```http
POST {{base_url}}/places/{{place_id}}/qa
```

Body JSON:

```json
{
  "content": "Địa điểm này có phù hợp đi buổi tối không?"
}
```

### Trả lời một câu hỏi

```http
POST {{base_url}}/places/{{place_id}}/qa
```

Body JSON:

```json
{
  "content": "Có, nhưng nên đặt trước nếu đi cuối tuần.",
  "parent_id": 1
}
```

### Like Q&A

```http
POST {{base_url}}/qa/1/like
```

Response là JSON dạng:

```json
{
  "likes": 2
}
```

### Xóa Q&A

```http
DELETE {{base_url}}/qa/1
```

Chỉ chủ sở hữu hoặc admin được xóa.

## 7. Test trip builder

Các route dưới đây cần đăng nhập.

### Lấy danh sách trips

```http
GET {{base_url}}/trips
```

Route này trả Inertia response.

### Tạo trip

```http
POST {{base_url}}/trips
```

Body JSON:

```json
{
  "title": "Lịch trình cuối tuần",
  "start_date": "2026-05-25",
  "end_date": "2026-05-26",
  "currency": "VND",
  "budget": 1500000,
  "members": 2,
  "return_time": "21:00",
  "is_public": false,
  "place_ids": [1, 2]
}
```

Hoặc tạo kèm lịch chi tiết:

```json
{
  "title": "Một ngày khám phá",
  "start_date": "2026-05-25",
  "end_date": "2026-05-25",
  "currency": "VND",
  "budget": 800000,
  "members": 2,
  "is_public": true,
  "trip_places": [
    {
      "place_id": 1,
      "day_number": 1,
      "order": 0,
      "visit_time": "09:00",
      "duration_minutes": 90,
      "note": "Đi buổi sáng"
    }
  ]
}
```

### Cập nhật trip

```http
PUT {{base_url}}/trips/{{trip_id}}
```

Body JSON:

```json
{
  "title": "Lịch trình đã chỉnh sửa",
  "status": "planned",
  "budget": 2000000
}
```

### Thêm địa điểm vào trip

```http
POST {{base_url}}/trips/{{trip_id}}/places
```

Body JSON:

```json
{
  "place_id": 3,
  "day_number": 1,
  "visit_time": "14:30",
  "duration_minutes": 60,
  "note": "Ghé sau bữa trưa"
}
```

### Cập nhật giờ ghé thăm

```http
PATCH {{base_url}}/trips/{{trip_id}}/places/{{trip_place_id}}/time
```

Body JSON:

```json
{
  "visit_time": "15:00",
  "duration_minutes": 75
}
```

### Sắp xếp lại địa điểm trong trip

```http
POST {{base_url}}/trips/{{trip_id}}/reorder
```

Body JSON:

```json
{
  "items": [
    {
      "id": 1,
      "day_number": 1,
      "order": 0
    },
    {
      "id": 2,
      "day_number": 1,
      "order": 1
    }
  ]
}
```

Route này trả JSON:

```json
{
  "ok": true
}
```

### Xóa địa điểm khỏi trip

```http
DELETE {{base_url}}/trips/{{trip_id}}/places/{{trip_place_id}}
```

### Xóa trip

```http
DELETE {{base_url}}/trips/{{trip_id}}
```

### Xóa nhiều trip

```http
POST {{base_url}}/trips/batch-delete
```

Body JSON:

```json
{
  "ids": [1, 2, 3]
}
```

## 8. Discovery map

Route này cần đăng nhập.

```http
POST {{base_url}}/map/discovery
```

Body JSON:

```json
{
  "name": "Quán mới từ Postman",
  "category_id": 1,
  "address": "Quận 1, TP.HCM",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "description": "Địa điểm test từ Postman."
}
```

Validation:

- `name`: bắt buộc, tối đa 255 ký tự.
- `category_id`: bắt buộc, phải tồn tại trong `categories`.
- `address`: bắt buộc.
- `latitude`: bắt buộc, từ `-90` đến `90`.
- `longitude`: bắt buộc, từ `-180` đến `180`.
- `description`: tùy chọn, tối đa 1000 ký tự.

## 9. Admin places

Các route này cần user có `role = admin`.

### Lấy danh sách địa điểm admin

```http
GET {{base_url}}/admin/places
```

### Tạo địa điểm

```http
POST {{base_url}}/admin/places
```

Body JSON:

```json
{
  "name": "Địa điểm admin test",
  "description": "Mô tả địa điểm test bằng Postman.",
  "address": "TP.HCM",
  "image": "https://example.com/image.jpg",
  "category_id": 1,
  "latitude": 10.7769,
  "longitude": 106.7009
}
```

### Cập nhật địa điểm

```http
PUT {{base_url}}/admin/places/{{place_id}}
```

Body giống tạo địa điểm.

### Xóa mềm địa điểm

```http
DELETE {{base_url}}/admin/places/{{place_id}}
```

### Khôi phục địa điểm

```http
PATCH {{base_url}}/admin/places/{{place_id}}/restore
```

## 10. API review protected hiện chưa dùng được ngay

Route API này có trong `routes/api.php`:

```http
POST {{api_url}}/places/{{place_slug}}/reviews
```

Nhưng route đang bọc middleware:

```php
auth:sanctum
```

Project hiện chưa khai báo package/config Laravel Sanctum trong `composer.json`. Vì vậy nếu test route này trong Postman bằng Bearer Token, nó sẽ chưa hoạt động đúng cho đến khi cài và cấu hình Sanctum.

Nếu muốn dùng API token thật, cần làm tiếp:

1. Cài `laravel/sanctum`.
2. Publish/migrate bảng token nếu cần.
3. Thêm `HasApiTokens` vào `User`.
4. Tạo endpoint login/token riêng.
5. Trong Postman dùng header:

```http
Authorization: Bearer <token>
```

Trong trạng thái hiện tại, nên test review bằng web route:

```http
POST {{base_url}}/places/{{place_id}}/reviews
```

## 11. Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| `419 Page Expired` | Thiếu/sai CSRF token hoặc cookie session | Gọi lại `GET /login`, kiểm tra cookie, set `X-XSRF-TOKEN`. |
| `401 Unauthorized` | Chưa đăng nhập hoặc session hết hạn | Login lại bằng `POST /login`. |
| `403 Forbidden` | User không có quyền, ví dụ không phải admin hoặc không sở hữu trip/Q&A | Dùng đúng user hoặc đổi role trong database. |
| `422 Unprocessable Entity` | Body không đúng validation | Kiểm tra field bắt buộc, kiểu dữ liệu, id có tồn tại. |
| `404 Not Found` | Sai slug/id hoặc route không tồn tại | Lấy lại slug/id từ API list hoặc database. |
| Nhận HTML/Inertia thay vì JSON | Đang gọi route web/Inertia | Đây là bình thường với route web. Muốn JSON thuần thì ưu tiên `/api/v1/...`. |

## 12. Thứ tự test đề xuất

1. `GET {{api_url}}/categories`
2. `GET {{api_url}}/places`
3. Copy một `slug` và gọi `GET {{api_url}}/places/{{place_slug}}`
4. `GET {{base_url}}/login` để lấy cookie + CSRF
5. `POST {{base_url}}/register` hoặc `POST {{base_url}}/login`
6. `POST {{base_url}}/places/{{place_id}}/favorite`
7. `POST {{base_url}}/places/{{place_id}}/reviews`
8. `POST {{base_url}}/trips`
9. `POST {{base_url}}/trips/{{trip_id}}/places`
10. `POST {{base_url}}/logout`
