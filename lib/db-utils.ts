"use server";

import prisma from "@/lib/prisma";

/**
 * Checks if the Post table exists in the database
 * @returns Promise<boolean> - true if the table exists, false otherwise
 */
export async function checkPostTableExists(): Promise<boolean> {
  try {
    // Try to query the post table
    await prisma.post.findFirst();
    return true;
  } catch (error) {
    // If there's an error, the table likely doesn't exist
    return false;
  }
}

/**
 * Initializes the database by running migrations
 */
export async function initializeDatabase() {
  try {
    // For this demo, we'll just try to create a test post to verify the database is working
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password:
          "$2a$10$GQH.xZRmjTq1wZDOPFEXCOQdnHlVKjlO1DIAvYmAQQI/xEgVIxLHW", // "password123" hashed
        posts: {
          create: [
            {
              title: "Welcome to your new blog",
              content:
                "This is your first post. You can edit or delete it, or create new posts.",
              published: true,
            },
          ],
        },
      },
    });

    return { success: true, message: "Database initialized successfully" };
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to initialize database",
    };
  }
}
