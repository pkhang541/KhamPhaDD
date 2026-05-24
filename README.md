# KhamPhaDD - Nền Tảng Khám Phá Địa Điểm & Lên Lịch Trình Thông Minh

**KhamPhaDD** là một ứng dụng web hiện đại giúp người dùng tìm kiếm, khám phá các địa điểm thú vị như quán cà phê học bài, điểm check-in, khu giải trí, ẩm thực và tự thiết kế lịch trình du lịch/trải nghiệm cá nhân một cách trực quan, đồng bộ.

---

## Tính Năng Nổi Bật

### 1. Khám Phá & Tìm Kiếm Thông Minh (Discovery & Search)

* **Trang chủ sinh động:** Hiển thị địa điểm nổi bật, địa điểm mới và danh mục được cá nhân hóa.
* **Tìm kiếm thông minh (Typeahead):** Tự động gợi ý từ khóa địa điểm và địa chỉ khi người dùng đang nhập (`/autocomplete`).
* **Bộ lọc đa chiều nâng cao:** Lọc theo tỉnh thành, danh mục, xếp hạng (rating), tiện ích (amenities) và sắp xếp theo độ phổ biến hoặc mới nhất.

### 2. Bản Đồ Tương Tác Trực Quan (Interactive Map)

* **Giao diện bản đồ full-screen:** Sử dụng Leaflet & React Leaflet tích hợp cụm điểm (`MarkerCluster`) giúp hiển thị hàng trăm địa điểm mượt mà.

### 3. Công Cụ Lên Lịch Trình Cá Nhân (Trip Builder)

* **Lên lịch trình chuyên nghiệp:** Gom nhóm các địa điểm đã chọn theo từng ngày (Ngày 1, Ngày 2...).
* **Kéo thả trực quan (Drag & Drop):** Thay đổi thứ tự ghé thăm hoặc chuyển địa điểm giữa các ngày nhờ `@dnd-kit`.
* **Mời thành viên:** Tìm kiếm bạn bè qua email/UID và thêm vào chuyến đi để cùng quản lý lịch trình.

### 4. Cộng Đồng & Tương Tác (Social Interaction)

* **Hệ thống đánh giá & review:** Đánh giá điểm số (1-5 sao) kèm bình luận. Hệ thống tự động tính lại điểm trung bình (`avg_rating`) của địa điểm bất đồng bộ qua Queue Job.
* **Hỏi & Đáp (Q&A):** Mục thảo luận, đặt câu hỏi trực tiếp tại mỗi địa điểm, hỗ trợ thích (like) câu hỏi.
* **Đăng nhập mạng xã hội:** Hỗ trợ đăng nhập nhanh bằng Google và Facebook.

### 5. Trang Quản Trị Toàn Diện (Admin Panel)

* **Quản lý địa điểm & danh mục:** CRUD danh mục, địa điểm, quản lý tọa độ bản đồ và phê duyệt đóng góp từ cộng đồng.

---

## Công Nghệ Sử Dụng (Tech Stack)

### Backend

* **Laravel 12.x** (yêu cầu PHP 8.2+)
* **Inertia.js Laravel Bridge** giúp kết nối Laravel và React mà không cần xây dựng API REST phức tạp.
* **Service - Repository Pattern** giúp tách biệt nghiệp vụ và thuận tiện khi viết test.
* **Cơ sở dữ liệu:** MySQL cho production và SQLite in-memory cho testing.

### Frontend

* **React 19.x** & **React DOM 19.x**
* **Inertia.js React Client**
* **Tailwind CSS v3** & **Vite v7**
* **React Leaflet v5** cho bản đồ
* **@dnd-kit** cho kéo thả lịch trình

---

## Hướng Dẫn Cài Đặt Môi Trường Phát Triển (Local Setup)

### 1. Tải mã nguồn

```bash
git clone https://github.com/pkhang541/KhamPhaDD.git
cd KhamPhaDD
```

### 2. Cài đặt thư viện backend & frontend

```bash
# Cài đặt thư viện PHP
composer install

# Cài đặt thư viện JavaScript
pnpm install
```

### 3. Cấu hình file môi trường `.env`

Sao chép file cấu hình ví dụ và cập nhật thông tin database:

```bash
cp .env.example .env
```

Mở file `.env` và điền thông tin kết nối MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=khamphadd
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Khởi tạo khóa bảo mật & dữ liệu mẫu

```bash
# Sinh khóa bảo mật
php artisan key:generate

# Tạo bảng và nạp dữ liệu mẫu vào database
php artisan migrate:fresh --seed

# Liên kết thư mục upload hình ảnh công cộng
php artisan storage:link
```

### 5. Chạy ứng dụng local

Mở 2 tab terminal riêng biệt và chạy đồng thời các lệnh sau:

**Terminal 1 - Backend Server**

```bash
php artisan serve
```

**Terminal 2 - Vite Frontend Compiler**

```bash
pnpm run dev
```

Truy cập ứng dụng tại: `http://localhost:8000`

---

## Tài Khoản Trải Nghiệm Thử (Demo Credentials)

Sau khi chạy lệnh `php artisan migrate:fresh --seed`, bạn có thể đăng nhập bằng các tài khoản mặc định sau:

**Tài khoản quản trị viên (Admin)**

* **Email:** `admin@saigonchill.com` hoặc email admin được cấu hình trong `DatabaseSeeder`
* **Mật khẩu:** `password`

**Tài khoản thành viên (User)**

* **Email:** `user@example.com`
* **Mật khẩu:** `password`

---

## Quy Trình Kiểm Thử (Testing Suite)

Dự án đi kèm bộ kiểm thử tự động bao gồm đăng ký, đăng nhập, quên mật khẩu, tìm kiếm địa điểm, viết đánh giá và mời thành viên lịch trình.

Chạy toàn bộ test suite:

```bash
php artisan test
```

---

## Kiểm Thử API Bằng Postman

Dự án đã tích hợp sẵn thư mục cấu hình và bộ sưu tập Postman hoàn chỉnh trong thư mục `postman/`:

* **Postman Collection:** `postman/KhamPhaDD.postman_collection.json` chứa hơn 30 API mẫu được chia thư mục từ Public, Auth, Interactions, Trip Builder, Discovery đến Admin.
* **Postman Environment:** `postman/KhamPhaDD_Local.postman_environment.json` định nghĩa sẵn các biến `base_url`, `api_url`, `xsrf_token`, slugs và ids.

### Các bước sử dụng

1. Mở Postman và chọn **Import**.
2. Kéo thả cả hai file JSON trong thư mục `postman/` vào Postman.
3. Chọn environment **KhamPhaDD Local**.
4. Với các API yêu cầu đăng nhập, chạy request đầu tiên trong thư mục **2. Authentication** là **Get CSRF Cookie & Login Page** để tự động lưu CSRF Token vào biến môi trường. Sau đó gọi **Register** hoặc **Login**.
5. Xem hướng dẫn chi tiết tại [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md).

---

## Hướng Dẫn Build Khi Deploy (Production Build)

Khi deploy lên server, hãy biên dịch tối ưu các tệp tĩnh của React/JavaScript:

```bash
pnpm run build
```

Đồng thời cấu hình `.env` sang `APP_ENV=production` và tắt debug bằng `APP_DEBUG=false` để đảm bảo hiệu năng và bảo mật.
