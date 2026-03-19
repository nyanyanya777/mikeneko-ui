import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from "./avatar"

const meta = {
  title: "Data Display/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
}
