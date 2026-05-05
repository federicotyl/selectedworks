const canvas = document.getElementById("canvas");
const exitLayer = document.getElementById("exit-layer");

const lineYear = document.getElementById("line-year");
const lineTitle = document.getElementById("line-title");
const lineType = document.getElementById("line-type");
const lineDescription = document.getElementById("line-description");

const lineYearGhost = document.getElementById("line-year-ghost");
const lineTitleGhost = document.getElementById("line-title-ghost");
const lineTypeGhost = document.getElementById("line-type-ghost");
const lineDescriptionGhost = document.getElementById("line-description-ghost");

const mainFields = [lineYear, lineTitle, lineType, lineDescription];
const ghostFields = [lineYearGhost, lineTitleGhost, lineTypeGhost, lineDescriptionGhost];

const projects = [
  {
    cover: "images/prada_manuals/cover.png",
    coverType: "image",
    gallery: [
      "images/prada_manuals/gallery_1.png",
      "images/prada_manuals/gallery_2.png",
      "images/prada_manuals/gallery_3.png",
      "images/prada_manuals/gallery_4.png"
    ],
    year: "2022",
    title: "PRADA",
    type: "poster / graphic design",
    description: "short project note"
  }
];

let lastTime = 0;
let imagesOnScreen = [];
let detailImages = [];
const MAX_IMAGES = 20;
let focusedImage = null;
let isProjectOpen = false;

function createMediaElement(src, type, className) {
  const el = type === "video" ? document.createElement("video") : document.createElement("img");
  el.src = src;
  if (className) el.classList.add(className);

  if (type === "video") {
    el.autoplay = true;
    el.muted = true;
    el.loop = true;
    el.playsInline = true;
  }

  return el;
}

function showProjectLine(project) {
  const nextValues = [project.year, project.title, project.type, project.description];

  mainFields.forEach((field, index) => {
    const currentText = field.textContent;
    ghostFields[index].textContent = currentText;
    ghostFields[index].classList.remove("linger");
    void ghostFields[index].offsetWidth;

    if (currentText) ghostFields[index].classList.add("linger");

    field.classList.remove("visible");
  });

  setTimeout(() => {
    lineYear.textContent = nextValues[0];
    lineTitle.textContent = nextValues[1];
    lineType.textContent = nextValues[2];
    lineDescription.textContent = nextValues[3];

    [
      { field: lineYear, baseDelay: 30 },
      { field: lineTitle, baseDelay: 120 },
      { field: lineType, baseDelay: 70 },
      { field: lineDescription, baseDelay: 190 }
    ].forEach((item) => {
      const randomOffset = Math.floor(Math.random() * 70) - 20;
      setTimeout(() => item.field.classList.add("visible"), item.baseDelay + randomOffset);
    });
  }, 120);

  setTimeout(() => {
    ghostFields.forEach((ghost) => ghost.classList.remove("linger"));
  }, 520);
}

function hideProjectLine() {
  mainFields.forEach((field, index) => {
    const currentText = field.textContent;
    ghostFields[index].textContent = currentText;
    ghostFields[index].classList.remove("linger");
    void ghostFields[index].offsetWidth;

    if (currentText) ghostFields[index].classList.add("linger");

    field.classList.remove("visible");
    field.textContent = "";
  });

  setTimeout(() => {
    ghostFields.forEach((ghost) => {
      ghost.classList.remove("linger");
      ghost.textContent = "";
    });
  }, 500);
}

function removeDetailImages() {
  detailImages.forEach((item) => {
    item.classList.remove("visible");
    setTimeout(() => item.remove(), 200);
  });
  detailImages = [];
}

