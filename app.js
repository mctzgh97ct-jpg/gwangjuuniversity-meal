const button = document.querySelector("#loadButton");
const statusBox = document.querySelector("#status");
const sourceCard = document.querySelector("#sourceCard");
const postTitle = document.querySelector("#postTitle");
const postLink = document.querySelector("#postLink");
const mealSection = document.querySelector("#mealSection");
const dateTabs = document.querySelector("#dateTabs");
const selectedDate = document.querySelector("#selectedDate");
const mealList = document.querySelector("#mealList");
const emptyMessage = document.querySelector("#emptyMessage");
const parserNote = document.querySelector("#parserNote");
const updatedAt = document.querySelector("#updatedAt");
const studentTab = document.querySelector("#studentTab");
const foodTab = document.querySelector("#foodTab");
const mealCardLabel = document.querySelector("#mealCardLabel");

let mealDays = [];
let activeDate = null;
let activeCategory = "student";

button.addEventListener("click", loadMenu);
studentTab.addEventListener("click", () => setCategory("student"));
foodTab.addEventListener("click", () => setCategory("food"));
window.addEventListener("DOMContentLoaded", loadMenu);

async function loadMenu() {
  button.disabled = true;
  statusBox.classList.remove("error", "success");
  statusBox.textContent = "저장된 최신 식단을 불러오는 중이에요…";

  try {
    const response = await fetch(`./menu.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`menu.json을 불러오지 못했습니다. (${response.status})`);

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || "아직 식단 데이터가 업데이트되지 않았습니다.");
    }

    postTitle.textContent = data.post?.title || "최신 식단 게시글";
    postLink.href = data.post?.url || data.source || "#";
    sourceCard.classList.remove("hidden");

    mealDays = Array.isArray(data.days) ? data.days : [];
    if (!mealDays.length) throw new Error("저장된 식단 날짜가 없습니다.");

    activeDate = data.default_date || mealDays[0]?.date || null;

    const hasFood = mealDays.some(
      (day) => Array.isArray(day.food_items) && day.food_items.length > 0
    );
    foodTab.classList.toggle("category-tab-muted", !hasFood);

    renderDateTabs();
    renderMeal(activeDate);
    mealSection.classList.remove("hidden");

    parserNote.textContent =
      data.parse_note || "광주대학교 공식 식단표에서 저장된 메뉴입니다.";
    updatedAt.textContent = data.last_updated
      ? `데이터 업데이트: ${formatUpdatedAt(data.last_updated)}`
      : "";

    statusBox.classList.add("success");
    statusBox.textContent = "최신 저장 식단을 불러왔어요.";
  } catch (error) {
    mealDays = [];
    activeDate = null;
    mealSection.classList.add("hidden");
    sourceCard.classList.add("hidden");
    statusBox.classList.add("error");
    statusBox.textContent = `오류: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

function setCategory(category) {
  activeCategory = category;
  studentTab.classList.toggle("active", category === "student");
  foodTab.classList.toggle("active", category === "food");
  studentTab.setAttribute("aria-pressed", category === "student" ? "true" : "false");
  foodTab.setAttribute("aria-pressed", category === "food" ? "true" : "false");
  renderMeal(activeDate);
}

function renderDateTabs() {
  dateTabs.innerHTML = "";

  mealDays.forEach((day) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "date-tab";
    tab.dataset.date = day.date;
    tab.setAttribute("aria-pressed", day.date === activeDate ? "true" : "false");

    const date = parseLocalDate(day.date);
    const monthDay = Number.isNaN(date.getTime())
      ? day.date
      : `${date.getMonth() + 1}/${date.getDate()}`;

    tab.innerHTML = `<span>${monthDay}</span><strong>${escapeHtml(day.weekday || "")}</strong>`;
    if (day.date === activeDate) tab.classList.add("active");

    tab.addEventListener("click", () => {
      activeDate = day.date;
      renderDateTabs();
      renderMeal(activeDate);
    });

    dateTabs.appendChild(tab);
  });
}

function renderMeal(dateString) {
  mealList.innerHTML = "";
  const day = mealDays.find((item) => item.date === dateString) || mealDays[0];

  if (!day) return;

  const parsed = parseLocalDate(day.date);
  selectedDate.textContent = Number.isNaN(parsed.getTime())
    ? `${day.date} ${day.weekday || ""}`
    : `${parsed.getMonth() + 1}월 ${parsed.getDate()}일 ${day.weekday || ""}요일`;

  const isFood = activeCategory === "food";
  const categoryLabel = isFood ? "푸드단품" : "학생정식";
  mealCardLabel.textContent = categoryLabel;

  const rawItems = isFood ? day.food_items : (day.student_items || day.items);
  const items = Array.isArray(rawItems) ? rawItems.filter(Boolean) : [];

  if (!items.length) {
    emptyMessage.textContent = `이 날짜에는 등록된 ${categoryLabel} 메뉴가 없어요.`;
    emptyMessage.classList.remove("hidden");
    return;
  }

  emptyMessage.classList.add("hidden");
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="meal-number">${String(index + 1).padStart(2, "0")}</span><span>${escapeHtml(item)}</span>`;
    mealList.appendChild(li);
  });
}

function parseLocalDate(value) {
  if (!value || typeof value !== "string") return new Date(NaN);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return new Date(NaN);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function formatUpdatedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
