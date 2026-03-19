import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Progress } from "./progress"

const meta = {
  title: "Feedback/Progress",
  component: Progress,
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: 60 },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
}

export const Zero: Story = {
  args: { value: 0 },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
}

export const Full: Story = {
  args: { value: 100 },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
}

export const Quarter: Story = {
  args: { value: 25 },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
}
