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
} from "../appwrite.config";
import { parseStringify } from "./utils";
import { IdentificationTypes } from "@/constants";
import { InputFile } from 'node-appwrite/file'

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
    try {
        const newuser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        );
        console.log(newuser)
        return parseStringify(newuser);

    } catch (error: any) {
        // Check existing user
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal("email", [user.email]),
            ]);

            return existingUser.users[0];
        }
        console.error("An error occurred while creating a new user:", error);
    }
};

export const getUser = async (userid: string) => {
    try {
        const result = await users.get(
            userid
        );
        return parseStringify(result);
    }
    catch (error) {
        console.error(
            "An error occurred while retrieving the user details:",
            error
        );
    }
};

export const registerPatient = async ({ identificationDocument, ...patients }: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const inputfile = InputFile.fromBuffer(identificationDocument?.get("blobFile") as Blob, identificationDocument?.get("fileName") as string)

            file = await storage.createFile(STORAGE_BUCKET!, ID.unique(), inputfile);
        }
        const newpatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocument: file?.$id
                    ? `${ENDPOINT}/storage/buckets/${STORAGE_BUCKET}/files/${file.$id}/view??project=${PROJECT_ID}`
                    : null,
                ...patients,
            }
        )
        return parseStringify(newpatient);
    }
    catch (error) {
        console.error("An error occurred while creating a new patient:", error);
    }
};

export const getPatient = async (userid: string) => {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal("userId", [userid])] // queries (optional)
        );
        return parseStringify(result);
    }
    catch (error) {
        console.error("An error occurred while retrieving info of patient:", error);
    }
}