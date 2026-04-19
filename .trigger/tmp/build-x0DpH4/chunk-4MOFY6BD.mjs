import {
  createClient,
  dist_exports
} from "./chunk-VK2CBFCN.mjs";
import {
  processUrl
} from "./chunk-MOWZ7RJR.mjs";
import {
  logger,
  schedules_exports
} from "./chunk-VLXL7XX4.mjs";
import {
  __name,
  init_esm
} from "./chunk-JJFB2UO5.mjs";

// trigger/tasks/screenshot-monitor.ts
init_esm();
var screenshotMonitorTask = schedules_exports.task({
  id: "screenshot-monitor",
  cron: "0 * * * *",
  maxDuration: 600,
  run: /* @__PURE__ */ __name(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    logger.info("Screenshot monitor started");
    const { data: urls, error } = await supabase.from("monitored_urls").select("*").eq("is_active", true);
    if (error) throw new Error(`Failed to load monitored URLs: ${error.message}`);
    if (!urls?.length) {
      logger.info("No active URLs found");
      return;
    }
    const now = /* @__PURE__ */ new Date();
    const currentHour = now.getUTCHours();
    const dueUrls = urls.filter((u) => {
      if (u.check_frequency === "hourly") {
        if (!u.last_checked_at) return true;
        return now.getTime() - new Date(u.last_checked_at).getTime() >= 60 * 60 * 1e3;
      }
      if (u.check_hour != null) {
        if (currentHour !== u.check_hour) return false;
        if (u.last_checked_at) {
          const last = new Date(u.last_checked_at);
          const sameHour = last.getUTCFullYear() === now.getUTCFullYear() && last.getUTCMonth() === now.getUTCMonth() && last.getUTCDate() === now.getUTCDate() && last.getUTCHours() === now.getUTCHours();
          if (sameHour) return false;
        }
        if (u.check_frequency === "weekly" && u.last_checked_at) {
          return now.getTime() - new Date(u.last_checked_at).getTime() >= 7 * 24 * 60 * 60 * 1e3;
        }
        return true;
      }
      if (!u.last_checked_at) return true;
      const elapsed = now.getTime() - new Date(u.last_checked_at).getTime();
      if (u.check_frequency === "daily") return elapsed >= 24 * 60 * 60 * 1e3;
      if (u.check_frequency === "weekly") return elapsed >= 7 * 24 * 60 * 60 * 1e3;
      return false;
    });
    if (!dueUrls.length) {
      logger.info("No URLs due for checking this hour");
      return;
    }
    logger.info(`${dueUrls.length} URL(s) due for screenshots`);
    for (const monUrl of dueUrls) {
      try {
        await processUrl(monUrl, supabase, now);
      } catch (err) {
        logger.error("Unhandled error processing URL", { url: monUrl.url, err });
      }
    }
    logger.info("Screenshot monitor complete");
  }, "run")
});

export {
  screenshotMonitorTask
};
//# sourceMappingURL=chunk-4MOFY6BD.mjs.map
