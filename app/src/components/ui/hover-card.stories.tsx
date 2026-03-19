import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CalendarDaysIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"

const meta = {
  title: "Overlay/HoverCard",
  component: HoverCard,
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<a href="#" className="text-sm font-medium underline underline-offset-4" />}>
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm text-muted-foreground">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
              <CalendarDaysIcon className="size-3" />
              <span>Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
