import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AspectRatio } from "./aspect-ratio"

const meta = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const SixteenByNine: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-48">
      <AspectRatio ratio={1}>
        <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          1:1
        </div>
      </AspectRatio>
    </div>
  ),
}

export const FourByThree: Story = {
  render: () => (
    <div className="w-64">
      <AspectRatio ratio={4 / 3}>
        <div className="flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          4:3
        </div>
      </AspectRatio>
    </div>
  ),
}
