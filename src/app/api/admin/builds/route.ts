import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/builds/buildNormalizer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.contentType || !body.role || !body.weaponLine || !body.mainHand || !body.head || !body.chest || !body.shoes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = body.slug ?? generateSlug(body.title);
    const existing = await prisma.build.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Build with this slug already exists" }, { status: 409 });
    }

    const build = await prisma.build.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        contentType: body.contentType,
        partySize: body.partySize,
        role: body.role,
        weaponLine: body.weaponLine,
        mainHand: body.mainHand,
        offHand: body.offHand,
        head: body.head,
        chest: body.chest,
        shoes: body.shoes,
        cape: body.cape,
        bag: body.bag,
        mount: body.mount,
        food: body.food,
        potion: body.potion,
        tierRecommended: body.tierRecommended,
        enchantRecommended: body.enchantRecommended,
        ipMin: body.ipMin,
        budgetLevel: body.budgetLevel ?? "medium",
        difficulty: body.difficulty ?? "medium",
        status: body.status ?? "active",
        sourceType: body.sourceType ?? "manual",
        isRecommended: body.isRecommended ?? false,
        isPopular: body.isPopular ?? false,
        isCheap: body.isCheap ?? false,
        pros: body.pros,
        cons: body.cons,
        combo: body.combo,
        strongAgainst: body.strongAgainst,
        weakAgainst: body.weakAgainst,
        notes: body.notes,
        lastVerifiedAt: new Date(),
        patchVersion: body.patchVersion,
      },
    });

    if (body.items && Array.isArray(body.items)) {
      await prisma.buildItem.createMany({
        data: body.items.map((item: { slot: string; itemName: string; itemUniqueName: string; tier?: number; enchantment?: number; quality?: number }) => ({
          buildId: build.id,
          slot: item.slot,
          itemName: item.itemName,
          itemUniqueName: item.itemUniqueName,
          tier: item.tier,
          enchantment: item.enchantment,
          quality: item.quality ?? 1,
        })),
      });
    }

    return NextResponse.json(build, { status: 201 });
  } catch (error) {
    console.error("Failed to create build:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
