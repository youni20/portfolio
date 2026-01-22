const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
let scrollPosition = 0;

// Mobile menu scroll prevention
function disableScroll() {
  scrollPosition = window.pageYOffset;
  document.body.classList.add('no-scroll');
  document.body.style.top = `-${scrollPosition}px`;
  document.addEventListener('touchmove', preventTouch, { passive: false });
}

function enableScroll() {
  document.body.classList.remove('no-scroll');
  document.body.style.top = '';
  window.scrollTo(0, scrollPosition);
  document.removeEventListener('touchmove', preventTouch);
}

function preventTouch(e) {
  if (navMenu && navMenu.contains(e.target)) {
    return;
  }
  e.preventDefault();
}

// Hamburger menu functionality
if (hamburger && navMenu) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");

    if (navMenu.classList.contains("active")) {
      disableScroll();
    } else {
      enableScroll();
    }
  });

  // Close menu when clicking on navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      enableScroll();
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 &&
      navMenu.classList.contains("active") &&
      !hamburger.contains(e.target) &&
      !navMenu.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      enableScroll();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      enableScroll();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      enableScroll();
    }
  });

  // Handle orientation change
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      if (navMenu.classList.contains("active")) {
        enableScroll();
        setTimeout(() => {
          disableScroll();
        }, 100);
      }
    }, 100);
  });
}

// Navbar scroll effect
let ticking = false;
function updateNavbar() {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".skill-category, .project-card, .cert-card, .timeline-item");
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
  if (!element) return;

  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize on page load
window.addEventListener("load", () => {
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    typeWriter(heroTitle, originalText, 50);
  }

  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    setTimeout(() => {
      loadingIndicator.classList.add("hidden");
    }, 350);
  }
});

// Active navigation based on scroll
let navTicking = false;
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
  navTicking = false;
}

window.addEventListener("scroll", () => {
  if (!navTicking) {
    requestAnimationFrame(updateActiveNav);
    navTicking = true;
  }
});

// Add loaded class to body
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Skills animation on scroll
const skillsSection = document.getElementById("skills");
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !skillsAnimated) {
      animateSkills();
      skillsAnimated = true;
      skillsObserver.unobserve(entry.target);
    }
  });
});

if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

function animateSkills() {
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag, index) => {
    setTimeout(() => {
      tag.style.opacity = "0";
      tag.style.transform = "scale(0.8)";
      tag.style.transition = "all 0.3s ease";
      setTimeout(() => {
        tag.style.opacity = "1";
        tag.style.transform = "scale(1)";
      }, 50);
    }, index * 100);
  });
}

// Interactive effects
document.addEventListener("DOMContentLoaded", () => {
  // Hover effects for project cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
      card.style.boxShadow = "0 15px 40px rgba(43, 108, 176, 0.2)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.05)";
    });
  });

  // Ripple effect for buttons
  const buttons = document.querySelectorAll(".btn, .social-btn, .project-link");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const existingRipples = this.querySelectorAll(".ripple");
      existingRipples.forEach((ripple) => ripple.remove());

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.6)";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.pointerEvents = "none";

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    });
  });

  // Hover effects for skill tags
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag, index) => {
    tag.addEventListener("mouseenter", () => {
      tag.style.transform = "translateY(-3px) scale(1.05)";
      tag.style.boxShadow = "0 5px 15px rgba(43, 108, 176, 0.3)";
    });
    tag.addEventListener("mouseleave", () => {
      tag.style.transform = "translateY(0) scale(1)";
      tag.style.boxShadow = "none";
    });
  });
});

// Ripple animation styles
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Reveal animations for sections
const revealElements = document.querySelectorAll(".section-header, .about-text, .contact-item");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

revealElements.forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.8s ease, transform 0.8s ease"
  revealObserver.observe(el)
})

