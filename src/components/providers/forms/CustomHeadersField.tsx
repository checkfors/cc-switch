import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidHeaderName, isValidHeaderValue } from "@/lib/httpHeaders";

interface CustomHeadersFieldProps {
  /** Array of custom headers (name, value pairs) */
  headers: Array<{ name: string; value: string }>;
  /** Called whenever headers change (add/remove/edit) */
  onChange: (headers: Array<{ name: string; value: string }>) => void;
}

/**
 * 供应商级自定义 HTTP 请求头字段（Claude / Codex 表单共用）。
 *
 * 含标签 + 多行输入（每行 name + value + 删除按钮）+ 添加按钮。
 * 实时校验 header name/value 合法性（非阻断，与 User-Agent 一致）。
 * 保存时由 ProviderForm 过滤空行。
 */
export function CustomHeadersField({
  headers,
  onChange,
}: CustomHeadersFieldProps) {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange([...headers, { name: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    const next = [...headers];
    next.splice(index, 1);
    onChange(next);
  };

  const handleChange = (
    index: number,
    field: "name" | "value",
    value: string,
  ) => {
    const next = headers.map((h, i) =>
      i === index ? { ...h, [field]: value } : h,
    );
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel>
          {t("providerForm.customHeaders", {
            defaultValue: "自定义请求头",
          })}
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("providerForm.customHeaders.add", {
            defaultValue: "添加请求头",
          })}
        </Button>
      </div>

      {headers.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          {t("providerForm.customHeaders.hint", {
            defaultValue:
              "仅在开启本地路由/代理接管后生效，会添加到（或覆盖）转发请求中的对应请求头。",
          })}
        </p>
      ) : (
        <div className="space-y-2">
          {headers.map((header, index) => {
            const nameValid =
              header.name.trim() === "" || isValidHeaderName(header.name);
            const valueValid =
              header.value.trim() === "" || isValidHeaderValue(header.value);

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={header.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    placeholder={t(
                      "providerForm.customHeaders.namePlaceholder",
                      {
                        defaultValue: "Header 名称",
                      },
                    )}
                    autoComplete="off"
                    className="flex-[2] font-mono text-xs"
                  />
                  <Input
                    type="text"
                    value={header.value}
                    onChange={(e) =>
                      handleChange(index, "value", e.target.value)
                    }
                    placeholder={t(
                      "providerForm.customHeaders.valuePlaceholder",
                      {
                        defaultValue: "Header 值",
                      },
                    )}
                    autoComplete="off"
                    className="flex-[3] font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {!nameValid && (
                  <p className="text-xs text-destructive">
                    {t("providerForm.customHeaders.invalidName", {
                      defaultValue:
                        "Header 名称格式无效，运行时将被忽略。",
                    })}
                  </p>
                )}
                {!valueValid && (
                  <p className="text-xs text-destructive">
                    {t("providerForm.customHeaders.invalidValue", {
                      defaultValue:
                        "Header 值不能包含控制字符，运行时将被忽略。",
                    })}
                  </p>
                )}
                {nameValid && valueValid && header.name.trim() !== "" && (
                  <p className="text-xs text-muted-foreground">
                    {t("providerForm.customHeaders.hint", {
                      defaultValue:
                        "仅在开启本地路由/代理接管后生效，会添加到（或覆盖）转发请求中的对应请求头。",
                    })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
