"use strict";
// main.js - TypeScript-ready JavaScript with proper typing (No Node.js dependencies)
Object.defineProperty(exports, "__esModule", { value: true });
// Mobile Menu Handler
class MobileMenuHandler {
    menuToggle;
    menuLinks;
    constructor() {
        this.menuToggle = document.getElementById("nav-toggle");
        this.menuLinks = document.querySelectorAll(".site-nav__link");
        this.init();
    }
    init() {
        if (this.menuToggle) {
            this.menuLinks.forEach((link) => {
                link.addEventListener("click", () => this.closeMenu());
            });
            // Close menu when clicking outside
            document.addEventListener("click", (e) => this.handleOutsideClick(e));
            // Handle escape key
            document.addEventListener("keydown", (e) => this.handleEscapeKey(e));
        }
    }
    closeMenu() {
        if (this.menuToggle) {
            this.menuToggle.checked = false;
        }
    }
    handleOutsideClick(event) {
        const target = event.target;
        const menu = document.querySelector(".site-nav__menu");
        const icon = document.querySelector(".site-nav__icon");
        if (this.menuToggle?.checked &&
            menu &&
            icon &&
            !menu.contains(target) &&
            !icon.contains(target)) {
            this.closeMenu();
        }
    }
    handleEscapeKey(event) {
        if (event.key === "Escape" && this.menuToggle?.checked) {
            this.closeMenu();
        }
    }
}
// Smooth Scroll Handler
class SmoothScrollHandler {
    constructor() {
        this.init();
    }
    init() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => this.handleClick(e, anchor));
        });
    }
    handleClick(e, anchor) {
        const targetId = anchor.getAttribute("href");
        if (targetId && targetId !== "#") {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        }
    }
}
// Newsletter Form Handler
class NewsletterHandler {
    form;
    constructor() {
        this.form = document.getElementById("newsletter-form");
        if (this.form) {
            this.init();
        }
    }
    init() {
        this.form?.addEventListener("submit", (e) => this.handleSubmit(e));
    }
    handleSubmit(event) {
        event.preventDefault();
        const emailInput = this.form?.querySelector('input[type="email"]');
        const email = emailInput?.value;
        if (email && this.validateEmail(email)) {
            this.showMessage("Inscrição realizada com sucesso!", "success");
            emailInput.value = "";
        }
        else {
            this.showMessage("Por favor, insira um e-mail válido.", "error");
        }
    }
    validateEmail(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    }
    showMessage(message, type) {
        const existingMessage = document.querySelector(".form-message");
        if (existingMessage) {
            existingMessage.remove();
        }
        const messageElement = document.createElement("div");
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            background: ${type === "success" ? "#d4edda" : "#f8d7da"};
            color: ${type === "success" ? "#155724" : "#721c24"};
        `;
        this.form?.appendChild(messageElement);
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}
// Intersection Observer for Animations
class AnimationObserver {
    observer;
    constructor() {
        this.observer = new IntersectionObserver((entries) => this.handleIntersect(entries), {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        });
        this.init();
    }
    init() {
        const animatedElements = document.querySelectorAll(".product-card, .testimonial-card, .plan-card");
        animatedElements.forEach((el) => {
            el.classList.add("animate-on-scroll");
            this.observer.observe(el);
        });
    }
    handleIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
                this.observer.unobserve(entry.target);
            }
        });
    }
}
// Lazy Loading Images Handler
class LazyLoader {
    constructor() {
        if ("IntersectionObserver" in window) {
            this.initLazyLoading();
        }
        else {
            this.fallbackLazyLoading();
        }
    }
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Type-safe way to set loading attribute
                    if ("loading" in img) {
                        img.loading = "lazy";
                    }
                    observer.unobserve(img);
                }
            });
        });
        images.forEach((img) => observer.observe(img));
    }
    fallbackLazyLoading() {
        // Fallback for older browsers
        const images = document.querySelectorAll("img");
        images.forEach((img) => {
            const htmlImg = img;
            if ("loading" in htmlImg) {
                htmlImg.loading = "lazy";
            }
        });
    }
}
// Current Year Handler
class CurrentYearHandler {
    constructor() {
        this.updateYear();
    }
    updateYear() {
        const yearElement = document.getElementById("current-year");
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear().toString();
        }
    }
}
// Active Link Handler for Scroll Spy
class ScrollSpyHandler {
    sections;
    navLinks;
    constructor() {
        this.sections = document.querySelectorAll("section[id]");
        this.navLinks = document.querySelectorAll(".site-nav__link");
        this.init();
    }
    init() {
        window.addEventListener("scroll", () => this.updateActiveLink());
        this.updateActiveLink();
    }
    updateActiveLink() {
        let currentSection = "";
        const scrollPosition = window.scrollY + 100;
        this.sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute("id") || "";
            }
        });
        this.navLinks.forEach((link) => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }
}
// Header Background Handler
class HeaderBackgroundHandler {
    header;
    constructor() {
        this.header = document.querySelector(".site-header");
        this.init();
    }
    init() {
        if (this.header) {
            window.addEventListener("scroll", () => this.updateHeaderBackground());
            this.updateHeaderBackground();
        }
    }
    updateHeaderBackground() {
        if (window.scrollY > 50) {
            this.header?.classList.add("site-header--scrolled");
        }
        else {
            this.header?.classList.remove("site-header--scrolled");
        }
    }
}
// Form Input Validation
class FormValidator {
    constructor() {
        this.init();
    }
    init() {
        const inputs = document.querySelectorAll(".footer-section__input");
        inputs.forEach((input) => {
            input.addEventListener("blur", (e) => this.validateInput(e.target));
        });
    }
    validateInput(input) {
        if (input.type === "email") {
            const isValid = this.validateEmail(input.value);
            if (!isValid && input.value !== "") {
                input.style.borderColor = "#dc3545";
                this.showInputError(input, "Digite um e-mail válido");
            }
            else {
                input.style.borderColor = "";
                this.clearInputError(input);
            }
        }
    }
    validateEmail(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    }
    showInputError(input, message) {
        const existingError = input.parentElement?.querySelector(".input-error");
        if (existingError) {
            existingError.remove();
        }
        const errorElement = document.createElement("span");
        errorElement.className = "input-error";
        errorElement.textContent = message;
        errorElement.style.cssText = `
            font-size: 0.75rem;
            color: #dc3545;
            margin-top: 0.25rem;
            display: block;
        `;
        input.parentElement?.appendChild(errorElement);
    }
    clearInputError(input) {
        const error = input.parentElement?.querySelector(".input-error");
        if (error) {
            error.remove();
        }
    }
}
// Performance Optimization Handler
class PerformanceOptimizer {
    constructor() {
        this.deferNonCritical();
        this.optimizeImages();
    }
    deferNonCritical() {
        // Defer non-critical JavaScript using dynamic import pattern
        const scripts = document.querySelectorAll("script[data-defer]");
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(() => {
                scripts.forEach((script) => {
                    const newScript = document.createElement("script");
                    const src = script.getAttribute("src");
                    if (src) {
                        newScript.src = src;
                    }
                    if (script.innerHTML) {
                        newScript.innerHTML = script.innerHTML;
                    }
                    script.parentNode?.replaceChild(newScript, script);
                });
            });
        }
    }
    optimizeImages() {
        // Add width and height to images to prevent layout shift
        const images = document.querySelectorAll("img:not([width])");
        images.forEach((img) => {
            const htmlImg = img;
            // Check if image is already loaded and has natural dimensions
            if (htmlImg.complete && htmlImg.naturalWidth) {
                const naturalWidth = htmlImg.naturalWidth;
                const naturalHeight = htmlImg.naturalHeight;
                img.setAttribute("width", naturalWidth.toString());
                img.setAttribute("height", naturalHeight.toString());
            }
            else {
                // If image not loaded yet, wait for load event
                htmlImg.addEventListener("load", () => {
                    if (htmlImg.naturalWidth) {
                        img.setAttribute("width", htmlImg.naturalWidth.toString());
                        img.setAttribute("height", htmlImg.naturalHeight.toString());
                    }
                });
            }
        });
    }
}
// Back to Top Button Handler
class BackToTopHandler {
    button;
    constructor() {
        this.button = this.createButton();
        this.init();
    }
    createButton() {
        const btn = document.createElement("button");
        btn.className = "back-to-top";
        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        btn.setAttribute("aria-label", "Voltar ao topo");
        btn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: var(--color-gold);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(btn);
        return btn;
    }
    init() {
        if (this.button) {
            window.addEventListener("scroll", () => this.toggleVisibility());
            this.button.addEventListener("click", () => this.scrollToTop());
        }
    }
    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.style.opacity = "1";
            this.button.style.visibility = "visible";
        }
        else {
            this.button.style.opacity = "0";
            this.button.style.visibility = "hidden";
        }
    }
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
}
// Initialize all handlers when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new MobileMenuHandler();
    new SmoothScrollHandler();
    new NewsletterHandler();
    new AnimationObserver();
    new LazyLoader();
    new CurrentYearHandler();
    new ScrollSpyHandler();
    new HeaderBackgroundHandler();
    new FormValidator();
    new PerformanceOptimizer();
    new BackToTopHandler();
});
// Add CSS for animations and additional styles
const style = document.createElement("style");
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .site-nav__link.active {
        color: var(--color-gold);
    }
    
    .site-nav__link.active::after {
        width: 100%;
    }
    
    .form-message {
        animation: slideIn 0.3s ease;
    }
    
    .site-header {
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .site-header--scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .input-error {
        animation: fadeIn 0.2s ease;
    }
    
    .back-to-top:hover {
        transform: scale(1.1);
        background: var(--color-gold-dark);
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    /* Performance optimizations */
    img {
        content-visibility: auto;
        contain: paint;
    }
    
    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
        
        .back-to-top {
            transition: none !important;
        }
    }
    
    /* Responsive adjustments for back to top button */
    @media (max-width: 768px) {
        .back-to-top {
            bottom: 1rem;
            right: 1rem;
            width: 2.5rem;
            height: 2.5rem;
        }
    }
`;
document.head.appendChild(style);
//# sourceMappingURL=script.js.map