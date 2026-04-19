import {
  createClient,
  dist_exports
} from "./chunk-VK2CBFCN.mjs";
import {
  logger,
  schedules_exports
} from "./chunk-VLXL7XX4.mjs";
import {
  __name,
  init_esm
} from "./chunk-JJFB2UO5.mjs";

// trigger/tasks/send-alert-digest.ts
init_esm();

// node_modules/resend/dist/index.mjs
init_esm();
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __spreadValues = /* @__PURE__ */ __name((a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
}, "__spreadValues");
var __spreadProps = /* @__PURE__ */ __name((a, b) => __defProps(a, __getOwnPropDescs(b)), "__spreadProps");
var __async = /* @__PURE__ */ __name((__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = /* @__PURE__ */ __name((value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }, "fulfilled");
    var rejected = /* @__PURE__ */ __name((value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    }, "rejected");
    var step = /* @__PURE__ */ __name((x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected), "step");
    step((generator = generator.apply(__this, __arguments)).next());
  });
}, "__async");
var version = "4.8.0";
var ApiKeys = class {
  static {
    __name(this, "ApiKeys");
  }
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        "/api-keys",
        payload,
        options
      );
      return data;
    });
  }
  list() {
    return __async(this, null, function* () {
      const data = yield this.resend.get("/api-keys");
      return data;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.delete(
        `/api-keys/${id}`
      );
      return data;
    });
  }
};
var Audiences = class {
  static {
    __name(this, "Audiences");
  }
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        "/audiences",
        payload,
        options
      );
      return data;
    });
  }
  list() {
    return __async(this, null, function* () {
      const data = yield this.resend.get("/audiences");
      return data;
    });
  }
  get(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.get(
        `/audiences/${id}`
      );
      return data;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.delete(
        `/audiences/${id}`
      );
      return data;
    });
  }
};
function parseAttachments(attachments) {
  return attachments == null ? void 0 : attachments.map((attachment) => ({
    content: attachment.content,
    filename: attachment.filename,
    path: attachment.path,
    content_type: attachment.contentType,
    inline_content_id: attachment.inlineContentId
  }));
}
__name(parseAttachments, "parseAttachments");
function parseEmailToApiOptions(email) {
  return {
    attachments: parseAttachments(email.attachments),
    bcc: email.bcc,
    cc: email.cc,
    from: email.from,
    headers: email.headers,
    html: email.html,
    reply_to: email.replyTo,
    scheduled_at: email.scheduledAt,
    subject: email.subject,
    tags: email.tags,
    text: email.text,
    to: email.to
  };
}
__name(parseEmailToApiOptions, "parseEmailToApiOptions");
var Batch = class {
  static {
    __name(this, "Batch");
  }
  constructor(resend) {
    this.resend = resend;
  }
  send(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      return this.create(payload, options);
    });
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      const emails = [];
      for (const email of payload) {
        if (email.react) {
          if (!this.renderAsync) {
            try {
              const { renderAsync } = yield import("./node-NBWHEHVG.mjs");
              this.renderAsync = renderAsync;
            } catch (error) {
              throw new Error(
                "Failed to render React component. Make sure to install `@react-email/render`"
              );
            }
          }
          email.html = yield this.renderAsync(email.react);
          email.react = void 0;
        }
        emails.push(parseEmailToApiOptions(email));
      }
      const data = yield this.resend.post(
        "/emails/batch",
        emails,
        options
      );
      return data;
    });
  }
};
var Broadcasts = class {
  static {
    __name(this, "Broadcasts");
  }
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      if (payload.react) {
        if (!this.renderAsync) {
          try {
            const { renderAsync } = yield import("./node-NBWHEHVG.mjs");
            this.renderAsync = renderAsync;
          } catch (error) {
            throw new Error(
              "Failed to render React component. Make sure to install `@react-email/render`"
            );
          }
        }
        payload.html = yield this.renderAsync(
          payload.react
        );
      }
      const data = yield this.resend.post(
        "/broadcasts",
        {
          name: payload.name,
          audience_id: payload.audienceId,
          preview_text: payload.previewText,
          from: payload.from,
          html: payload.html,
          reply_to: payload.replyTo,
          subject: payload.subject,
          text: payload.text
        },
        options
      );
      return data;
    });
  }
  send(id, payload) {
    return __async(this, null, function* () {
      const data = yield this.resend.post(
        `/broadcasts/${id}/send`,
        { scheduled_at: payload == null ? void 0 : payload.scheduledAt }
      );
      return data;
    });
  }
  list() {
    return __async(this, null, function* () {
      const data = yield this.resend.get("/broadcasts");
      return data;
    });
  }
  get(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.get(
        `/broadcasts/${id}`
      );
      return data;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.delete(
        `/broadcasts/${id}`
      );
      return data;
    });
  }
  update(id, payload) {
    return __async(this, null, function* () {
      const data = yield this.resend.patch(
        `/broadcasts/${id}`,
        {
          name: payload.name,
          audience_id: payload.audienceId,
          from: payload.from,
          html: payload.html,
          text: payload.text,
          subject: payload.subject,
          reply_to: payload.replyTo,
          preview_text: payload.previewText
        }
      );
      return data;
    });
  }
};
var Contacts = class {
  static {
    __name(this, "Contacts");
  }
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        `/audiences/${payload.audienceId}/contacts`,
        {
          unsubscribed: payload.unsubscribed,
          email: payload.email,
          first_name: payload.firstName,
          last_name: payload.lastName
        },
        options
      );
      return data;
    });
  }
  list(options) {
    return __async(this, null, function* () {
      const data = yield this.resend.get(
        `/audiences/${options.audienceId}/contacts`
      );
      return data;
    });
  }
  get(options) {
    return __async(this, null, function* () {
      if (!options.id && !options.email) {
        return {
          data: null,
          error: {
            message: "Missing `id` or `email` field.",
            name: "missing_required_field"
          }
        };
      }
      const data = yield this.resend.get(
        `/audiences/${options.audienceId}/contacts/${(options == null ? void 0 : options.email) ? options == null ? void 0 : options.email : options == null ? void 0 : options.id}`
      );
      return data;
    });
  }
  update(payload) {
    return __async(this, null, function* () {
      if (!payload.id && !payload.email) {
        return {
          data: null,
          error: {
            message: "Missing `id` or `email` field.",
            name: "missing_required_field"
          }
        };
      }
      const data = yield this.resend.patch(
        `/audiences/${payload.audienceId}/contacts/${(payload == null ? void 0 : payload.email) ? payload == null ? void 0 : payload.email : payload == null ? void 0 : payload.id}`,
        {
          unsubscribed: payload.unsubscribed,
          first_name: payload.firstName,
          last_name: payload.lastName
        }
      );
      return data;
    });
  }
  remove(payload) {
    return __async(this, null, function* () {
      if (!payload.id && !payload.email) {
        return {
          data: null,
          error: {
            message: "Missing `id` or `email` field.",
            name: "missing_required_field"
          }
        };
      }
      const data = yield this.resend.delete(
        `/audiences/${payload.audienceId}/contacts/${(payload == null ? void 0 : payload.email) ? payload == null ? void 0 : payload.email : payload == null ? void 0 : payload.id}`
      );
      return data;
    });
  }
};
function parseDomainToApiOptions(domain) {
  return {
    name: domain.name,
    region: domain.region,
    custom_return_path: domain.customReturnPath
  };
}
__name(parseDomainToApiOptions, "parseDomainToApiOptions");
var Domains = class {
  static {
    __name(this, "Domains");
  }
  constructor(resend) {
    this.resend = resend;
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      const data = yield this.resend.post(
        "/domains",
        parseDomainToApiOptions(payload),
        options
      );
      return data;
    });
  }
  list() {
    return __async(this, null, function* () {
      const data = yield this.resend.get("/domains");
      return data;
    });
  }
  get(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.get(
        `/domains/${id}`
      );
      return data;
    });
  }
  update(payload) {
    return __async(this, null, function* () {
      const data = yield this.resend.patch(
        `/domains/${payload.id}`,
        {
          click_tracking: payload.clickTracking,
          open_tracking: payload.openTracking,
          tls: payload.tls
        }
      );
      return data;
    });
  }
  remove(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.delete(
        `/domains/${id}`
      );
      return data;
    });
  }
  verify(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.post(
        `/domains/${id}/verify`
      );
      return data;
    });
  }
};
var Emails = class {
  static {
    __name(this, "Emails");
  }
  constructor(resend) {
    this.resend = resend;
  }
  send(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      return this.create(payload, options);
    });
  }
  create(_0) {
    return __async(this, arguments, function* (payload, options = {}) {
      if (payload.react) {
        if (!this.renderAsync) {
          try {
            const { renderAsync } = yield import("./node-NBWHEHVG.mjs");
            this.renderAsync = renderAsync;
          } catch (error) {
            throw new Error(
              "Failed to render React component. Make sure to install `@react-email/render`"
            );
          }
        }
        payload.html = yield this.renderAsync(
          payload.react
        );
      }
      const data = yield this.resend.post(
        "/emails",
        parseEmailToApiOptions(payload),
        options
      );
      return data;
    });
  }
  get(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.get(
        `/emails/${id}`
      );
      return data;
    });
  }
  update(payload) {
    return __async(this, null, function* () {
      const data = yield this.resend.patch(
        `/emails/${payload.id}`,
        {
          scheduled_at: payload.scheduledAt
        }
      );
      return data;
    });
  }
  cancel(id) {
    return __async(this, null, function* () {
      const data = yield this.resend.post(
        `/emails/${id}/cancel`
      );
      return data;
    });
  }
};
var defaultBaseUrl = "https://api.resend.com";
var defaultUserAgent = `resend-node:${version}`;
var baseUrl = typeof process !== "undefined" && process.env ? process.env.RESEND_BASE_URL || defaultBaseUrl : defaultBaseUrl;
var userAgent = typeof process !== "undefined" && process.env ? process.env.RESEND_USER_AGENT || defaultUserAgent : defaultUserAgent;
var Resend = class {
  static {
    __name(this, "Resend");
  }
  constructor(key) {
    this.key = key;
    this.apiKeys = new ApiKeys(this);
    this.audiences = new Audiences(this);
    this.batch = new Batch(this);
    this.broadcasts = new Broadcasts(this);
    this.contacts = new Contacts(this);
    this.domains = new Domains(this);
    this.emails = new Emails(this);
    if (!key) {
      if (typeof process !== "undefined" && process.env) {
        this.key = process.env.RESEND_API_KEY;
      }
      if (!this.key) {
        throw new Error(
          'Missing API key. Pass it to the constructor `new Resend("re_123")`'
        );
      }
    }
    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "User-Agent": userAgent,
      "Content-Type": "application/json"
    });
  }
  fetchRequest(_0) {
    return __async(this, arguments, function* (path, options = {}) {
      try {
        const response = yield fetch(`${baseUrl}${path}`, options);
        if (!response.ok) {
          try {
            const rawError = yield response.text();
            return { data: null, error: JSON.parse(rawError) };
          } catch (err) {
            if (err instanceof SyntaxError) {
              return {
                data: null,
                error: {
                  name: "application_error",
                  message: "Internal server error. We are unable to process your request right now, please try again later."
                }
              };
            }
            const error = {
              message: response.statusText,
              name: "application_error"
            };
            if (err instanceof Error) {
              return { data: null, error: __spreadProps(__spreadValues({}, error), { message: err.message }) };
            }
            return { data: null, error };
          }
        }
        const data = yield response.json();
        return { data, error: null };
      } catch (error) {
        return {
          data: null,
          error: {
            name: "application_error",
            message: "Unable to fetch data. The request could not be resolved."
          }
        };
      }
    });
  }
  post(_0, _1) {
    return __async(this, arguments, function* (path, entity, options = {}) {
      const headers = new Headers(this.headers);
      if (options.idempotencyKey) {
        headers.set("Idempotency-Key", options.idempotencyKey);
      }
      const requestOptions = __spreadValues({
        method: "POST",
        headers,
        body: JSON.stringify(entity)
      }, options);
      return this.fetchRequest(path, requestOptions);
    });
  }
  get(_0) {
    return __async(this, arguments, function* (path, options = {}) {
      const requestOptions = __spreadValues({
        method: "GET",
        headers: this.headers
      }, options);
      return this.fetchRequest(path, requestOptions);
    });
  }
  put(_0, _1) {
    return __async(this, arguments, function* (path, entity, options = {}) {
      const requestOptions = __spreadValues({
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(entity)
      }, options);
      return this.fetchRequest(path, requestOptions);
    });
  }
  patch(_0, _1) {
    return __async(this, arguments, function* (path, entity, options = {}) {
      const requestOptions = __spreadValues({
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify(entity)
      }, options);
      return this.fetchRequest(path, requestOptions);
    });
  }
  delete(path, query) {
    return __async(this, null, function* () {
      const requestOptions = {
        method: "DELETE",
        headers: this.headers,
        body: JSON.stringify(query)
      };
      return this.fetchRequest(path, requestOptions);
    });
  }
};

