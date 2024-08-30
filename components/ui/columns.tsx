"use client"

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table"
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import AppointmentModal from "./AppointmentModal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "patient",
        header: "Patient",
        cell: ({ row }) => {
            const appointment = row.original;
            return <p className="text-14-medium ">{appointment.patient?.name}</p>;
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
        cell: ({ row }) => {
            const appointment = row.original;
            let img;
            switch (appointment.status) {
                case "pending":
                    img = "/assets/icons/pending.svg";
                    break;
                case "cancelled":
                    img = "/assets/icons/close.svg";
                    break;
                case "scheduled":
                    img = "/assets/icons/check.svg";
                    break;
            }
            return (
                <div className={clsx("status-badge flex gap-4", {
                    "bg-green-600": appointment.status === "scheduled",
                    "bg-red-600": appointment.status === "cancelled",
                    "bg-blue-600": appointment.status === "pending",
                })}>
                    <Image src={img} width={24} height={24} alt={appointment.status} />
                    <p className={clsx({
                        "text-green-500": appointment.status === "scheduled",
                        "text-red-500": appointment.status === "cancelled",
                        "text-blue-500": appointment.status === "pending",
                    })}>{appointment.status}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "primaryPhysician",
        header: "Doctor",
        cell: ({ row }) => {
            const appointment = row.original;
            const doctor = Doctors.find(
                (doctor) => doctor.name === appointment.primaryPhysician
            );

            return (
                <div className="flex items-center gap-3">
                    <Image
                        src={doctor?.image!}
                        alt="doctor"
                        width={100}
                        height={100}
                        className="size-8"
                    />
                    <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
                </div>
            );
        }
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const appointment = row.original;
            return (
                <div className="flex gap-4">
                    <AppointmentModal type="schedule" patientid={appointment.patient.$id} userid={appointment.userId} appointment={appointment} title="Schedule Appointment" description="Please fill in the details to schedule appointment" />
                    <AppointmentModal type="cancel" patientid={appointment.patient.$id} userid={appointment.userId} appointment={appointment} title="Cancel Appointment" description="Please fill in the details to cancel appointment" />
                </div>);
        }
    },
]
