"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SignIn() {
    const { data: session } = useSession();
    const router = useRouter();

    if (session) {
        return (
            <div className="container container-center">
                <Image src={session.user.image} alt="Profile Picture" width={50} height={50} />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }

    return (
        <div className="container container-center">
            <button onClick={() => signIn("google", { callbackUrl: "/profile" })}>Signin with Google</button>
        </div>
    );
}