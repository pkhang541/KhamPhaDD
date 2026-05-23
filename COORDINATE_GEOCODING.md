# Hướng dẫn sửa tọa độ địa điểm

Ngày tạo: 21/05/2026

## 1. Cách tự động lấy tọa độ miễn phí

Dự án đã có command:

```bash
php artisan places:geocode
```

Command này dùng Nominatim/OpenStreetMap miễn phí để tìm tọa độ cho các địa điểm:

- thiếu `latitude` hoặc `longitude`
- có tọa độ `0`
- có tọa độ nằm ngoài khung Việt Nam

Mặc định command xử lý tối đa 25 địa điểm mỗi lần.

## 2. Chạy thử trước, không ghi database

Nên chạy thử trước:

```bash
php artisan places:geocode --dry-run --limit=10
```

Nếu kết quả ổn, chạy thật:

```bash
php artisan places:geocode --limit=10
```

Nên chạy theo batch nhỏ để kiểm tra chất lượng tọa độ.

## 3. Sửa một vài địa điểm cụ thể

Chạy theo danh sách ID:

```bash
php artisan places:geocode --ids=15,16,17 --dry-run
```

Nếu ổn:

```bash
php artisan places:geocode --ids=15,16,17
```

## 4. Ép geocode lại cả địa điểm đã có tọa độ

Dùng khi nghi tọa độ hiện tại sai:

```bash
php artisan places:geocode --force --limit=20 --dry-run
```

Nếu thấy đúng:

```bash
php artisan places:geocode --force --limit=20
```

## 5. Vì sao có quán không tìm được?

Nominatim miễn phí nhưng dữ liệu quán ở Việt Nam không đầy đủ như Google Maps. Một số quán sẽ không tìm được dù tên và địa chỉ đúng.

Với các quán không tìm được, cách đúng nhất là sửa thủ công trong admin:

```text
/admin/places/{id}/edit
```

Trang admin đã có thêm ô:

- `Latitude`
- `Longitude`

Bạn có thể lấy tọa độ thủ công bằng cách mở Google Maps/OpenStreetMap, click vào vị trí quán và copy tọa độ.

## 6. Cách lấy tọa độ thủ công miễn phí

Trên Google Maps:

1. Tìm tên quán.
2. Click phải vào đúng vị trí marker.
3. Copy cặp số tọa độ, ví dụ:

```text
10.776900, 106.700900
```

4. Dán vào admin:

```text
Latitude: 10.776900
Longitude: 106.700900
```

Trên OpenStreetMap:

1. Tìm địa điểm hoặc kéo bản đồ tới đúng vị trí.
2. Click chuột phải.
3. Chọn tùy chọn hiển thị địa chỉ/tọa độ.
4. Copy latitude/longitude.

## 7. Dữ liệu seed

`GooglePlacesSeeder` đã được cập nhật để tự đọc tọa độ nếu file nguồn sau này có một trong các field:

- `latitude`, `longitude`
- `lat`, `lng`
- `location.lat`, `location.lng`
- `coordinates.latitude`, `coordinates.longitude`
- `gpsCoordinates.latitude`, `gpsCoordinates.longitude`

Seeder cũng có thể parse tọa độ từ Google Maps URL nếu URL có dạng chứa `@lat,lng`, `query=lat,lng` hoặc `!3dlat!4dlng`.

## 8. Lưu ý quan trọng

- Không nên hard-code tọa độ theo `id` trong migration, vì seed lại database có thể đổi ID.
- Không nên chạy `--force` toàn bộ database một lần nếu chưa kiểm tra dry-run.
- Nên sửa thủ công các quán quan trọng hoặc các quán Nominatim không tìm được.
- Tọa độ hợp lệ cho Việt Nam thường nằm trong khoảng:
  - latitude: khoảng `8` đến `24`
  - longitude: khoảng `102` đến `110`
