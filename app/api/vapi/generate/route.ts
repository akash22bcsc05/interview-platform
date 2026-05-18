import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { NextResponse as Response } from "next/server";

export async function POST(request: Request) {
  console.log("POST HIT FROM WEB APP");
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: `You are an API. 
Return ONLY a valid JSON array.

Generate exactly ${Number(amount)} interview questions.

Role: ${role}
Level: ${level}
Techstack: ${techstack}
Focus: ${type}

STRICT RULES:
- Output must be valid JSON
- No explanation
- No numbering
- No extra text

Example:
["Question 1","Question 2"]`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("OpenRouter Response:", data);

   
    let text = data?.choices?.[0]?.message?.content || "";
    console.log("RAW TEXT:", text);

    let parsedQuestions: string[] = [];

    try {
      // clean markdown
      let clean = text.replace(/```json|```/g, "").trim();

      // extract JSON array
      const match = clean.match(/\[.*\]/s);
      if (match) {
        parsedQuestions = JSON.parse(match[0]);
      } else {
        throw new Error("No JSON found");
      }

    } catch (err) {
      console.log("Fallback parsing...");

      // 🔥 fallback: split text into lines/questions
      parsedQuestions = text
        .split(/[\n?]+/)
        .map(q => q.replace(/^\d+\.?\s*/, "").trim())
        .filter(q => q.length > 5);
    }

    // 🔥 FINAL SAFETY (never empty)
    if (!parsedQuestions || parsedQuestions.length === 0) {
      parsedQuestions = [
        "Explain React lifecycle methods.",
        "What is server-side rendering in Next.js?",
        "Difference between CSR and SSR?",
        "What is useEffect and when is it used?",
        "How does React handle state updates?"
      ];
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Saving Interview:", interview);
    const docRef = await db.collection("interviews").add(interview);
    console.log("INTERVIEW SAVED:", docRef.id);

    return Response.json({ success: true, interviewId: docRef.id, }, { status: 200 });

  } catch (error: any) {
    console.error("Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}