import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Textarea } from "./textarea"
import { Label } from "./label"

const meta = {
  title: "Input/Textarea",
  component: Textarea,
  args: { placeholder: "Enter text..." },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-80 gap-1.5">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, value: "Disabled" },
}
