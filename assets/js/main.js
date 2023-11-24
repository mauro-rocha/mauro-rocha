(function () {
  "use strict";

  try {
    const currentYear = new Date().getFullYear();
    const currentYearComp = document.getElementById("current-year");
    currentYearComp.innerText = currentYear;
  } catch (error) {
    // ignore
  }

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 16;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Intro type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      startDelay: 512,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1000,
      cursorChar: "_",
      autoInsertCss: true,
      smartBackspace: true,
    });
  }

  const CANVAS = document.getElementsByTagName("canvas")[0],
    CTX = CANVAS.getContext("2d"),
    W = window.innerWidth,
    H = window.innerHeight,
    XO = W / 2,
    YO = H / 2,
    NUM_PARTICLES = 400,
    MAX_Z = 2,
    MAX_R = 1,
    Z_SPD = 1,
    PARTICLES = [];

  class Particle {
    constructor(x, y, z) {
      this.pos = new Vector(x, y, z);
      const X_VEL = 0,
        Y_VEL = 0,
        Z_VEL = -Z_SPD;
      this.vel = new Vector(X_VEL, Y_VEL, Z_VEL);
      this.vel.scale(0.005);
      this.fill = "rgba(255,255,255,0.3)";
      this.stroke = this.fill;
    }

    update() {
      this.pos.add(this.vel);
    }

    render() {
      const PIXEL = to2d(this.pos),
        X = PIXEL[0],
        Y = PIXEL[1],
        R = ((MAX_Z - this.pos.z) / MAX_Z) * MAX_R;

      if (X < 0 || X > W || Y < 0 || Y > H) this.pos.z = MAX_Z;

      this.update();
      CTX.beginPath();
      CTX.fillStyle = this.fill;
      CTX.strokeStyle = this.stroke;
      CTX.arc(X, PIXEL[1], R, 0, Math.PI * 2);
      CTX.fill();
      CTX.stroke();
      CTX.closePath();
    }
  }

  class Vector {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    }

    scale(n) {
      this.x *= n;
      this.y *= n;
      this.z *= n;
    }
  }

  function to2d(v) {
    const X_COORD = v.x - XO,
      Y_COORD = v.y - YO,
      PX = X_COORD / v.z,
      PY = Y_COORD / v.z;
    return [PX + XO, PY + YO];
  }

  function render() {
    for (let i = 0; i < PARTICLES.length; i++) {
      PARTICLES[i].render();
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    CTX.fillStyle = "rgba(0,0,0,0.15)";
    CTX.fillRect(0, 0, W, H);
    render();
  }

  function createParticles() {
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const X = Math.random() * W,
        Y = Math.random() * H,
        Z = Math.random() * MAX_Z;
      PARTICLES.push(new Particle(X, Y, Z));
    }
  }

  function init() {
    CANVAS.width = W;
    CANVAS.height = H;
    createParticles();
    loop();
  }
  init();
})();
