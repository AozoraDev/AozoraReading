"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { testConnectionAction } from "@/app/llm-settings/server/actions"
import {
  llmSettingsFormSchema,
  type LlmSettingsFormValues,
} from "@/app/llm-settings/schema"
import { getFirstFieldErrorMessage } from "@/app/llm-settings/tool/validation"
import {
  loadLlmSettingsFromSession,
  saveLlmSettingsToSession,
} from "@/lib/llm-settings/session-storage"

const DEFAULT_VALUES: LlmSettingsFormValues = {
  baseUrl: "",
  model: "",
  apiKey: "",
}

/** LLM 设置表单：读写 session、校验、测试连接、控制保存 */
export function useLlmSettingsForm() {
  const t = useTranslations("llmSettings.form")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testPassed, setTestPassed] = useState(false) // 当前表单值是否已通过连接测试
  const skipTestReset = useRef(true) // 跳过首次渲染，避免无意义重置

  const form = useForm<LlmSettingsFormValues>({
    resolver: zodResolver(llmSettingsFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = form

  // 挂载时从 sessionStorage 恢复上次保存的配置
  useEffect(() => {
    const saved = loadLlmSettingsFromSession()
    if (saved) {
      reset(saved)
    }
  }, [reset])

  const watchedValues = useWatch({ control })

  // 字段变更后需重新测试连接
  useEffect(() => {
    if (skipTestReset.current) {
      skipTestReset.current = false
      return
    }
    setTestPassed(false)
  }, [watchedValues])

  // 保存到 sessionStorage（仅当前标签页有效）
  const onSave = handleSubmit(
    (values) => {
      if (!testPassed) {
        toast.error(t("saveRequiresTest"))
        return
      }

      saveLlmSettingsToSession(values)
      toast.success(t("saveSuccess"))
    },
    (formErrors) => {
      const messageKey = getFirstFieldErrorMessage(formErrors)
      toast.error(messageKey ? t(messageKey) : t("validationError"))
    },
  )

  // 校验表单后，由服务端代发请求测试 API 连通性
  async function onTestConnection() {
    const isValid = await trigger()
    if (!isValid) {
      const messageKey = getFirstFieldErrorMessage(form.formState.errors)
      toast.error(messageKey ? t(messageKey) : t("validationError"))
      return
    }

    setIsTesting(true)
    setTestPassed(false)
    try {
      const result = await testConnectionAction(form.getValues())
      if (result.success) {
        setTestPassed(true)
      }
      toast[result.success ? "success" : "error"](result.message)
    } catch {
      toast.error(t("testNetworkError"))
    } finally {
      setIsTesting(false)
    }
  }

  return {
    t,
    register,
    errors,
    showApiKey,
    toggleApiKeyVisibility: () => setShowApiKey((value) => !value),
    isTesting,
    isSubmitting,
    isBusy: isTesting || isSubmitting,
    testPassed,
    canSave: testPassed && !isTesting && !isSubmitting,
    onSave,
    onTestConnection,
  }
}

export type LlmSettingsFormController = ReturnType<typeof useLlmSettingsForm>
