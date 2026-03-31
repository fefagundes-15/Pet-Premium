// Mobile Menu Handler
class MobileMenuHandler {
  private menuToggle: HTMLInputElement | null;
  private menuLinks: NodeListOf<HTMLAnchorElement>;
  private overlay: HTMLDivElement | null;

  constructor() {
    this.menuToggle = document.getElementById("nav-toggle") as HTMLInputElement;
    this.menuLinks = document.querySelectorAll(".site-nav__link");
    this.overlay = null;

    this.createOverlay();
    this.init();
  }

  private init(): void {
    if (!this.menuToggle) return;

    // Fecha o menu sempre que um link do menu for clicado
    this.menuLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener("click", () => {
        this.closeMenu();
      });
    });

    // Overlay fecha o menu
    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeMenu());
    }

    // ESC fecha o menu
    document.addEventListener("keydown", (e: KeyboardEvent) =>
      this.handleEscapeKey(e),
    );

    // Quando o checkbox muda, atualiza estado visual/scroll
    this.menuToggle.addEventListener("change", () => this.toggleMenuState());
  }

  private createOverlay(): void {
    this.overlay = document.createElement("div");
    this.overlay.className = "menu-overlay";
    document.body.appendChild(this.overlay);
  }

  private closeMenu(): void {
    if (this.menuToggle && this.menuToggle.checked) {
      this.menuToggle.checked = false;
      this.toggleMenuState();
    }
  }

  private toggleMenuState(): void {
    const isMenuOpen: boolean = this.menuToggle?.checked ?? false;

    if (isMenuOpen) {
      document.body.classList.add("menu-open");
      if (this.overlay) {
        this.overlay.classList.add("active");
      }
    } else {
      document.body.classList.remove("menu-open");
      if (this.overlay) {
        this.overlay.classList.remove("active");
      }
    }
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.menuToggle?.checked) {
      this.closeMenu();
    }
  }
}

// Smooth Scroll Handler – genérico para todos os links de âncora
class SmoothScrollHandler {
  constructor() {
    this.init();
  }

  private init(): void {
    const links: NodeListOf<HTMLAnchorElement> =
      document.querySelectorAll('a[href^="#"]');

    links.forEach((anchor: HTMLAnchorElement) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href === "#home") return;

      anchor.addEventListener("click", (e: MouseEvent) =>
        this.handleClick(e, anchor),
      );
    });
  }

  private handleClick(e: MouseEvent, anchor: HTMLAnchorElement): void {
    const targetId: string | null = anchor.getAttribute("href");
    if (!targetId) return;

    const targetElement: Element | null = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    const headerOffset: number = 80;
    const elementPosition: number = targetElement.getBoundingClientRect().top;
    const offsetPosition: number =
      elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

// Newsletter Form Handler
class NewsletterHandler {
  private form: HTMLFormElement | null;

  constructor() {
    this.form = document.getElementById("newsletter-form") as HTMLFormElement;
    if (this.form) {
      this.init();
    }
  }

  private init(): void {
    this.form?.addEventListener("submit", (e: Event) => this.handleSubmit(e));
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const emailInput: HTMLInputElement | null = this.form?.querySelector(
      'input[type="email"]',
    ) as HTMLInputElement;
    const email: string = emailInput?.value || "";

    if (email && this.validateEmail(email)) {
      this.showMessage("Inscrição realizada com sucesso!", "success");
      emailInput.value = "";
    } else {
      this.showMessage("Por favor, insira um e-mail válido.", "error");
    }
  }

  private validateEmail(email: string): boolean {
    const re: RegExp = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
  }

  private showMessage(message: string, type: "success" | "error"): void {
    const existingMessage: Element | null =
      document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement: HTMLDivElement = document.createElement("div");
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
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => this.handleIntersect(entries),
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );
    this.init();
  }

  private init(): void {
    const animatedElements: NodeListOf<Element> = document.querySelectorAll(
      ".product-card, .testimonial-card, .plan-card",
    );
    animatedElements.forEach((el: Element) => {
      el.classList.add("animate-on-scroll");
      this.observer.observe(el);
    });
  }

  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add("animated");
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
    } else {
      this.fallbackLazyLoading();
    }
  }

  private initLazyLoading(): void {
    const images: NodeListOf<HTMLImageElement> = document.querySelectorAll(
      'img[loading="lazy"]',
    );
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            const img: HTMLImageElement = entry.target as HTMLImageElement;
            if ("loading" in img) {
              img.loading = "lazy";
            }
            observer.unobserve(img);
          }
        });
      },
    );

    images.forEach((img: HTMLImageElement) => observer.observe(img));
  }

  private fallbackLazyLoading(): void {
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll("img");
    images.forEach((img: HTMLImageElement) => {
      if ("loading" in img) {
        img.loading = "lazy";
      }
    });
  }
}

// Current Year Handler
class CurrentYearHandler {
  constructor() {
    this.updateYear();
  }

