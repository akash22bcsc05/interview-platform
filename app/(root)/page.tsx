import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import {
  getInterviewsByUserId,
  getLatestInterviews
} from '@/lib/actions/general.action'

const Page = async () => {

  const user = await getCurrentUser();

  const userInterviews = user
    ? await getInterviewsByUserId(user.id)
    : [];

  const latestInterviews = await getLatestInterviews(
    user?.id || undefined
  );

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>
            Get ready with AI-Powered Practice and Feedback Interview
          </h2>

          <p className='text-lg'>
            Practice on real interview questions, get instant AI feedback.
          </p>

          <div className='flex gap-4 max-sm:flex-col'>

            {user ? (
              <>
                <Button asChild className='btn-primary max-sm:w-full'>
                  <Link href='/interview'>
                    Start an Interview
                  </Link>
                </Button>

                <Button asChild className='btn-primary max-sm:w-full'>
                  <Link href='https://chatbot-coder.vercel.app/'>
                    Start Coding
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className='btn-primary max-sm:w-full'>
                  <Link href='/sign-in'>
                    Sign In
                  </Link>
                </Button>

                <Button asChild className='btn-primary max-sm:w-full'>
                  <Link href='/sign-up'>
                    Sign Up
                  </Link>
                </Button>
              </>
            )}

          </div>
        </div>

        <Image
          src='/robot.png'
          alt='robot'
          width={400}
          height={400}
          className='max-sm:hidden'
        />
      </section>

      {/* ONLY SHOW USER INTERVIEWS AFTER LOGIN */}

      {user && (
        <section className='flex flex-col gap-6 mt-8'>
          <h2>Your Interviews</h2>

          <div className='interviews-section'>
            {hasPastInterviews ? (
              userInterviews.map((interview) => (
                <InterviewCard
                  {...interview}
                  key={interview.id}
                />
              ))
            ) : (
              <p>You haven't taken any interviews yet.</p>
            )}
          </div>
        </section>
      )}

      {/* PUBLIC SECTION */}

      <section className='flex flex-col gap-6 mt-8'>
        <h2>
          {user ? 'Take an Interview' : 'Explore Interviews'}
        </h2>

        <div className='interviews-section'>
          {hasUpcomingInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard
                {...interview}
                key={interview.id}
              />
            ))
          ) : (
            <p>There are no interviews available.</p>
          )}
        </div>
      </section>
    </>
  )
}

export default Page