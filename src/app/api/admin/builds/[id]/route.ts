import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBuildCost } from "@/lib/builds/buildCostService";
import { CURRENT_PATCH_VERSION } from "@/lib/builds/config";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.build.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    const build = await prisma.build.update({
      where: { id },
      data: {
        title: body.title,
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
        budgetLevel: body.budgetLevel,
        difficulty: body.difficulty,
        status: body.status,
        sourceType: body.sourceType,
        isRecommended: body.isRecommended,
        isPopular: body.isPopular,
        isCheap: body.isCheap,
        pros: body.pros,
        cons: body.cons,
        combo: body.combo,
        strongAgainst: body.strongAgainst,
        weakAgainst: body.weakAgainst,
        notes: body.notes,
      },
    });

    return NextResponse.json(build);
  } catch (error) {
    console.error("Failed to update build:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.build.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete build:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    const existing = await prisma.build.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));

    switch (action) {
      case "recalculate-cost": {
        const snapshot = await calculateBuildCost(prisma, id);
        return NextResponse.json({ success: true, snapshot });
      }
      case "mark-reviewed": {
        const build = await prisma.build.update({
          where: { id },
          data: {
            lastVerifiedAt: new Date(),
            patchVersion: body?.patchVersion ?? CURRENT_PATCH_VERSION,
            status: body?.statusAfterReview ?? existing.status,
          },
        });
        return NextResponse.json(build);
      }
      case "duplicate": {
        const { id, createdAt, updatedAt, ...buildData } = existing;
        const duplicate = await prisma.build.create({
          data: {
            ...buildData,
            id: undefined,
            title: `${existing.title} (Copy)`,
            slug: `${existing.slug}-copy-${Date.now()}`,
            createdAt: undefined,
            updatedAt: undefined,
          },
        });
        return NextResponse.json(duplicate, { status: 201 });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to process build action:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
