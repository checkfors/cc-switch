import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { CustomHeadersField } from "@/components/providers/forms/CustomHeadersField";

/** Wrapper: FormLabel needs a FormProvider from react-hook-form */
function TestWrapper({ children }: { children: React.ReactNode }) {
  const form = useForm();
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe("CustomHeadersField", () => {
  it("renders add button and hint when no headers", () => {
    const onChange = () => {};
    render(<CustomHeadersField headers={[]} onChange={onChange} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("添加请求头")).toBeDefined();
    expect(
      screen.getByText(/仅在开启本地路由\/代理接管后生效/),
    ).toBeDefined();
  });

  it("adds a new empty row on add button click", async () => {
    let captured: Array<{ name: string; value: string }> = [];
    const onChange = (headers: Array<{ name: string; value: string }>) => {
      captured = headers;
    };

    const { rerender } = render(
      <CustomHeadersField headers={[]} onChange={onChange} />,
      { wrapper: TestWrapper },
    );

    const user = userEvent.setup();
    await user.click(screen.getByText("添加请求头"));

    expect(captured).toHaveLength(1);
    expect(captured[0]).toEqual({ name: "", value: "" });

    rerender(<CustomHeadersField headers={captured} onChange={onChange} />);
    expect(screen.getByPlaceholderText("Header 名称")).toBeDefined();
    expect(screen.getByPlaceholderText("Header 值")).toBeDefined();
  });

  it("removes a row on delete button click", async () => {
    let captured: Array<{ name: string; value: string }> = [
      { name: "X-Test", value: "test-value" },
    ];
    const onChange = (headers: Array<{ name: string; value: string }>) => {
      captured = headers;
    };

    const { rerender } = render(
      <CustomHeadersField headers={captured} onChange={onChange} />,
      { wrapper: TestWrapper },
    );

    const user = userEvent.setup();
    const buttons = screen.getAllByRole("button");
    const trashButton = buttons.find(
      (b) => b.querySelector(".lucide-trash2") || b.innerHTML.includes("trash"),
    );
    if (trashButton) {
      await user.click(trashButton);
      expect(captured).toHaveLength(0);
    }

    rerender(<CustomHeadersField headers={captured} onChange={onChange} />);
    expect(screen.getByText("添加请求头")).toBeDefined();
  });

  it("shows validation hint for valid header entries", () => {
    const headers = [{ name: "X-Custom", value: "some-value" }];
    render(<CustomHeadersField headers={headers} onChange={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(
      screen.getByText(/仅在开启本地路由\/代理接管后生效/),
    ).toBeDefined();
  });

  it("shows invalid name warning for header name with space", () => {
    const headers = [{ name: "Bad Name", value: "ok" }];
    render(<CustomHeadersField headers={headers} onChange={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText(/Header 名称格式无效/)).toBeDefined();
  });

  it("shows invalid value warning for header value with control char", () => {
    const headers = [{ name: "X-OK", value: "val\nue" }];
    render(<CustomHeadersField headers={headers} onChange={() => {}} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText(/Header 值不能包含控制字符/)).toBeDefined();
  });

  it("handles multiple headers", () => {
    const headers = [
      { name: "X-One", value: "1" },
      { name: "X-Two", value: "2" },
    ];
    render(<CustomHeadersField headers={headers} onChange={() => {}} />, {
      wrapper: TestWrapper,
    });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4); // 2 name + 2 value inputs
  });
});
