import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Slider } from "./slider"

const meta = {
  title: "Input/Slider",
  component: Slider,
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: [50] },
}

export const Range: Story = {
  args: { defaultValue: [25, 75] },
}

export const Disabled: Story = {
  args: { defaultValue: [50], disabled: true },
}
