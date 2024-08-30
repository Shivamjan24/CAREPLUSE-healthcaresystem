"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Customformfield } from "@/components/ui/Customformfield"
import { getAppointmentSchema, userformvalidation } from "@/lib/userformvalidation"

import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { createUser } from "@/lib/actions/patient.actions"
import { Formfieldtypes } from "./Patientform"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, sendsms, sendsmspending, Updateappointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"
import { revalidatePath } from "next/cache"
import toast from "react-hot-toast"



export function Appointmentform({ type, patientid, userid, appointment, setOpen }: {
    type: "create" | "schedule" | "cancel",
    patientid: string,
    userid: string,
    appointment?: Appointment,
    setOpen?: Dispatch<SetStateAction<boolean>>
}) {
    // ...
    const [isloading, setisloading] = useState(false);
    const router = useRouter();
    const schema = getAppointmentSchema(type);
    console.log(patientid)

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : "",
            schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment ? appointment.note : "",
            cancellationReason: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof schema>) => {
        let status: Status;
        let load;
        console.log("i am here")
        switch (type) {
            case "create":
                status = "pending";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "scheduled";
        }
        try {
            load = toast.loading("Request in process")
            if (type === "create") {
                const appointment: CreateAppointmentParams = {
                    userId: userid,
                    patient: patientid,
                    status: status,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    note: values.note,
                    schedule: values.schedule,
                }
                const response = await createAppointment(appointment);
                if (response) {
                    form.reset()
                    toast.dismiss(load)
                    toast.success("new appointment created successfully")
                    const result = await sendsmspending(response);
                    console.log(response)
                    router.push(`/patients/${userid}/new-appointment/success?appointmentId=${response.$id}`)
                }

            }
            else {
                const appointmenttoupdate: UpdateAppointmentParams = {
                    appointmentid: appointment!.$id,
                    appointment: {
                        status: status,
                        primaryPhysician: values.primaryPhysician,
                        reason: values.reason,
                        schedule: new Date(values.schedule),
                        cancellationReason: values.cancellationReason
                    }
                }
                const updated = await Updateappointment(appointmenttoupdate);
                if (updated) {
                    updated.status === "cancelled" ? toast.success("appointment cancelled successfully") : toast.success("appointment scheduled successfully");
                    const response = await sendsms(updated, type);
                    setOpen && setOpen(false);
                    form.reset();
                    toast.dismiss(load)
                }
            }
        }
        catch (error) {
            console.log(error)
            toast.dismiss(load)
        }
    }

    let label: string;
    switch (type) {
        case "create":
            label = "Create New Appointment";
            break;
        case "schedule":
            label = "Schedule New Appointment";
            break;
        case "cancel":
            label = "Cancel Existing Appointment";
    }
    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {type === "create" && <section className="mb-12 space-y-4">
                    <h1 className="header">Hey there 👋</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
                </section>}
                {type !== "cancel" &&
                    <div className="w-[100%]">
                        <div className="flex md:flex-row flex-col gap-2 mb-4">
                            <Customformfield control={form.control} name="primaryPhysician" label="Primary care physician" fieldtype={Formfieldtypes.SELECT} placeholder="Select a physician">
                                {Doctors.map((doctor, i) => {
                                    return (
                                        <SelectItem key={doctor.name + i} value={doctor.name}>
                                            <div className="flex cursor-pointer items-center gap-2">
                                                <Image src={doctor.image} height={32} width={32} alt="Physician" className="rounded-full border border-dark-500" />
                                                <p>{doctor.name}</p>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </Customformfield>

                        </div>
                        <div className="flex sm:flex-row flex-col gap-2 mb-4">
                            <div className="sm:w-1/2">
                                <Customformfield control={form.control} name="reason" label="Reason for aapointment" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:Monthly checkup" />
                            </div>
                            <div className="sm:w-1/2">
                                <Customformfield control={form.control} name="note" label="Additional comments or notes" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:Prefer morning appointments, if possible" />
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col gap-2 mb-4">
                            <Customformfield control={form.control} name="schedule" showTimeSelect label="Expected appointment date" dateFormat="dd/MM/yyyy - h:mm aa" fieldtype={Formfieldtypes.DATE_PICKER} placeholder="Select your appointment date" iconSrc="/assets/icons/calendar.svg" iconAlt="Calendar" />
                        </div>
                    </div>
                }
                {type === "cancel" &&
                    <div className="w-[100%]">
                        <div>
                            <Customformfield control={form.control} name="cancellationReason" label="Reason for cancellation" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:urgent meeting came up" />
                        </div>
                    </div>
                }

                <div className="w-[100%]">
                    <Button type="submit" className={type === "cancel" ? "border-solid border-white bg-red-500 w-[100%] text-center" : "border-solid border-white bg-green-500 w-[100%] text-center"}>{label}</Button>
                </div>
            </form>
        </Form>
    )
}
