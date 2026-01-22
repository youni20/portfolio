const contactForm = document.getElementById("contactForm");
const contactNotification = document.getElementById("contactNotification");
const contactSubmitButton = contactForm.querySelector("button[type='submit']");

// -----------------------------
// CONFIGURATION
// -----------------------------
const RATE_LIMIT_CONFIG = {
    maxEmails: 3,
    timeWindow: 60 * 60 * 1000, // 1 hour
    cooldownPeriod: 60 * 1000 // 1 minute between submissions
};

// -----------------------------
// Rate Limiting Logic
// -----------------------------
function getContactSubmissionData() {
    const data = localStorage.getItem('formspreeAttempts');
    return data ? JSON.parse(data) : { timestamps: [] };
}

function checkContactRateLimit() {
    const now = Date.now();
    const data = getContactSubmissionData();

    // Filter out timestamps older than the time window
    const recent = data.timestamps.filter(t => now - t < RATE_LIMIT_CONFIG.timeWindow);

    // Check max count
    if (recent.length >= RATE_LIMIT_CONFIG.maxEmails) {
        const oldest = Math.min(...recent);
        const waitTime = Math.ceil((RATE_LIMIT_CONFIG.timeWindow - (now - oldest)) / 60000);
        return {
            allowed: false,
            message: `Limit reached. Please try again in ${waitTime} minutes.`
        };
    }

    // Check cooldown (rapid fire prevention)
    if (recent.length > 0) {
        const last = Math.max(...recent);
        if (now - last < RATE_LIMIT_CONFIG.cooldownPeriod) {
            return {
                allowed: false,
                message: "Please wait a moment before sending another message."
            };
        }
    }

    return { allowed: true };
}

function recordContactSubmission() {
    const now = Date.now();
    const data = getContactSubmissionData();
    // Clean old
    data.timestamps = data.timestamps.filter(t => now - t < RATE_LIMIT_CONFIG.timeWindow);
    // Add new
    data.timestamps.push(now);
    localStorage.setItem('formspreeAttempts', JSON.stringify(data));
}

function showContactNotification(message, type = "success") {
    contactNotification.textContent = message;
    contactNotification.className = `contact-notification ${type}`;
    contactNotification.style.display = "block";
    contactNotification.style.opacity = "1";

    setTimeout(() => {
        contactNotification.style.opacity = "0";
        setTimeout(() => {
            contactNotification.style.display = "none";
        }, 500);
    }, 5000);
}

async function handleContactSubmit(event) {
    event.preventDefault();

    // 1. Check Rate Limit
    const limitCheck = checkContactRateLimit();
    if (!limitCheck.allowed) {
        showContactNotification(limitCheck.message, "error");
        return;
    }

    const data = new FormData(event.target);

    // 2. Client-Side Validation
    const email = data.get('email');
    const subject = data.get('subject');
    const message = data.get('message');

    if (!email || !subject || !message) {
        showContactNotification("Please fill in all fields.", "error");
        return;
    }

    // Disable button
    contactSubmitButton.disabled = true;
    contactSubmitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch(event.target.action, {
            method: contactForm.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // 3. Record Success
            recordContactSubmission();
            showContactNotification("Thanks for your message! I'll be in touch soon.", "success");
            contactForm.reset();
        } else {
            const result = await response.json();
            if (Object.hasOwn(result, 'errors')) {
                const errorMessages = result.errors.map(error => error.message).join(", ");
                showContactNotification(errorMessages, "error");
            } else {
                showContactNotification("Oops! There was a problem submitting your form", "error");
            }
        }
    } catch (error) {
        showContactNotification("Oops! There was a problem submitting your form", "error");
    } finally {
        contactSubmitButton.disabled = false;
        contactSubmitButton.textContent = "Send Message";
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
}
