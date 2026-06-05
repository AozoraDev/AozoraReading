// 获取必需的环境变量

function requiredEnv(name: string, value: string | undefined): string {

  // 如果环境变量为空，抛出错误

  if (!value) {

    throw new Error(`Missing ${name} environment variable`)

  }



  return value

}



// 获取 Supabase URL

export function getSupabaseUrl() {

  return requiredEnv(

    "NEXT_PUBLIC_SUPABASE_URL",

    process.env.NEXT_PUBLIC_SUPABASE_URL,

  )

}



// 获取 Supabase 匿名密钥

export function getSupabaseAnonKey() {

  return requiredEnv(

    "NEXT_PUBLIC_SUPABASE_ANON_KEY",

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  )

}


