import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminClient initialProjects={projects} />;
}
