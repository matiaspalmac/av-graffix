"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { roles, users } from "@/db/schema";
import { requireRole, toErrorMessage } from "@/lib/server-action";

function asNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function createUserAction(formData: FormData) {
  try {
    await requireRole(["admin"]);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();
    const roleId = asNumber(formData.get("roleId"));

    if (!fullName || !email || !password || !roleId) {
      return;
    }

    const passwordHash = await hash(password, 10);

    await db.insert(users).values({
      roleId,
      fullName,
      email,
      phone: String(formData.get("phone") ?? "").trim() || null,
      passwordHash,
      isActive: true,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/erp/admin");
  } catch (error) {
    console.error("createUserAction", toErrorMessage(error));
  }
}

export async function toggleUserActiveAction(formData: FormData) {
  try {
    await requireRole(["admin"]);

    const userId = asNumber(formData.get("userId"));
    const isActive = String(formData.get("isActive") ?? "1") === "1";

    if (!userId) {
      return;
    }

    await db
      .update(users)
      .set({ isActive: !isActive, updatedAt: new Date().toISOString() })
      .where(eq(users.id, userId));

    revalidatePath("/erp/admin");
  } catch (error) {
    console.error("toggleUserActiveAction", toErrorMessage(error));
  }
}

export async function resetUserPasswordAction(formData: FormData) {
  try {
    await requireRole(["admin"]);

    const userId = asNumber(formData.get("userId"));
    const newPassword = String(formData.get("newPassword") ?? "").trim();

    if (!userId || !newPassword) {
      return;
    }

    const passwordHash = await hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date().toISOString() })
      .where(eq(users.id, userId));

    revalidatePath("/erp/admin");
  } catch (error) {
    console.error("resetUserPasswordAction", toErrorMessage(error));
  }
}

export async function adminFormOptions() {
  const roleOptions = await db
    .select({ id: roles.id, code: roles.code, name: roles.name })
    .from(roles)
    .where(eq(roles.isActive, true))
    .orderBy(desc(roles.id));

  return {
    roleOptions: roleOptions.filter((role) => role.code === "admin" || role.code === "produccion"),
  };
}

export async function deleteUserAction(formData: FormData) {
  try {
    await requireRole(["admin"]);

    const userId = asNumber(formData.get("userId"));

    if (!userId) {
      return;
    }

    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/erp/admin");
  } catch (error) {
    console.error("deleteUserAction", toErrorMessage(error));
  }
}

export async function latestUsersWithRole(limit = 20) {
  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
      isActive: users.isActive,
      lastLoginAt: users.lastLoginAt,
      roleCode: roles.code,
      roleName: roles.name,
    })
    .from(users)
    .leftJoin(roles, eq(users.roleId, roles.id))
    .orderBy(desc(users.id))
    .limit(limit);
}
