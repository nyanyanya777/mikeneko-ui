import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchIcon, MailIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from "./input-group"

const meta = {
  title: "Input/InputGroup",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const WithIcon: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
}

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-64">
      <InputGroupInput placeholder="Enter email" />
      <InputGroupButton>
        <MailIcon />
      </InputGroupButton>
    </InputGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <InputGroup className="w-72">
      <InputGroupText>https://</InputGroupText>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
}