// Certification data for modals
const certData = {
  "cs50-ai": {
    title: "CS50's Artificial Intelligence with Python (Professional)",
    description:
      "Harvard University's introduction to the concepts and algorithms at the foundation of modern artificial intelligence. Completed a comprehensive curriculum covering search algorithms, knowledge representation, uncertainty, optimization, learning, neural networks, and language processing.",
    skills:
      "Search Algorithms, Knowledge Representation, Neural Networks, Reinforcement Learning, Natural Language Processing, Python, TensorFlow, Optimization",
    image: "certs/cs50-ai.jpg",
  },
  "aws-ccp": {
    title: "AWS Certified Cloud Practitioner",
    description:
      "Validates foundational understanding of the AWS Cloud, including core services, security, architecture, pricing, and support models. demonstrates an overall understanding of cloud computing concepts.",
    skills:
      "Cloud Concepts, Security & Compliance, Technology, Billing & Pricing, AWS Global Infrastructure, Core Services (EC2, S3, RDS)",
    image: "certs/aws-ccp.jpg",
  },
  "ibm-rag": {
    title: "IBM RAG & Agentic AI (Professional)",
    description:
      "Specialized certification in Retrieval-Augmented Generation (RAG) and Agentic AI. Covers building autonomous AI agents, intelligent information retrieval, and advanced natural language understanding systems.",
    skills:
      "Retrieval-Augmented Generation (RAG), Agentic AI, LLM Orchestration, Vector Databases, Python, AI Agents, Prompt Engineering",
    image: "certs/ibm-rag.jpg",
  },
  "ms-api": {
    title: "API-104: Backend APIs & Microservices",
    description:
      "Validates proficiency in designing, building, and deploying robust backend applications and microservices. Covers RESTful API design, server-side logic, data persistence, and cloud integration.",
    skills:
      "API Development, Microservices, C#, .NET, REST, Swagger/OpenAPI, Backend Architecture, Endpoint Security",
    image: "certs/ms-api.jpg",
  },
  "aws-ai": {
    title: "AWS Certified AI Practitioner",
    description:
      "Validates ability to implement AI/ML solutions on AWS. Covers machine learning terminology, problem-solving strategies, and practical use of AWS AI services like SageMaker, Rekognition, and Lex.",
    skills:
      "AWS AI Services, Machine Learning Pipelines, Model Deployment, Computer Vision, NLP, Generative AI on AWS, Amazon Bedrock",
    image: "certs/aws-ai.jpg",
  },
  "ibm-devops": {
    title: "DevOps & Cloud Fundamentals",
    description:
      "Foundational DevOps certification covering CI/CD pipelines, automation, containerization, and cloud delivery models. Emphasizes efficient software delivery and operational performance.",
    skills:
      "DevOps Principles, CI/CD, Docker, Kubernetes, Automation, Git/GitHub, Cloud Computing, Agile Methodologies",
    image: "certs/ibm-devops.jpg",
  },
  "cu-network": {
    title: "Fundamentals of Network Communication",
    description:
      "University of Colorado certification covering network architectures, protocols (TCP/IP), routing, switching, and network security. essential for diagnosing and designing reliable infrastructure.",
    skills:
      "Network Protocols, TCP/IP, OSI Model, Routing & Switching, Network Security, Troubleshooting, Data Transmission",
    image: "certs/cu-network.jpg",
  },
  "ibm-python": {
    title: "Python for Data Science, AI & Development",
    description:
      "Comprehensive Python certification for data science and AI applications. Covers data analysis with Pandas/NumPy, visualization, and building machine learning models from scratch.",
    skills:
      "Python, Pandas, NumPy, Scikit-learn, Data Analysis, Data Visualization, Machine Learning, Web Scraping",
    image: "certs/ibm-python.jpg",
  },
};

