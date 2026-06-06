# Quiz Web App — Design Spec
**Date:** 2026-06-06  
**Project:** final-prep (GitHub Pages)  
**Purpose:** Ôn tập trắc nghiệm cuối kỳ cho 4 môn: DEVOPS, RL, TKM, CI/CD

---

## 1. Mục tiêu

Xây dựng web tĩnh (static site) deploy lên GitHub Pages, hỗ trợ ôn tập trắc nghiệm theo cấu trúc Môn → Chương → Lý thuyết + Quiz. Không cần server, không cần framework, không lưu tiến độ.

---

## 2. Kiến trúc file

```
final-prep/
├── index.html              # Trang chủ — chọn môn học
├── subject.html            # Trang môn học — danh sách chương
├── chapter.html            # Trang chương — lý thuyết + quiz
├── css/
│   └── style.css           # Giao diện tối giản (trắng/xám)
├── js/
│   ├── app.js              # Logic điều hướng, render trang
│   └── quiz.js             # Logic trắc nghiệm (luyện tập / thi thử)
└── data/
    ├── devops/
    │   ├── meta.json       # Tên môn, danh sách chương
    │   ├── chapter1.json
    │   └── chapter2.json   # (thêm dần khi có tài liệu)
    ├── rl/
    ├── tkm/
    └── cicd/
```

---

## 3. Cấu trúc dữ liệu

### `data/<subject>/meta.json`
```json
{
  "id": "devops",
  "title": "DevOps",
  "description": "Môn học về văn hóa, quy trình và công cụ DevOps",
  "chapters": [
    { "id": 1, "title": "Giới thiệu DevOps" },
    { "id": 2, "title": "CI/CD Pipeline cơ bản" }
  ]
}
```

### `data/<subject>/chapterX.json`
```json
{
  "title": "Chương 1: Giới thiệu DevOps",
  "theory": [
    {
      "heading": "DevOps là gì?",
      "content": "DevOps là sự kết hợp giữa Development và Operations..."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "basic",
      "question": "DevOps viết tắt của cái gì?",
      "options": ["Dev + Ops", "Design + Operations", "Deploy + Optimize", "Data + Operations"],
      "answer": 0,
      "explanation": "DevOps = Development + Operations"
    }
  ]
}
```

- `level`: `"basic"` | `"intermediate"` | `"advanced"`
- `answer`: index (0-based) của đáp án đúng trong mảng `options`
- `explanation`: hiển thị sau khi chọn (luyện tập) hoặc sau khi nộp (thi thử)

---

## 4. Điều hướng

URL dùng query string, hoạt động tốt với GitHub Pages:

| Trang | URL |
|-------|-----|
| Trang chủ | `index.html` |
| Trang môn | `subject.html?subject=devops` |
| Trang chương | `chapter.html?subject=devops&chapter=1` |

---

## 5. Tính năng từng trang

### `index.html` — Trang chủ
- Grid 4 thẻ (card) cho 4 môn: DEVOPS, RL, TKM, CI/CD
- Mỗi card: tên môn, mô tả ngắn, số chương, nút "Vào học"

### `subject.html` — Trang môn
- Tiêu đề môn + mô tả
- Danh sách chương dạng card: số chương, tên chương, số câu hỏi
- Breadcrumb: Trang chủ > Tên môn

### `chapter.html` — Trang chương
- Breadcrumb: Trang chủ > Tên môn > Tên chương
- **2 tab:**
  - **Lý thuyết:** hiển thị các section heading + content từ `theory[]`
  - **Luyện tập / Thi thử:** chọn chế độ trước khi bắt đầu

### Chế độ Luyện tập
- Hiển thị từng câu hỏi
- Sau khi chọn: highlight đúng/sai, hiện giải thích ngay
- Nút "Câu tiếp theo"
- Filter theo level: Tất cả / Cơ bản / Trung bình / Nâng cao

### Chế độ Thi thử
- Hiển thị tất cả câu hỏi (hoặc từng câu, có nút điều hướng)
- Nút "Nộp bài" ở cuối
- Sau khi nộp: hiện điểm X/Y, highlight đúng/sai, hiện giải thích

---

## 6. Giao diện

- **Style:** Tối giản, trắng/xám, font hệ thống
- **Màu sắc:** Trắng nền, xám nhạt border, xanh dương cho action/highlight đúng, đỏ cho sai
- **Responsive:** hoạt động tốt trên điện thoại lẫn máy tính
- **Không dùng framework CSS** — viết CSS thuần, file nhỏ gọn

---

## 7. Constraints

- Toàn bộ là file tĩnh (HTML/CSS/JS) — không cần server
- Fetch JSON bằng `fetch()` API
- Không dùng React/Vue/Angular
- Không lưu localStorage (mỗi lần vào là bắt đầu mới)
- Tương thích GitHub Pages

---

## 8. Workflow thêm câu hỏi (Bước 2)

Khi người dùng cung cấp tài liệu từng môn:
1. Tôi đọc tài liệu và tạo file `chapterX.json` với `theory[]` + `questions[]`
2. Cập nhật `meta.json` để thêm chương mới
3. Không cần sửa bất kỳ file HTML/CSS/JS nào
