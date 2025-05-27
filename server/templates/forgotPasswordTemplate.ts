export const forgotPasswordTemplate = (username: string, resetLink: string) => `
  <div style="font-family:Arial,sans-serif;padding:20px;color:#111;">
    <h2>Password Reset</h2>
    <p>Hello ${username},</p>
    <p>You requested to reset your Waypoint password.</p>
    <p>
      <a href="${resetLink}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">
        Reset Password
      </a>
    </p>
    <p>This link will expire in 15 minutes. If you didn’t request this, you can ignore it.</p>
    <hr />
    <small>Waypoint Support</small>
  </div>
`;