function createDetailImage(src, startX, startY, endX, endY, delay) {
  const frame = document.createElement("div");
  frame.classList.add("detail-frame");
  frame.style.left = `${endX}px`;
  frame.style.top = `${endY}px`;

  const img = createMediaElement(src, "image");
  frame.appendChild(img);

  canvas.appendChild(frame);
  detailImages.push(frame);

  const dx = startX - endX;
  const dy = startY - endY;

  frame.style.opacity = "0";
  frame.style.transform = `translate(${dx}px, ${dy}px) scale(0.96)`;

  setTimeout(() => {
    frame.classList.add("visible");

    frame.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.96)`, opacity: 0 },
        { transform: `translate(${dx * 0.18}px, ${dy * 0.18}px) scale(1.02)`, opacity: 1, offset: 0.78 },
        { transform: "translate(0px, 0px) scale(1)", opacity: 1 }
      ],
      {
        duration: 240,
        easing: "cubic-bezier(0.22, 0.9, 0.24, 1)",
        fill: "forwards"
      }
    );
  }, delay);
}

function showProjectGallery(project, anchorImg) {
  removeDetailImages();

  const startX = 80 + 520;
  const startY = window.innerHeight / 2 - 340;

  const frameW = 220;
  const frameH = 300;
  const gap = 24;

  const galleryStartX = 660;
  const galleryY = window.innerHeight / 2 - frameH / 2;

  project.gallery.forEach((src, i) => {
    createDetailImage(
      src,
      startX,
      startY,
      galleryStartX + i * (frameW + gap),
      galleryY,
      40 + i * 60
    );
  });
}

  targets = targets.map((item) => ({
    ...item,
    x: Math.max(24, Math.min(item.x, screenW - size - 24)),
    y: Math.max(24, Math.min(item.y, screenH - frameHeight - 24))
  }));

  const startX = rect.left + rect.width * 0.12;
  const startY = rect.top + rect.height * 0.08;

  targets.forEach((item, i) => {
    createDetailImage(item.src, startX + i * 6, startY + i * 4, item.x, item.y, 20 + i * 55);
  });
}

function setImagesClickable(state) {
  imagesOnScreen.forEach((img) => {
    img.style.pointerEvents = state ? "auto" : "none";
  });

  if (focusedImage) focusedImage.style.pointerEvents = "auto";
}

function clearFocus() {
  isProjectOpen = false;
  focusedImage = null;

  imagesOnScreen.forEach((img) => {
    img.classList.remove("dimmed");
    img.classList.remove("active-project");
    img.style.pointerEvents = "auto";
  });

  removeDetailImages();
  hideProjectLine();
  exitLayer.classList.remove("active");
}

function openProject(project, img) {
  isProjectOpen = true;
  focusedImage = img;

  imagesOnScreen.forEach((i) => {
    i.classList.remove("active-project");

    if (i !== img) {
      i.classList.add("dimmed");
    } else {
      i.classList.remove("dimmed");
      i.classList.add("active-project");
    }
  });

  setImagesClickable(false);
  showProjectLine(project);
  showProjectGallery(project, img);
  exitLayer.classList.add("active");
}

function createImage(x, y) {
  const project = projects[Math.floor(Math.random() * projects.length)];
  const img = createMediaElement(project.cover, project.coverType, "floating-image");

  img.style.left = `${x - 210}px`;
  img.style.top = `${y - 210}px`;

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isProjectOpen) return;
    openProject(project, img);
  });

  canvas.appendChild(img);
  imagesOnScreen.push(img);

  if (imagesOnScreen.length > MAX_IMAGES) {
    const old = imagesOnScreen.shift();
    if (old === focusedImage) clearFocus();
    old.remove();
  }

  requestAnimationFrame(() => img.classList.add("visible"));
}

document.addEventListener("mousemove", (e) => {
  const now = Date.now();

  if (now - lastTime > 120 && !isProjectOpen) {
    createImage(e.clientX, e.clientY);
    lastTime = now;
  }
});

if (exitLayer) {
  exitLayer.addEventListener("click", clearFocus);
}

/* MOBILE */
const mobileProjects = document.querySelectorAll(".mobile-project");

mobileProjects.forEach((project) => {
  const cover = project.querySelector(".mobile-cover");
  if (!cover) return;

  cover.addEventListener("click", () => {
    project.classList.toggle("active");
  });
});

const mobileItems = document.querySelectorAll(".mobile-item");

mobileItems.forEach((item) => {
  item.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    mobileItems.forEach((i) => i.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});