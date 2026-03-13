const BASE_URL = "http://localhost:5000/api";
const LANGUAGE_STORAGE_KEY = "arogya_language";
const DEFAULT_LANGUAGE = "en";
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();

const exactTranslations = {
  kn: {
    "Arogya-Vahini": "ಆರೋಗ್ಯ ವಾಹಿನಿ",
    "Arogya Vault": "ಆರೋಗ್ಯ ವಾಲ್ಟ್",
    "Technology": "ತಂತ್ರಜ್ಞಾನ",
    "Network": "ಜಾಲ",
    "Portal Login": "ಪೋರ್ಟಲ್ ಲಾಗಿನ್",
    "Empowering Rural Healthcare": "ಗ್ರಾಮೀಣ ಆರೋಗ್ಯಕ್ಕೆ ಶಕ್ತಿ",
    "Universal": "ಸಾರ್ವತ್ರಿಕ",
    "Referral": "ರೆಫರಲ್",
    "Health Vault": "ಆರೋಗ್ಯ ವಾಲ್ಟ್",
    "Access My Health Vault": "ನನ್ನ ಆರೋಗ್ಯ ವಾಲ್ಟ್ ತೆರೆಯಿರಿ",
    "Show My QR Token": "ನನ್ನ ಕ್ಯೂಆರ್ ಟೋಕನ್ ತೋರಿಸಿ",
    "Patients": "ರೋಗಿಗಳು",
    "Secure": "ಸುರಕ್ಷಿತ",
    "Clinics": "ಕ್ಲಿನಿಕ್‌ಗಳು",
    "Health Records": "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
    "All your data, one place.": "ನಿಮ್ಮ ಎಲ್ಲಾ ಮಾಹಿತಿ, ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.",
    "Digital History": "ಡಿಜಿಟಲ್ ಇತಿಹಾಸ",
    "No paper files needed.": "ಕಾಗದದ ಕಡತಗಳ ಅಗತ್ಯವಿಲ್ಲ.",
    "QR for Doctors": "ವೈದ್ಯರಿಗಾಗಿ ಕ್ಯೂಆರ್",
    "Instant access via scan.": "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಕೂಡಲೇ ಪ್ರವೇಶ.",
    "Easy Referrals": "ಸುಲಭ ರೆಫರಲ್‌ಗಳು",
    "Specialist transfers fast.": "ತಜ್ಞರ ಬಳಿಗೆ ವೇಗವಾದ ವರ್ಗಾವಣೆ.",
    "Portal Access": "ಪೋರ್ಟಲ್ ಪ್ರವೇಶ",
    "Doctor": "ವೈದ್ಯರು",
    "Patient": "ರೋಗಿ",
    "Admin": "ನಿರ್ವಾಹಕ",
    "Email Address": "ಇಮೇಲ್ ವಿಳಾಸ",
    "Password": "ಗುಪ್ತಪದ",
    "Sign In": "ಸೈನ್ ಇನ್",
    "New to the platform?": "ವೇದಿಕೆಗೆ ಹೊಸವರಾ?",
    "Register Now": "ಈಗ ನೋಂದಣಿ ಮಾಡಿ",
    "Create Account": "ಖಾತೆ ರಚಿಸಿ",
    "Full Name": "ಪೂರ್ಣ ಹೆಸರು",
    "Phone": "ದೂರವಾಣಿ",
    "Aadhaar (ID)": "ಆಧಾರ್ (ಐಡಿ)",
    "Register Account": "ಖಾತೆ ನೋಂದಣಿ ಮಾಡಿ",
    "Already registered?": "ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?",
    "Verify Device": "ಸಾಧನವನ್ನು ಪರಿಶೀಲಿಸಿ",
    "Enter OTP": "OTP ನಮೂದಿಸಿ",
    "Verify & Login": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ",
    "Overview": "ಒವರ್ವ್ಯೂ",
    "Referrals": "ರೆಫರಲ್‌ಗಳು",
    "Scan QR": "ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್",
    "Appointments": "ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು",
    "Teleconsultation": "ದೂರ ಚಿಕಿತ್ಸಾ ಸಲಹೆ",
    "System Online": "ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯವಾಗಿದೆ",
    "Sign Out": "ಸೈನ್ ಔಟ್",
    "Clinic Overview": "ಕ್ಲಿನಿಕ್ ಸಮೀಕ್ಷೆ",
    "New Patient": "ಹೊಸ ರೋಗಿ",
    "Patient Growth": "ರೋಗಿ ವೃದ್ಧಿ",
    "Sync Status": "ಸಿಂಕ್ ಸ್ಥಿತಿ",
    "Live & Secure": "ಲೈವ್ ಮತ್ತು ಸುರಕ್ಷಿತ",
    "Storage Used": "ಬಳಸಿದ ಸಂಗ್ರಹಣೆ",
    "Active Referrals": "ಸಕ್ರಿಯ ರೆಫರಲ್‌ಗಳು",
    "Pending Review": "ಪರಿಶೀಲನೆ ಬಾಕಿ",
    "Appointments": "ಅಪಾಯಿಂಟ್ಮೆಂಟ್‌ಗಳು",
    "Next Up": "ಮುಂದಿನದು",
    "Quick Actions": "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    "Scan": "ಸ್ಕ್ಯಾನ್",
    "Add": "ಸೇರಿಸಿ",
    "Tele": "ಟೆಲೆ",
    "Vault": "ವಾಲ್ಟ್",
    "Recent Patients": "ಇತ್ತೀಚಿನ ರೋಗಿಗಳು",
    "View All": "ಎಲ್ಲವನ್ನು ನೋಡಿ",
    "Notifications": "ಸೂಚನೆಗಳು",
    "Patient Profile": "ರೋಗಿಯ ಪ್ರೊಫೈಲ್",
    "Verified Account": "ಪರಿಶೀಲಿತ ಖಾತೆ",
    "Health Status: Stable": "ಆರೋಗ್ಯ ಸ್ಥಿತಿ: ಸ್ಥಿರ",
    "Health Records": "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
    "My Referrals": "ನನ್ನ ರೆಫರಲ್‌ಗಳು",
    "Medical History": "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    "Export History": "ಇತಿಹಾಸ ರಫ್ತು ಮಾಡಿ",
    "Blood Group": "ರಕ್ತ ಗುಂಪು",
    "Visits": "ಭೇಟಿಗಳು",
    "Next Checkup": "ಮುಂದಿನ ತಪಾಸಣೆ",
    "Recent Consultations": "ಇತ್ತೀಚಿನ ಸಲಹೆಗಳು",
    "Prescription": "ಔಷಧ ಸೂಚನೆ",
    "Doctor's Advice": "ವೈದ್ಯರ ಸಲಹೆ",
    "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "Patients Directory": "ರೋಗಿಗಳ ಪಟ್ಟಿ",
    "Manage all registered patients.": "ನೋಂದಾಯಿತ ಎಲ್ಲಾ ರೋಗಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    "Patient ID": "ರೋಗಿ ಐಡಿ",
    "Name": "ಹೆಸರು",
    "Age/Gender": "ವಯಸ್ಸು/ಲಿಂಗ",
    "Blood Grp": "ರಕ್ತ ಗುಂಪು",
    "Action": "ಕ್ರಿಯೆ",
    "Register New Patient": "ಹೊಸ ರೋಗಿಯನ್ನು ನೋಂದಣಿ ಮಾಡಿ",
    "Aadhaar": "ಆಧಾರ್",
    "Age": "ವಯಸ್ಸು",
    "Gender": "ಲಿಂಗ",
    "Male": "ಪುರುಷ",
    "Female": "ಮಹಿಳೆ",
    "Other": "ಇತರೆ",
    "Address": "ವಿಳಾಸ",
    "Save Patient": "ರೋಗಿಯನ್ನು ಉಳಿಸಿ",
    "Patient QR Code": "ರೋಗಿಯ ಕ್ಯೂಆರ್ ಕೋಡ್",
    "Save QR": "ಕ್ಯೂಆರ್ ಉಳಿಸಿ",
    "Done": "ಮುಗಿದಿದೆ",
    "AI Alerts": "AI ಎಚ್ಚರಿಕೆಗಳು",
    "AI Priority Alerts": "AI ಪ್ರಾಥಮಿಕ ಎಚ್ಚರಿಕೆಗಳು",
    "Risk Level": "ಅಪಾಯ ಮಟ್ಟ",
    "Diagnostic Flags": "ರೋಗನಿರ್ಣಯ ಸೂಚನೆಗಳು",
    "Time logged": "ದಾಖಲಿಸಿದ ಸಮಯ",
    "Referrals Directory": "ರೆಫರಲ್ ಪಟ್ಟಿ",
    "Specialist": "ತಜ್ಞರು",
    "Target Hospital": "ಗುರಿ ಆಸ್ಪತ್ರೆ",
    "Status": "ಸ್ಥಿತಿ",
    "Last Updated": "ಕೊನೆಯ ನವೀಕರಣ",
    "Nearby Hospitals": "ಸಮೀಪದ ಆಸ್ಪತ್ರೆಗಳು",
    "Hospital Network": "ಆಸ್ಪತ್ರೆ ಜಾಲ",
    "Get Nearby": "ಸಮೀಪದಲ್ಲಿರುವವುಗಳನ್ನು ನೋಡಿ",
    "Hospital Name": "ಆಸ್ಪತ್ರೆಯ ಹೆಸರು",
    "Distance (km)": "ದೂರ (ಕಿಮೀ)",
    "Specialties": "ತಜ್ಞ ವಿಭಾಗಗಳು",
    "Contact": "ಸಂಪರ್ಕ",
    "My Dashboard": "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "Medical Records": "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    "Find Hospitals": "ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ",
    "Locate Network Hospitals": "ಜಾಲ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ",
    "Re-center Location": "ಸ್ಥಳವನ್ನು ಮರುಕೇಂದ್ರಗೊಳಿಸಿ",
    "Nearest Centers": "ಸಮೀಪದ ಕೇಂದ್ರಗಳು",
    "Patient Detail": "ರೋಗಿಯ ವಿವರ",
    "Back to Directory": "ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ",
    "Run AI Analysis": "AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ",
    "Symptoms Record": "ಲಕ್ಷಣಗಳ ದಾಖಲೆ",
    "Add": "ಸೇರಿಸಿ",
    "Medical Reports": "ವೈದ್ಯಕೀಯ ವರದಿಗಳು",
    "Upload": "ಅಪ್‌ಲೋಡ್",
    "AI Diagnostic Output": "AI ರೋಗನಿರ್ಣಯ ಔಟ್‌ಪುಟ್",
    "Referrals & Alerts": "ರೆಫರಲ್‌ಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    "Refer": "ರೆಫರ್ ಮಾಡಿ",
    "Log Symptoms": "ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿ",
    "Symptoms (Comma separated)": "ಲಕ್ಷಣಗಳು (ಕಾಮಾ ಬಳಸಿ)",
    "Temperature (°F)": "ತಾಪಮಾನ (°F)",
    "Blood Pressure": "ರಕ್ತದೊತ್ತಡ",
    "Doctor Notes": "ವೈದ್ಯರ ಟಿಪ್ಪಣಿಗಳು",
    "Save Record": "ದಾಖಲೆಯನ್ನು ಉಳಿಸಿ",
    "Upload Medical Document": "ವೈದ್ಯಕೀಯ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    "Report Type": "ವರದಿ ಪ್ರಕಾರ",
    "Document/File": "ದಾಖಲೆ/ಕಡತ",
    "Notes": "ಟಿಪ್ಪಣಿಗಳು",
    "Upload Document": "ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    "Create Referral": "ರೆಫರಲ್ ರಚಿಸಿ",
    "Required Specialist": "ಅಗತ್ಯ ತಜ್ಞರು",
    "Recommended Hospital / Provider": "ಶಿಫಾರಸು ಮಾಡಿದ ಆಸ್ಪತ್ರೆ / ಸೇವಾಪ್ರದಾತ",
    "Summary Notes for Specialist": "ತಜ್ಞರಿಗಾಗಿ ಸಾರಾಂಶ ಟಿಪ್ಪಣಿಗಳು",
    "Fill with AI Summary": "AI ಸಾರಾಂಶ ತುಂಬಿ",
    "Issue Referral": "ರೆಫರಲ್ ನೀಡಿರಿ",
    "My Medical Records": "ನನ್ನ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    "Medical Checkups & Symptoms": "ವೈದ್ಯಕೀಯ ತಪಾಸಣೆಗಳು ಮತ್ತು ಲಕ್ಷಣಗಳು",
    "Uploaded Documents & Test Reports": "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು ಮತ್ತು ಪರೀಕ್ಷಾ ವರದಿಗಳು",
    "Active Referrals": "ಸಕ್ರಿಯ ರೆಫರಲ್‌ಗಳು",
    "English": "English",
    "Kannada": "ಕನ್ನಡ",
    "Language": "ಭಾಷೆ",
    "PENDING": "ಬಾಕಿ",
    "ACCEPTED": "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    "COMPLETED": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "VERIFIED": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "HIGH": "ಹೆಚ್ಚು",
    "MEDIUM": "ಮಧ್ಯಮ",
    "LOW": "ಕಡಿಮೆ"
  }
};

