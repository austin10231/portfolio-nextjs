# 演示视频功能清单

按实际完成的功能演示；视频时长以课程要求为准。

## 1. 项目独立性与首页

- 展示新 GitHub 仓库及新的 Vercel URL。
- 说明原站 `mutianhe.com` 和 `my-profile` 保持不变。
- 展示首页头像、两段教育经历、技能、简历和原社交链接。
- 切换中文/英文、深色/浅色，刷新后展示偏好仍保留。
- 指出中文和英文分别打开对应简历 PDF。

## 2. 页面导航与原有交互

- 从 Home 进入 Experience、Projects、Contact，满足四个不同页面要求。
- 在 Experience 切换 Industry / Research，展示 URL 的 `#industry` / `#research`。
- 展示鼠标星尘、卡片倾斜、按钮磁吸与滚动显现。
- 缩窄浏览器，展开手机菜单并实际点击页面链接。

## 3. 动态路由

- 在 Projects 点击多模态搜索项目标题，展示 `/projects/multimodal-image-search`。
- 返回列表，再打开 `/projects/rl-maze-navigation`，证明不同 slug 对应不同内容。
- 刷新详情页，确认仍可访问；输入不存在的 slug，展示 404。
- 指出原 GitHub、Demo 和 JaaS PDF 链接仍保留。
- 从项目列表底部进入 Smart Parking UI 展示页。

## 4. Contact 服务端验证

- 展示姓名、邮箱、留言字段。
- 在姓名填两个空格、留言填十个空格，邮箱填 `test@example.com`。长度满足浏览器基本检查，但提交后由服务端 trim/验证并返回字段错误。
- 打开开发者工具 Network，展示 `POST /api/contact` 返回 HTTP 400 与 `errors`。
- 或在终端运行以下请求，证明不依赖前端验证（将域名替换为新站地址）：

```sh
curl -i https://YOUR_DEPLOYMENT.vercel.app/api/contact \
  -H 'Content-Type: application/json' \
  --data '{"name":" ","email":"invalid","message":"short"}'
```

- 若需再次展示成功提交，使用清楚标注的测试留言；消息会实际发送到原有收件渠道，避免反复提交。
- 说明只有 Formspree 接受请求后才显示成功；服务不可用时会显示失败和直接邮箱链接。

## 5. 代码与 AI 开发过程

- `src/app/`：App Router、四个主要页面、`projects/[slug]/page.tsx` 与 `api/contact/route.ts`。
- `src/data/`：集中管理中英文文案、8 个项目和 24 项技能。
- `src/components/`：导航、经历切换、表单及有清理逻辑的动画组件。
- `src/lib/contact.ts`：服务端 schema、错误状态和实际投递边界。
- 运行 `npm test`，展示 8 个真实自动测试；展示 HTTP 检查结果。
- 打开 `ai-development-log.md`，讲解字体接线、手机菜单层级和平滑滚动适配三项实际不足及修复。
- 展示分阶段 Git Commit。

## 6. Midterm：Project Manager（LocalStorage CRUD）

- 从导航点击 PROJECT MANAGER 进入 `/project-manager`，展示与全站一致的设计。
- 首次访问显示 3 个示例项目；打开开发者工具 Application → Local Storage，说明此时还没有 `portfolio-projects` 键（未做修改前不写入）。
- 表单校验：空表单直接点击 Add project，展示标题、描述、技术栈的红色错误提示，且列表不变。
- 添加：填写标题、描述、技术栈（输入 `React, Vite, Tailwind, React` 展示去重）并选择 In Progress，点击 Add project 后出现第 4 张卡片，Local Storage 中出现 `portfolio-projects` 且包含 4 条记录。
- 刷新页面：新项目仍在，证明 LocalStorage 持久化。
- 编辑：点击该卡片的 Edit，表单回填；修改标题并把状态改为 Completed，点击 Save changes 后卡片更新。
- 删除：点击任意卡片的 Delete 并确认，卡片消失；再次刷新验证删除已持久化。
- 提及容错：清空或篡改 Local Storage 数据后刷新，页面回退到示例列表并显示提示，不会白屏；隐私模式下显示"无法持久化"警告。
- 简短展示暗色模式、中文导航（项目管理）以及窄窗口汉堡菜单进入该页面；说明其余页面功能未变。
- 运行 `npm run typecheck`、`npm test`（24 个测试）和 `npm run check:http`（86 项检查）作为证据。
