self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; }
  catch { payload = { title: "LIFE OS", body: event.data ? event.data.text() : "Você tem uma atualização." }; }
  const title = payload.title || "LIFE OS · Lembrete";
  const options = {
    body: payload.body || "Você tem um lembrete pendente.",
    icon: "/LifeOS-Code/icon-192.png",
    badge: "/LifeOS-Code/icon-192.png",
    data: { url: payload.url || "/LifeOS-Code/dashboard/" },
    tag: payload.tag || "lifeos-reminder"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/LifeOS-Code/dashboard/", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => client.url.startsWith(self.location.origin + "/LifeOS-Code/"));
    if (existing) { existing.navigate(target); return existing.focus(); }
    return clients.openWindow(target);
  }));
});