// Project data for modals
const projectData = {
  "ecoscale": {
    title: "EcoScale: Commercial Energy Anomaly Detection",
    description:
      "An end-to-end Machine Learning system serving as a 'Virtual Meter' for 1,600+ commercial buildings. It predicts expected energy usage and flags inefficiencies in real-time, identifying $1.46M in potential waste.",
    tech: ["Python", "LightGBM", "Pandas", "Streamlit", "Plotly", "Parquet", "Scikit-Learn"],
    features: [
      "Architected a scalable ETL pipeline merging 100GB+ of IoT sensor & weather data",
      "Implemented cyclical time encoding and lag features for complex temporal patterns",
      "Trained a gradient boosting model (LightGBM) with MAE of 6.34 kWh",
      "Developed an interactive Streamlit dashboard for visualizing energy profiles and anomalies",
      "Identified $1.46 Million in expansive operational inefficiencies ('phantom loads')",
    ],
    skills:
      "Machine Learning, Data Engineering, Time Series Analysis, Anomaly Detection, Dashboarding",
    github: "https://github.com/youni20/ecoscale",
  },
  "iot-platform": {
    title: "Cloud-Native IoT Telemetry Platform",
    description:
      "A production-ready IoT telemetry platform built as a teaching reference for Cloud Native students. Demonstrates GitOps, Kubernetes orchestration, and real-time data processing.",
    tech: ["Kubernetes (K3s)", "Flux CD", "MQTT (EMQX)", "Telegraf", "InfluxDB", "Grafana", "Prometheus"],
    features: [
      "Established a lightweight K3s cluster with declarative GitOps management via Flux CD",
      "Engineered real-time data flow: IoT -> MQTT -> Telegraf -> InfluxDB",
      "Deployed comprehensive observability stack with Prometheus and Grafana",
      "Implemented security best practices (RBAC, Network Policies)",
      "Developed Python-based load testing tools (Locust) to validate system resilience",
    ],
    skills:
      "Cloud Native Architecture, Kubernetes, GitOps, IoT, Observability, Infrastructure as Code",
    github: "https://github.com/youni20/iot-platform",
  },
  "football-vision": {
    title: "Football Vision AI: Sports Analytics System",
    description:
      "An end-to-end computer vision system that automates match analysis. Detects players/ball, tracks movement, identifies teams, and calculates speed/distance/possession using Deep Learning.",
    tech: ["Python", "YOLOv8", "OpenCV", "ByteTrack", "PyTorch", "Pandas", "Google Colab"],
    features: [
      "Fine-tuned YOLOv8x on 2,000+ frames achieving 92% mAP",
      "Integrated ByteTrack for consistent multi-object tracking through occlusions",
      "Automatic team segmentation using K-means clustering on jersey colors",
      "Camera movement compensation with Lucas-Kanade optical flow for real-world metrics",
      "Perspective transformation to calculate player speed (km/h) and distance covered",
    ],
    skills:
      "Computer Vision, Deep Learning, Object Tracking, Sports Analytics, Unsupervised Learning",
    github: "https://github.com/youni20/football-vision",
  },
  "symphony-marine": {
    title: "Symphony Marine Analytics Platform",
    description:
      "Award-winning (2nd Place) marine spatial analytics platform. Uses ML to analyze interactions between human pressures and marine ecosystems. Built during Mistra C2B2 Hackathon.",
    tech: ["Python", "Flask", "XGBoost", "TensorFlow", "Rasterio", "Plotly", "Geospatial Analysis"],
    features: [
      "Dual-mode analytics: Predictive modeling (Random Forest/XGBoost) & Correlation analysis",
      "Processed GeoTIFF marine data using custom CLI tools",
      "Built interactive web interface for exploring ecosystem impact predictions",
      "Visualized complex relationships using parity plots and correlation heatmaps",
      "Demonstrated end-to-end integration of ML models with a web backend",
    ],
    skills:
      "Geospatial Data Science, Machine Learning, Web Development, Environmental Analytics",
    github: "https://github.com/youni20/symphony-marine",
  },
  "fitnest": {
    title: "FitNest - AI Powered Fitness App",
    description:
      "Full-stack intelligent fitness platform offering AI-driven workout recommendations. Features secure auth, real-time tracking, and personalized guidance.",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "OpenAI API", "JWT"],
    features: [
      "Three-tier architecture with secure JWT authentication",
      "Integrated OpenAI API to generate personalized workout plans via NLP",
      "Real-time progress tracking and data visualization dashboards",
      "Containerized entire stack with Docker for seamless deployment",
      "Responsive UI designed with modern best practices",
    ],
    skills:
      "Full-Stack Development, AI Integration, Database Design, Containerization, API Development",
    github: "https://github.com/youni20/fitnest",
  },
  "deepfake-detection": {
    title: "DeepFake Detection System",
    description:
      "Production-ready deep learning system detecting AI-generated faces with 96.8% accuracy. Addresses security challenges of synthetic media.",
    tech: ["Python", "PyTorch", "ResNet50", "EfficientNet", "FastAPI", "Docker", "MLflow"],
    features: [
      "Leveraged transfer learning with ResNet50 and EfficientNet on 9,600+ images",
      "Engineered advanced data augmentation pipeline for model robustness",
      "Deployed model via Dockerized FastAPI with batch inference capabilities",
      "Integrated MLflow for experiment tracking and version control",
      "achieved 96.8% accuracy in distinguishing real vs synthetic faces",
    ],
    skills:
      "Computer Vision, Deep Learning, MLOps, Model Deployment, API Engineering",
    github: "https://github.com/youni20/deepfake-detection",
  },
  "ibm-capstone": {
    title: "IBM Data Science Capstone",
    description:
      "Comprehensive data science project executing the full pipeline from raw data to predictive modeling and insight generation.",
    tech: ["Python", "Pandas", "Scikit-Learn", "Matplotlib", "Jupyter Notebooks"],
    features: [
      "Performed extensive data cleaning and preprocessing for quality assurance",
      "Conducted exploratory data analysis (EDA) to uncover trends and correlations",
      "Developed and optimized multiple ML models for predictive analytics",
      "Created comprehensive visualizations to communicate actionable insights",
      "Validated models using rigorous performance metrics",
    ],
    skills:
      "Data Science Lifecycle, Statistical Analysis, Predictive Modeling, Data Visualization",
    github: "https://github.com/youni20/ibm-capstone",
  },
  "swedish-climate": {
    title: "Swedish Environmental Analytics Platform",
    description:
      "Full-stack ML platform forecasting environmental patterns across Swedish cities. Transforms raw climate data into interactive insights.",
    tech: ["React", "FastAPI", "Prophet", "LSTM", "Redis", "Docker", "Leaflet"],
    features: [
      "Implemented Prophet, SARIMA, and LSTM models for multi-variate forecasting",
      "Built responsive React frontend with interactive maps and charts",
      "FastAPI backend with Redis caching for sub-200ms response times",
      "Containerized deployment with Docker and CI/CD via GitHub Actions",
      "Forecasts environmental metrics with <10% MAPE",
    ],
    skills:
      "Full-Stack ML, Time Series Forecasting, System Architecture, Frontend Development, CI/CD",
    github: "https://github.com/youni20/swedish-climate",
  },
};