const regexTranslations = {
  kn: [
    [/^ID: (.+)$/u, "ಐಡಿ: $1"],
    [/^Your health, digitized and portable\.$/u, "ನಿಮ್ಮ ಆರೋಗ್ಯ, ಡಿಜಿಟಲ್ ಮತ್ತು ಸಾಗಿಸಬಹುದಾದದು."],
    [/^A secure, token-based ecosystem connecting village clinics to specialist hospitals across India\.$/u, "ಭಾರತದ ಗ್ರಾಮೀಣ ಕ್ಲಿನಿಕ್‌ಗಳನ್ನು ತಜ್ಞ ಆಸ್ಪತ್ರೆಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ಸುರಕ್ಷಿತ ಟೋಕನ್ ಆಧಾರಿತ ವ್ಯವಸ್ಥೆ."],
    [/^Secure login for healthcare professionals and patients\.$/u, "ಆರೋಗ್ಯ ವೃತ್ತಿಪರರು ಮತ್ತು ರೋಗಿಗಳಿಗಾಗಿ ಸುರಕ್ಷಿತ ಲಾಗಿನ್."],
    [/^Register once and carry your health records across the network\.$/u, "ಒಮ್ಮೆ ನೋಂದಣಿ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯ ದಾಖಲೆಗಳನ್ನು ಸಂಪೂರ್ಣ ಜಾಲದಲ್ಲಿ ಸಾಗಿಸಿರಿ."],
    [/^We've sent a 6-digit OTP to your email\.$/u, "ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ 6 ಅಂಕಿಯ OTP ಕಳುಹಿಸಲಾಗಿದೆ."],
    [/^Real-time status of your medical facility$/u, "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಕೇಂದ್ರದ ತಕ್ಷಣದ ಸ್ಥಿತಿ"],
    [/^Total registered patients$/u, "ಒಟ್ಟು ನೋಂದಾಯಿತ ರೋಗಿಗಳು"],
    [/^vs last month$/u, "ಕಳೆದ ತಿಂಗಳೊಂದಿಗೆ ಹೋಲಿಕೆ"],
    [/^(\d+) urgent$/u, "$1 ತುರ್ತು"],
    [/^No urgent cases$/u, "ಯಾವುದೇ ತುರ್ತು ಪ್ರಕರಣಗಳಿಲ್ಲ"],
    [/^Encrypted connection active$/u, "ಎನ್ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಸಂಪರ್ಕ ಸಕ್ರಿಯವಾಗಿದೆ"],
    [/^Preparation required for (\d+) cases$/u, "$1 ಪ್ರಕರಣಗಳಿಗೆ ಪೂರ್ವ ಸಿದ್ಧತೆ ಅಗತ್ಯ"],
    [/^Rating ([\d.]+) · (.+)$/u, "ರೇಟಿಂಗ್ $1 · $2"],
    [/^Health Status: Monitoring$/u, "ಆರೋಗ್ಯ ಸ್ಥಿತಿ: ಮೇಲ್ವಿಚಾರಣೆ"],
    [/^No patients registered yet\.$/u, "ಇನ್ನೂ ಯಾವುದೇ ರೋಗಿಗಳು ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿಲ್ಲ."],
    [/^Emergency Referral$/u, "ತುರ್ತು ರೆಫರಲ್"],
    [/^Clinical Follow-up$/u, "ವೈದ್ಯಕೀಯ ಅನುಸರಣೆ"],
    [/^Referral Accepted$/u, "ರೆಫರಲ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ"],
    [/^Records Synced$/u, "ದಾಖಲೆಗಳು ಸಿಂಕ್ ಆಗಿವೆ"],
    [/^Medical ID pending creation by physical doctor\.$/u, "ವೈದ್ಯರು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಐಡಿಯನ್ನು ಇನ್ನೂ ಸೃಷ್ಟಿಸಿಲ್ಲ."],
    [/^No reports dynamically saved\.$/u, "ಯಾವುದೇ ವರದಿಗಳು ಉಳಿಸಲಾಗಿಲ್ಲ."],
    [/^No history found\.$/u, "ಯಾವುದೇ ಇತಿಹಾಸ ಸಿಗಲಿಲ್ಲ."],
    [/^No checkups currently on record\.$/u, "ಈ ಕ್ಷಣ ಯಾವುದೇ ತಪಾಸಣೆ ದಾಖಲೆಗಳಿಲ್ಲ."],
    [/^No medical documents uploaded\.$/u, "ಯಾವುದೇ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು ಅಪ್‌ಲೋಡ್ ಆಗಿಲ್ಲ."],
    [/^No referrals requested or active\.$/u, "ಯಾವುದೇ ರೆಫರಲ್‌ಗಳು ಸಕ್ರಿಯವಾಗಿಲ್ಲ."],
    [/^Loading patients\.\.\.$/u, "ರೋಗಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Loading alerts\.\.\.$/u, "ಎಚ್ಚರಿಕೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Loading referrals\.\.\.$/u, "ರೆಫರಲ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Loading medical history\.\.\.$/u, "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಲೋಡ್ ಆಗುತ್ತಿದೆ..."],
    [/^Loading hospitals\.\.\.$/u, "ಆಸ್ಪತ್ರೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ..."],
    [/^Loading notifications\.\.\.$/u, "ಸೂಚನೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ..."],
    [/^Loading patients\.\.\.$/u, "ರೋಗಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Loading checkups\.\.\.$/u, "ತಪಾಸಣೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Loading reports\.\.\.$/u, "ವರದಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Loading referrals\.\.\.$/u, "ರೆಫರಲ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."],
    [/^Requesting location\.\.\.$/u, "ಸ್ಥಳವನ್ನು ಕೇಳಲಾಗುತ್ತಿದೆ..."],
    [/^Locating you\.\.\.$/u, "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ..."],
    [/^Location access denied\. Cannot load map markers\.$/u, "ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ನಕ್ಷೆ ಗುರುತುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ."],
    [/^No partnered hospitals found nearby\.$/u, "ಸಮೀಪದಲ್ಲಿ ಭಾಗಿಯಾಗಿರುವ ಆಸ್ಪತ್ರೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ."],
    [/^No hospitals found in network\.$/u, "ಜಾಲದಲ್ಲಿ ಯಾವುದೇ ಆಸ್ಪತ್ರೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ."],
    [/^Click "Get Nearby" to search based on your location\.$/u, "ನಿಮ್ಮ ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಹುಡುಕಲು \"ಸಮೀಪದಲ್ಲಿರುವವುಗಳನ್ನು ನೋಡಿ\" ಒತ್ತಿರಿ."],
    [/^Allow location access to plot hospitals on the map\.$/u, "ನಕ್ಷೆಯಲ್ಲಿ ಆಸ್ಪತ್ರೆಗಳನ್ನು ತೋರಿಸಲು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ."],
    [/^No AI alerts to review\.$/u, "ಪರಿಶೀಲಿಸಲು ಯಾವುದೇ AI ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ."],
    [/^No referrals found\.$/u, "ಯಾವುದೇ ರೆಫರಲ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ."],
    [/^No patients found\.$/u, "ಯಾವುದೇ ರೋಗಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ."],
    [/^No AI alerts generated yet\.$/u, "ಇನ್ನೂ ಯಾವುದೇ AI ಎಚ್ಚರಿಕೆಗಳು ಉಂಟಾಗಿಲ್ಲ."],
    [/^No consultations logged yet\.$/u, "ಇನ್ನೂ ಯಾವುದೇ ಸಲಹೆಗಳು ದಾಖಲಾಗಿಲ್ಲ."],
    [/^You are here$/u, "ನೀವು ಇಲ್ಲಿ ಇದ್ದೀರಿ"],
    [/^([\d.]+) km away$/u, "$1 ಕಿಮೀ ದೂರ"],
    [/^([\d.]+) km$/u, "$1 ಕಿಮೀ"],
    [/^BP: (.+) \| Temp: (.+)$/u, "ಬಿಪಿ: $1 | ತಾಪಮಾನ: $2"],
    [/^Symptoms: (.+)$/u, "ಲಕ್ಷಣಗಳು: $1"],
    [/^Doctor Notes: (.+)$/u, "ವೈದ್ಯರ ಟಿಪ್ಪಣಿ: $1"],
    [/^Logged on: (.+)$/u, "ದಾಖಲಿಸಿದ ದಿನಾಂಕ: $1"],
    [/^Notes: (.+)$/u, "ಟಿಪ್ಪಣಿಗಳು: $1"],
    [/^Facility: (.+)$/u, "ಕೇಂದ್ರ: $1"],
    [/^Referred to: (.+)$/u, "ರೆಫರ್ ಮಾಡಿದ್ದು: $1"],
    [/^View File$/u, "ಕಡತ ನೋಡಿ"],
    [/^View Case$/u, "ಕೇಸ್ ನೋಡಿ"],
    [/^Investigate$/u, "ಪರಿಶೀಲಿಸಿ"],
    [/^Delete$/u, "ಅಳಿಸಿ"],
    [/^Found nearby hospitals successfully\.$/u, "ಸಮೀಪದ ಆಸ್ಪತ್ರೆಗಳು ಕಂಡುಬಂದಿವೆ."],
    [/^Location access denied\. Displaying all hospitals\.$/u, "ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳು ತೋರಿಸಲಾಗುತ್ತಿವೆ."],
    [/^Geolocation is not supported by your browser$/u, "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಭೂಸ್ಥಾನ ಸೇವೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ"],
    [/^Geolocation not supported\.$/u, "ಭೂಸ್ಥಾನ ಸೇವೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ."],
    [/^Map updated with nearby centers$/u, "ಸಮೀಪದ ಕೇಂದ್ರಗಳೊಂದಿಗೆ ನಕ್ಷೆ ನವೀಕರಿಸಲಾಗಿದೆ"],
    [/^Logged in successfully!$/u, "ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದೆ!"],
    [/^Registration successful! Check email for OTP\.$/u, "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! OTPಗಾಗಿ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ."],
    [/^Verification successful! Logging in\.\.\.$/u, "ಪರಿಶೀಲನೆ ಯಶಸ್ವಿಯಾಗಿದೆ! ಲಾಗಿನ್ ಆಗಲಾಗುತ್ತಿದೆ..."],
    [/^Session expired\. Please register again\.$/u, "ಸೆಷನ್ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಮರು ನೋಂದಣಿ ಮಾಡಿ."],
    [/^An error occurred$/u, "ದೋಷ ಸಂಭವಿಸಿದೆ"],
    [/^Patient Registered Successfully$/u, "ರೋಗಿ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ"],
    [/^Patient deleted successfully$/u, "ರೋಗಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ"],
    [/^Referral status updated$/u, "ರೆಫರಲ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ"],
    [/^Symptoms logged successfully$/u, "ಲಕ್ಷಣಗಳು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ"],
    [/^Report uploaded$/u, "ವರದಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ"],
    [/^Referral Issued$/u, "ರೆಫರಲ್ ನೀಡಲಾಗಿದೆ"],
    [/^AI Analysis Complete$/u, "AI ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ"],
    [/^Uploading\.\.\.$/u, "ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ..."],
    [/^No active referrals\.$/u, "ಯಾವುದೇ ಸಕ್ರಿಯ ರೆಫರಲ್‌ಗಳಿಲ್ಲ."],
    [/^Profile Pending\.\.\.$/u, "ಪ್ರೊಫೈಲ್ ಬಾಕಿಯಾಗಿದೆ..."],
    [/^Please ask your doctor to register your medical profile using your Phone Number\.$/u, "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ನಿಮ್ಮ ದೂರವಾಣಿ ಸಂಖ್ಯೆಯಿಂದ ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲ್ ನೋಂದಣಿ ಮಾಡಲು ಕೇಳಿ."],
    [/^No hospitals located nearby\.$/u, "ಸಮೀಪದಲ್ಲಿ ಯಾವುದೇ ಆಸ್ಪತ್ರೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ."],
    [/^Failed to load hospitals\.$/u, "ಆಸ್ಪತ್ರೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ."],
    [/^Location access needed to find hospitals\.$/u, "ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಲು ಸ್ಥಳ ಪ್ರವೇಶ ಅಗತ್ಯವಿದೆ."],
    [/^Low Risk$/iu, "ಕಡಿಮೆ ಅಪಾಯ"],
    [/^Medium Risk$/iu, "ಮಧ್ಯಮ ಅಪಾಯ"],
    [/^High Risk Detected$/iu, "ಹೆಚ್ಚಿನ ಅಪಾಯ ಪತ್ತೆಯಾಗಿದೆ"],
    [/^Referral recommended immediately\.$/u, "ತಕ್ಷಣ ರೆಫರಲ್ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ."],
    [/^No AI analysis has been executed for this patient yet\. Click "Run AI Analysis" to generate insights across all recorded symptoms and reports\.$/u, "ಈ ರೋಗಿಗಾಗಿ ಇನ್ನೂ ಯಾವುದೇ AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲಾಗಿಲ್ಲ. ದಾಖಲಾದ ಎಲ್ಲಾ ಲಕ್ಷಣಗಳು ಮತ್ತು ವರದಿಗಳ ಆಧಾರದ ಮೇಲೆ ವಿಶ್ಲೇಷಣೆಗೆ \"AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ\" ಒತ್ತಿರಿ."],
    [/^Failed to run AI analysis\.(.*)$/u, "AI ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲು ವಿಫಲವಾಗಿದೆ.$1"],
    [/^Have the patient scan this to instantly sync their profile, or print it for their records\. The patient can login with their Email and default password: Password123\.$/u, "ರೋಗಿಯ ಪ್ರೊಫೈಲ್ ತಕ್ಷಣ ಸಿಂಕ್ ಆಗಲು ಇದನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿಸಿ, ಅಥವಾ ಅವರ ದಾಖಲೆಗಾಗಿ ಮುದ್ರಿಸಿ. ರೋಗಿ ತಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಮೂಲ ಗುಪ್ತಪದ Password123 ಬಳಸಿ ಲಾಗಿನ್ ಮಾಡಬಹುದು."],
    [/^Good Morning, (.+)!$/u, "ಶುಭೋದಯ, $1!"],
    [/^Good Afternoon, (.+)!$/u, "ಶುಭ ಮಧ್ಯಾಹ್ನ, $1!"],
    [/^Good Evening, (.+)!$/u, "ಶುಭ ಸಂಜೆ, $1!"],
    [/^Your personal health hub\.$/u, "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ."],
    [/^Manage all registered patients\.$/u, "ನೋಂದಾಯಿತ ಎಲ್ಲಾ ರೋಗಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ."],
    [/^Recent high and medium risk flags generated by AI diagnostic models\.$/u, "AI ರೋಗನಿರ್ಣಯ ಮಾದರಿಗಳು ಸೃಷ್ಟಿಸಿದ ಇತ್ತೀಚಿನ ಹೆಚ್ಚು ಮತ್ತು ಮಧ್ಯಮ ಅಪಾಯ ಎಚ್ಚರಿಕೆಗಳು."],
    [/^Incoming and outgoing patient referrals for specialised care\.$/u, "ವಿಶೇಷ ಚಿಕಿತ್ಸೆಗೆ ಬರುವ ಮತ್ತು ಹೋಗುವ ರೋಗಿ ರೆಫರಲ್‌ಗಳು."],
    [/^Find available hospitals near your location\.$/u, "ನಿಮ್ಮ ಸ್ಥಳದ ಸಮೀಪದಲ್ಲಿರುವ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ."],
    [/^Interactive Map of Arogya-partnered centers near you\.$/u, "ನಿಮ್ಮ ಸಮೀಪದ ಆರೋಗ್ಯ ಭಾಗಿದಾರಿ ಕೇಂದ್ರಗಳ ಸಂವಹನಾತ್ಮಕ ನಕ್ಷೆ."],
    [/^Your complete history securely logged by Arogya network doctors\.$/u, "ಆರೋಗ್ಯ ಜಾಲದ ವೈದ್ಯರು ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಿದ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಇತಿಹಾಸ."],
    [/^Welcome back to your command center\.$/u, "ನಿಮ್ಮ ನಿಯಂತ್ರಣ ಕೇಂದ್ರಕ್ಕೆ ಮತ್ತೆ ಸ್ವಾಗತ."],
    [/^Commonly used medical tools$/u, "ಸಾಮಾನ್ಯವಾಗಿ ಬಳಸುವ ವೈದ್ಯಕೀಯ ಸಾಧನಗಳು"],
    [/^Secure login for healthcare professionals and patients\.$/u, "ಆರೋಗ್ಯ ವೃತ್ತಿಪರರು ಮತ್ತು ರೋಗಿಗಳಿಗಾಗಿ ಸುರಕ್ಷಿತ ಲಾಗಿನ್."],
    [/^doctor@arogya\.com$/u, "doctor@arogya.com"],
    [/^john@hospital\.com$/u, "john@hospital.com"],
    [/^patient@example\.com$/u, "patient@example.com"],
    [/^12-Digit Addhaar$/u, "12 ಅಂಕಿಯ ಆಧಾರ್"],
    [/^12-digit number$/u, "12 ಅಂಕಿಯ ಸಂಖ್ಯೆ"],
    [/^doctor@arogya\.com$/u, "doctor@arogya.com"]
  ]
};

if (document.body) {
  document.body.classList.add("page-shell");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("page-enter-ready");
    });
  });
}

