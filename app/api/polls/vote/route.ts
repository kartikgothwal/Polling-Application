import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import PollModel, { TPoll } from "@/schema/polls";

export async function POST(request: NextRequest) {
  try {
    const { pollId, userId, optionIndex } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }
    if (typeof optionIndex !== "number") {
      return NextResponse.json(
        { message: "Invalid option index" },
        { status: 400 }
      );
    }

    const poll: TPoll | null = await PollModel.findById(pollId);
    if (!poll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    const voteIndex = poll.votes.findIndex(
      (vote) => vote.user.toString() === userId
    );
    if (voteIndex !== -1) {
      poll.votes[voteIndex].optionIndex = optionIndex;
      poll.votes[voteIndex].votedAt = new Date();
    } else {
      poll.votes.push({
        user: new mongoose.Types.ObjectId(userId),
        optionIndex,
        votedAt: new Date(),
      });
    }

    await poll.save();

    return NextResponse.json(
      { message: "Vote submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
