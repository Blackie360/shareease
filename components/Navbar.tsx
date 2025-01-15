import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-16">
        <Link href='/' className="flex items-center gap-2">
          
          <span className="font-bold">Better-auth.</span>
        </Link>

        <div>
          {
            session ? (
              <form action={async () => {
                'use server'
                await auth.api.signOut({
                  headers: await headers()
                });
                redirect('/')
              }}>
                <Button type='submit'>Sign Out</Button>
              </form>
            ) :
              <Link href='/sign-in' className={buttonVariants()}>
                Sign In
              </Link>
          }
        </div>
      </div>

    </div>
  )
}
