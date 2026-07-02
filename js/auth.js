// ===============================
// The Shepherd's Library Auth JS
// ===============================

// -------------------------------
// Email + Password Signup
// -------------------------------
async function signUp(event) {
if (event) event.preventDefault();

const firstName = document.getElementById("firstName")?.value || "";
const lastName = document.getElementById("lastName")?.value || "";
const fullName = `${firstName} ${lastName}`.trim();

const email = document.getElementById("email")?.value || "";
const password = document.getElementById("password")?.value || "";
const churchName = document.getElementById("churchName")?.value || "";
const role = document.getElementById("role")?.value || "";
const message = document.getElementById("message");

const { error } = await supabaseClient.auth.signUp({
email,
password,
options: {
data: {
full_name: fullName,
first_name: firstName,
last_name: lastName,
church_name: churchName,
role: role
}
}
});

if (error) {
showMessage(message, error.message, "error");
return;
}

showMessage(
message,
"Account created successfully. Please check your email to confirm your account.",
"success"
);
}

// -------------------------------
// Email + Password Login
// -------------------------------
async function login(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("email")?.value || "";
  const password = document.getElementById("password")?.value || "";
  const message = document.getElementById("message");

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showMessage(message, error.message, "error");
    return;
  }

  window.location.href = REDIRECT_URL;
}

// -------------------------------
// Google Login
// -------------------------------
async function loginWithGoogle() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/dashboard.html"
    }
  });

  if (error) {
    alert(error.message);
  }
}


// Apple Login
// -------------------------------
async function loginWithApple() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: REDIRECT_URL
    }
  });

  if (error) {
    alert(error.message);
  }
}

// -------------------------------
// Password Reset
// -------------------------------
async function resetPassword() {
  const email = document.getElementById("email")?.value || "";
  const message = document.getElementById("message");

  if (!email) {
    showMessage(message, "Enter your email first, then click forgot password.", "error");
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: RESET_PASSWORD_URL
  });

  if (error) {
    showMessage(message, error.message, "error");
    return;
  }

  showMessage(message, "Password reset link sent. Check your email.", "success");
}

// -------------------------------
// Update Password
// Use on account.html after reset
// -------------------------------
async function updatePassword(event) {
  if (event) event.preventDefault();

  const newPassword = document.getElementById("newPassword")?.value || "";
  const message = document.getElementById("message");

  if (newPassword.length < 8) {
    showMessage(message, "Password must be at least 8 characters.", "error");
    return;
  }

  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });

  if (error) {
    showMessage(message, error.message, "error");
    return;
  }

  showMessage(message, "Password updated successfully.", "success");
}

// -------------------------------
// Logout
// -------------------------------
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

// -------------------------------
// Get Current User
// -------------------------------
async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data.user;
}

// -------------------------------
// Check if User is Logged In
// -------------------------------
async function checkAuth() {
  const { data } = await supabaseClient.auth.getSession();
  return data.session;
}

// -------------------------------
// Protect Private Pages
// -------------------------------
async function requireAuth() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
  }
}

// -------------------------------
// Redirect Logged-In Users
// Use this on login/signup pages if desired
// -------------------------------
async function redirectIfLoggedIn() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    window.location.href = REDIRECT_URL;
  }
}

// -------------------------------
// Load User Profile
// -------------------------------
async function loadUserProfile() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
}

// -------------------------------
// Helper Message Function
// -------------------------------
function showMessage(element, text, type = "success") {
  if (!element) return;

  element.textContent = text;

  if (type === "error") {
    element.style.color = "#dc2626";
  } else {
    element.style.color = "#1e3a8a";
  }
}
