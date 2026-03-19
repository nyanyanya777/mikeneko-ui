import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "Input/Input",
  component: Input,
  args: { placeholder: "Enter text..." },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-64 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, value: "Disabled" },
}

export const Error: Story = {
  args: { "aria-invalid": true, defaultValue: "Invalid value" },
}

export const File: Story = {
  args: { type: "file" },
}
