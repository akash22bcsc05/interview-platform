import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
    const feedback = userId && id
        ? await getFeedbackByInterviewId({ interviewId: id, userId })
        : null;
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");

    return (
        <div>
            <div className="card-border w-90 max-sm:w-full min-h-96">

                <div className="card-interview">
                    <div>
                        <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                            <p className="badge-text">{normalizedType}</p>
                        </div>
                        <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className="rounded-full object-cover size-[90px]" />

                        <h3 className="mt-5 capitalize">
                            {role} Interview
                        </h3>

                        <div className="flex flex-row gap-5 mt-3">
                            <div className="flex flex-col gap-2">
                                <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
                                <p>{formattedDate}</p>
                            </div>

                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/star.svg" alt="star" width={22} height={22} />
                                <p
                                    className={
                                        feedback?.totalScore || 0 >= 75
                                            ? "text-green-400"
                                            : feedback?.totalScore || 0 >= 50
                                                ? "text-yellow-400"
                                                : "text-red-400"
                                    }
                                >
                                    {feedback?.totalScore || "---"}/100
                                </p>
                            </div>
                        </div>
                        <div className="mt-5">

                            {feedback ? (

                                <div className="flex flex-col gap-2">

                                    <p className="line-clamp-2 text-sm text-light-100">

                                        {feedback.finalAssessment}

                                    </p>

                                    {feedback.strengths?.length > 0 && (

                                        <div className="flex flex-wrap gap-2 mt-2">

                                            {feedback.strengths
                                                .slice(0, 2)
                                                .map((strength, index) => (

                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 rounded-md bg-primary-200/20 text-primary-100 text-xs"
                                                    >
                                                        {strength}
                                                    </span>

                                                ))}

                                        </div>

                                    )}

                                </div>

                            ) : (

                                <p className="line-clamp-2 text-sm text-light-100">

                                    You haven't taken the interview yet.
                                    Take it now to improve your skills.

                                </p>

                            )}

                        </div>
                    </div>

                    <div className="flex flex-row justify-between">
                        <DisplayTechIcons techStack={techstack} />
                        <Button className="btn-primary">
                            <Link href={feedback ?
                                `/interview/${id}/feedback`
                                :
                                `/interview/${id}`}>
                                {feedback ? "Check Feedback" : "View Interview"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewCard
