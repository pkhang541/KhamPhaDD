# Công nghệ sử dụng trong dự án KhamPhaDD Journal

Dự án **KhamPhaDD Journal** được xây dựng dựa trên các công nghệ hiện đại nhất năm 2026, đảm bảo hiệu suất cao, khả năng mở rộng và trải nghiệm người dùng cao cấp theo phong cách "Modern Nomad".

## 1. Stack Tổng thể (The Modern Monolith)
*   **Framework**: [Laravel 11](https://laravel.com/) + [Inertia.js](https://inertiajs.com/) + [React](https://react.dev/).
*   **Kiến trúc**: Sử dụng mô hình Single Page Application (SPA) nhưng vẫn giữ được sự mạnh mẽ của backend Laravel mà không cần tách rời API.

## 2. Backend (Hệ thống cốt lõi)
*   **Ngôn ngữ**: PHP 8.2+.
*   **Cơ sở dữ liệu**: MySQL.
*   **Kiến trúc phần mềm**: 
    *   **Service-Repository Pattern**: Tách biệt logic nghiệp vụ và truy vấn dữ liệu.
    *   **Dependency Injection**: Quản lý phụ thuộc linh hoạt.
*   **Xác thực (Authentication)**: Laravel Breeze (Inertia/React version).

## 3. Frontend (Giao diện & Trải nghiệm)
*   **Thư viện UI**: **React 18+**.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Thiết kế dựa trên hệ thống utility-first.
*   **Bundler**: Vite - Biên dịch mã nguồn frontend siêu tốc.
*   **Phông chữ (Typography)**:
    *   **Inter**: Dùng cho UI và văn bản nội dung (hiện đại, dễ đọc).
    *   **Instrument Serif**: Dùng cho tiêu đề (mang đậm chất tạp chí, cổ điển nhưng hiện đại).
*   **Aesthetics**:
    *   **Modern Nomad Design**: Phong cách tối giản, sử dụng khoảng trắng lớn, typography mạnh mẽ.
    *   **Glassmorphism**: Hiệu ứng kính mờ cho Navigation và các thành phần nổi.
    *   **Micro-animations**: Hiệu ứng chuyển cảnh mượt mà giữa các trang (SPA transitions).

## 4. Bản đồ & Địa điểm
*   **Thư viện bản đồ**: [Leaflet.js](https://leafletjs.com/) tích hợp qua `react-leaflet`.
*   **Dữ liệu bản đồ**: [OpenStreetMap (OSM)](https://www.openstreetmap.org/) kết hợp với **CARTO** tiles (Light Mode).
*   **Geocoding**: [Nominatim](https://nominatim.openstreetmap.org/) - Tìm kiếm địa chỉ từ tọa độ thời gian thực.

## 5. Các tính năng nổi bật
*   **SPA Transitions**: Trải nghiệm chuyển trang ngay lập tức, không load lại trình duyệt.
*   **Optimistic UI**: Cập nhật giao diện ngay khi người dùng tương tác (ví dụ: thả tim địa điểm).
*   **Discovery Map**: Bản đồ tương tác cho phép tìm kiếm và đóng góp địa điểm trực tiếp.
*   **Journal Entries**: Hệ thống bài viết và đánh giá địa điểm chuyên sâu.

---
*Tài liệu được cập nhật vào ngày 15/05/2026 sau khi nâng cấp lên hệ thống React & Inertia.*
