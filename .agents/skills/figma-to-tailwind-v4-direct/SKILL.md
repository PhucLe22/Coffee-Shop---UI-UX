---
name: figma-to-tailwind-v4-direct
description: Implement UI components by directly mapping Figma design tokens to Tailwind CSS v4 classes. Assumes 1:1 naming parity between Figma variables and Tailwind theme tokens.
---

# Direct Figma to Tailwind v4 Implementation

Kỹ năng này được sử dụng khi hệ thống Design Tokens trong Figma và cấu hình `@theme` trong Tailwind v4 đã đồng bộ hoàn toàn về tên gọi. Agent không cần định nghĩa lại token mà tập trung vào việc áp dụng chúng vào code React/HTML.

## Nguyên tắc Mapping trực tiếp

Vì tên biến giống nhau, việc chuyển đổi tuân theo công thức:
`Figma Variable Name` -> `--color-{name}` -> `class="{property}-{name}"`

### 1. Color Mapping

| Figma Token         | Tailwind Class                             |
| :------------------ | :----------------------------------------- |
| `surface-main`      | `bg-surface-main`                          |
| `text-primary`      | `text-text-primary`                        |
| `brand-accent`      | `bg-brand-accent` hoặc `text-brand-accent` |
| `border-primary-50` | `border-border-primary-50`                 |

### 2. Spacing & Radius Mapping

| Figma Property             | Tailwind Class |
| :------------------------- | :------------- |
| Gap: `md` (16px)           | `gap-md`       |
| Padding: `lg` (24px)       | `p-lg`         |
| Corner Radius: `xl` (32px) | `rounded-xl`   |

## Quy trình thực thi (Workflow)

1. **Đọc thông số từ Figma**: Xác định các lớp (layers) và các biến (variables/styles) được áp dụng.
2. **Đối soát Token**: Kiểm tra biến đó có tồn tại trong `@theme` (theo file `globals.css` đã cấu hình).
3. **Áp dụng Utility Classes**:
   - Sử dụng trực tiếp class tương ứng với tên biến.
   - Đối với Typography, sử dụng các tổ hợp class đã định nghĩa trong `@layer utilities` (ví dụ: `text-display-hero`).
4. **Xây dựng Logic Component**:
   - Sử dụng `cn()` để kết hợp các token động.
   - Giữ nguyên các giá trị `line-height` và `letter-spacing` theo thiết kế nếu chúng chưa được đóng gói vào class typography.

## Mẫu Implementation (Best Practice)

Khi nhận được yêu cầu "Code cho tôi cái Card này từ Figma":

```tsx
// Agent sẽ sử dụng đúng các token đã có trong config của bạn
export function FeatureCard({ title, description }) {
  return (
    <div className="bg-surface-main p-lg rounded-md border border-border-primary-50 shadow-smeffect">
      <h3 className="text-h3-bold text-text-primary mb-sm">{title}</h3>
      <p className="text-body-md-reg text-text-muted">{description}</p>
    </div>
  );
}
```
