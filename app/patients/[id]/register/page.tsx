
import Image from "next/image";
import { Patientform } from "@/components/forms/Patientform";
import Registerform from "@/components/forms/Registerform";
import { getUser } from "@/lib/actions/patient.actions";

export default async function Register({ params: { id } }: SearchParamProps) {

    const user = await getUser(id);
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[496px]">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />


                    <Registerform user={user} />
                    <div className="text-14-regular mt-20 flex justify-between">
                        <p className="justify-items-end text-dark-600 xl:text-left">
                            © 2024 CarePluse
                        </p>
                    </div>
                </div>
            </section>

            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="appointment"
                className="side-img max-w-[25%]"
            />

        </div>
    );
}
