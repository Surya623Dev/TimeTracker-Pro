import { initializeApp, cert } from "npm:firebase-admin@12.0.0/app";
import { getFirestore } from "npm:firebase-admin@12.0.0/firestore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const serviceAccount = JSON.parse(Deno.env.get("FIREBASE_ADMIN_SDK") || "{}");

    if (!serviceAccount.project_id) {
      throw new Error("Firebase Admin SDK credentials not configured");
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore(app);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    const attendanceSnapshot = await db
      .collection("attendanceRecords")
      .where("date", "==", yesterdayDate)
      .where("clockOut", "==", null)
      .get();

    let updatedCount = 0;

    for (const doc of attendanceSnapshot.docs) {
      const record = doc.data();
      const clockInTime = new Date(`${yesterdayDate} ${record.clockIn}`);
      const clockOutTime = new Date(`${yesterdayDate} 23:59:59`);
      const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

      await doc.ref.update({
        clockOut: "23:59",
        totalHours: Math.round(totalHours * 100) / 100,
      });

      updatedCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Auto clock-out completed. ${updatedCount} records updated.`,
        count: updatedCount,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in auto_clockout:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
