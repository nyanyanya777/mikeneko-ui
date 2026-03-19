import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu"

const meta = {
  title: "Navigation/NavigationMenu",
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4">
              <NavigationMenuLink asChild>
                <a
                  className="flex select-none flex-col gap-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
                  href="#"
                >
                  <div className="text-sm font-medium">Introduction</div>
                  <p className="text-sm leading-snug text-muted-foreground">
                    Re-usable components built with shadcn/ui.
                  </p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="flex select-none flex-col gap-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
                  href="#"
                >
                  <div className="text-sm font-medium">Installation</div>
                  <p className="text-sm leading-snug text-muted-foreground">
                    How to install dependencies and structure your app.
                  </p>
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <NavigationMenuLink asChild>
                <a
                  className="flex select-none flex-col gap-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
                  href="#"
                >
                  <div className="text-sm font-medium">Alert Dialog</div>
                  <p className="text-sm leading-snug text-muted-foreground">
                    A modal dialog for important content.
                  </p>
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="flex select-none flex-col gap-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent"
                  href="#"
                >
                  <div className="text-sm font-medium">Hover Card</div>
                  <p className="text-sm leading-snug text-muted-foreground">
                    For sighted users to preview content.
                  </p>
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
