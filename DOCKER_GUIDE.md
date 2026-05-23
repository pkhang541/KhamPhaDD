# Hướng dẫn dùng Docker cho dự án KhamPhaDD

Ngày tạo: 21/05/2026

## 1. Trạng thái Docker hiện tại

Dự án hiện **chưa có** các file Docker ở root:

- `docker-compose.yml`
- `Dockerfile`
- `.dockerignore`

Nhưng dự án đã cài sẵn package:

```text
laravel/sail
```

Vì vậy cách dễ nhất để dùng Docker là dùng **Laravel Sail**. Sail sẽ sinh `docker-compose.yml` và cấu hình container phù hợp cho Laravel.

## 2. Yêu cầu trước khi dùng

Cần cài:

- Docker Desktop
- WSL2 nếu dùng Windows
- Composer dependencies đã có sẵn trong `vendor/`

Kiểm tra Docker:

```bash
docker --version
docker compose version
```

## 3. Cách khởi tạo Docker bằng Laravel Sail

Chạy lệnh này ở root project:

```bash
php artisan sail:install --with=mysql,redis,mailpit --php=8.2
```

Ý nghĩa:

- `mysql`: database container.
- `redis`: dùng cho cache/queue/session nếu muốn tối ưu production-like.
- `mailpit`: xem email local.
- `--php=8.2`: khớp với yêu cầu PHP hiện tại trong `composer.json`.

Sau khi chạy, Sail sẽ tạo `docker-compose.yml`.

## 4. Cấu hình `.env` khi chạy bằng Docker

Khi app chạy trong container, `DB_HOST=127.0.0.1` sẽ sai vì `127.0.0.1` là chính container PHP, không phải container MySQL.

Nên chỉnh `.env` theo mẫu:

```env
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=khamphadd
DB_USERNAME=sail
DB_PASSWORD=password

FORWARD_DB_PORT=3307
```

Ghi chú:

- `DB_HOST=mysql` là tên service MySQL trong `docker-compose.yml`.
- `DB_PORT=3306` là port MySQL bên trong Docker network.
- `FORWARD_DB_PORT=3307` là port trên máy host, hữu ích nếu máy bạn đã có MySQL chạy ở `3306`.
- Không commit `.env` lên Git.

Nếu muốn dùng Redis:

```env
CACHE_STORE=redis
QUEUE_CONNECTION=redis
REDIS_HOST=redis
```

Nếu muốn giữ đơn giản, vẫn có thể dùng:

```env
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
```

## 5. Chạy project bằng Sail

Trên Windows PowerShell:

```powershell
.\vendor\bin\sail.bat up -d
```

Trên Git Bash, WSL, macOS hoặc Linux:

```bash
./vendor/bin/sail up -d
```

Xem container đang chạy:

```bash
docker ps
```

Mở app:

```text
http://localhost
```

Nếu `APP_PORT` trong `.env` khác `80`, URL có thể là:

```text
http://localhost:<APP_PORT>
```

## 6. Chạy lệnh Laravel trong Docker

Thay vì chạy trực tiếp `php artisan ...`, dùng Sail:

```bash
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail artisan route:list
./vendor/bin/sail artisan test
./vendor/bin/sail artisan queue:work
```

Trên PowerShell thay `./vendor/bin/sail` bằng:

```powershell
.\vendor\bin\sail.bat
```

Ví dụ:

```powershell
.\vendor\bin\sail.bat artisan migrate --seed
```

## 7. Composer và npm trong Docker

Cài PHP dependencies:

```bash
./vendor/bin/sail composer install
```

Cài Node dependencies:

```bash
./vendor/bin/sail npm install
```

Build frontend:

```bash
./vendor/bin/sail npm run build
```

Chạy Vite dev server:

```bash
./vendor/bin/sail npm run dev
```

## 8. Lưu ý Vite khi chạy trong container

`vite.config.js` hiện đang có:

```js
server: {
    host: '127.0.0.1',
},
```

