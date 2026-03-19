import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"
import { Calendar } from "./calendar"

const meta = {
  title: "Input/Calendar",
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
    )
  },
}

export const Range: Story = {
  render: function Render() {
    const [range, setRange] = React.useState<{ from: Date; to?: Date }>({
      from: new Date(),
    })
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={(r) => r && setRange(r)}
        numberOfMonths={2}
        className="rounded-lg border"
      />
    )
  },
}
