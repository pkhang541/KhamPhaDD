# Saigon Chill - Khám phá Sài Gòn theo cách của bạn

Sài Gòn Chill là nền tảng giúp bạn tìm kiếm những địa điểm thú vị tại TP.HCM, từ quán cà phê học bài yên tĩnh, góc check-in sống ảo đến những nơi thư giãn (chill) cuối tuần.

## 🚀 Tính năng chính

- **Khám phá địa điểm**: Xem danh sách các địa điểm nổi bật theo danh mục (Học bài, Check-in, Chill, Giải trí).
- **Tìm kiếm thông minh**: Tìm kiếm địa điểm theo tên hoặc địa chỉ.
- **Đánh giá & Review**: Người dùng có thể đánh giá (rating) và để lại bình luận.
- **Yêu thích**: Lưu lại những địa điểm bạn yêu thích.
- **Gợi ý thông minh**: Hệ thống gợi ý các địa điểm dựa trên độ phổ biến và đánh giá.
- **API v1**: Hỗ trợ lấy dữ liệu địa điểm, danh mục qua API.

## 🛠 Công nghệ sử dụng

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Blade, Tailwind CSS, Vite
- **Database**: MySQL / SQLite
- **Kiến trúc**: Service-Repository Pattern
- **Xác thực**: Laravel Breeze

## 📦 Hướng dẫn cài đặt

1. **Clone project**:
   ```bash
   git clone <repository-url>
   cd saigon-chill
   ```

2. **Cài đặt dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Cấu hình môi trường**:
   - Sao chép `.env.example` thành `.env`.
   - Cấu hình `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` trong file `.env`.

4. **Khởi tạo database và dữ liệu mẫu**:
   ```bash
   php artisan key:generate
   php artisan migrate:fresh --seed
   ```

5. **Chạy ứng dụng**:
   ```bash
   php artisan serve
   npm run dev
   ```

6. **Truy cập**:
   - Web: `http://localhost:8000`
   - API: `http://localhost:8000/api/v1/places`

## 👤 Tài khoản Demo

- **Admin**:
  - Email: `admin@saigonchill.com`
  - Password: `password`
- **User**:
  - Email: `user@example.com`
  - Password: `password`

## 🧪 Chạy Test

```bash
php artisan test
```
