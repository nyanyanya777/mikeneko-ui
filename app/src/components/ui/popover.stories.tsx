import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

const meta = {
  title: "Overlay/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open Popover
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="auto" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
