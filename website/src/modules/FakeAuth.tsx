import React, { useState } from "react";
import type { RiskProfile } from "../types";

interface Props {
  onLogin: (payload: {
    name: string;
    phone: string;
    aadhaar: string;
    pan: string;
    riskProfile: RiskProfile;
  }) => void | Promise<void>;
}

export const FakeAuth: React.FC<Props> = ({ onLogin }) => {
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("Amit");
  const [aadhaar, setAadhaar] = useState("123412341234");
  const [pan, setPan] = useState("ABCDE1234F");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 10) return;
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 4) return;
    setStep("details");
  };

  const maskId = (value: string) => {
    if (!value) return "";
    const visible = value.slice(-4);
    return "**** **** " + visible;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onLogin({
      name: name || "User",
      phone,
      aadhaar: maskId(aadhaar),
      pan: maskId(pan),
      riskProfile,
    });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>SpareChange Micro-Invest</h1>
        <p className="subtitle">
          Simulated OTP login with dummy Aadhaar &amp; PAN. No real data used.
        </p>

        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="form">
            <label>
              Phone number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile"
                required
              />
            </label>
            <button type="submit" className="btn-primary">
              Send OTP (mock)
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="form">
            <label>
              Enter OTP
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                required
              />
            </label>
            <button type="submit" className="btn-primary">
              Verify OTP (mock)
            </button>
          </form>
        )}

        {step === "details" && (
          <form onSubmit={handleDetailsSubmit} className="form">
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Aadhaar (dummy)
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
              />
            </label>
            <label>
              PAN (dummy)
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
              />
            </label>
            <label>
              Risk profile
              <select
                value={riskProfile}
                onChange={(e) =>
                  setRiskProfile(e.target.value as RiskProfile)
                }
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </label>
            <button type="submit" className="btn-primary">
              Continue to dashboard
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