function getCurrentLanguage() {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
}

function localizeText(text, language = getCurrentLanguage()) {
  if (!text || language === "en") {
    return text;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return text;
  }

  const exactMatch = exactTranslations[language] && exactTranslations[language][trimmed];
  if (exactMatch) {
    return text.replace(trimmed, exactMatch);
  }

  let localized = text;
  const rules = regexTranslations[language] || [];
  rules.forEach(([pattern, replacement]) => {
    localized = localized.replace(pattern, replacement);
  });
  return localized;
}

function translateTextNode(node, language) {
  if (!originalTextNodes.has(node)) {
    originalTextNodes.set(node, node.textContent);
  }

  const original = originalTextNodes.get(node);
  node.textContent = language === "en" ? original : localizeText(original, language);
}

function storeOriginalAttribute(element, attribute) {
  if (!originalAttributes.has(element)) {
    originalAttributes.set(element, {});
  }

  const record = originalAttributes.get(element);
  if (!(attribute in record)) {
    record[attribute] = element.getAttribute(attribute);
  }
}

function translateAttributes(root, language) {
  const selectors = ["[placeholder]", "[title]", "[aria-label]"];
  root.querySelectorAll(selectors.join(",")).forEach((element) => {
    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) {
        return;
      }

      storeOriginalAttribute(element, attribute);
      const original = originalAttributes.get(element)[attribute];
      if (original == null) {
        return;
      }

      element.setAttribute(attribute, language === "en" ? original : localizeText(original, language));
    });
  });
}

