# 🗺️ KhamPhaDD - Nền Tảng Khám Phá Địa Điểm & Lên Lịch Trình Thông Minh

**KhamPhaDD** là một ứng dụng Web hiện đại giúp người dùng tìm kiếm, khám phá các địa điểm thú vị (quán cà phê học bài, điểm check-in sống ảo, khu giải trí, ẩm thực) và tự thiết kế lịch trình du lịch/trải nghiệm cá nhân một cách trực quan và đồng bộ nhất.

---

## 🚀 Tính Năng Nổi Bật

### 1. Khám Phá & Tìm Kiếm Thông Minh (Discovery & Search)
*   **Trang chủ sinh động:** Hiển thị địa điểm nổi bật, địa điểm mới và danh mục được cá nhân hóa.
*   **Tìm kiếm thông minh (Typeahead):** Tự động gợi ý từ khóa địa điểm và địa chỉ khi người dùng đang nhập (`/autocomplete`).
*   **Bộ lọc đa chiều nâng cao:** Lọc theo tỉnh thành, danh mục, xếp hạng (rating), tiện ích (amenities) và sắp xếp theo độ phổ biến hoặc mới nhất.

### 2. Bản Đồ Tương Tác Trực Quan (Interactive Map)
*   **Giao diện bản đồ full-screen:** Sử dụng Leaflet & React Leaflet tích hợp cụm điểm (`MarkerCluster`) giúp hiển thị hàng trăm địa điểm mượt mà.
*   **Đóng góp địa điểm (Discovery flow):** Cho phép người dùng đóng góp các địa điểm mới trực tiếp trên bản đồ kèm theo tải lên nhiều hình ảnh (gallery).

### 3. Công Cụ Lên Lịch Trình Cá Nhân (Trip Builder)
*   **Lên lịch trình chuyên nghiệp:** Gom nhóm các địa điểm đã chọn theo từng ngày (Ngày 1, Ngày 2...).
*   **Kéo thả trực quan (Drag & Drop):** Thay đổi thứ tự ghé thăm hoặc chuyển địa điểm giữa các ngày cực kỳ mượt mà nhờ `@dnd-kit`.
*   **Mời thành viên:** Tìm kiếm bạn bè qua Email/UID và thêm vào chuyến đi để cùng quản lý lịch trình.

### 4. Cộng Đồng & Tương Tác (Social Interaction)
*   **Hệ thống Đánh giá & Review:** Đánh giá điểm số (1-5★) kèm bình luận. Hệ thống tự động tính lại điểm trung bình (`avg_rating`) của địa điểm bất đồng bộ qua Queue Job.
*   **Hỏi & Đáp (Q&A):** Mục thảo luận, đặt câu hỏi trực tiếp tại mỗi địa điểm, hỗ trợ thích (like) câu hỏi.
*   **Đăng nhập mạng xã hội:** Hỗ trợ đăng nhập nhanh bằng Google và Facebook.

### 5. Trang Quản Trị Toàn Diện (Admin Panel)
*   **Quản lý Địa điểm & Danh mục:** CRUD danh mục, địa điểm, quản lý tọa độ bản đồ và phê duyệt đóng góp từ cộng đồng.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Backend (Hệ thống cốt lõi)
*   **Laravel 12.x** (Yêu cầu PHP 8.2+)
*   **Inertia.js Laravel Bridge** (Giao tiếp liền mạch giữa Laravel và React mà không cần xây dựng API REST phức tạp)
*   **Kiến trúc:** Service - Repository Pattern giúp code sạch, tách biệt nghiệp vụ và dễ dàng viết test.
*   **Cơ sở dữ liệu:** MySQL (Production) & SQLite in-memory (Testing).

### Frontend (Giao diện người dùng)
*   **React 19.x** & **React DOM 19.x**
*   **Inertia.js React Client**
*   **Tailwind CSS v3** & **Vite v7** (Biên dịch tối ưu hóa tài nguyên)
*   **React Leaflet v5** (Bản đồ)
*   **@dnd-kit** (Hệ thống kéo thả lịch trình)

---

## 📦 Hướng Dẫn Cài Đặt Môi Trường Phát Triển (Local Setup)

### 1. Tải mã nguồn về máy
```bash
git clone https://github.com/pkhang541/KhamPhaDD.git
cd KhamPhaDD
```

### 2. Cài đặt các thư viện Backend & Frontend
```bash
# Cài đặt thư viện PHP
composer install

# Cài đặt thư viện Javascript
npm install
```

### 3. Cấu hình file môi trường `.env`
Sao chép file cấu hình ví dụ và cập nhật thông tin database của bạn:
```bash
cp .env.example .env
```
Mở file `.env` lên và điền thông tin kết nối MySQL:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=khamphadd
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Khởi tạo khóa bảo mật & Dữ liệu mẫu
Chạy chuỗi lệnh sau để tạo ứng dụng hoàn chỉnh:
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

*   **Terminal 1 (Backend Server):**
    ```bash
    php artisan serve
    ```
*   **Terminal 2 (Vite Frontend compiler):**
    ```bash
    npm run dev
    ```

Truy cập ứng dụng của bạn tại: `http://localhost:8000`

---

## 👤 Tài Khoản Trải Nghiệm Thử (Demo Credentials)

Sau khi chạy lệnh `--seed`, bạn có thể đăng nhập bằng các tài khoản mặc định sau:

*   **Tài khoản Quản trị viên (Admin):**
    *   **Email:** `admin@saigonchill.com` (hoặc email admin được cấu hình trong `DatabaseSeeder`)
    *   **Mật khẩu:** `password`
*   **Tài khoản Thành viên (User):**
    *   **Email:** `user@example.com`
    *   **Mật khẩu:** `password`

---

## 🧪 Quy Trình Kiểm Thử (Testing Suite)

Dự án đi kèm bộ kiểm thử tự động toàn diện bao gồm: Đăng ký, Đăng nhập, Quên mật khẩu, Tìm kiếm địa điểm, Viết đánh giá, và Mời thành viên lịch trình.

Để chạy toàn bộ test suite và đảm bảo không có lỗi xảy ra:
```bash
php artisan test
```

---

## 🚀 Hướng Dẫn Biên Dịch Khi Deploy Lên Mạng (Production Build)

Khi tiến hành deploy lên server mạng, hãy biên dịch tối ưu hóa các tệp tĩnh của React/JS bằng lệnh sau:
```bash
npm run build
```
Đồng thời cấu hình `.env` chuyển sang `APP_ENV=production` và tắt chế độ debug `APP_DEBUG=false` để đảm bảo hiệu năng và bảo mật tốt nhất.
