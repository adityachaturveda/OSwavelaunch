import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/client";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.fullName || !payload.email) {
      return NextResponse.json(
        { ok: false, error: "Full name and email are required." },
        { status: 400 }
      );
    }

    await prisma.application.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        careerMilestones: payload.careerMilestones ?? null,
        careerTurningPoints: payload.careerTurningPoints ?? null,
        ventureVision: payload.ventureVision ?? null,
        ventureGoals: payload.ventureGoals ?? null,
        industryFocus: payload.industryFocus ?? null,
        targetAudience: payload.targetAudience ?? null,
        audienceDemographics: payload.audienceDemographics ?? null,
        audiencePainPoints: payload.audiencePainPoints ?? null,
        audienceAge: payload.audienceAge ?? null,
        differentiation: payload.differentiation ?? null,
        uniqueValue: payload.uniqueValue ?? null,
        competitors: payload.competitors ?? null,
        brandImage: payload.brandImage ?? null,
        admiredInfluencers: payload.admiredInfluencers ?? null,
        brandAesthetics: payload.brandAesthetics ?? null,
        brandEmotions: payload.brandEmotions ?? null,
        brandPersonality: payload.brandPersonality ?? null,
        brandFontPreference: payload.brandFontPreference ?? null,
        scalingGoals: payload.scalingGoals ?? null,
        growthStrategies: payload.growthStrategies ?? null,
        longTermVision: payload.longTermVision ?? null,
        additionalInfo: payload.additionalInfo ?? null,
        keyDeadlines: payload.keyDeadlines ?? null,
        discoveryChannels: payload.discoveryChannels ?? null,
        audienceGender: payload.audienceGender ?? null,
        audienceMaritalStatus: payload.audienceMaritalStatus ?? null,
        brandValues: payload.brandValues ?? null,
        timestamp: payload.timestamp ? new Date(payload.timestamp) : undefined,
        submittedAt: payload.submittedAt ? new Date(payload.submittedAt) : undefined,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[Application] submission failed", error);
    return NextResponse.json(
      { ok: false, error: "Unable to submit application." },
      { status: 500 }
    );
  }
}
