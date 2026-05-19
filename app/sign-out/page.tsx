'use client'

import { useEffect } from 'react';

const Page = () => {

    useEffect(() => {

        // Clear Clerk cookies manually
        document.cookie.split(";").forEach((cookie) => {

            const eqPos = cookie.indexOf("=");

            const name =
                eqPos > -1
                    ? cookie.substr(0, eqPos).trim()
                    : cookie.trim();

            document.cookie =
                `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        });

        // Clear browser storage
        localStorage.clear();
        sessionStorage.clear();

        // Hard reload homepage
        window.location.href = '/';

    }, []);

    return (
        <div className="flex justify-center items-center h-screen">

            <p className="text-lg">
                Signing out...
            </p>

        </div>
    );
};

export default Page;