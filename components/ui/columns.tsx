"use client"

import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "patient",
        header: "Patient",
        cell: ({ row }) => {
            const appointment = row.original;
            return <p className="text-14-medium ">{appointment.patient.name}</p>;
        },
    },
    {
        accessorKey: "schedule",
        header: "Date",
        cell: ({ row }) => {
            const appointment = row.original;
            return <p className="text-14-medium ">{formatDateTime(appointment.schedule).dateTime}</p>;
        }
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "primaryPhysician",
        header: "Doctor",
    },
    {
        accessorKey: "actions",
        header: "Actions",
    },
]
