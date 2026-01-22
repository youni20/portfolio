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

/*
// Certification data for modals
const certData = {
  "aws-saa": {
    title: "AWS Certified Solutions Architect Associate",
    description:
      "Validates expertise in designing distributed systems and applications on the AWS platform. This certification demonstrates comprehensive knowledge of AWS services, architecture best practices, and cost optimization strategies.",
    skills:
      "AWS Core Services (EC2, S3, RDS, VPC), Cloud Architecture Design, Security and Compliance, Cost Optimization, High Availability and Disaster Recovery, Serverless Computing, Container Services, Monitoring and Logging",
    image: "certs/aws-saa.jpg",
  },
  "aws-dev": {
    title: "AWS Certified Developer Associate",
    description:
      "Demonstrates proficiency in developing, deploying, and debugging cloud-based applications using AWS. This certification validates hands-on experience with AWS developer tools and services.",
    skills:
      "AWS SDK and CLI, Lambda Functions, API Gateway, DynamoDB, CloudFormation, CodeCommit/CodeBuild/CodeDeploy, Application Security, Monitoring and Troubleshooting, Serverless Application Development",
    image: "certs/aws-dev.jpg",
  },
  "github-actions-devops": {
    title: "GitHub Actions for DevOps CI/CD",
    description:
      "Certification for mastering GitHub Actions in DevOps CI/CD workflows. Demonstrates proficiency in automating build, test, and deployment pipelines using GitHub Actions, YAML workflows, and best practices for modern DevOps.",
    skills:
      "CI/CD Automation, GitHub Actions, Workflow YAML, DevOps Best Practices, Continuous Integration, Continuous Deployment, Automation Scripting, Pipeline Security, Packt Training",
    image: "certs/GitHubActions.jpg",
  },
  "aws-ai-practitioner": {
    title: "AWS Certified AI Practitioner",
    description:
      "Validates foundational knowledge of AI and machine learning concepts, AWS AI services, and practical skills in deploying AI solutions on AWS. Demonstrates ability to design, implement, and validate AI-driven applications using AWS tools.",
    skills:
      "AI Fundamentals, Machine Learning Concepts, AWS AI Services (SageMaker, Rekognition, Lex, Polly), Model Deployment, Validation, Security, Cost Optimization, Responsible AI Practices",
  image: "certs/AWS Certified AI Practitioner certificate.jpg",
  },
  "ms-api": {
    title: "API-104: Backend APIs & Microservices",
    description:
      "Comprehensive certification covering modern API development and microservices architecture. Focuses on building scalable, maintainable backend systems using industry best practices.",
    skills:
      "RESTful API Design, Microservices Architecture, API Security and Authentication, Database Integration, Service Communication, API Documentation, Testing Strategies, Performance Optimization",
    image: "certs/Microsoft API-104 Certificate _ edX.jpg",
  },
  "python-ibm": {
    title: "Python for Data Scientist, AI & Development",
    description:
      "Comprehensive Python certification covering data science, artificial intelligence, and software development applications. Demonstrates proficiency in Python programming for various technical domains.",
    skills:
      "Python Programming Fundamentals, Data Analysis with Pandas/NumPy, Machine Learning with Scikit-learn, Data Visualization, Web Development with Flask/Django, API Development, Database Connectivity",
    image: "certs/PythonForDataScience.jpg",
  },
  "network-fundamentals": {
    title: "Fundamentals of Network Communication",
    description:
      "Foundational certification in network communication principles and protocols. Covers essential networking concepts crucial for cloud and infrastructure engineering.",
    skills:
      "TCP/IP Protocol Suite, Network Topologies, Routing and Switching, Network Security, OSI Model, DNS and DHCP, Network Troubleshooting, Wireless Networking",
    image: "certs/ComputerNetworking.jpg",
  },
  "docker-basics": {
    title: "Docker Basics for DevOps",
    description:
      "Practical certification in Docker containerization technology. Covers container fundamentals, image management, and Docker in DevOps workflows.",
    skills:
      "Container Fundamentals, Docker Image Creation, Docker Compose, Container Orchestration, Registry Management, Security Best Practices, DevOps Integration, Troubleshooting",
    image: "certs/DockerForDevOps.jpg",
  },
  "linux-cloud": {
    title: "Linux for Cloud and DevOps Engineers",
    description:
      "Specialized Linux certification focused on cloud and DevOps applications. Covers advanced Linux administration skills essential for modern infrastructure management.",
    skills:
      "Linux System Administration, Shell Scripting, Process Management, Network Configuration, Security Hardening, Package Management, System Monitoring, Cloud Integration",
    image: "certs/LinuxCloud&DevOps.jpg",
  },
  "linux-scripting": {
    title: "Linux Shell Scripting - Advanced",
    description:
      "Advanced certification in Linux shell scripting and automation. Demonstrates expertise in creating complex automation scripts for system administration and DevOps tasks.",
    skills:
      "Advanced Bash Scripting, Automation Frameworks, System Integration, Error Handling, Performance Optimization, Security Scripting, DevOps Automation, Monitoring Scripts",
    image: "certs/AdvancedShellScripting.jpg",
  },
  "ibm-devops": {
    title: "IBM Introduction to DevOps",
    description:
      "Certification for completing IBM's Introduction to DevOps course via Coursera. Covers foundational DevOps concepts, practices, and tools for modern software delivery.",
    skills:
      "DevOps Fundamentals, CI/CD, Automation, Collaboration, Cloud Concepts, Agile Practices, Monitoring, IBM DevOps Tools",
    image: "certs/IntroToDevOps.jpg",
  },
}*/

/* 
// Project data for modals
const projectData = {
  "cloud-monitoring": {
    title: "Cloud Monitoring App on Amazon EKS",
    description:
      "A comprehensive real-time system resource monitoring application built with Flask and deployed on Amazon EKS. This project demonstrates advanced cloud-native architecture, containerization, and Kubernetes orchestration skills.",
    tech: ["AWS EKS", "Docker", "Kubernetes", "Python", "Flask", "Amazon ECR", "AWS CLI"],
    features: [
      "Developed a Flask-based REST API and dashboard to monitor CPU, memory, and disk usage in real-time",
      "Containerized the application with Docker and pushed images to Amazon ECR using secure IAM roles",
      "Provisioned and configured an Amazon EKS cluster with managed node groups for orchestration",
      "Managed Kubernetes Deployments and Services using declarative YAML manifests",
      "Exposed internal services using port-forwarding; explored LoadBalancer configuration for public access",
      "Controlled infrastructure from a local Ubuntu environment via AWS CLI and kubectl",
      "Implemented monitoring dashboards with real-time data visualization",
      "Applied security best practices with IAM roles and policies",
    ],
    skills:
      "Cloud Architecture, Container Orchestration, Infrastructure as Code, System Monitoring, DevOps Practices, AWS Services, Kubernetes Management",
  },
}
*/

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
        modalLinks.innerHTML = `
          <a href="#" class="project-link github-link" target="_blank" rel="noopener noreferrer">
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