"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import authStyles from "./auth.module.css";

export default function SignIn() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className={authStyles.auth}>
                <button onClick={() => window.location.href = "/profile"}>
                    <Image src={session.user.image} alt="Profile Picture" width={30} height={30} />
                    <p>{session.user.name}</p>
                </button>
            </div>
        );
    }

    return (
        <div className={authStyles.auth}>
            <button onClick={() => signIn("google")}><FaGoogle /></button>
        </div >
    );
}