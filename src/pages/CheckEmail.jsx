import React from "react";
import StatusNotice from "../components/StatusNotice";

export default function CheckEmail() {
  return (
    <StatusNotice
      title="Check your email"
      message="We’ve sent a link to your email. Please check your inbox and follow the instructions."
    />
  );
}
