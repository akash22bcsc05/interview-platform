'use server'

import { feedbackSchema } from '@/constants';
import { db } from '@/firebase/admin';
import { generateText } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';


export async function getInterviewsByUserId(userId: string): Promise<Interview[]> {
    if (!userId) return [];

    const interviews = await db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();


    return interviews.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(userId?: string, limit = 20) {

    // Guest user
    if (!userId || userId === "undefined" || userId === "null") {

        const interviews = await db
            .collection('interviews')
            .where('finalized', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];
    }

    // Logged in user
    const interviews = await db
        .collection('interviews')
        .where('finalized', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db
        .collection('interviews')
        .doc(id)
        .get();

    if (!interview.exists) return null;

    return {
        id: interview.id,
        ...interview.data()
    } as Interview;
}

export async function createFeedback(
    params: CreateFeedbackParams
) {

    const {
        interviewId,
        userId,
        transcript
    } = params;

    try {

        const formattedTranscript = transcript
            .map(
                (
                    sentence: {
                        role: string;
                        content: string;
                    }
                ) => (
                    ` - ${sentence.role} : ${sentence.content}\n`
                )
            )
            .join("");

        const { text } = await generateText({

            model: openrouter("openrouter/free"),

            prompt: `
Return ONLY valid JSON.

{
  "totalScore": number,
  "categoryScores": {
    "communicationSkills": number,
    "technicalKnowledge": number,
    "problemSolving": number,
    "culturalAndRoleFit": number,
    "confidenceAndClarity": number
  },
  "strengths": [string],
  "areasForImprovement": [string],
  "finalAssessment": string
}

Analyze this interview transcript:

${formattedTranscript}
`,
            system:
                "You are a professional AI interviewer.",
        });

        console.log("RAW AI RESPONSE:", text);

        const clean = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(clean);

        const {
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
        } = parsed;

        const feedback = await db
            .collection('feedback')
            .add({

                interviewId,
                userId,

                totalScore,
                categoryScores,
                strengths,
                areasForImprovement,
                finalAssessment,

                createdAt:
                    new Date().toISOString(),
            });

        return {

            success: true,
            feedbackId: feedback.id,
        };

    } catch (e) {

        console.log(
            'Error saving feedback',
            e
        );

        return {
            success: false,
        };
    }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const feedback = await db
        .collection('feedback')
        .where('interviewId', '==', interviewId)
        .where('userId', '==', userId)
        .limit(1)
        .get();

    if (feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];
    return {
        id: feedbackDoc.id, ...feedbackDoc.data()
    } as Feedback;

}