import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { Event } from "@/types/event"
import { useState } from "react"
import { EventDetailsDialog } from "./EventDetails"
import type { BookingPayloadRequest } from "@/types/bookings"

interface DataTableProps {
  data: Event[]
  onBookingPress: (data: BookingPayloadRequest) => void
  isBookingLoading: boolean
  processStatus: string | null
}

export const EventTable = ({ data, onBookingPress, isBookingLoading, processStatus }: DataTableProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [open, setOpen] = useState(false)

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Event Name",
    },
    {
      accessorKey: "venue",
      header: "Venue",
    },
    {
      accessorKey: "eventDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.eventDate)
        return date.toLocaleString()
      },
    },
    {
      id: "actions",
      header: "Details",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedEvent(row.original)
              setOpen(true)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="w-full">
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EventDetailsDialog
        open={open}
        onOpenChange={setOpen}
        event={selectedEvent}
        onBookingPress={onBookingPress}
        isBookingLoading={isBookingLoading}
        processStatus={processStatus}
      />
    </div>
  )
}