Nếu chạy `npm run dev` **bên trong container**, host máy thật có thể không truy cập được Vite. Khi dùng Docker/Sail, thường nên đổi thành:

```js
server: {
    host: '0.0.0.0',
    hmr: {
        host: 'localhost',
    },
},
```

Nếu chỉ build production bằng:

```bash
./vendor/bin/sail npm run build
```

thì không nhất thiết phải đổi cấu hình Vite.

## 9. Database workflow

Chạy migrate:

```bash
./vendor/bin/sail artisan migrate
```

Reset database và seed lại:

```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

Vào MySQL container:

```bash
./vendor/bin/sail mysql
```

Hoặc dùng tool như TablePlus, DBeaver, MySQL Workbench với thông tin:

```text
Host: 127.0.0.1
Port: 3307
Database: khamphadd
Username: sail
Password: password
```

Port `3307` phải khớp với `FORWARD_DB_PORT` trong `.env`.

## 10. Queue, logs và mail

Nếu dùng queue database:

```bash
./vendor/bin/sail artisan queue:work
```

Xem log Laravel:

```bash
./vendor/bin/sail artisan pail
```

Nếu đã cài `mailpit`, mở:

```text
http://localhost:8025
```

## 11. Dừng và xóa container

Dừng container nhưng giữ volume database:

```bash
./vendor/bin/sail down
```

Dừng và xóa luôn volume database:

```bash
./vendor/bin/sail down -v
```

Cẩn thận với `down -v` vì sẽ xóa dữ liệu MySQL trong Docker volume.

## 12. Khi nào nên dùng Docker trong dự án này?

Nên dùng Docker/Sail nếu:

- Muốn mọi máy dev dùng cùng PHP/MySQL/Redis version.
- Không muốn cài PHP/MySQL trực tiếp trên Windows.
- Muốn test queue, mail, database giống môi trường server hơn.

Có thể không cần Docker nếu:

- Bạn đã có PHP, Composer, Node, MySQL chạy ổn local.
- Bạn chỉ làm frontend hoặc chỉnh UI nhẹ.
- Bạn muốn chạy nhanh bằng `php artisan serve` và `npm run dev`.

## 13. Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| `SQLSTATE[HY000] [2002] Connection refused` | `.env` vẫn để `DB_HOST=127.0.0.1` khi chạy trong container | Đổi thành `DB_HOST=mysql`. |
| MySQL port bị trùng | Máy host đã chạy MySQL ở `3306` | Dùng `FORWARD_DB_PORT=3307`. |
| Vite không truy cập được | Vite bind `127.0.0.1` trong container | Đổi `server.host` sang `0.0.0.0`. |
| `vendor/bin/sail` không chạy trong PowerShell | Windows cần file `.bat` | Dùng `.\vendor\bin\sail.bat`. |
| Permission lỗi trong WSL | File sinh bởi user/root khác nhau | Chạy project trong WSL và dùng Sail nhất quán. |
| Container chạy nhưng app lỗi key | Chưa có `APP_KEY` | Chạy `./vendor/bin/sail artisan key:generate`. |

## 14. Thứ tự setup đề xuất từ đầu

1. Cài Docker Desktop và bật WSL2.
2. Chạy `composer install` nếu chưa có `vendor/`.
3. Chạy `php artisan sail:install --with=mysql,redis,mailpit --php=8.2`.
4. Chỉnh `.env` sang `DB_HOST=mysql`, `DB_PORT=3306`, `FORWARD_DB_PORT=3307`.
5. Chạy `.\vendor\bin\sail.bat up -d` trên PowerShell.
6. Chạy `.\vendor\bin\sail.bat artisan key:generate` nếu thiếu `APP_KEY`.
7. Chạy `.\vendor\bin\sail.bat artisan migrate --seed`.
8. Chạy `.\vendor\bin\sail.bat npm install`.
9. Chạy `.\vendor\bin\sail.bat npm run build` hoặc `.\vendor\bin\sail.bat npm run dev`.
10. Mở `http://localhost`.
