"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl
} from "@/components/ui/form"
import { Customformfield } from "@/components/ui/Customformfield"
import { registerformvalidation, userformvalidation } from "@/lib/userformvalidation"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


import { Formfieldtypes } from "./Patientform"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select"

import Image from "next/image"
import FileUploader from "../ui/FileUploader"
const Registerform = ({ user }: { user: User }) => {
    // ...

    const [isloading, setisloading] = useState(false);
    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof registerformvalidation>) => {
        let formdata = new FormData();
        if (values.identificationDocument && values.identificationDocument?.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type })
            formdata.append("blobFile", blobFile)
            formdata.append("fileName", values.identificationDocument[0].name)
        }
        try {
            setisloading(true);
            const patient = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                userId: user.$id,
                birthDate: values.birthDate,
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument ? formdata : undefined,
                privacyConsent: values.privacyConsent,
                disclosureConsent: values.disclosureConsent,
                treatmentConsent: values.treatmentConsent
            }
            const newPatient = await registerPatient(patient);
            if (newPatient) {
                router.push(`/patients/${user.$id}/new-appointment`);
            }
            setisloading(false);
        }
        catch (error) {
            console.log(error)
        }
    }
    const form = useForm<z.infer<typeof registerformvalidation>>({
        resolver: zodResolver(registerformvalidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: user.name,
            email: user.email,
            phone: user.phone,
        }
    })
    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="mb-9 space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Share more about yourself.</p>
                </section>

                <section className="mb-9 space-y-4">
                    <h1 className="sub-header">Personal Information</h1>
                </section>
                <div className="w-[130%]">
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield control={form.control} name="name" label="Full Name" fieldtype={Formfieldtypes.INPUT} placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="User" />
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="email" label="Email" fieldtype={Formfieldtypes.INPUT} placeholder="JohnDoe@gmail.com" iconSrc="/assets/icons/email.svg" iconAlt="Email" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="phone" label="Phone number" fieldtype={Formfieldtypes.PHONEINPUT} placeholder="(255) 123-4567" />
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="birthDate" label="Date of birth" fieldtype={Formfieldtypes.DATE_PICKER} placeholder="Select your birth date" iconSrc="/assets/icons/calendar.svg" iconAlt="Calendar" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="gender" label="Gender" fieldtype={Formfieldtypes.SKELETON} renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        {GenderOptions.map((option, i) => {
                                            return (<div key={option + i} className="radio-group">
                                                <RadioGroupItem value={option} id={option} />
                                                <Label htmlFor={option}>{option}</Label>
                                            </div>)
                                        })}

                                    </RadioGroup>
                                </FormControl>
                            )} />
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="address" label="Address" fieldtype={Formfieldtypes.INPUT} placeholder="10th street,New York" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="occupation" label="Occupation" fieldtype={Formfieldtypes.INPUT} placeholder="Software Engineer" />
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="emergencyContactName" label="Emergency Contact Name" fieldtype={Formfieldtypes.INPUT} placeholder="Guardian Name" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="emergencyContactNumber" label="Emergency Contact Number" fieldtype={Formfieldtypes.PHONEINPUT} placeholder="(255) 123-4567" />
                        </div>
                    </div>
                </div>
                <section className="mb-9 mt-9 space-y-4">
                    <h1 className="sub-header">Medical Information</h1>
                </section>
                <div className="w-[130%]">
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
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="insuranceProvider" label="Insurance Provider" fieldtype={Formfieldtypes.INPUT} placeholder="ex:LIC" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="insurancePolicyNumber" label="Insurance Policy Number" fieldtype={Formfieldtypes.INPUT} placeholder="ex:ABC1234567" />
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="allergies" label="Allergies(if any)" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:peanuts,lactose" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="currentMedication" label="Current Medications" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:paracetamol 500gm,adliv" />
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="familyMedicalHistory" label="Family Medical History" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:father has type 1 diabetes, mother is allergic to peanuts" />
                        </div>
                        <div className="w-1/2">
                            <Customformfield control={form.control} name="pastMedicalHistory" label="Past Medical History" fieldtype={Formfieldtypes.TEXTAREA} placeholder="ex:asthma,jaundice" />
                        </div>
                    </div>
                </div>
                <section className="mb-9 mt-9 space-y-4">
                    <h1 className="sub-header">Identification and Verification</h1>
                </section>
                <div className="w-[130%]">
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield control={form.control} name="identificationType" label="Identification Type" fieldtype={Formfieldtypes.SELECT} placeholder="Select a identification type">
                            {IdentificationTypes.map((ide, i) => {
                                return (
                                    <SelectItem key={ide + i} value={ide}>
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <p>{ide}</p>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </Customformfield>
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield control={form.control} name="identificationNumber" label="Identification Number" fieldtype={Formfieldtypes.INPUT} placeholder="1234567" />
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield
                            fieldtype={Formfieldtypes.SKELETON}
                            control={form.control}
                            name="identificationDocument"
                            label="Scanned Copy of Identification Document"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <FileUploader files={field.value} onChange={field.onChange} />
                                </FormControl>
                            )}
                        />
                    </div>

                </div>
                <section className="mb-9 mt-9 space-y-4">
                    <h1 className="sub-header">Consent and Privacy</h1>
                </section>
                <div className="w-[130%]">
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield
                            fieldtype={Formfieldtypes.CHECKBOX}
                            control={form.control}
                            name="treatmentConsent"
                            label="I consent to recieve treatment for my health condition"
                        />
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield
                            fieldtype={Formfieldtypes.CHECKBOX}
                            control={form.control}
                            name="disclosureConsent"
                            label="I consent to the use and dislosure of my health conditions for treatment purposes"
                        />
                    </div>
                    <div className="flex md:flex-row flex-col gap-2 mb-4">
                        <Customformfield
                            fieldtype={Formfieldtypes.CHECKBOX}
                            control={form.control}
                            name="privacyConsent"
                            label="I acknowledge that i have reviewed and agree to the privacy policy"
                        />
                    </div>
                </div>
                <Button type="submit" className="border-solid border-white bg-green-500">Get started</Button>
            </form>
        </Form>
    )
}

export default Registerform;