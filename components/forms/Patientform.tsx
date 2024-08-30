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
import toast from "react-hot-toast"



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
    let load;
    try {
      setisloading(true);
      load = toast.loading("Loading");
      const user = { name: values.name, email: values.email, phone: values.phone }
      const result = await createUser(user)
      if (result.type === "new") {
        router.push(`/patients/${result.$id}/register`);
        toast.dismiss(load);
        toast.success("User signed up")
      }
      else if (result.type === "existing") {
        router.push(`/patients/${result.$id}/new-appointment`);
        toast.dismiss(load);
        toast.success("User logged in")
      }
      setisloading(false);
    }
    catch (error) {
      console.log(error)
      toast.dismiss(load);
      toast.error("Something went wrong");
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
