
import { columns } from "@/components/ui/columns";
import Counter from "@/components/ui/Counter";
import { DataTable } from "@/components/ui/data-table";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";

export const revalidate = 0;

const admin = async () => {

    const data = await getRecentAppointmentList();
    return (
        <div className="h-screen max-h-screen">
            <div className="flex justify-between bg-black px-6 py-4 m-2 rounded-lg items-center">
                <div>
                    <Link href="/">
                        <Image
                            src="/assets/icons/logo-full.svg"
                            height={1000}
                            width={1000}
                            alt="patient"
                            className="h-10 w-fit"
                        />
                    </Link>
                </div>
                <div>
                    <p className="text-lg font-semibold">Admin</p>
                </div>
            </div>
            <div className="px-12 py-8">
                <section className="mb-9 space-y-4">
                    <h1 className="header">Welcome, Admin</h1>
                    <p className="text-dark-700">Start your day with managing new appointments.</p>
                </section>
                <div className="flex flex-row space-x-4 justify-evenly">
                    <Counter icon="/assets/icons/appointments.svg" numb={data.scheduled} label="Total number of scheduled appointments" type="scheduled" />
                    <Counter icon="/assets/icons/pending.svg" numb={data.pending} label="Total number of pending appointments" type="pending" />
                    <Counter icon="/assets/icons/cancelled.svg" numb={data.cancelled} label="Total number of cancelled appointments" type="cancelled" />

                </div>
                <div className="mt-12">
                    <DataTable columns={columns} data={data.listt} />
                </div>
            </div>
        </div>
    )
}

export default admin;