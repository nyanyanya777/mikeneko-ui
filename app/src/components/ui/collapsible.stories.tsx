import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ChevronsUpDownIcon } from "lucide-react"
import { Button } from "./button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"

const meta = {
  title: "Disclosure/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-semibold">3 items</h4>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <ChevronsUpDownIcon />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 text-sm">Item 1 (always visible)</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-3 py-2 text-sm">Item 2</div>
        <div className="rounded-md border px-3 py-2 text-sm">Item 3</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
