import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY")!;
const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY")!;
const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@example.com";

const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (request.headers.get("Authorization") !== `Bearer ${serviceKey}`) return new Response("Unauthorized", { status: 401 });

  const now = new Date().toISOString();
  const { data: reminders, error } = await db.from("reminders")
    .select("id,user_id,title,details,remind_at")
    .eq("completed", false).is("notification_sent_at", null)
    .lte("remind_at", now).limit(100);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  let sent = 0;
  let failed = 0;
  for (const reminder of reminders || []) {
    const { data: subscriptions } = await db.from("push_subscriptions")
      .select("id,endpoint,p256dh,auth").eq("user_id", reminder.user_id);
    let delivered = false;
    for (const sub of subscriptions || []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: "LIFE OS · Lembrete", body: reminder.title, tag: reminder.id, url: "/LifeOS-Code/reminders/" })
        );
        delivered = true;
        sent++;
      } catch (error) {
        failed++;
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await db.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }
    if (delivered) {
      await db.from("reminders").update({ notification_sent_at: now }).eq("id", reminder.id);
    }
  }
  return Response.json({ processed: reminders?.length || 0, sent, failed });
});
