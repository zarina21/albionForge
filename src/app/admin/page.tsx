import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPage } from "./_components/AdminPage";

export const metadata: Metadata = {
  title: "Admin",
  description: "Albion Forge admin panel — view and manage database records.",
};

export default async function Page() {
  const [builds, resources, guides] = await Promise.all([
    prisma.build.findMany({ orderBy: { title: "asc" } }),
    prisma.resource.findMany({ orderBy: [{ resourceType: "asc" }, { tier: "asc" }] }),
    prisma.professionGuide.findMany({ orderBy: [{ professionType: "asc" }, { profession: "asc" }] }),
  ]);
  return <AdminPage builds={builds} resources={resources} guides={guides} />;
}
