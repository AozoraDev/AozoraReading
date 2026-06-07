/** 
 全局 React Query 提供者，设置默认配置 
 这个文件是给整个应用包一层 React Query（TanStack Query） 的“外壳”。
  
  简单说就是：
  1. 创建一个 QueryClient（管理请求缓存、加载状态等）
  2. 用 QueryClientProvider 包住子组件
  3. 默认设置：数据在 60 秒内算“新鲜”，不会马上重复请求
  
  在 app/layout.tsx 里包住了整站，所以页面里用 useQuery、useMutation 这类 hook 才能正常工作。
 * 
*/

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
