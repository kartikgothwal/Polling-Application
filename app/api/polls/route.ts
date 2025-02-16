import dbConnect from "@/config/dbConnect";
import PollModel, { pollValidationSchema } from "@/schema/polls";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const pollData = pollValidationSchema.parse(body);

    const newPoll = new PollModel(pollData);
    await newPoll.save();

    return NextResponse.json(
      {
        message: "Poll created successfully!",
        poll: newPoll,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Internal server error",
        },
        { status: 500 }
      );
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const polls = await PollModel.find();

    return NextResponse.json(polls, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
