const redis = require("redis");
const {
  REDIS_URL,
  OTP_EXPIRES_IN,
  OTP_LENGTH,
  MSG91_AUTH_KEY,
  MSG91_TEMPLATE_ID,
} = require("./env");

/* =========================
   REDIS
========================= */
const client = redis.createClient({ url: REDIS_URL });

client.on("error", err => {
  console.error("Redis Error:", err.message);
});

(async () => {
  await client.connect();
  console.log("Redis connected");
})();

/* =========================
   MSG91
========================= */
const MSG91_BASE_URL = "https://control.msg91.com/api/v5/otp";

const normalizePhoneKey = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const formatMsg91Mobile = (phone = "") => {
  const phoneKey = normalizePhoneKey(phone);
  return phoneKey ? `91${phoneKey}` : "";
};

const getOtpExpiryMinutes = () => {
  const seconds = Number(OTP_EXPIRES_IN) || 300;
  return Math.max(1, Math.ceil(seconds / 60));
};

const parseMsg91Response = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (_error) {
    return { type: response.ok ? "success" : "error", message: text };
  }
};

const ensureMsg91Config = () => {
  if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
    const err = new Error("MSG91_AUTH_KEY and MSG91_TEMPLATE_ID are required");
    err.statusCode = 500;
    throw err;
  }
};

const isMsg91Success = (data) => {
  const type = String(data?.type || "").toLowerCase();
  const message = String(data?.message || "").toLowerCase();

  return type === "success" || message.includes("success") || message.includes("verified");
};

const sendMsg91Otp = async (mobile) => {
  const url = new URL(MSG91_BASE_URL);
  url.searchParams.set("authkey", MSG91_AUTH_KEY);
  url.searchParams.set("template_id", MSG91_TEMPLATE_ID);
  url.searchParams.set("mobile", mobile);
  url.searchParams.set("otp_length", String(OTP_LENGTH || 6));
  url.searchParams.set("otp_expiry", String(getOtpExpiryMinutes()));

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await parseMsg91Response(response);

  if (!response.ok || !isMsg91Success(data)) {
    const err = new Error(data?.message || "MSG91 OTP send failed");
    err.statusCode = response.status || 502;
    err.providerResponse = data;
    throw err;
  }

  return data;
};

/* =========================
   OTP RATE LIMITING (max 3 per hour per phone)
========================= */
const OTP_RATE_LIMIT = 3;
const OTP_RATE_WINDOW = 3600; // 1 hour in seconds

const checkOTPRateLimit = async (phone) => {
  const key = `otp_rate:${normalizePhoneKey(phone)}`;
  const count = await client.get(key);

  if (count && Number(count) >= OTP_RATE_LIMIT) {
    return false;
  }

  const newCount = await client.incr(key);
  if (newCount === 1) {
    await client.expire(key, OTP_RATE_WINDOW);
  }

  return true;
};

const sendOTP = async phone => {
  ensureMsg91Config();

  const phoneKey = normalizePhoneKey(phone);

  if (!phoneKey || phoneKey.length !== 10) {
    const err = new Error("Enter a valid 10-digit phone number");
    err.statusCode = 400;
    throw err;
  }

  const inFlightKey = `otp_inflight:${phoneKey}`;
  const lockAcquired = await client.set(inFlightKey, "1", {
    NX: true,
    EX: 10,
  });

  if (!lockAcquired) {
    return true;
  }

  try {
    // Rate limit disabled for testing. Re-enable before production launch.
    // const allowed = await checkOTPRateLimit(phoneKey);
    // if (!allowed) {
    //   const err = new Error("Too many OTP requests. Max 3 per hour. Please try again later.");
    //   err.statusCode = 429;
    //   throw err;
    // }

    const mobile = formatMsg91Mobile(phoneKey);
    const data = await sendMsg91Otp(mobile);
    console.log(`MSG91 SMS OTP sent successfully to ${mobile}`);
    return data;
  } finally {
    await client.del(inFlightKey);
  }
};

const verifyOTP = async (phone, otp) => {
  ensureMsg91Config();

  const phoneKey = normalizePhoneKey(phone);
  const mobile = formatMsg91Mobile(phoneKey);

  if (!mobile || !otp) return false;

  const url = new URL(`${MSG91_BASE_URL}/verify`);
  url.searchParams.set("otp", String(otp).trim());
  url.searchParams.set("mobile", mobile);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      authkey: MSG91_AUTH_KEY,
    },
  });

  const data = await parseMsg91Response(response);
  console.log(`MSG91 OTP verify: phone=${mobile}, type=${data?.type}, message=${data?.message}`);

  return response.ok && isMsg91Success(data);
};

module.exports = {
  sendOTP,
  verifyOTP,
};