// trigger/tasks/send-alert-digest.ts
var sendAlertDigestTask = schedules_exports.task({
  id: "send-alert-digest",
  cron: "0 8 * * *",
  // daily at 8 AM UTC
  maxDuration: 120,
  run: /* @__PURE__ */ __name(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const resend = new Resend(process.env.RESEND_API_KEY);
    logger.info("Alert digest started");
    const since = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString();
    const { data: alerts } = await supabase.from("alerts").select("*, monitored_urls(url, name, check_frequency), workspaces(domain, owner_user_id)").eq("status", "open").gte("triggered_at", since).order("severity", { ascending: false });
    if (!alerts?.length) {
      logger.info("No new alerts to send");
      return;
    }
    const byWorkspace = {};
    for (const alert of alerts) {
      const wsId = alert.workspace_id;
      if (!byWorkspace[wsId]) byWorkspace[wsId] = [];
      byWorkspace[wsId].push(alert);
    }
    for (const [wsId, wsAlerts] of Object.entries(byWorkspace)) {
      const { data: channels } = await supabase.from("notification_channels").select("*").eq("workspace_id", wsId).eq("channel_type", "email").eq("is_active", true);
      if (!channels?.length) continue;
      const ownerUserId = wsAlerts[0].workspaces?.owner_user_id;
      if (!ownerUserId) continue;
      const { data: profile } = await supabase.from("profiles").select("email, full_name").eq("id", ownerUserId).single();
      if (!profile?.email) continue;
      const criticalCount = wsAlerts.filter((a) => a.severity === "critical").length;
      const highCount = wsAlerts.filter((a) => a.severity === "high").length;
      const severityBg = {
        critical: "#fee2e2",
        high: "#fef3c7",
        medium: "#fefce8",
        low: "#f0fdf4"
      };
      const severityColor = {
        critical: "#dc2626",
        high: "#d97706",
        medium: "#ca8a04",
        low: "#16a34a"
      };
      const alertRows = wsAlerts.slice(0, 10).map((a) => {
        const diffLabel = a.diff_pct !== null ? `${Number(a.diff_pct).toFixed(1)}% changed` : "";
        const pageLabel = a.monitored_urls?.name ?? a.monitored_urls?.url ?? "";
        return `
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;">
              <div style="font-weight:600;color:#0f172a;font-size:14px;">${a.title}</div>
              <div style="color:#64748b;font-size:13px;margin-top:2px;">${a.summary}</div>
              ${pageLabel ? `<div style="color:#94a3b8;font-size:11px;margin-top:4px;font-family:monospace;">${pageLabel}</div>` : ""}
            </td>
            <td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;text-align:center;white-space:nowrap;vertical-align:top;">
              <span style="background:${severityBg[a.severity] ?? "#f8fafc"};color:${severityColor[a.severity] ?? "#374151"};padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.05em;display:block;margin-bottom:4px;">${a.severity.toUpperCase()}</span>
              ${diffLabel ? `<span style="color:#94a3b8;font-size:11px;">${diffLabel}</span>` : ""}
            </td>
          </tr>`;
      }).join("");
      const domain = wsAlerts[0].workspaces?.domain ?? "";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const fromDomain = process.env.EMAIL_FROM_DOMAIN ?? "yourdomain.com";
      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0f172a;padding:24px 32px;">
      <div style="color:white;font-size:20px;font-weight:700;margin:0;">PageWatch</div>
      <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Visual Change Digest</div>
    </div>
    <div style="padding:32px;">
      <p style="color:#374151;font-size:15px;margin:0 0 8px;">Hi ${profile.full_name ?? "there"},</p>
      <p style="color:#374151;font-size:15px;margin:0 0 24px;">
        You have <strong>${wsAlerts.length} page change alert${wsAlerts.length > 1 ? "s" : ""}</strong> in the last 24 hours${criticalCount > 0 ? ` — including <strong style="color:#dc2626;">${criticalCount} critical</strong>` : ""}.
      </p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#64748b;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Change</th>
            <th style="padding:10px 16px;text-align:center;font-size:12px;color:#64748b;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;width:110px;">Severity</th>
          </tr>
        </thead>
        <tbody>${alertRows}</tbody>
      </table>
      <div style="margin-top:28px;">
        <a href="${appUrl}/dashboard/alerts" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">View All Alerts &rarr;</a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #f1f5f9;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        PageWatch &middot; monitoring <strong>${domain}</strong> &middot;
        <a href="${appUrl}/dashboard/settings" style="color:#94a3b8;text-decoration:underline;">Manage notifications</a>
      </p>
    </div>
  </div>
</body>
</html>`;
      try {
        await resend.emails.send({
          from: `PageWatch <alerts@${fromDomain}>`,
          to: profile.email,
          subject: `${criticalCount > 0 ? "🔴" : highCount > 0 ? "🟡" : "👁"} ${wsAlerts.length} page change alert${wsAlerts.length > 1 ? "s" : ""} — ${domain}`,
          html
        });
        await supabase.from("notification_events").insert(
          wsAlerts.map((a) => ({
            workspace_id: wsId,
            alert_id: a.id,
            channel_type: "email",
            sent_at: (/* @__PURE__ */ new Date()).toISOString(),
            status: "sent"
          }))
        );
        logger.info("Digest sent", { workspace: wsId, alertCount: wsAlerts.length });
      } catch (err) {
        logger.error("Failed to send digest", { workspace: wsId, err });
      }
    }
    logger.info("Alert digest complete");
  }, "run")
});

export {
  sendAlertDigestTask
};
//# sourceMappingURL=chunk-HZYDX35I.mjs.map
