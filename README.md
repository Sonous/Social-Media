# 📚 Mini Social Media

Một ứng dụng mạng xã hội mini lấy cảm hứng giao diện từ Instagram cho phép người dùng đăng bài viết, tương tác với bài viết bằng like, comment, tìm kiếm người dùng, follow người dùng khác, và quản lý thông tin cá nhân, nhắn tin giữa các người dùng.

---

## 🚀 Demo

- 🌐 Frontend: [https://your-frontend.vercel.app](https://your-frontend.vercel.app)
- 🔗 Backend: [https://your-backend.render.com](https://your-backend.render.com)
- 📂 Source Code Frontend: [Link GitHub FE](https://github.com/yourname/your-fe-repo)
- 📂 Source Code Backend: [Link GitHub BE](https://github.com/yourname/your-be-repo)
- 📺 Video demo: [Link Youtube Demo](https://github.com/yourname/your-be-repo)

---

## 📸 Screenshot

> (Thêm ảnh giao diện tại đây — sử dụng ![alt](link hình ảnh) nếu muốn)

---

## ⚙️ Tính năng chính

- ✅ Đăng ký (với cơ chế xác thực email bằng otp)
- ✅ Đăng nhập với JWT (access và refresh token)
- ✅ Tạo / sửa / xoá bài viết
- ✅ Like, bình luận, thêm vào bài viết vào mục yêu thích
- ✅ Quản lý hồ sơ người dùng
- ✅ Nhắn tin giữa các người dùng thông qua WebSocket/Socket.IO
- ✅ Follow người dùng
- ✅ Tìm kiếm người dùng
- ✅ Responsive UI
- ✅ API chuẩn RESTful

---

## 🛠️ Công nghệ sử dụng

### Frontend:
- Vite
- ReactJS
- TailwindCSS / Shadcn/ui
- Zustand 
- Axios

### Backend:
- NestJS (Node.js)
- PostgreSQL
- TypeORM
- JWT Authentication
- WebSocket/Socket.IO

### Khác:
- Render (Backend Deploy)
- Vercel (Frontend Deploy)
- Postman (API Testing)

---
<!-- 
## 🔐 Phân quyền người dùng

| Role   | Quyền hạn |
|--------|-----------|
| User   | Đăng bài, sửa bài của mình, like/comment |
| Admin  | Toàn quyền quản lý bài viết, user |

--- -->

## 📦 Cài đặt local

```bash
# Clone project
git clone https://github.com/Sonous/Social-Media.git

# Cài đặt Frontend
cd frontend
npm install
npm run dev

# Cài đặt Backend
cd backend
npm install
npm run start:dev
```

## 🧩 Biến môi trường (Environment Variables)

### 📁 Backend (`/backend/.env`)

```env
#Mail service
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
EMAIL_PORT=

#Otp secret key
OTP_SECRET_KEY=

#Database
DATABASE_URL=

#Jwt secret key
JWT_SECRET_KEY=
COOKIE_SECRET=

#CORS URL
ORIGIN_CORS=
```

### 📁 Frontend (`/frontend/.env`)
```env
VITE_SOCKET_URL=
VITE_BACKEND_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_API_KEY=
```