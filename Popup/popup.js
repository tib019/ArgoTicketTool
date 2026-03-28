// Cloudflare-Worker-Proxy
// Config is loaded from config.js (see config.example.js — copy and fill in your values)
/* global CONFIG */
const PROXY_URL = (typeof CONFIG !== "undefined") ? CONFIG.PROXY_URL : "";
const PROXY_SECRET = (typeof CONFIG !== "undefined") ? CONFIG.PROXY_SECRET : "";


const FIELD = {
  Email: "Email",
  Status: "Status",
  Priority: "Priority",
  Request_Type: "Request_Type",
  Request_Subject: "Request_Subject",
  Request_Description: "Request_Description"
};

// Storage lesen
function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ["zohoOauthToken", "clientId", "clientSecret", "refreshToken"],
      (result) => resolve(result)
    );
  });
}

// neuen Access-Token via Refresh holen
async function refreshAccessToken(clientId, clientSecret, refreshToken) {
  const resp = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  const data = await resp.json();
  if (!resp.ok || !data.access_token) {
    throw new Error("Token-Refresh fehlgeschlagen: " + JSON.stringify(data));
  }
  // neuen Token speichern
  await new Promise((res) =>
    chrome.storage.sync.set({ zohoOauthToken: data.access_token }, res)
  );
  return data.access_token;
}

document.getElementById("submit").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const requestType = document.getElementById("requestType").value.trim();
  const priority = document.getElementById("priority").value;
  const subject = document.getElementById("subject").value.trim();
  const description = document.getElementById("description").value.trim();
  const statusValue = document.getElementById("statusField").value;

  // Pflichtfelder prüfen
  if (!email || !requestType || !priority || !subject || !description) {
    const msg = "Bitte alle Pflichtfelder ausfüllen.";
    document.getElementById("status").textContent = msg;
    document.getElementById("status").style.color = "red";
    return;
  }

  const cfg = await getConfig();
  let accessToken = cfg.zohoOauthToken;
  const clientId = cfg.clientId;
  const clientSecret = cfg.clientSecret;
  const refreshToken = cfg.refreshToken;

  if (!accessToken) {
    document.getElementById("status").textContent =
      "Kein Access Token gefunden. Bitte in den Optionen speichern.";
    document.getElementById("status").style.color = "red";
    return;
  }

  const payload = {
    data: {
      [FIELD.Email]: email,
      [FIELD.Status]: statusValue || "New Ticket",
      [FIELD.Priority]: priority,
      [FIELD.Request_Type]: requestType,
      [FIELD.Request_Subject]: subject,
      [FIELD.Request_Description]: description
    }
  };

  //GEÄNDERT: POST geht an den Worker + Secret-Header
  async function postRecord(token) {
    const r = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
        "X-Proxy-Auth": PROXY_SECRET
      },
      body: JSON.stringify(payload)
    });
    const json = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, json };
  }

  // 1. Versuch
  let result = await postRecord(accessToken);

  // Wenn 401, versuche Refresh
  if (!result.ok && result.status === 401 && refreshToken && clientId && clientSecret) {
    try {
      accessToken = await refreshAccessToken(clientId, clientSecret, refreshToken);
      result = await postRecord(accessToken);
    } catch (e) {
      document.getElementById("status").textContent =
        "Token-Refresh fehlgeschlagen: " + e.message;
      document.getElementById("status").style.color = "red";
      return;
    }
  }

  if (result.ok) {
    document.getElementById("status").textContent = "Ticket erfolgreich erstellt!";
    document.getElementById("status").style.color = "green";
    // Felder leeren
    document.getElementById("email").value = "";
    document.getElementById("requestType").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("description").value = "";
    document.getElementById("statusField").value = "New Ticket";
  } else {
    // Zeige vollständige Fehlermeldung
    console.error("Zoho error:", result.json);
    const msg =
      (result.json && (result.json.message || result.json.description || JSON.stringify(result.json))) ||
      `HTTP ${result.status}`;
    document.getElementById("status").textContent = "Fehler: " + msg;
    document.getElementById("status").style.color = "red";
  }
});
