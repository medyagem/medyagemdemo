import { prisma } from "./prisma";

export async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { is_active: true },
      orderBy: { published_at: "desc" },
    });
  } catch (error) {
    console.error("getBlogPosts error:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (error) {
    console.error("getBlogPostBySlug error:", error);
    return null;
  }
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { is_active: true },
      orderBy: { created_at: "asc" },
    });
  } catch (error) {
    console.error("getServices error:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (error) {
    console.error("getServiceBySlug error:", error);
    return null;
  }
}

export async function getRegions() {
  try {
    return await prisma.region.findMany({
      where: { is_active: true }
    });
  } catch (error) {
    console.error("getRegions error:", error);
    return [];
  }
}

export async function getRegionBySlug(slug: string) {
  try {
    return await prisma.region.findUnique({
      where: { slug }
    });
  } catch (error) {
    console.error("getRegionBySlug error:", error);
    return null;
  }
}

export async function getBlogCategories() {
  try {
    return await prisma.blogCategory.findMany({
      where: { is_active: true },
      orderBy: { order_no: "asc" }
    });
  } catch (error) {
    console.error("getBlogCategories error:", error);
    return [];
  }
}

export async function getServiceCategories() {
  try {
    return await prisma.serviceCategory.findMany({
      where: { is_active: true },
      orderBy: { order_no: "asc" }
    });
  } catch (error) {
    console.error("getServiceCategories error:", error);
    return [];
  }
}

export async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" }
    });
  } catch (error) {
    console.error("getProjects error:", error);
    return [];
  }
}
