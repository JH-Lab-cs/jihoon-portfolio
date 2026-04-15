const projects = [
  {
    title: "추후 추가될 예정입니다.",
    summary:
      "현재 포트폴리오에 들어갈 프로젝트를 정리 중이며, 검토가 끝나는 대로 실제 작업물을 추가할 예정입니다.",
    tags: ["준비 중"],
    label: "준비 중",
  },
];

const projectGrid = document.querySelector("#project-grid");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const currentYear = document.querySelector("#current-year");

function createTag(tag) {
  const item = document.createElement("li");
  item.textContent = tag;
  return item;
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card is-placeholder";

  const preview = document.createElement("div");
  preview.className = "project-preview";

  const previewLabel = document.createElement("span");
  previewLabel.className = "project-index";
  previewLabel.textContent = project.label || `PROJECT ${String(index + 1).padStart(2, "0")}`;
  preview.appendChild(previewLabel);

  const body = document.createElement("div");
  body.className = "project-body";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const summary = document.createElement("p");
  summary.textContent = project.summary;

  const tagList = document.createElement("ul");
  tagList.className = "tag-list";
  tagList.setAttribute("aria-label", `${project.title} 기술 태그`);
  project.tags.forEach((tag) => {
    tagList.appendChild(createTag(tag));
  });

  body.append(title, summary, tagList);
  card.append(preview, body);

  return card;
}

function renderProjects() {
  if (!projectGrid) {
    return;
  }

  projectGrid.textContent = "";
  projectGrid.classList.toggle("is-single", projects.length === 1);

  const fragment = document.createDocumentFragment();
  projects.forEach((project, index) => {
    fragment.appendChild(createProjectCard(project, index));
  });
  projectGrid.appendChild(fragment);
}

function closeMobileMenu() {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function setupMobileMenu() {
  if (!siteNav || !menuToggle) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMobileMenu();
    }
  });
}

function setCurrentYear() {
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
}

renderProjects();
setupMobileMenu();
setCurrentYear();
