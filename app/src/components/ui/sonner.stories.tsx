import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { toast } from "sonner"
import { Button } from "./button"
import { Toaster } from "./sonner"

const meta = {
  title: "Feedback/Sonner",
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        {Story()}
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast("Event has been created.")}
    >
      Show Toast
    </Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.success("Changes saved successfully.")}
    >
      Success Toast
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast.error("Something went wrong.")}
    >
      Error Toast
    </Button>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event created", {
          description: "Sunday, March 19, 2026 at 9:00 AM",
        })
      }
    >
      With Description
    </Button>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event deleted", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      With Action
    </Button>
  ),
}
