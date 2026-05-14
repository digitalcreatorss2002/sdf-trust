import { useState } from "react";
import { API_BASE_URL } from "../config";

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    interest: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/volunteer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setStatus({ type: "success", message: data.message });
        setFormData({ name: "", email: "", phone: "", age: "", address: "", interest: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to submit application." });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Become a Volunteer 🙌
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Join us and make a difference in the community.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {status.message && (
            <div className={`p-4 rounded-lg text-center font-medium ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Email + Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Age + Interest */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                className="input"
                required
              />
            </div>


            <div>
              <label className="block mb-1 font-medium">Area of Interest</label>
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="environment">Environment</option>
                <option value="women">Women Empowerment</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="grid md:grid-cols-2 gap-4">
          <div className="max-w-5xl"> 
            <label className="block mb-1 font-medium">Full Address</label>
            <input
              name="address"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
              className="input"
              required
            ></input>
            </div>

            <div>
              <label className="block mb-1 font-medium">Pincode</label>
              <input
                type="pincode"
                name="age"
                placeholder="Enter Pincode"
                value={formData.age}
                onChange={handleChange}
                className="input"
                required
              />
            </div>


          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              name="message"
              placeholder="Why do you want to volunteer?"
              value={formData.message}
              onChange={handleChange}
              className="input h-28 resize-none"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-full font-semibold transition text-white ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application →"}
          </button>
        </form>
      </div>
    </section>
  );
}
