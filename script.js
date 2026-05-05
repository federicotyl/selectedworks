const canvas = document.getElementById("canvas");

const projects = [
  {
    cover: "images/prada_manuals/cover.png",
    gallery: [
      "images/prada_manuals/gallery_1.png",
      "images/prada_manuals/gallery_2.png",
      "images/prada_manuals/gallery_3.png",
      "images/prada_manuals/gallery_4.png",
      "images/prada_manuals/gallery_5.png"
    ],
    year: "2022",
    title: "PRADA",
    type: "poster / graphic design",
    description: "short project note"
  }
];

let lastTime = 0;
let imagesOnScreen = [];
const MAX_IMAGES = 16;
let isProjectOpen = false;

function createImage(x, y) {
  if (!canvas || isProjectOpen) return;

  const project = projects[Math.floor(Math.random() * projects.length)];
  const img = document.createElement("img");

  img.src = project.cover;
  img.className = "floating-image";

  img.style.left = `${x - 210}px`;
  img.style.top = `${y - 280}px`;

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    openProject(project);
  });

  canvas.appendChild(img);
  imagesOnScreen.push(img);

  if (imagesOnScreen.length > MAX_IMAGES) {
    const old = imagesOnScreen.shift();
    old.remove();
  }

  requestAnimationFrame(() => {
    img.classList.add("visible");
  });
}

function openProject(project) {
  isProjectOpen = true;

  imagesOnScreen.forEach((img) => {
    img.classList.add("dimmed");
  });

  let overlay = document.getElementById("project-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "project-overlay";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <button class="project-close">close</button>

    <div class="project-inner">
      <img class="project-cover" src="${project.cover}" alt="${project.title}">

      <div class="project-right">
        <div class="project-info">
          <div>${project.year}</div>
          <div class="project-title">${project.title}</div>
          <div>${project.type}</div>
          <div>${project.description}</div>
        </div>

        <div class="project-gallery">
          ${project.gallery.map(src => `<img src="${src}" alt="${project.title}">`).join("")}
        </div>
      </div>
    </div>
  `;

  overlay.classList.add("active");

  overlay.querySelector(".project-close").addEventListener("click", closeProject);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProject();
  });
}

function closeProject() {
  isProjectOpen = false;

  imagesOnScreen.forEach((img) => {
    img.classList.remove("dimmed");
  });

  const overlay = document.getElementById("project-overlay");
  if (overlay) overlay.classList.remove("active");
}

document.addEventListener("mousemove", (e) => {
  const now = Date.now();

  if (now - lastTime > 130 && !isProjectOpen) {
    createImage(e.clientX, e.clientY);
    lastTime = now;
  }
});

document.addEventListener("touchstart", (e) => {
  if (isProjectOpen) return;

  const touch = e.touches[0];
  createImage(touch.clientX, touch.clientY);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProject();
});