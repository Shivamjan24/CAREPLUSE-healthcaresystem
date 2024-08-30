import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Appointment } from "@/types/appwrite.types"
import clsx from "clsx"
import { Appointmentform } from "../forms/Appointmentform"
import { useState } from "react"


const AppointmentModal = ({ type, patientid, userid, appointment, title, description }: { type: "schedule" | "cancel", patientid: string, userid: string, appointment: Appointment, title?: string, description?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className={`capitalize ${type === "schedule" && "text-green-500"}`}>{type}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <Appointmentform type={type} patientid={patientid} userid={userid} appointment={appointment} setOpen={setOpen} />

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AppointmentModal