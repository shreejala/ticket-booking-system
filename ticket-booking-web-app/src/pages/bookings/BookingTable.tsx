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
import type { Booking } from "@/types/bookings"
import { TicketTiers } from "@/constants/ticket-tier"

interface Props {
  data: Booking[]
}

export function BookingsTable({ data }: Props) {
  const columns: ColumnDef<Booking>[] = [
    // {
    //   accessorKey: "bookingId",
    //   header: "Booking ID",
    //   cell: ({ row }) => (
    //     <span className="text-xs">{row.original.bookingId}</span>
    //   ),
    // },
    {
      header: "Event",
      cell: ({ row }) => row.original.event.name,
    },
    {
      header: "Venue",
      cell: ({ row }) => row.original.event.venue,
    },
    {
      header: "Event Date",
      cell: ({ row }) =>
        new Date(row.original.event.eventDate).toLocaleString(),
    },
    {
      accessorKey: "userEmail",
      header: "Email",
    },
    {
      header: "Ticket Type",
      cell: ({ row }) => TicketTiers[row.original.ticketTier.name] || '',
    },
    {
      accessorKey: "quantity",
      header: "Qty",
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => `$${row.original.totalAmount}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`rounded-md px-2 py-1 text-xs ${
            row.original.status === "SUCCESS"
              ? "bg-primary text-primary-foreground"
              : "bg-destructive text-white"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "bookedAt",
      header: "Booked At",
      cell: ({ row }) => new Date(row.original.bookedAt).toLocaleString(),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full rounded-md border border-border bg-background">
      <Table className="w-full">
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="transition-colors hover:bg-accent"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
