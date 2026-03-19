import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AlertCircleIcon, InfoIcon } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "./alert"

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <InfoIcon />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>This is an informational alert.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
    </Alert>
  ),
}
