import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const body = await req.json();
  const { loyaltyPrograms, creditCards, preferences } = body;

  // Delete old data and re-insert
  await prisma.loyaltyProgram.deleteMany({ where: { userId } });
  await prisma.creditCard.deleteMany({ where: { userId } });

  if (loyaltyPrograms?.length) {
    await prisma.loyaltyProgram.createMany({
      data: loyaltyPrograms.map((lp: any) => ({
        userId,
        name: lp.name,
        balance: parseInt(lp.balance) || 0,
        accountId: lp.accountId || null,
      })),
    });
  }

  if (creditCards?.length) {
    await prisma.creditCard.createMany({
      data: creditCards.map((cc: any) => ({
        userId,
        name: cc.name,
        travelMultiplier: parseFloat(cc.travelMultiplier) || 1,
        diningMultiplier: parseFloat(cc.diningMultiplier) || 1,
        hotelMultiplier: parseFloat(cc.hotelMultiplier) || 1,
        annualCredit: parseFloat(cc.annualCredit) || 0,
      })),
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      seatPreference: preferences?.seatPreference || null,
      hotelStyle: preferences?.hotelStyle || null,
      flightTime: preferences?.flightTime || null,
      budgetRange: preferences?.budgetRange || null,
      onboardingDone: true,
    },
  });

  return NextResponse.json({ success: true });
}
