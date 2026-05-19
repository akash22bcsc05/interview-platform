'use client'

import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Page = () => {

    const { signOut } = useClerk();
    const router = useRouter();

    useEffect(() => {

        const logout = async () => {

            await signOut();

            router.push('/sign-in');
        };

        logout();

    }, []);

    return (
        <p className="text-center mt-20">
            Signing out...
        </p>
    );
};

export default Page;