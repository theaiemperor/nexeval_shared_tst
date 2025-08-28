const security = {
    token_expiry_seconds: 60 * 60 * 24 * 7,
    password_hash_rounds: 12,
    password_min_len: 6,
    password_max_len: 22,
    max_login_attemps: 5,
    otp_expiration_mintues: 10,
    otp_len: 6,
    encryption_algo: "AES-256-CBC",
    has_algo: "SHA-256",
    http_only: true,
    x_frame_options: 'DENY',
    rate_limit_max_req: 100,
    rate_limit_window_mintues: 15,
    audit_logs: true,
    audit_logs_retation_days: 90,
    secure_headers_enable: true
}

export default security;