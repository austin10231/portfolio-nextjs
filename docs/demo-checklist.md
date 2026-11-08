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
