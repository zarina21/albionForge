import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditBuildClient } from "./EditBuildClient";

export const metadata: Metadata = {
  title: "Edit Build",
  description: "Edit build details.",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBuildPage({ params }: Props) {
  const { id } = await params;
  const build = await prisma.build.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!build) notFound();

  return <EditBuildClient build={JSON.parse(JSON.stringify(build))} />;
}
