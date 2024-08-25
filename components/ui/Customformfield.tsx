"use client"

import {

    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form";
import { Formfieldtypes } from "../forms/Patientform";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput, { type Value } from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"




interface Customprops {
    control: Control<any>,
    name: string,
    placeholder?: string,
    label?: string,
    description?: string,
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldtype: Formfieldtypes
}

export const Renderfield = ({ field, props }: { field: any, props: Customprops }) => {
    const { placeholder, fieldtype } = props
    switch (fieldtype) {
        case Formfieldtypes.INPUT:
            {
                return (
                    <div className="flex space-x-4 rounded-lg border border-gray-500 bg-dark-500">
                        {props.iconSrc && (<Image src={props.iconSrc} height={24} width={24} alt={props.iconAlt || "icon"} className="ml-2" />)}
                        <FormControl>
                            <Input placeholder={placeholder} {...field} className="rounded-lg border border-gray-500 bg-black" />
                        </FormControl>
                        <FormMessage />
                    </div>
                )
            }
        case Formfieldtypes.SELECT:
            {
                return (
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={props.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="shad-select-content">
                                {props.children}
                            </SelectContent>
                        </Select>
                    </FormControl>
                )
            }
        case Formfieldtypes.PHONEINPUT:
            {
                return (
                    <FormControl>
                        <PhoneInput
                            defaultCountry="US"
                            placeholder={props.placeholder}
                            international
                            withCountryCallingCode
                            value={field.value as E164Number | ""}
                            onChange={field.onChange}
                            className="input-phone" />
                    </FormControl>
                )
            }
        case Formfieldtypes.TEXTAREA:
            {
                return (
                    <FormControl>
                        <Textarea placeholder={props.placeholder}
                            {...field}
                            className="shad-textArea"
                            disabled={props.disabled} />
                    </FormControl>
                )
            }
        case Formfieldtypes.CHECKBOX:
            {
                return (
                    <FormControl>
                        <div className="flex items-center space-x-2">
                            <Checkbox id={props.name}
                                checked={field.value}
                                onCheckedChange={field.onChange} />
                            <label
                                htmlFor={props.name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {props.label}
                            </label>
                        </div>
                    </FormControl>
                )
            }
        case Formfieldtypes.DATE_PICKER:
            {
                return (
                    <div className="flex rounded-md border border-dark-500 bg-dark-400">
                        <Image
                            src="/assets/icons/calendar.svg"
                            height={24}
                            width={24}
                            alt="user"
                            className="ml-2"
                        />
                        <FormControl>
                            <DatePicker
                                showTimeSelect={props.showTimeSelect ?? false}
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                timeInputLabel="Time:"
                                dateFormat={props.dateFormat ?? "dd/MM/yyyy"}
                                wrapperClassName="date-picker"
                            />
                        </FormControl>
                    </div>
                )
            }
        case Formfieldtypes.SKELETON:
            {
                return props.renderSkeleton ? props.renderSkeleton(field) : null;
            }
    }
}

export const Customformfield = (props: Customprops) => {
    const { control, name, label, placeholder, fieldtype } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormField
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            {props.fieldtype !== Formfieldtypes.CHECKBOX && label && (
                                <FormLabel className="shad-input-label">{label}</FormLabel>
                            )}
                            <Renderfield field={field} props={props} />

                            <FormMessage className="shad-error" />
                        </FormItem>
                    )}
                />
            )}
        />
    )
}
