import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await request.json();
  const { participants } = body;

  for (const participant of participants) {
    if (!participant || !participant.name || !participant.email) {
      return NextResponse.json(
        { error: "Missing name or email in one or more participant entries" },
        { status: 400 },
      );
    }
    participant.isPicked = false;
  }

  const shuffledParticipants = [...participants];
  for (let i = shuffledParticipants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledParticipants[i], shuffledParticipants[j]] = [
      shuffledParticipants[j],
      shuffledParticipants[i],
    ];
  }

  for (let i = 0; i < shuffledParticipants.length; i++) {
    const giver = participants[i];
    const receiver = shuffledParticipants[i];
    if (giver.email === receiver.email) {
      if (i === shuffledParticipants.length - 1) {
        [shuffledParticipants[i], shuffledParticipants[0]] = [
          shuffledParticipants[0],
          shuffledParticipants[i],
        ];
      } else {
        [shuffledParticipants[i], shuffledParticipants[i + 1]] = [
          shuffledParticipants[i + 1],
          shuffledParticipants[i],
        ];
      }
    }
  }
  console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);

  const transporter = nodemailer.createTransport({
    service: "Mail.ru",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  for (let i = 0; i < participants.length; i++) {
    const giver = participants[i];
    const receiver = shuffledParticipants[i];
    const message = `The human lucky enough to be graced by your present is ${receiver.name} (${receiver.email}).`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: giver.email,
      subject: "You have been picked as a Secret Santa",
      text: message,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { message: "Emails sent to the participants successfully" },
    { status: 200 },
  );
}
