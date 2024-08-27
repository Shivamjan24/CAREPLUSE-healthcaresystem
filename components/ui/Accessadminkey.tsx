"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { decryptKey, encryptKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ENDPOINT, NEXT_PUBLIC_ADMIN_PASSKEY } from "@/lib/appwrite.config";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from "next/image";




const Accessadminkey = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [key, setkey] = useState("");
    const [error, setError] = useState("");
    const path = usePathname();

    const encryptedKey =
        typeof window !== "undefined"
            ? window.localStorage.getItem("adminkey")
            : null;

    useEffect(() => {
        const accesskey = encryptedKey && decryptKey(encryptedKey)
        if (path) {
            if (accesskey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false);
                router.push("/admin");
            }
            else {
                setOpen(true);
            }
        }
    }, [encryptKey])

    const closemodal = () => {
        setOpen(false);
        router.push("/")
    }

    const validate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log(key, process.env.NEXT_PUBLIC_ADMIN_PASSKEY)
        if (key === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedkey = encryptKey(key);
            localStorage.setItem("adminkey", encryptedkey);
            setOpen(false);
            router.push("/admin");
        }
        else {
            setError("Incorrect passkey, please enter correct passkey");
        }
    }
    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-between">
                            <div>Access Verification</div>
                            <div onClick={closemodal}><Image src="/assets/icons/close.svg" height={30} width={30} alt="close" className="cursor-pointer" /></div>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            To access the admin page, please enter the passkey...
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex flex-col">
                        <div className="flex justify-center items-center">
                            <InputOTP maxLength={6} value={key} onChange={(value) => setkey(value)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        {error && (
                            <p className="shad-error text-14-regular mt-4 flex justify-center">
                                {error}
                            </p>
                        )}

                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction className="shad-primary-btn w-full" onClick={(e) => validate(e)}>Enter admin panel</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Accessadminkey;