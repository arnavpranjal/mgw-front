import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "../../../components/email-resetpass-template";
import { Resend } from "resend";

const resend = new Resend("re_dsz9kQCM_LJvjjLLosmvJobf7N21r6Fah");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "";
  const otp = searchParams.get("otp") ?? "";
  const email = searchParams.get("email") ?? "";

  try {
    const { data, error } = await resend.emails.send({
      from: "Megerware <onboarding@tappings.co.in>",
      to: [email],
      subject: "MergerWare login OTP",
      react: EmailTemplate({
        name: name,
        email: email,
        otp: otp,
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}

// reset template