const certCards = document.querySelectorAll(".cert-card")
const certModal = document.getElementById("certModal")

certCards.forEach((card) => {
  card.addEventListener("click", () => {
    const certId = card.getAttribute("data-cert")
    const cert = certData[certId]

    if (cert && certModal) {
      const modalTitle = document.getElementById("certModalTitle")
      const modalDescription = document.getElementById("certModalDescription")
      const modalSkills = document.getElementById("certModalSkills")

      if (modalTitle) modalTitle.textContent = cert.title
      if (modalDescription) modalDescription.textContent = cert.description
      if (modalSkills) {
        modalSkills.innerHTML = `
          <h4>Skills Covered:</h4>
          <p>${cert.skills}</p>
        `
      }

      const certImage = document.getElementById("certImage")
      const certImageContainer = document.getElementById("certImageContainer")

      // Remove any previous extra details
      if (certImageContainer) {
        const extra = certImageContainer.querySelector(".cert-extra-details")
        if (extra) extra.remove()
      }

      if (cert.image && certImage && certImageContainer) {
        certImage.src = cert.image
        certImage.alt = `${cert.title} Certificate`

        // Apply enhanced styling
        certImage.style.maxWidth = "100%"
        certImage.style.height = "auto"
        certImage.style.objectFit = "contain"
        certImage.style.borderRadius = "12px"
        certImage.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)"
        certImage.style.display = "block"
        certImage.style.margin = "20px auto"
        certImage.style.border = "2px solid rgba(43, 108, 176, 0.1)"
        certImage.style.transition = "transform 0.3s ease, box-shadow 0.3s ease"
        certImage.style.cursor = "pointer"

        certImageContainer.style.display = "block"

        // Show extra details for AWS AI Practitioner
        if (certId === "aws-ai-practitioner" && cert.extra) {
          let extraHtml = `<div class='cert-extra-details' style='margin-top:16px;'>`
          extraHtml += `<p><strong>Validation Number:</strong> ${cert.extra.validationNumber}</p>`
          extraHtml += `<p><strong>Validate at:</strong> <a href='${cert.extra.validateUrl}' target='_blank' rel='noopener'>${cert.extra.validateUrl}</a></p>`
          extraHtml += `<p><strong>Issue Date:</strong> ${cert.extra.issueDate}</p>`
          extraHtml += `<p><strong>Expiration Date:</strong> ${cert.extra.expirationDate}</p>`
          extraHtml += `</div>`
          certImageContainer.insertAdjacentHTML("beforeend", extraHtml)
        }

        // Enhanced click to zoom functionality
        certImage.onclick = () => {
          const overlay = document.createElement("div")
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
            backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease;
          `

          const fullImage = document.createElement("img")
          fullImage.src = cert.image
          fullImage.style.cssText = `
            max-width: 95vw;
            max-height: 95vh;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            transform: scale(0.9);
            transition: transform 0.3s ease;
          `

          fullImage.onload = function () {
            this.style.transform = "scale(1)"
          }

          const closeBtn = document.createElement("div")
          closeBtn.innerHTML = "&times;"
          closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
          `

          overlay.appendChild(fullImage)
          overlay.appendChild(closeBtn)
          document.body.appendChild(overlay)

          // Close functionality
          const closeOverlay = () => {
            overlay.style.opacity = "0"
            setTimeout(() => {
              if (document.body.contains(overlay)) {
                document.body.removeChild(overlay)
              }
            }, 300)
          }

          overlay.onclick = closeOverlay
          closeBtn.onclick = closeOverlay

          // Close on escape key
          const escapeHandler = (e) => {
            if (e.key === "Escape") {
              closeOverlay()
              document.removeEventListener("keydown", escapeHandler)
            }
          }
          document.addEventListener("keydown", escapeHandler)
        }
      } else if (certImage && certImageContainer) {
        certImage.style.display = "none"
        certImageContainer.style.display = "none"
      }

      certModal.style.display = "block"
      certModal.setAttribute("aria-hidden", "false")
      // Reset scroll position to top when opening modal
      certModal.scrollTop = 0
      const certModalContent = certModal.querySelector('.modal-content')
      if (certModalContent) certModalContent.scrollTop = 0
      preventBodyScroll()
    }
  })
})

