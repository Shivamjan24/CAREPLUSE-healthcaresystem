"use server"

import { ID, Query } from "node-appwrite";

import {
    storage,
    users,
    STORAGE_BUCKET,
    databases,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    ENDPOINT,
    PROJECT_ID,
    APPOINTMENT_COLLECTION_ID,
    messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "./utils";
import { Appointment } from "@/types/appwrite.types";


export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newappointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )
        return parseStringify(newappointment);
    }
    catch (error) {
        console.error("An error occurred while creating a new patient:", error);
    }
}

export const getAppointment = async (id: string) => {
    try {
        const appointmentlist = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            id
        );
        return parseStringify(appointmentlist)
    }
    catch (error) {
        console.error("An error occurred while retrieving appointment:", error);
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointmentlist = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")],

        );
        const initialvalues = {
            scheduled: 0,
            pending: 0,
            cancelled: 0
        }
        const result = (appointmentlist.documents as Appointment[]).reduce((acc, appointment) => {
            switch (appointment.status) {
                case "scheduled":
                    {
                        acc.scheduled += 1;
                        break;
                    }
                case "pending":
                    {
                        acc.pending += 1;
                        break;
                    }
                case "cancelled":
                    {
                        acc.cancelled += 1;
                        break;
                    }
            }
            return acc;
        }, initialvalues)
        const response = {
            ...result,
            total: appointmentlist.total,
            listt: appointmentlist.documents
        }
        return parseStringify(response);
    }
    catch (error) {
        console.error("An error occurred while retrieving appointments:", error);
    }
}

export const Updateappointment = async ({ appointmentid, appointment }: UpdateAppointmentParams) => {
    try {
        const updated = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentid,
            appointment
        );
        return parseStringify(updated);

    }
    catch (error) {
        console.error("An error occurred while updating appointment:", error);
    }
}
export const sendsms = async (appointment: Appointment, type: "create" | "schedule" | "cancel") => {
    try {
        const result = await messaging.createSms(
            ID.unique(), // messageId
            `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`, // content
            [],
            [appointment.userId]
        );
        return parseStringify(result);
    }
    catch (error) {
        console.error("An error occurred while sending sms:", error);
    }
}

export const sendsmspending = async (appointment: Appointment) => {
    try {
        const result = await messaging.createSms(
            ID.unique(), // messageId
            `Greetings from CarePulse. Your appointment has been requested for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}.`, // content
            [],
            [appointment.userId]
        );
        return parseStringify(result);
    }
    catch (error) {
        console.error("An error occurred while sending sms:", error);
    }
}