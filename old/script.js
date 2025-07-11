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

// Form submission handling
document.getElementById("feedbackForm").addEventListener("submit", function (e) {
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
    if (!element.value.trim()) {
      element.classList.add("border-red-500");
      isValid = false;
    } else {
      element.classList.remove("border-red-500");
    }
  });

  if (!isValid) {
    alert("Please fill in all required fields.");
    return;
  }

  // Submit form
  const formData = new FormData(this);

  fetch(this.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("feedbackForm").parentElement.style.display = "none";
        document.getElementById("successMessage").classList.remove("hidden");
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .catch((error) => {
      alert("There was an error submitting your feedback. Please try again.");
    });
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