const projectCards = document.querySelectorAll(".project-card")
const projectModal = document.getElementById("projectModal")

projectCards.forEach((card) => {
  card.addEventListener("click", function (e) {
    // Prevent modal from opening if a project-link (GitHub or video) was clicked
    if (
      e.target.closest('.project-link')
    ) {
      // Let the link behave normally
      return
    }
    const projectId = card.getAttribute("data-project")
    const project = projectData[projectId]

    if (project && projectModal) {
      const modalTitle = document.getElementById("modalTitle")
      const modalDescription = document.getElementById("modalDescription")
      const modalTech = document.getElementById("modalTech")
      const modalFeatures = document.getElementById("modalFeatures")
      const modalSkills = document.getElementById("modalSkills")
      const modalLinks = document.getElementById("modalLinks")

      if (modalTitle) modalTitle.textContent = project.title
      if (modalDescription) modalDescription.textContent = project.description

      // Populate tech tags
      if (modalTech) {
        modalTech.innerHTML = project.tech.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")
      }

      // Populate features
      if (modalFeatures) {
        modalFeatures.innerHTML = `
          <h4>Key Features & Achievements:</h4>
          <ul>${project.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        `
      }

      // Populate skills
      if (modalSkills) {
        modalSkills.innerHTML = `
          <h4>Skills Demonstrated:</h4>
          <p>${project.skills}</p>
        `
      }

      // Populate links
      if (modalLinks) {
        const githubUrl = project.github || "#";
        modalLinks.innerHTML = `
          <a href="${githubUrl}" class="project-link github-link" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github"></i>
            <span>View on GitHub</span>
          </a>
          <a href="#" class="project-link video-link" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-play"></i>
            <span>Watch Demo</span>
          </a>
        `
      }

      projectModal.style.display = "block"
      projectModal.setAttribute("aria-hidden", "false")
      // Reset scroll position to top when opening modal
      projectModal.scrollTop = 0
      const projectModalContent = projectModal.querySelector('.modal-content')
      if (projectModalContent) projectModalContent.scrollTop = 0
      preventBodyScroll()
    }
  })
})

document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    if (projectModal) {
      projectModal.style.display = "none"
      projectModal.setAttribute("aria-hidden", "true")
      allowBodyScroll()
    }
    if (certModal) {
      certModal.style.display = "none"
      certModal.setAttribute("aria-hidden", "true")
      allowBodyScroll()
    }
  })
})

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === projectModal && projectModal) {
    projectModal.style.display = "none"
    projectModal.setAttribute("aria-hidden", "true")
    allowBodyScroll()
  }
  if (event.target === certModal && certModal) {
    certModal.style.display = "none"
    certModal.setAttribute("aria-hidden", "true")
    allowBodyScroll()
  }
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (projectModal && projectModal.style.display === "block") {
      projectModal.style.display = "none"
      projectModal.setAttribute("aria-hidden", "true")
      allowBodyScroll()
    }
    if (certModal && certModal.style.display === "block") {
      certModal.style.display = "none"
      certModal.setAttribute("aria-hidden", "true")
      allowBodyScroll()
    }
  }
})

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  const lazyImages = document.querySelectorAll("img[data-src]");
  lazyImages.forEach((img) => imageObserver.observe(img));
}

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

function updateToggleIcon() {
  if (darkModeToggle) {
    const icon = darkModeToggle.querySelector("i");
    if (icon) {
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        icon.className = "fas fa-sun";
      } else {
        icon.className = "fas fa-moon";
      }
    }
  }
}

updateToggleIcon();

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateToggleIcon();
  });
}