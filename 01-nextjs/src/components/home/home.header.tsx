"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "antd";

export default function HomeHeader(props: any) {
    // const { data: session, status } = useSession();
    // console.log("Session data:", session);
    const { session } = props;
    return (
        <div>
            Đây là header nhé: {session?.user.email}
            <div>
                <Button onClick={() => signOut()}>Đăng xuất</Button>
            </div>
        </div>
    );
}
