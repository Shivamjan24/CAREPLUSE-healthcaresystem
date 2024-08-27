import { Appointmentform } from "@/components/forms/Appointmentform"
import { Patientform } from "@/components/forms/Patientform"
import { getPatient } from "@/lib/actions/patient.actions"
import Image from "next/image"

const appointment = async ({ params: { id } }: SearchParamProps) => {
    const patient = await getPatient(id);
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[700px]">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />


                    <Appointmentform type="create" patientid={patient?.$id} userid={id} />
                    <div className="text-14-regular mt-20 flex justify-between">
                        <p className="justify-items-end text-dark-600 xl:text-left">
                            © 2024 CarePluse
                        </p>
                    </div>
                </div>
            </section>

            <Image
                src="/assets/images/appointment-img.png"
                height={1000}
                width={1000}
                alt="patient"
                className="side-img max-w-[30%]"
            />

        </div>
    )
}

export default appointment