// Show/hide "Other" text input for valuable part question
document.getElementById("valuable").addEventListener("change", function () {
  const otherDiv = document.getElementById("otherValuableDiv");
  if (this.value === "Other") {
    otherDiv.classList.remove("hidden");
    otherDiv.classList.add("success-animation");
  } else {
    otherDiv.classList.add("hidden");
    document.getElementById("otherValuable").value = "";
  }
});

// --- Supabase Setup ---
const SUPABASE_URL = "https://bjggezqfnrqcuasofqve.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZ2dlenFmbnJxY3Vhc29mcXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxODMzOTYsImV4cCI6MjA1Mzc1OTM5Nn0.I9MlNsfr8c4bJxuvD4FH8fwOI7RoAkPYfq7qmtf2CLU";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgreldn";

// Create Supabase client
let supabaseClient;
try {
  const { createClient } = supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
}

// Form submission handling
document
  .getElementById("feedbackForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Simple validation
    const requiredFields = [
      "rating",
      "clarity",
      "relevance",
      "pace",
      "expectations",
    ];
    let isValid = true;

    requiredFields.forEach((field) => {
      const element = document.getElementById(field);
      if (!element || !element.value.trim()) {
        if (element) element.classList.add("border-red-500");
        isValid = false;
      } else {
        element.classList.remove("border-red-500");
      }
    });

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    // Disable button to prevent multiple submissions
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Collect form data once
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    console.log("Form data collected:", formObject);

    let supabaseSuccess = false;
    let formspreeSuccess = false;

    try {
      // --- PRIMARY: Submit to Supabase ---
      if (supabaseClient) {
        try {
          // Transform data for database (convert to snake_case)
          const submission = {
            session_rating: formObject["Session Rating"] || null,
            instructor_clarity: formObject["Instructor Clarity"] || null,
            content_relevance: formObject["Content Relevance"] || null,
            pace: formObject["Pace"] || null,
            expectations: formObject["Expectations"] || null,
            valuable_part: formObject["Valuable Part"] || null,
            other_valuable_part: formObject["Other Valuable Part"] || null,
            interaction: formObject["Interaction"] || null,
            future_interest: formObject["Future Interest"] || null,
            hands_on_engagement: formObject["Hands-on Engagement"] || null,
            learning_environment: formObject["Learning Environment"] || null,
            facilities: formObject["Facilities"] || null,
            punctuality: formObject["Punctuality"] || null,
            registration_process: formObject["Registration Process"] || null,
            staff_professionalism: formObject["Staff Professionalism"] || null,
            equipment_setup: formObject["Equipment Setup"] || null,
            venue_accessibility: formObject["Venue Accessibility"] || null,
            venue_comfort: formObject["Venue Comfort"] || null,
            suggestions: formObject["Suggestions"] || null,
          };

          console.log("Submitting to Supabase:", submission);

          const { data, error } = await supabaseClient
            .from("feedback")
            .insert([submission]);

          if (error) {
            throw error;
          }

          console.log("✅ Supabase submission successful:", data);
          supabaseSuccess = true;
        } catch (supabaseError) {
          console.error("❌ Supabase submission failed:", supabaseError);
        }
      } else {
        console.warn("⚠️ Supabase client not available");
      }

      // --- SECONDARY: Submit to Formspree (fallback) ---
      try {
        console.log("Submitting to Formspree as fallback...");
        
        const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (formspreeResponse.ok) {
          console.log("✅ Formspree submission successful");
          formspreeSuccess = true;
        } else {
          throw new Error(`Formspree responded with status: ${formspreeResponse.status}`);
        }
      } catch (formspreeError) {
        console.error("❌ Formspree submission failed:", formspreeError);
      }

      // --- Handle submission results ---
      if (supabaseSuccess || formspreeSuccess) {
        // Success if at least one submission worked
        const successMessage = supabaseSuccess && formspreeSuccess 
          ? "✅ Feedback submitted successfully to both systems!"
          : supabaseSuccess 
            ? "✅ Feedback submitted to primary database!"
            : "✅ Feedback submitted to backup system!";
        
        console.log(successMessage);
        
        // Show success message
        document.getElementById("feedbackForm").parentElement.style.display = "none";
        document.getElementById("successMessage").classList.remove("hidden");
      } else {
        // Both submissions failed
        throw new Error("Both primary and backup submission systems failed");
      }

    } catch (error) {
      console.error("❌ Complete submission failure:", error);
      
      // More detailed error message
      let errorMessage = "There was an error submitting your feedback. Please try again.";
      if (error.message) {
        errorMessage += "\nError: " + error.message;
      }
      
      alert(errorMessage);
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });

// Add interactive hover effects
document.querySelectorAll("select, textarea, input").forEach((element) => {
  element.addEventListener("focus", function () {
    this.parentElement.classList.add("transform", "scale-[1.02]");
  });

  element.addEventListener("blur", function () {
    this.parentElement.classList.remove("transform", "scale-[1.02]");
  });
});

// Enhanced dropdown interactions
document.querySelectorAll(".modern-select").forEach((select) => {
  select.addEventListener("mouseenter", function () {
    this.style.borderColor = "#3b82f6";
  });

  select.addEventListener("mouseleave", function () {
    if (!this.matches(":focus")) {
      this.style.borderColor = "#d1d5db";
    }
  });
});
