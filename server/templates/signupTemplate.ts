export const signupTemplate = (username: string) => `
  <div style="font-family:Arial,sans-serif;padding:20px;color:#111;">
    <h2>Welcome to Waypoint, ${username} 🎉</h2>
    <p>Thank you for signing up. We’re excited to have you onboard!</p>
    <p>If you have any questions or feedback, just reply to this email.</p>
    <hr />
    <small>© ${new Date().getFullYear()} Waypoint. All rights reserved.</small>
  </div>
`;
