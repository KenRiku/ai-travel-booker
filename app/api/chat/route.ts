import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { messages, conversationId } = await req.json();

  // Get user profile for context
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyaltyPrograms: true, creditCards: true },
  });

  const loyaltyContext = user?.loyaltyPrograms.length
    ? user.loyaltyPrograms.map((lp) => `${lp.name}: ${lp.balance.toLocaleString()} points`).join(", ")
    : "No loyalty programs set up";

  const cardContext = user?.creditCards.length
    ? user.creditCards.map((cc) => `${cc.name} (travel: ${cc.travelMultiplier}x, hotel: ${cc.hotelMultiplier}x)`).join(", ")
    : "No credit cards set up";

  const prefsContext = [
    user?.seatPreference ? `Seat: ${user.seatPreference}` : null,
    user?.hotelStyle ? `Hotel style: ${user.hotelStyle}` : null,
    user?.flightTime ? `Preferred flight time: ${user.flightTime}` : null,
    user?.budgetRange ? `Budget: ${user.budgetRange}` : null,
  ].filter(Boolean).join(", ") || "No preferences set";

  const systemPrompt = `You are Trippr, an expert AI travel concierge. Your job is to create optimized travel itineraries that maximize value from the user's loyalty programs and credit card benefits.

USER PROFILE:
- Name: ${user?.name || "Traveler"}
- Loyalty Programs: ${loyaltyContext}
- Credit Cards: ${cardContext}
- Preferences: ${prefsContext}

When creating itineraries, ALWAYS:
1. Consider which loyalty programs to use for each booking
2. Recommend which credit card to charge each expense to (for best rewards)
3. Show estimated point costs vs cash costs
4. Be specific about flights (times, airlines, class) and hotels (name, neighborhood)
5. Include a brief "Points & Perks Summary" section

IMPORTANT: After your conversational response, if you've created a full itinerary, append a JSON block at the very end in this exact format (do not include it for casual conversation or clarifying questions):

<itinerary>
{
  "title": "Trip title",
  "destination": "City, Country",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "flights": [
    {
      "route": "NYC → LIS",
      "airline": "TAP Air Portugal",
      "flightClass": "Business",
      "date": "Apr 18",
      "time": "10:30 PM - 10:00 AM+1",
      "pointsCost": 50000,
      "cashCost": 850,
      "loyaltyProgram": "United MileagePlus",
      "cardRecommendation": "Chase Sapphire Reserve (3x travel)"
    }
  ],
  "hotels": [
    {
      "name": "Hotel Bairro Alto",
      "neighborhood": "Bairro Alto",
      "nights": 3,
      "pointsCost": 30000,
      "cashCost": 280,
      "loyaltyProgram": "Marriott Bonvoy",
      "cardRecommendation": "Amex Platinum (5x hotels)"
    }
  ],
  "totalPointsUsed": 80000,
  "totalCashAlternative": 1850,
  "pointsSavings": 1130,
  "disclaimer": "Prices and availability are AI-estimated and may vary. Always verify before booking."
}
</itinerary>

Keep responses warm, expert, and concise. You're a knowledgeable friend who travels constantly and knows all the tricks.`;

  // Save conversation and messages
  let convo = conversationId ? await prisma.conversation.findFirst({ where: { id: conversationId, userId } }) : null;
  if (!convo) {
    convo = await prisma.conversation.create({ data: { userId } });
  }

  // Save user's last message
  const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
  if (lastUserMsg) {
    await prisma.message.create({
      data: {
        conversationId: convo.id,
        role: "user",
        content: lastUserMsg.content,
      },
    });
  }

  // Call Anthropic
  const anthropicMessages = messages.map((m: any) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  const textContent = response.content.find((c) => c.type === "text");
  const fullText = textContent?.text || "I'm sorry, I couldn't generate a response.";

  // Extract itinerary JSON if present
  let itineraryJson = null;
  const itineraryMatch = fullText.match(/<itinerary>([\s\S]*?)<\/itinerary>/);
  let displayText = fullText;
  if (itineraryMatch) {
    try {
      itineraryJson = JSON.parse(itineraryMatch[1].trim());
      displayText = fullText.replace(/<itinerary>[\s\S]*?<\/itinerary>/, "").trim();
    } catch {}
  }

  // Save assistant message
  await prisma.message.create({
    data: {
      conversationId: convo.id,
      role: "assistant",
      content: displayText,
      itineraryJson: itineraryJson || undefined,
    },
  });

  return NextResponse.json({
    content: displayText,
    itinerary: itineraryJson,
    conversationId: convo.id,
  });
}
