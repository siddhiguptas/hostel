const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const counters = document.querySelectorAll("[data-count]");

counters.forEach((counter) => {
  const target = Number(counter.dataset.count || 0);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 42));

  const tick = () => {
    current = Math.min(target, current + step);
    counter.textContent = String(current);

    if (current < target) {
      requestAnimationFrame(tick);
    }
  };

  tick();
});

const leaveForm = document.getElementById("leaveForm");

if (leaveForm) {
  leaveForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");
    const message = document.getElementById("leaveMessage");
    const start = new Date(fromDate.value);
    const end = new Date(toDate.value);

    if (end < start) {
      message.textContent = "Return date must be after the leaving date.";
      message.classList.add("error");
      return;
    }

    const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    message.textContent = `Leave request submitted for ${days} day${days === 1 ? "" : "s"}.`;
    message.classList.remove("error");
    leaveForm.reset();
  });
}

const feeForm = document.getElementById("feeForm");

if (feeForm) {
  feeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fee = Number(document.getElementById("roomType").value);
    const months = Number(document.getElementById("months").value);
    const paid = Number(document.getElementById("paidAmount").value);
    const result = document.getElementById("feeResult");
    const total = fee * months;
    const due = Math.max(0, total - paid);
    const extra = Math.max(0, paid - total);

    result.classList.remove("error");

    if (extra > 0) {
      result.textContent = `Total fee is Rs. ${total.toLocaleString("en-IN")}. Extra paid: Rs. ${extra.toLocaleString("en-IN")}.`;
      return;
    }

    result.textContent = `Total fee is Rs. ${total.toLocaleString("en-IN")}. Amount due: Rs. ${due.toLocaleString("en-IN")}.`;
  });
}

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authTabs = document.querySelectorAll("[data-auth-tab]");

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
};

const getAccounts = () => readJson("hostelAccounts", []);
const saveAccounts = (accounts) => localStorage.setItem("hostelAccounts", JSON.stringify(accounts));
const cleanUsername = (value) => value.trim().toLowerCase();
const getCurrentUser = () => readJson("hostelCurrentUser", null);

const currentUser = getCurrentUser();

document.querySelectorAll(".login-link").forEach((link) => {
  if (currentUser) {
    link.textContent = "Dashboard";
    link.href = "dashboard.html";
  }
});

const showAuthMessage = (text, isError = false) => {
  const message = document.getElementById("loginMessage");

  if (!message) {
    return;
  }

  message.textContent = text;
  message.classList.toggle("error", isError);
};

const setAuthMode = (mode) => {
  if (!loginForm || !signupForm) {
    return;
  }

  const isSignup = mode === "signup";
  const title = document.getElementById("authTitle");

  loginForm.hidden = isSignup;
  signupForm.hidden = !isSignup;

  if (title) {
    title.textContent = isSignup ? "Create your account" : "Login to continue";
  }

  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authTab === mode;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  showAuthMessage(isSignup ? "Create an account first, then use the same details to log in." : "");
};

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab));
});

const findAccount = (role, username) => {
  return getAccounts().find((item) => item.role === role && item.username === cleanUsername(username));
};

const validateLoginUser = () => {
  if (!loginForm) {
    return;
  }

  const role = document.getElementById("loginRole").value;
  const username = cleanUsername(document.getElementById("loginUsername").value);

  if (!username) {
    showAuthMessage("");
    return;
  }

  if (!findAccount(role, username)) {
    showAuthMessage("No account exists for this role and username. Please sign up first.", true);
    return;
  }

  showAuthMessage("Account found. Enter your password to continue.");
};

const loginRole = document.getElementById("loginRole");
const loginUsername = document.getElementById("loginUsername");

if (loginRole && loginUsername) {
  loginRole.addEventListener("change", validateLoginUser);
  loginUsername.addEventListener("blur", validateLoginUser);
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const role = document.getElementById("signupRole").value;
    const fullName = document.getElementById("fullName").value.trim();
    const username = cleanUsername(document.getElementById("signupUsername").value);
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const accounts = getAccounts();

    if (password !== confirmPassword) {
      showAuthMessage("Passwords do not match.", true);
      return;
    }

    const alreadyExists = accounts.some((account) => account.username === username);

    if (alreadyExists) {
      showAuthMessage("This username already exists. Choose another username or log in.", true);
      return;
    }

    accounts.push({ role, fullName, username, password });
    saveAccounts(accounts);
    signupForm.reset();
    setAuthMode("login");
    showAuthMessage("Account created. You can log in now.");
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const role = document.getElementById("loginRole").value;
    const username = cleanUsername(document.getElementById("loginUsername").value);
    const password = document.getElementById("loginPassword").value;
    const account = findAccount(role, username);

    if (!account) {
      showAuthMessage("No account exists for this role and username. Please sign up first.", true);
      return;
    }

    if (account.password !== password) {
      showAuthMessage("Incorrect password. Please try again.", true);
      return;
    }

    localStorage.setItem("hostelCurrentUser", JSON.stringify({
      role: account.role,
      username: account.username,
      fullName: account.fullName
    }));

    showAuthMessage(`${account.role} dashboard ready for ${account.fullName}.`);
    loginForm.reset();
    window.location.href = "dashboard.html";
  });
}

const dashboardGreeting = document.getElementById("dashboardGreeting");

if (dashboardGreeting) {
  if (!currentUser) {
    window.location.href = "login.html";
  } else {
    const profileName = document.getElementById("profileName");
    const profileMeta = document.getElementById("profileMeta");
    const profileInitials = document.getElementById("profileInitials");
    const dashboardRole = document.getElementById("dashboardRole");

    dashboardGreeting.textContent = `Welcome, ${currentUser.fullName}.`;

    if (dashboardRole) {
      dashboardRole.textContent = `${currentUser.role} access is active for username ${currentUser.username}.`;
    }

    if (profileName) {
      profileName.textContent = currentUser.fullName;
    }

    if (profileMeta) {
      profileMeta.textContent = `${currentUser.role} account`;
    }

    if (profileInitials) {
      profileInitials.textContent = currentUser.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "CB";
    }
  }
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("hostelCurrentUser");
    window.location.href = "login.html";
  });
}
