import { ReactNode } from 'react'
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from '@/lib/actions/auth.action'

const RootLayout = async ({
    children
}: {
    children: ReactNode
}) => {

    const user = await getCurrentUser();

    return (

        <div className='root-layout'>

            <nav className='flex items-center justify-between'>

                <Link
                    href='/'
                    className="flex items-center gap-2"
                >
                    <Image
                        src='/logo.svg'
                        alt="logo"
                        width={38}
                        height={32}
                    />

                    <h2 className='text-primary-100'>
                        HireEdge AI
                    </h2>
                </Link>

                <div className='flex items-center gap-3'>

                    {user ? (

                        <a
                            href="/sign-out"
                            className='px-4 py-2 rounded-lg bg-primary-200 text-black font-semibold hover:opacity-90 transition'
                        >
                            Sign Out
                        </a>

                    ) : (

                        <>
                            <Link
                                href="/sign-in"
                                className='px-4 py-2 rounded-lg border border-primary-200 text-primary-100 hover:bg-primary-200 hover:text-black transition'
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                className='px-4 py-2 rounded-lg bg-primary-200 text-black font-semibold hover:opacity-90 transition'
                            >
                                Sign Up
                            </Link>
                        </>

                    )}

                </div>

            </nav>

            {children}

        </div>
    )
}

export default RootLayout