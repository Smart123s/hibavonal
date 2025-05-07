import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { hasPermission } from "@/utils/permissions"; 
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function deleteRoomAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      console.error("Unauthorized attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    console.log(`User role: ${role}`); 
    const isAllowed = hasPermission(session.user.role as Role, "errortype", "delete");

    if (!isAllowed) {
      console.error("User does not have delete permission");
      return NextResponse.json(
        { error: "You do not have permission to delete this error type." },
        { status: 403 }
      );
    }

    const errorType = await prisma.errorType.findUnique({
      where: { id },
    });

    if (!errorType) {
      console.error(`Error type with ID ${id} not found`);
      return NextResponse.json({ error: "Error type not found" }, { status: 404 });
    }

    console.log(`Deleting error type with ID ${id}`); 
    const deletedErrorType = await prisma.errorType.delete({
      where: { id },
    });

    if (!deletedErrorType) {
      console.error(`Error type with ID ${id} could not be deleted`);
      return NextResponse.json({ error: "Failed to delete error type" }, { status: 500 });
    }

    console.log(`Successfully deleted error type with ID ${id}`);
    return NextResponse.json({ success: true, message: "Error type deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error during error type deletion:", error);
    return NextResponse.json({ error: "Error deleting error type" }, { status: 500 });
  }
}