function translateDocument(root = document.body) {
  if (!root) {
    return;
  }

  const language = getCurrentLanguage();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement) {
        return NodeFilter.FILTER_REJECT;
      }

      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentElement.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }

      if (!node.textContent.trim()) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) {
    translateTextNode(walker.currentNode, language);
  }

  translateAttributes(root, language);

  if (!document.documentElement.dataset.originalTitle) {
    document.documentElement.dataset.originalTitle = document.title;
  }
  const originalTitle = document.documentElement.dataset.originalTitle;
  document.title = language === "en" ? originalTitle : localizeText(originalTitle, language);
  document.documentElement.lang = language === "kn" ? "kn" : "en";
}

function renderLanguageSwitcher() {
  let switcher = document.getElementById("language-switcher");
  if (!switcher) {
    switcher = document.createElement("div");
    switcher.id = "language-switcher";
    switcher.className = "global-language-switcher";
    switcher.innerHTML = `
      <span class="global-language-label">Language</span>
      <button type="button" data-lang="en">EN</button>
      <button type="button" data-lang="kn">ಕನ್ನಡ</button>
    `;
    document.body.appendChild(switcher);
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-lang]");
      if (!button) {
        return;
      }
      setLanguage(button.dataset.lang);
    });
  }

  switcher.querySelectorAll("button[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === getCurrentLanguage());
  });

  const label = switcher.querySelector(".global-language-label");
  if (label) {
    label.textContent = getCurrentLanguage() === "kn" ? "ಭಾಷೆ" : "Language";
  }
}

