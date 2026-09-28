import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { sendFeedbackEmail } from "@/lib/mail";
import {
  emptyAnswers,
  type QuestionnaireAnswers,
  type StoredResponse,
} from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "responses.json");

async function readResponses(): Promise<StoredResponse[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as StoredResponse[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const responses = await readResponses();
  return NextResponse.json({ responses });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<QuestionnaireAnswers>;
  const answers: QuestionnaireAnswers = { ...emptyAnswers, ...body };

  if (
    typeof answers.fullName !== "string" ||
    !answers.fullName.trim() ||
    typeof answers.company !== "string" ||
    !answers.company.trim()
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const stored: StoredResponse = {
    ...answers,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  await mkdir(dataDir, { recursive: true });
  const existing = await readResponses();
  existing.unshift(stored);
  await writeFile(dataFile, JSON.stringify(existing, null, 2), "utf8");

  let emailSent = false;
  try {
    await sendFeedbackEmail(stored);
    emailSent = true;
  } catch (error) {
    console.error("Failed to send feedback email:", error);
  }

  return NextResponse.json({ ok: true, id: stored.id, emailSent });
}
