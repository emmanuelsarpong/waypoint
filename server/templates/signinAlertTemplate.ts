export const loginAlertTemplate = (username: string, location: string, time: string) => `
  <div style="font-family:Arial,sans-serif;padding:20px;color:#111;">
    <h3>Hey ${username},</h3>
    <p>We noticed a login to your Waypoint account:</p>
    <ul>
      <li><strong>Location:</strong> ${location}</li>
      <li><strong>Time:</strong> ${time}</li>
    </ul>
    <p>If this wasn’t you, please reset your password immediately.</p>
    <hr />
    <small>Waypoint Security</small>
  </div>
`;
