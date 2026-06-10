import { FormActionButton } from "@/app/llm-settings/components/llm-settings-form/components/shared/form-action-button"
import type { LlmSettingsFormController } from "@/app/llm-settings/hook/use-llm-settings-form"

export function LlmSettingsFormActions({
  form,
}: {
  form: Pick<
    LlmSettingsFormController,
    | "t"
    | "isTesting"
    | "isSubmitting"
    | "isBusy"
    | "canSave"
    | "onTestConnection"
  >
}) {
  const { t, isTesting, isSubmitting, isBusy, canSave, onTestConnection } = form

  return (
    <div className="grid gap-3">
      {!canSave && !isBusy ? (
        <p className="text-right text-xs text-muted-foreground">{t("saveHint")}</p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <FormActionButton
          type="button"
          variant="outline"
          isLoading={isTesting}
          loadingLabel={t("testing")}
          disabled={isBusy}
          onClick={onTestConnection}
        >
          {t("test")}
        </FormActionButton>

        <FormActionButton
          type="submit"
          variant="brandCta"
          isLoading={isSubmitting}
          loadingLabel={t("saving")}
          disabled={isBusy || !canSave}
        >
          {t("save")}
        </FormActionButton>
      </div>
    </div>
  )
}
