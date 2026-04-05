import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(trips);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, destination, startDate, endDate, itineraryJson, conversationId } = body;

  const trip = await prisma.trip.create({
    data: {
      userId: session.user.id,
      title,
      destination,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      itineraryJson,
      status: "saved",
    },
  });

  if (conversationId) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { tripId: trip.id },
    });
  }

  return NextResponse.json(trip);
}
