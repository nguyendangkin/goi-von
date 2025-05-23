"use server";

import { signIn } from "@/auth";

export async function authenticate(values: {
    email: string;
    password: string;
}) {
    try {
        const r = await signIn("credentials", {
            ...values,
            redirect: false,
        });

        return r;
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1,
            };
        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2,
            };
        } else {
            return {
                error: "Lỗi từ máy chủ cục bộ",
                code: 0,
            };
        }
    }
}
