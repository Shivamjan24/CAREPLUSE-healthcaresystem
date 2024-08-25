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
import { userformvalidation } from "@/lib/userformvalidation"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createUser } from "@/lib/actions/patient.actions"



export enum Formfieldtypes {
  INPUT = "input",
  CHECKBOX = "checkbox",
  SKELETON = "skeleton",
  SELECT = "select",
  DATE_PICKER = "datePicker",
  PHONEINPUT = "phoneInput",
  TEXTAREA = "textarea"
}

export function Patientform() {
  // ...

  const [isloading, setisloading] = useState(false);
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof userformvalidation>) => {
    try {
      setisloading(true);
      const user = { name: values.name, email: values.email, phone: values.phone }
      const result = await createUser(user)
      if (result) {
        router.push(`/patients/${result.$id}/register`);
      }
      setisloading(false);
    }
    catch (error) {
      console.log(error)
    }
  }
  const form = useForm<z.infer<typeof userformvalidation>>({
    resolver: zodResolver(userformvalidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  })
  return (
    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <Customformfield control={form.control} name="name" label="Full Name" fieldtype={Formfieldtypes.INPUT} placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="User" />
        <Customformfield control={form.control} name="email" label="Email" fieldtype={Formfieldtypes.INPUT} placeholder="JohnDoe@gmail.com" iconSrc="/assets/icons/email.svg" iconAlt="Email" />
        <Customformfield control={form.control} name="phone" label="Phone number" fieldtype={Formfieldtypes.PHONEINPUT} placeholder="(255) 123-4567" />

        <Button type="submit" className="border-solid border-white bg-green-500">Get started</Button>
      </form>
    </Form>
  )
}
