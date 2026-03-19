import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { Toggle } from "./toggle"

const meta = {
  title: "Input/Toggle",
  component: Toggle,
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: <BoldIcon /> },
}

export const Outline: Story = {
  args: { variant: "outline", children: <ItalicIcon /> },
}

export const WithText: Story = {
  args: { children: <><BoldIcon /> Bold</> },
}

export const Disabled: Story = {
  args: { disabled: true, children: <UnderlineIcon /> },
}
