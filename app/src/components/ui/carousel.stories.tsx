import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Card, CardContent } from "./card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"

const meta = {
  title: "Data Display/Carousel",
  component: Carousel,
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-4xl font-semibold">{i + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const ThreePerView: Story = {
  render: () => (
    <Carousel className="w-full max-w-sm" opts={{ align: "start" }}>
      <CarouselContent className="-ml-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <CarouselItem key={i} className="basis-1/3 pl-2">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-2xl font-semibold">{i + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}