  private updateYear(): void {
    const yearElement: HTMLElement | null =
      document.getElementById("current-year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }
}

// Active Link Handler for Scroll Spy
class ScrollSpyHandler {
  private sections: NodeListOf<HTMLElement>;
  private navLinks: NodeListOf<HTMLAnchorElement>;

  constructor() {
    this.sections = document.querySelectorAll("section[id]");
    this.navLinks = document.querySelectorAll(".site-nav__link");
    this.init();
  }

  private init(): void {
    window.addEventListener("scroll", () => this.updateActiveLink());
    this.updateActiveLink();
  }

  private updateActiveLink(): void {
    let currentSection: string = "";
    const scrollPosition: number = window.scrollY + 100;

    this.sections.forEach((section: HTMLElement) => {
      const sectionTop: number = section.offsetTop;
      const sectionBottom: number = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section.getAttribute("id") || "";
      }
    });

    this.navLinks.forEach((link: HTMLAnchorElement) => {
      link.classList.remove("active");
      const href: string | null = link.getAttribute("href");
      if (href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }
}

// Header Background Handler
class HeaderBackgroundHandler {
  private header: HTMLElement | null;

  constructor() {
    this.header = document.querySelector(".site-header");
    this.init();
  }

  private init(): void {
    if (this.header) {
      window.addEventListener("scroll", () => this.updateHeaderBackground());
      this.updateHeaderBackground();
    }
  }

  private updateHeaderBackground(): void {
    if (window.scrollY > 50) {
      this.header?.classList.add("site-header--scrolled");
    } else {
      this.header?.classList.remove("site-header--scrolled");
    }
  }
}

// Form Input Validation
class FormValidator {
  constructor() {
    this.init();
  }

  private init(): void {
    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      ".footer-section__input",
    );
    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener("blur", (e: FocusEvent) =>
        this.validateInput(e.target as HTMLInputElement),
      );
    });
  }

  private validateInput(input: HTMLInputElement): void {
    if (input.type === "email") {
      const isValid: boolean = this.validateEmail(input.value);
      if (!isValid && input.value !== "") {
        input.style.borderColor = "#dc3545";
        this.showInputError(input, "Digite um e-mail válido");
      } else {
        input.style.borderColor = "";
        this.clearInputError(input);
      }
    }
  }

  private validateEmail(email: string): boolean {
    const re: RegExp = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
  }

  private showInputError(input: HTMLInputElement, message: string): void {
    const existingError: Element | null =
      input.parentElement?.querySelector(".input-error") || null;
    if (existingError) {
      existingError.remove();
    }

    const errorElement: HTMLSpanElement = document.createElement("span");
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

  private clearInputError(input: HTMLInputElement): void {
    const error: Element | null =
      input.parentElement?.querySelector(".input-error") || null;
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

  private deferNonCritical(): void {
    const scripts: NodeListOf<HTMLScriptElement> =
      document.querySelectorAll("script[data-defer]");
    if ("requestIdleCallback" in window) {
      // @ts-ignore
      window.requestIdleCallback(() => {
        scripts.forEach((script: HTMLScriptElement) => {
          const newScript: HTMLScriptElement = document.createElement("script");
          const src: string | null = script.getAttribute("src");
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

  private optimizeImages(): void {
    const images: NodeListOf<HTMLImageElement> =
      document.querySelectorAll("img:not([width])");
    images.forEach((img: HTMLImageElement) => {
      if (img.complete && img.naturalWidth) {
        img.setAttribute("width", img.naturalWidth.toString());
        img.setAttribute("height", img.naturalHeight.toString());
      } else {
        img.addEventListener("load", () => {
          if (img.naturalWidth) {
            img.setAttribute("width", img.naturalWidth.toString());
            img.setAttribute("height", img.naturalHeight.toString());
          }
        });
      }
    });
  }
}

// Back to Top Button Handler
class BackToTopHandler {
  private button: HTMLButtonElement;

  constructor() {
    this.button = this.createButton();
    this.init();
  }

  private createButton(): HTMLButtonElement {
    const btn: HTMLButtonElement = document.createElement("button");
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

  private init(): void {
    window.addEventListener("scroll", () => this.toggleVisibility());
    this.button.addEventListener("click", () => this.scrollToTop());
  }

  private toggleVisibility(): void {
    if (window.scrollY > 300) {
      this.button.style.opacity = "1";
      this.button.style.visibility = "visible";
    } else {
      this.button.style.opacity = "0";
      this.button.style.visibility = "hidden";
    }
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

// Responsive Handler
class ResponsiveHandler {
  constructor() {
    this.init();
  }

  private init(): void {
    window.addEventListener("resize", () => this.handleResize());
  }

  private handleResize(): void {
    const menuToggle: HTMLInputElement | null = document.getElementById(
      "nav-toggle",
    ) as HTMLInputElement;
    const isDesktop: boolean = window.innerWidth > 768;

    if (isDesktop && menuToggle?.checked) {
      menuToggle.checked = false;
      document.body.classList.remove("menu-open");
      const overlay: HTMLElement | null =
        document.querySelector(".menu-overlay");
      if (overlay) {
        overlay.classList.remove("active");
      }
    }
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
  new ResponsiveHandler();
});

// Add CSS for animations and additional styles
const styleElement: HTMLStyleElement = document.createElement("style");
styleElement.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
  }
  
  .back-to-top:hover {
    transform: scale(1.1);
    background: var(--color-gold-dark);
  }
  
  @media (max-width: 768px) {
    .back-to-top {
      bottom: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
    }
  }
`;
document.head.appendChild(styleElement);
