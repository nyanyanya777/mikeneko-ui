import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  HomeIcon,
  InboxIcon,
  CalendarIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar"

const meta = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  { title: "Home", icon: HomeIcon },
  { title: "Inbox", icon: InboxIcon },
  { title: "Calendar", icon: CalendarIcon },
  { title: "Search", icon: SearchIcon },
  { title: "Settings", icon: SettingsIcon },
]

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-3 text-sm font-semibold">
          mikeneko UI
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Page Content</span>
        </header>
        <div className="p-4 text-sm text-muted-foreground">
          Main content area. Use the trigger to collapse the sidebar.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
}

export const Active: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, i) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={i === 0}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 text-sm text-muted-foreground">Content</div>
      </SidebarInset>
    </SidebarProvider>
  ),
}
