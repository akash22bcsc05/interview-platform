import Agent from "@/components/Agent";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";


const Page = async () => {
  const user = await getCurrentUser();

  

  return (
    <>
      {!user ? (
        <section className="flex flex-col items-center justify-center gap-8 py-20">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl font-bold text-primary-100">
              HireEdge AI
            </h1>

            <p className="mt-6 text-lg text-light-100">
              Practice AI-powered mock interviews for Software Engineering,
              AI/ML, React, System Design, DSA, and more.
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="bg-primary-200 px-6 py-3 rounded-lg"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="bg-dark-300 px-6 py-3 rounded-lg"
            >
              Sign Up
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h3>Welcome back, {user.name}</h3>
            <p className="text-light-100">
              Generate personalized AI interviews.
            </p>
          </div>

          <Agent
            userName={user.name}
            userId={user.id}
            type="generate"
          />

          <section className="mt-10">
            {/* <h3>Your Interviews</h3> */}

            {/* interview cards go here */}
          </section>
        </>
      )}
    </>
  );
};

export default Page;