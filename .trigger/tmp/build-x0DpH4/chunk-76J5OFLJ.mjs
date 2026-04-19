import {
  createClient,
  dist_exports
} from "./chunk-VK2CBFCN.mjs";
import {
  processUrl
} from "./chunk-DMHODDN2.mjs";
import {
  logger,
  task
} from "./chunk-VLXL7XX4.mjs";
import {
  __name,
  init_esm
} from "./chunk-JJFB2UO5.mjs";

// trigger/tasks/run-single-url.ts
init_esm();
var runSingleUrlTask = task({
  id: "run-single-url",
  maxDuration: 120,
  run: /* @__PURE__ */ __name(async (payload) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: monUrl, error } = await supabase.from("monitored_urls").select("*").eq("id", payload.urlId).single();
    if (error || !monUrl) {
      throw new Error(`URL not found: ${payload.urlId}`);
    }
    if (!monUrl.is_active) {
      throw new Error(`URL is paused: ${monUrl.url}`);
    }
    logger.info("Manual run started", { url: monUrl.url });
    const result = await processUrl({ ...monUrl, _manual: true }, supabase);
    logger.info("Manual run complete", {
      url: monUrl.url,
      diffPct: result.diffPct != null ? `${result.diffPct.toFixed(1)}%` : "first run",
      alerted: result.alerted
    });
    return result;
  }, "run")
});

export {
  runSingleUrlTask
};
//# sourceMappingURL=chunk-76J5OFLJ.mjs.map
