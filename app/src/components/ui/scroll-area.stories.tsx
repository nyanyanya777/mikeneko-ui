import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { Separator } from "./separator"

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const tags = Array.from({ length: 50 }).map(
  (_, i) => `v1.2.0-beta.${i + 1}`
)

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-48 rounded-md border">
      <div className="p-3">
        <h4 className="mb-3 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 whitespace-nowrap rounded-md border">
      <div className="flex gap-3 p-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex size-24 shrink-0 items-center justify-center rounded-md border bg-muted text-sm"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}
