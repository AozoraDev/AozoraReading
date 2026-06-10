<div align="center">

<img src="public/img/logo.png" alt="AozoraDev" width="96" />

# AozoraReading

**AI 驱动的小说阅读平台**

支持智能 TXT 章节切分导入，阅读时可生成 AI 前情回顾与本章总结，让长篇阅读更轻松。

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-0059bb?style=flat-square)](LICENSE)

[English](README.en.md) · [快速开始](#快速开始) · [功能概览](#功能概览) · [技术栈](#技术栈) · [开源说明](#开源说明)

</div>

---

## 预览

<table>
  <tr>
    <td align="center" width="33%">
      <img src="public/img/show/image1.png" alt="首页" width="100%" />
      <br /><sub><b>首页</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="public/img/show/image2.png" alt="书城" width="100%" />
      <br /><sub><b>书城</b></sub>
    </td>
    <td align="center" width="33%">
      <img src="public/img/show/image3.png" alt="阅读" width="100%" />
      <br /><sub><b>阅读</b></sub>
    </td>
  </tr>
</table>

---

## 功能概览

<table>
  <tr>
    <td width="50%" valign="top">

**📚 阅读体验**
- 书城浏览与搜索
- 章节阅读与章节导航、作品收藏
- 阅读页 AI 前情回顾与本章总结
- 中英切换、明暗主题

</td>
    <td width="50%" valign="top">

**⚙️ 内容管理**
- 仪表盘管理小说
- 上传封面、智能 TXT 切分批量导入章节
- 邮箱注册登录、OTP 验证

</td>
  </tr>
</table>

---

## 技术栈

<table>
  <tr>
    <th>类别</th>
    <th>技术</th>
  </tr>
  <tr>
    <td><b>框架</b></td>
    <td><a href="https://nextjs.org/">Next.js 16</a>（App Router）+ <a href="https://react.dev/">React 19</a></td>
  </tr>
  <tr>
    <td><b>语言</b></td>
    <td><a href="https://www.typescriptlang.org/">TypeScript</a></td>
  </tr>
  <tr>
    <td><b>UI / 样式</b></td>
    <td><a href="https://tailwindcss.com/">Tailwind CSS 4</a> · <a href="https://www.radix-ui.com/">Radix UI</a> · <a href="https://ui.shadcn.com/">shadcn/ui</a> · <a href="https://github.com/pacocoursey/next-themes">next-themes</a></td>
  </tr>
  <tr>
    <td><b>后端 / 数据</b></td>
    <td><a href="https://supabase.com/">Supabase</a>（Auth、PostgreSQL、Storage）</td>
  </tr>
  <tr>
    <td><b>表单</b></td>
    <td><a href="https://react-hook-form.com/">React Hook Form</a> + <a href="https://zod.dev/">Zod</a></td>
  </tr>
  <tr>
    <td><b>国际化</b></td>
    <td><a href="https://next-intl.dev/">next-intl</a></td>
  </tr>
  <tr>
    <td><b>其他</b></td>
    <td>react-markdown · sonner · lucide-react</td>
  </tr>
</table>

---

## 项目结构

```
app/                    # Next.js App Router 页面与路由
  library/              # 书城
  reading/              # 阅读页
  favorites/            # 收藏
  text/                 # 章节正文
  dashboard/            # 管理仪表盘（概览、添加小说、添加章节）
  login/ signup/ forget/ # 认证相关
components/             # 可复用 UI 与业务组件
lib/supabase/           # Supabase 客户端与数据访问层
messages/               # 国际化文案（zh.json / en.json）
i18n/                   # 国际化配置
public/markdown/        # 静态 Markdown 内容（如「工作原理」）
```

---

## 快速开始

### 环境要求

- Node.js 20+
- [pnpm](https://pnpm.io/)（推荐）或 npm / yarn
- Supabase 项目

### 1. 克隆并安装依赖

```bash
git clone https://github.com/AozoraDev/AozoraReading.git
cd AozoraReading
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入 Supabase 项目信息（在 [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/_/settings/api) 获取）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> `SUPABASE_SERVICE_ROLE_KEY` 仅用于服务端操作（如仪表盘上传封面、管理 Storage），请勿暴露到客户端。

### 3. 启动开发服务器

```bash
pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 其他命令

| 命令 | 说明 |
|------|------|
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务 |
| `pnpm lint` | ESLint 检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm format` | Prettier 格式化 |

---

## 开源说明

本项目以 [MIT License](LICENSE) 开源，仅提供阅读平台代码，**不包含任何小说内容**。

| | |
|---|---|
| **小说自理** | 请自行准备、上传与管理小说文本与封面，并确保拥有相应版权或授权 |
| **后端自理** | 需自行创建 [Supabase](https://supabase.com/) 项目，配置数据库、Storage 与 Auth，并填入 `.env.local` |

类似其他开源阅读工具，本项目只开源软件本身；内容与后端基础设施由使用者自行负责。

---

<div align="center">

<sub>由 <a href="https://github.com/AozoraDev">AozoraDev</a> 维护</sub>

</div>
