"use server";

import prisma from "../lib/prisma";

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "asc" },
    });
    return projects;
  } catch {
    return [];
  }
}
