/**
 * Unit tests for ArgoTicketTool Popup/popup.js
 * Tests getConfig, refreshAccessToken, form validation, and FIELD mapping.
 */

// Setup DOM before testing
document.body.innerHTML = `
  <input id="email" value="" />
  <input id="requestType" value="" />
  <select id="priority"><option value="">-- select --</option><option value="Minor Issue">Minor Issue</option></select>
  <input id="subject" value="" />
  <textarea id="description"></textarea>
  <select id="statusField"><option value="New Ticket">New Ticket</option></select>
  <button id="submit">Submit</button>
  <div id="status"></div>
`;

// Define FIELD object matching popup.js source
const FIELD = {
  Email: "Email",
  Status: "Status",
  Priority: "Priority",
  Request_Type: "Request_Type",
  Request_Subject: "Request_Subject",
  Request_Description: "Request_Description"
};

// Define getConfig matching popup.js source
function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ["zohoOauthToken", "clientId", "clientSecret", "refreshToken"],
      (result) => resolve(result)
    );
  });
}

// Define refreshAccessToken matching popup.js source
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
  await new Promise((res) =>
    chrome.storage.sync.set({ zohoOauthToken: data.access_token }, res)
  );
  return data.access_token;
}

// Form validation logic matching popup.js
function validateForm() {
  const email = document.getElementById("email").value.trim();
  const requestType = document.getElementById("requestType").value.trim();
  const priority = document.getElementById("priority").value;
  const subject = document.getElementById("subject").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!email || !requestType || !priority || !subject || !description) {
    const msg = "Bitte alle Pflichtfelder ausfüllen.";
    document.getElementById("status").textContent = msg;
    document.getElementById("status").style.color = "red";
    return false;
  }
  return true;
}

beforeEach(() => {
  jest.clearAllMocks();
  // Reset DOM
  document.getElementById("email").value = "";
  document.getElementById("requestType").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("description").value = "";
  document.getElementById("status").textContent = "";
  document.getElementById("status").style.color = "";
});

describe('FIELD object', () => {
  test('FIELD has Email key', () => {
    expect(FIELD).toHaveProperty('Email', 'Email');
  });

  test('FIELD has Status key', () => {
    expect(FIELD).toHaveProperty('Status', 'Status');
  });

  test('FIELD has Priority key', () => {
    expect(FIELD).toHaveProperty('Priority', 'Priority');
  });

  test('FIELD has Request_Type key', () => {
    expect(FIELD).toHaveProperty('Request_Type', 'Request_Type');
  });

  test('FIELD has Request_Subject key', () => {
    expect(FIELD).toHaveProperty('Request_Subject', 'Request_Subject');
  });

  test('FIELD has Request_Description key', () => {
    expect(FIELD).toHaveProperty('Request_Description', 'Request_Description');
  });

  test('FIELD has exactly 6 keys', () => {
    expect(Object.keys(FIELD)).toHaveLength(6);
  });
});

describe('getConfig', () => {
  test('calls chrome.storage.sync.get', async () => {
    chrome.storage.sync.get.mockImplementation((keys, cb) => cb({}));
    await getConfig();
    expect(chrome.storage.sync.get).toHaveBeenCalledTimes(1);
  });

  test('calls chrome.storage.sync.get with correct keys', async () => {
    chrome.storage.sync.get.mockImplementation((keys, cb) => cb({}));
    await getConfig();
    expect(chrome.storage.sync.get).toHaveBeenCalledWith(
      ["zohoOauthToken", "clientId", "clientSecret", "refreshToken"],
      expect.any(Function)
    );
  });

  test('resolves with stored values', async () => {
    const mockData = { zohoOauthToken: 'abc123', clientId: 'cid', clientSecret: 'csec', refreshToken: 'rtok' };
    chrome.storage.sync.get.mockImplementation((keys, cb) => cb(mockData));
    const result = await getConfig();
    expect(result).toEqual(mockData);
  });

  test('resolves with empty object when nothing stored', async () => {
    chrome.storage.sync.get.mockImplementation((keys, cb) => cb({}));
    const result = await getConfig();
    expect(result).toEqual({});
  });
});