function setLanguage(language) {
  if (!["en", "kn"].includes(language)) {
    return;
  }

  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  if (document.body) {
    document.body.classList.add("language-fade-active");
  }

  setTimeout(() => {
    translateDocument();
    renderLanguageSwitcher();
    requestAnimationFrame(() => {
      document.body && document.body.classList.remove("language-fade-active");
    });
  }, 160);
}

function setupTranslationObserver() {
  if (!document.body || document.body.dataset.translationObserverAttached === "true") {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    if (getCurrentLanguage() === "en") {
      return;
    }

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
          translateTextNode(node, getCurrentLanguage());
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          translateDocument(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  document.body.dataset.translationObserverAttached = "true";
}

function shouldInterceptLink(anchor) {
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (href.startsWith("#")) {
    return false;
  }

  const url = new URL(anchor.href, window.location.href);
  return url.origin === window.location.origin && url.pathname.endsWith(".html");
}

function setupPageTransitions() {
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!shouldInterceptLink(anchor)) {
      return;
    }

    event.preventDefault();
    const targetUrl = anchor.href;
    document.body && document.body.classList.add("page-exit-active");
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 240);
  });
}

function initializeGlobalExperience() {
  translateDocument();
  renderLanguageSwitcher();
  setupTranslationObserver();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGlobalExperience);
} else {
  initializeGlobalExperience();
}

setupPageTransitions();
window.t = localizeText;
window.setAppLanguage = setLanguage;
window.translatePageContent = translateDocument;

function showToast(message, isError = false) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = localizeText(message);
  toast.className = `toast show ${isError ? "error" : ""}`;
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  isFormData = false,
) {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      const msg = result.message || "An error occurred";
      showToast(msg, true);
      throw new Error(localizeText(msg));
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

function requireAuth() {
  if (!localStorage.getItem("token")) {
    window.location.href = "../login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../login.html";
}
