import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

type propss = {
    icon: string,
    numb: string,
    label: string,
    type: "scheduled" | "pending" | "cancelled"
}

const Counter = ({ icon, numb, label, type }: propss) => {
    return (


        <div className={clsx("stat-card flex flex-col items-center space-y-6 py-7 px-6 rounded-lg", {
            "bg-appointments": type === "scheduled",
            "bg-pending": type === "pending",
            "bg-cancelled": type === "cancelled",
        })}>
            <div className="flex flex-row space-x-4 items-center justify-start">
                <Image src={icon} width={30} height={30} alt="scheduled" />
                <h1 className="text-xl font-bold">{numb}</h1>
            </div>
            <div className="flex justify-start">
                <p className="text-sm font-medium">{label}</p>
            </div>
        </div>
    )
}

export default Counter