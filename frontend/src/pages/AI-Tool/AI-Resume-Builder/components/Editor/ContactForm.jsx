import { useResume } from "../../context/useResume";
import './Forms.css';

const ContactForm = () => {
  const { resumeData, setResumeData } = useResume();

  // ✅ FIXED: This function now updates the correct 'personal_info' object.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({
      ...prevData,
      personal_info: {
        ...prevData.personal_info,
        [name]: value,
      },
    }));
  };

  // ✅ This JSX is restored to your original layout and structure,
  // but now points to the correct data fields.
  return (
    <div className="form-section">
      <div className="form-card unified-form-card">
        <div className="form-main-content">

          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="form-input"
              placeholder="e.g. Arunjyoti Changkakoty"
              value={resumeData.personal_info?.full_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="e.g. arunjyoti@example.com"
                value={resumeData.personal_info?.email || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                className="form-input"
                placeholder="e.g. +91 600XXXXXXX"
                value={resumeData.personal_info?.phone_number || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="linkedin_url">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                className="form-input"
                placeholder="linkedin.com/in/username"
                value={resumeData.personal_info?.linkedin_url || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="portfolio_url">Portfolio/Website</label>
              <input
                type="url"
                id="portfolio_url"
                name="portfolio_url"
                className="form-input"
                placeholder="github.com/username"
                value={resumeData.personal_info?.portfolio_url || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactForm;