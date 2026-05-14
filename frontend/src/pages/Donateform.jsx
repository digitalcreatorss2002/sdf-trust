import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { API_BASE_URL } from "../config";

export default function DonationForm() {
  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    donation_amount: "",
    address: "",
    message: "",
    wants_80g: false,
    pan_number: "",
  };

  const PAYMENT_TIME_LIMIT = 120; // 2 minutes for better UX
  const RESET_DELAY = 4000;

  const [showPan, setShowPan] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [responseMsg, setResponseMsg] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIME_LIMIT);
  const [isCreatingDonation, setIsCreatingDonation] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const resetRef = useRef(null);

  const upiId = "9709544166@ybl";
  const payeeName = "SDF Trust";

  // Using API_BASE_URL from config
  const CREATE_DONATION_API = `${API_BASE_URL}/create-donation.php`;
  const CHECK_STATUS_API = `${API_BASE_URL}/check-payment-status.php`;
  const EXPIRE_PAYMENT_API = `${API_BASE_URL}/expire-payment.php`;

  const createUpiUrl = ({ upiId, payeeName, amount, transactionId }) => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: String(amount),
      cu: "INR",
      tn: `Donation ${transactionId}`,
    });
    return `upi://pay?${params.toString()}`;
  };

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    if (resetRef.current) clearTimeout(resetRef.current);
  };

  const resetToForm = () => {
    clearAllTimers();
    setFormData(initialFormData);
    setSavedData(null);
    setShowPayment(false);
    setShowPan(false);
    setPaymentSuccess(false);
    setTransactionId("");
    setTimeLeft(PAYMENT_TIME_LIMIT);
    setIsCreatingDonation(false);
    setIsCheckingStatus(false);
    setResponseMsg("");
  };

  const backToFormOnly = async () => {
    if (transactionId && !paymentSuccess) {
      await markExpired(transactionId);
    }
    clearAllTimers();
    setShowPayment(false);
    setTransactionId("");
    setResponseMsg("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "pan_number" ? value.toUpperCase() : value,
    }));
    if (name === "wants_80g") setShowPan(checked);
  };

  const markExpired = async (txnId) => {
    try {
      await fetch(EXPIRE_PAYMENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: txnId }),
      });
    } catch (error) {
      console.error("Expiry error:", error);
    }
  };

  const checkPaymentStatus = async (txnId) => {
    if (!txnId || paymentSuccess) return;
    try {
      setIsCheckingStatus(true);
      const res = await fetch(`${CHECK_STATUS_API}?transaction_id=${encodeURIComponent(txnId)}`);
      const data = await res.json();

      if (data.status === "approved" || data.payment_status === "success") {
        clearAllTimers();
        setPaymentSuccess(true);
        setResponseMsg("✅ Donation Verified Successfully!");
        resetRef.current = setTimeout(resetToForm, RESET_DELAY);
      } else if (data.payment_status === "expired") {
        clearAllTimers();
        setResponseMsg("❌ QR Expired. Please try again.");
        resetRef.current = setTimeout(resetToForm, 3000);
      }
    } catch (error) {
      console.error("Status poll error:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const startCountdownAndPolling = (txnId) => {
    setTimeLeft(PAYMENT_TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          markExpired(txnId);
          setResponseMsg("⚠️ Time out. QR has expired.");
          resetRef.current = setTimeout(resetToForm, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    pollRef.current = setInterval(() => checkPaymentStatus(txnId), 4000);
  };

  const handleSaveInformation = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    setIsCreatingDonation(true);

    try {
      const res = await fetch(CREATE_DONATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSavedData(formData);
        setTransactionId(data.transaction_id);
        setShowPayment(true);
        startCountdownAndPolling(data.transaction_id);
      } else {
        setResponseMsg(data.message || "Initialization failed.");
      }
    } catch (error) {
      setResponseMsg("Network error. Please try again.");
    } finally {
      setIsCreatingDonation(false);
    }
  };

  const upiUrl = useMemo(() => {
    if (!savedData?.donation_amount || !transactionId) return "";
    return createUpiUrl({
      upiId,
      payeeName,
      amount: savedData.donation_amount,
      transactionId,
    });
  }, [savedData, transactionId]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-[#6a752b] mb-2">Support SDF Trust</h2>
        <p className="text-gray-500 italic">"Your contribution makes a direct impact on underprivileged lives."</p>
      </div>

      {responseMsg && (
        <div className={`mb-6 p-4 rounded-xl text-center font-bold ${paymentSuccess ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-100"}`}>
          {responseMsg}
        </div>
      )}

      {!showPayment ? (
        <form className="space-y-5" onSubmit={handleSaveInformation}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" name="first_name" placeholder="First Name" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6a752b] outline-none" value={formData.first_name} onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Last Name" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6a752b] outline-none" value={formData.last_name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="email" name="email" placeholder="Email Address" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6a752b] outline-none" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6a752b] outline-none" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="space-y-3">
            <input type="number" name="donation_amount" placeholder="Enter Amount (₹)" className="w-full border-2 border-[#6a752b]/20 rounded-xl px-4 py-4 text-xl font-bold focus:border-[#6a752b] outline-none" value={formData.donation_amount} onChange={handleChange} required min="1" />
            <div className="flex flex-wrap gap-3">
              {[500, 1000, 2000, 5000].map((amount) => (
                <button key={amount} type="button" onClick={() => setFormData(p => ({ ...p, donation_amount: String(amount) }))} className="px-5 py-2 rounded-full border border-gray-200 hover:bg-[#6a752b] hover:text-white transition-colors text-sm font-bold">₹{amount}</button>
              ))}
            </div>
          </div>

          <input type="text" name="address" placeholder="Residential Address" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6a752b] outline-none" value={formData.address} onChange={handleChange} required />

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" name="wants_80g" id="80g" className="w-5 h-5 accent-[#6a752b]" checked={formData.wants_80g} onChange={handleChange} />
            <label htmlFor="80g" className="text-sm font-semibold text-gray-700 cursor-pointer">I want an 80G Tax Exemption Receipt</label>
          </div>

          {showPan && (
            <input type="text" name="pan_number" placeholder="Enter 10-digit PAN Number" maxLength={10} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#6a752b] outline-none font-mono" value={formData.pan_number} onChange={handleChange} required />
          )}

          <button type="submit" disabled={isCreatingDonation} className="w-full bg-[#6a752b] hover:bg-[#5a6425] text-white font-bold py-4 rounded-full transition shadow-lg text-lg">
            {isCreatingDonation ? "Initializing Payment..." : "Generate Payment QR →"}
          </button>
        </form>
      ) : (
        <div className="text-center py-5 space-y-6 animate-fade-in">
          {!paymentSuccess && (
            <div className="inline-block bg-red-50 text-red-600 px-6 py-2 rounded-full font-mono font-bold border border-red-100">
              QR Expires in: {minutes}:{seconds}
            </div>
          )}

          <div className="relative p-6 bg-white border-4 border-[#6a752b] rounded-[2rem] inline-block shadow-2xl">
            {!paymentSuccess ? (
              <>
                <div className="mb-4">
                    <p className="text-lg font-bold text-gray-800">Scan to Pay: ₹{savedData?.donation_amount}</p>
                    <p className="text-xs text-gray-400">Transaction ID: {transactionId}</p>
                </div>
                <QRCode value={upiUrl} size={220} />
                <div className="mt-6 flex flex-col gap-3">
                    <a href={upiUrl} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition">
                        📱 Open UPI App
                    </a>
                    <button onClick={backToFormOnly} className="text-gray-400 text-sm underline hover:text-red-500">
                        Cancel and Edit Form
                    </button>
                </div>
              </>
            ) : (
              <div className="py-10 px-5 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-[#6a752b]">Payment Successful!</h3>
                <p className="text-gray-500 mt-2">Thank you for your kindness.</p>
              </div>
            )}
          </div>

          {!paymentSuccess && (
            <div className="flex flex-col items-center gap-2">
                <div className="w-2 h-2 bg-[#6a752b] rounded-full animate-ping"></div>
                <p className="text-sm text-gray-400 italic">Waiting for payment verification from admin...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}