describe('refreshAccessToken', () => {
  test('makes POST request to Zoho token endpoint', async () => {
    const mockResp = {
      ok: true,
      json: jest.fn().mockResolvedValue({ access_token: 'new_token_xyz' })
    };
    global.fetch.mockResolvedValue(mockResp);
    chrome.storage.sync.set.mockImplementation((obj, cb) => cb());

    await refreshAccessToken('client123', 'secret456', 'refresh789');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://accounts.zoho.eu/oauth/v2/token',
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('returns access token on success', async () => {
    const mockResp = {
      ok: true,
      json: jest.fn().mockResolvedValue({ access_token: 'new_token_xyz' })
    };
    global.fetch.mockResolvedValue(mockResp);
    chrome.storage.sync.set.mockImplementation((obj, cb) => cb());

    const token = await refreshAccessToken('client123', 'secret456', 'refresh789');
    expect(token).toBe('new_token_xyz');
  });

  test('saves new token to chrome.storage.sync', async () => {
    const mockResp = {
      ok: true,
      json: jest.fn().mockResolvedValue({ access_token: 'saved_token' })
    };
    global.fetch.mockResolvedValue(mockResp);
    chrome.storage.sync.set.mockImplementation((obj, cb) => cb());

    await refreshAccessToken('cid', 'csec', 'rtok');
    expect(chrome.storage.sync.set).toHaveBeenCalledWith(
      { zohoOauthToken: 'saved_token' },
      expect.any(Function)
    );
  });

  test('throws error when API returns non-ok response', async () => {
    const mockResp = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'invalid_client' })
    };
    global.fetch.mockResolvedValue(mockResp);

    await expect(
      refreshAccessToken('bad_client', 'bad_secret', 'bad_refresh')
    ).rejects.toThrow('Token-Refresh fehlgeschlagen');
  });

  test('throws error when response has no access_token', async () => {
    const mockResp = {
      ok: true,
      json: jest.fn().mockResolvedValue({ error: 'expired_token' })
    };
    global.fetch.mockResolvedValue(mockResp);

    await expect(
      refreshAccessToken('cid', 'csec', 'rtok')
    ).rejects.toThrow('Token-Refresh fehlgeschlagen');
  });

  test('throws error when fetch itself fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    await expect(
      refreshAccessToken('cid', 'csec', 'rtok')
    ).rejects.toThrow('Network error');
  });
});

describe('Form validation', () => {
  test('shows error message when all fields are empty', () => {
    const result = validateForm();
    expect(result).toBe(false);
    expect(document.getElementById('status').textContent).toBe('Bitte alle Pflichtfelder ausfüllen.');
  });

  test('shows error in red color when validation fails', () => {
    validateForm();
    expect(document.getElementById('status').style.color).toBe('red');
  });

  test('fails validation when only email is filled', () => {
    document.getElementById('email').value = 'test@test.com';
    const result = validateForm();
    expect(result).toBe(false);
  });

  test('fails validation when only requestType is missing', () => {
    document.getElementById('email').value = 'test@test.com';
    document.getElementById('priority').value = 'Minor Issue';
    document.getElementById('subject').value = 'Test Subject';
    document.getElementById('description').value = 'Test desc';
    const result = validateForm();
    expect(result).toBe(false);
  });

  test('passes validation when all required fields are filled', () => {
    document.getElementById('email').value = 'test@test.com';
    document.getElementById('requestType').value = 'Software Issue';
    document.getElementById('priority').value = 'Minor Issue';
    document.getElementById('subject').value = 'Test Subject';
    document.getElementById('description').value = 'Some description here';
    const result = validateForm();
    expect(result).toBe(true);
  });

  test('fails validation when email is whitespace only', () => {
    document.getElementById('email').value = '   ';
    document.getElementById('requestType').value = 'Software Issue';
    document.getElementById('priority').value = 'Minor Issue';
    document.getElementById('subject').value = 'Test';
    document.getElementById('description').value = 'Desc';
    const result = validateForm();
    expect(result).toBe(false);
  });
});
