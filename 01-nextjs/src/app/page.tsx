import { auth } from "@/auth";
import HomeHeader from "@/components/home/home.header";

export default async function Home() {
    const session = await auth();

    return (
        <div>
            Xin chào
            <HomeHeader session={session} />
        </div>
    );
}
