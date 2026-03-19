import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="p-4 text-sm text-muted-foreground">
          Make changes to your account here.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="p-4 text-sm text-muted-foreground">
          Change your password here.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="p-4 text-sm text-muted-foreground">
          Adjust your settings here.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="p-4 text-sm text-muted-foreground">Overview content.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="p-4 text-sm text-muted-foreground">Analytics content.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="p-4 text-sm text-muted-foreground">Reports content.</p>
      </TabsContent>
    </Tabs>
  ),
}
