import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ListItem = {
  email: string;
  name: string;
};

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 },
      );
    }

    // Check environment variables
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { participants } = body;

    // Validate participants
    if (!participants?.length) {
      return NextResponse.json(
        { error: "No participants provided" },
        { status: 400 },
      );
    }

    const uniqueEmails = new Set();
    // Validate each participant
    for (const participant of participants) {
      if (!participant?.name || !participant?.email) {
        return NextResponse.json(
          { error: "Missing name or email in one or more participant entries" },
          { status: 400 },
        );
      }
      uniqueEmails.add(participant.email);
    }

    if (!(participants.length === uniqueEmails.size)) {
      return NextResponse.json(
        { error: "Not all emails are unique" },
        { status: 400 },
      );
    }

    function isValidShuffle(
      original: ListItem[],
      shuffled: ListItem[],
    ): boolean {
      for (let i = 0; i < original.length; i++) {
        if (original[i].email === shuffled[i].email) {
          return false;
        }
      }
      return true;
    }

    function shuffle<T>(array: T[]): T[] {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    function getValidShuffle(participants: ListItem[]): ListItem[] {
      let shuffled: ListItem[];
      do {
        shuffled = shuffle(participants);
      } while (!isValidShuffle(participants, shuffled));

      return shuffled;
    }

    const shuffledParticipants = getValidShuffle(participants);

    const transporter = nodemailer.createTransport({
      service: "Mail.ru",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        timeout: 7000, // 5 seconds timeout
      },
    });

    const emailPromises = participants.map(
      (giver: { email: string }, i: number) => {
        const receiver = shuffledParticipants[i];
        const message = `The human lucky enough to be graced by your present is ${receiver.name} (${receiver.email}).`;

        const mailOptions = {
          from: process.env.EMAIL,
          to: giver.email,
          subject: "You have been picked as a Secret Santa",
          text: message,
        };

        return sendEmailWithRetry(transporter, mailOptions);
      },
    );

    await Promise.all(emailPromises);

    return NextResponse.json(
      { message: "Emails sent to the participants successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Full error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Helper function for sending emails with retry logic
async function sendEmailWithRetry(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
  maxRetries = 3,
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(
        `Email sent successfully to ${mailOptions.to} on attempt ${attempt}`,
      );
      return info;
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${mailOptions.to}:`, error);

      if (attempt === maxRetries) {
        throw new Error(
          `Failed to send email to ${mailOptions.to} after ${maxRetries} attempts`,
        );
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt)),
      );
    }
  }
}

// Configure function timeout
export const config = {
  maxDuration: 30, // 30 seconds
};
