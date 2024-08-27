import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const Success = async ({ params: { id }, searchParams }: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || "";
    const appointment = await getAppointment(appointmentId);

    const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
    );

    const schedule = appointment.schedule

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mt-8 mb-16">
                <Image
                    src="/assets/icons/logo-full.svg"
                    height={1000}
                    width={1000}
                    alt="patient"
                    className="mb-12 h-10 w-fit"
                />
            </div>
            <div>
                <Image
                    src="/assets/gifs/success.gif"
                    height={600}
                    width={600}
                    alt="success"
                    className="mb-4 w-fit"
                    unoptimized
                />
            </div>
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Your <span className="text-green-500">appointment request</span> has been successfully submitted!</h1>
            </div>
            <p className="text-gray-400">We'll be in touch shortly to confirm.</p>
            <div className="mt-8 flex sm:flex-row border-y items-center border-gray-800 py-8">
                <p className="text-lg text-gray-400">Requested Appointment Details: </p>
                <div className="ml-6 flex flex-row items-center border border-gray-800  py-2 px-2">
                    <Image
                        src={doctor?.image!}
                        height={50}
                        width={50}
                        alt="success"
                        className="w-fit"
                    />
                    <p className="text-gray-400 ml-2">{doctor?.name}</p>
                </div>
                <div className="ml-6 flex flex-row items-center border border-gray-800  py-2 px-2">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={1000}
                        width={1000}
                        alt="success"
                        className="w-fit"
                    />
                    <p className="text-gray-400 ml-2">{formatDateTime(appointment.schedule).dateTime}</p>
                </div>
            </div>

            <Button variant="outline" className="shad-primary-btn mt-6" asChild>
                <Link href={`/patients/${id}/new-appointment`}>
                    New Appointment
                </Link>
            </Button>

            <p className="copyright mt-10">© 2024 CarePluse</p>
        </div>
    )
}

export default Success;