import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Checkbox } from "./checkbox"
import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "Input/Label",
  component: Label,
  args: { children: "Label text" },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <div className="grid w-64 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}
