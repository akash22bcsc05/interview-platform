import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {

    await auth().signOut();

    redirect("/");
}