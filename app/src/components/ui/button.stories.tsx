import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"
import { MailIcon, LoaderIcon } from "lucide-react"
import { Button } from "./button"

const meta = {
  title: "Action/Button",
  component: Button,
  args: { onClick: fn(), children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Ghost: Story = {
  args: { variant: "ghost" },
}

export const Link: Story = {
  args: { variant: "link" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <MailIcon data-icon="inline-start" />
        Send
      </>
    ),
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <LoaderIcon className="animate-spin" />
        Loading...
      </>
    ),
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Icon: Story = {
  args: {
    variant: "outline",
    size: "icon",
    children: <MailIcon />,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
