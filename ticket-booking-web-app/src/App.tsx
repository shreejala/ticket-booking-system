import { AppSidebar } from "./components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "./components/ui/sidebar"
import { Route, Routes } from "react-router"
import { EventDashboard, MyBookings } from "./pages"

export function App() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <SidebarInset>
        <header className="flex items-center gap-2 border-b p-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Event Booking</h1>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/dashboard" element={<EventDashboard />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </SidebarInset>
    </div>
  )
}

export default App
