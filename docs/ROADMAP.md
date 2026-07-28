# LexiPets Development Roadmap

## Milestone 1 - Khởi tạo Project
**Goal:** Thiết lập lại project LexiPets bằng React + Vite + TypeScript.
- **Requirements:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router DOM, Zustand, TanStack Query, Supabase JS, ESLint, Prettier.
- **Deliverables:** Project chạy được bằng `npm run dev`, cấu trúc thư mục chuẩn.
- **Rules:** Chưa cần chuyển bất kỳ màn hình nào. Dừng lại chờ User confirm.

## Milestone 2 - Supabase
**Goal:** Thiết lập Backend.
- **Requirements:** Tạo Supabase Client, tạo migration, tạo Storage bucket `pets`, tạo các bảng `pet_species`, `pet_stages`, `user_pets`.
- **Rules:** Không viết UI. Chỉ làm backend. Dừng lại chờ User confirm.

## Milestone 3 - Authentication
**Goal:** Chuyển Login và Register sang React.
- **Requirements:** React Router, Supabase Auth. Không hardcode, không dùng LocalStorage để lưu user.
- **Rules:** Dừng lại chờ User confirm.

## Milestone 4 - Home
**Goal:** Xây dựng Home Screen.
- **Requirements:** Hiển thị pet, Level, Coin, Gem, EXP. Pet lấy từ Supabase. Ảnh lấy từ Storage.
- **Rules:** Dừng lại chờ User confirm.

## Milestone 5 - Collection
**Goal:** Collection.
- **Requirements:** Grid Pet, Evolution, Locked, Detail Modal.
- **Rules:** Dừng lại chờ User confirm.

## Milestone 6 - Learn Mode
**Goal:** Port toàn bộ Word Search.
- **Requirements:** Không thay đổi gameplay. Tách toàn bộ logic sang `src/utils`. Component chỉ render.
- **Rules:** Dừng lại chờ User confirm.
