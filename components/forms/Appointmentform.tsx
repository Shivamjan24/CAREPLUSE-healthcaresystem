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
import { useState } from "react"
import { createUser } from "@/lib/actions/patient.actions"
import { Formfieldtypes } from "./Patientform"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment } from "@/lib/actions/appointment.actions"



export function Appointmentform({ type = "create", patientid, userid }: {
    type: "create" | "schedule" | "cancel",
    patientid: string,
    userid: string
}) {
    // ...
    const [isloading, setisloading] = useState(false);
    const router = useRouter();
    const schema = getAppointmentSchema(type);
    console.log(patientid)

    const onSubmit = async (values: z.infer<typeof schema>) => {
        let status: Status;
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
            if (type === "create") {
                const appointment: CreateAppointmentParams = {
                    userId: userid,
                    patient: patientid,
                    status: status,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    note: values.note,
                    schedule: values.schedule
                }
                const response = await createAppointment(appointment);
                if (response) {
                    form.reset()
                    console.log(response)
                    router.push(`/patients/${userid}/new-appointment/success?appointmentId=${response.$id}`)
                }
            }

        }
        catch (error) {
            console.log(error)
        }
    }
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: "",
        }
    })
    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hey there 👋</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
                </section>
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
                    <Button type="submit" className="border-solid border-white bg-green-500 w-[100%] text-center">Submit and Continue</Button>
                </div>
            </form>
        </Form>
    )
}
