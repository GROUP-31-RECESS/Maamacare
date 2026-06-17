const API_BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("mamacare_api_token");
}

function setToken(token) {
  localStorage.setItem("mamacare_api_token", token);
}

function clearToken() {
  localStorage.removeItem("mamacare_api_token");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong.");
  }

  return data;
}

export const authApi = {
  async register({ name, phone, password }) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, phone, password }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  async login({ phone, password }) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    });

    if (data.token) {
      setToken(data.token);
    }

    return data;
  },

  async me() {
    return request("/auth/me");
  },

  async changePassword({ currentPassword, newPassword }) {
    return request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout() {
    clearToken();
  },
};

export const profileApi = {
  get() {
    return request("/profile");
  },

  update(profile) {
    return request("/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  },
};

export const symptomsApi = {
  list() {
    return request("/symptoms");
  },

  create(payload) {
    return request("/symptoms", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/symptoms/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return request(`/symptoms/${id}`, {
      method: "DELETE",
    });
  },
};

export const vitalsApi = {
  list() {
    return request("/vitals");
  },

  create(payload) {
    return request("/vitals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const wellnessApi = {
  list() {
    return request("/wellness");
  },

  create(payload) {
    return request("/wellness", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const appointmentsApi = {
  list() {
    return request("/appointments");
  },

  create(payload) {
    return request("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return request(`/appointments/${id}`, {
      method: "DELETE",
    });
  },
};

export const medicationsApi = {
  list() {
    return request("/medications");
  },

  create(payload) {
    return request("/medications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/medications/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return request(`/medications/${id}`, {
      method: "DELETE",
    });
  },
};

export const babyMovementApi = {
  list() {
    return request("/baby-movements");
  },

  create(payload) {
    return request("/baby-movements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const emergencyPlanApi = {
  get() {
    return request("/emergency-plan");
  },

  update(payload) {
    return request("/emergency-plan", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const healthRecordApi = {
  get() {
    return request("/health-record");
  },

  update(payload) {
    return request("/health-record", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const postnatalCareApi = {
  get() {
    return request("/postnatal-care");
  },

  update(payload) {
    return request("/postnatal-care", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

export const supportPeopleApi = {
  list() {
    return request("/support-people");
  },

  create(payload) {
    return request("/support-people", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/support-people/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return request(`/support-people/${id}`, {
      method: "DELETE",
    });
  },
};


export const aiApi = {
  ask(payload) {
    return request("/ai/ask", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const reportsApi = {
  clinicSummary() {
    return request("/reports/clinic-summary");
  },

  printableSummary() {
    return request("/reports/printable-summary");
  },
};

export const syncApi = {
  status() {
    return request("/sync/status");
  },

  push(payload) {
    return request("/sync/push", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  pull() {
    return request("/sync/pull");
  },
};

export const apiTools = {
  getToken,
  setToken,
  clearToken,
};
