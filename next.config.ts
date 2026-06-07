import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

// 获取 supabase 的 hostname
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

const nextConfig: NextConfig = {
  experimental: {
    // 章节 txt 上传最大 50 MB，需同步放宽 proxy 与 Server Action 请求体限制
    proxyClientMaxBodySize: "50mb",
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // 允许优化 supabase 的图片
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // VPN/代理 fake-ip 会把 supabase.co 解析到 198.18.x.x，Next.js 16 默认会拒绝优化
    // 你本地开代理时，supabase.co 会被解析成假 IP，封面就不显示。
    // 加这条后，仅 dev 环境 允许这种情况；上线生产仍是 false，更安全。
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
}

export default withNextIntl(nextConfig)
