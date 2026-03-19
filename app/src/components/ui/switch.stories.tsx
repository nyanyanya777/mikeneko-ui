import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Switch } from "./switch"
import { Label } from "./label"

const meta = {
  title: "Input/Switch",
  component: Switch,
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane Mode</Label>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
