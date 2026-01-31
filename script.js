// Charger le JSON du catalogue
fetch("catalog.json")
  .then(res => res.json())
  .then(data => {
    generateSections(data);
    enableModal(data);
  })
  .catch(err => console.error("Erreur JSON :", err));


// Variable globale pour stocker l'item ouvert
let currentItem = null;


// Génère toutes les sections (Ajout récent, Tendances, etc.)
function generateSections(data) {
  const main = document.querySelector("main");

  data.sections.forEach(section => {
    const row = document.createElement("section");
    row.classList.add("row");

    const title = document.createElement("h2");
    title.textContent = section.title;

    const slider = document.createElement("div");
    slider.classList.add("row-slider");

    section.items.forEach(id => {
      const item = data.catalog[id];
      if (!item) return;

      const card = document.createElement("div");
      card.classList.add("card");
      card.style.backgroundImage = `url(${item.images.poster})`;
      card.dataset.id = id;

      const label = document.createElement("div");
      label.classList.add("card-title");
      label.textContent = item.title;

      card.appendChild(label);
      slider.appendChild(card);
    });

    row.appendChild(title);
    row.appendChild(slider);
    main.appendChild(row);
  });
}


// MODALE
function enableModal(data) {
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("modal-close");

  document.addEventListener("click", e => {
    if (e.target.classList.contains("card")) {
      const id = e.target.dataset.id;
      openModal(data.catalog[id]);
    }
  });

  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}


// Ouvre la modale avec les infos du JSON
function openModal(item) {
  currentItem = item; // 🔥 essentiel pour Lecture

  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-meta").textContent =
    `${item.year} • ${item.type} • ${item.duration || item.seasons + " saisons"}`;

  document.getElementById("modal-description").textContent = item.description_long;
  document.getElementById("modal-age").textContent = item.age;
  document.getElementById("modal-quality").textContent = item.quality.join(", ");
  document.getElementById("modal-genres").textContent = item.genres.join(", ");

  document.getElementById("modal-backdrop").src = item.images.backdrop;

  document.getElementById("modal").classList.remove("hidden");
}


// 🔥 LECTURE VIDÉO
document.getElementById("modal-play").addEventListener("click", () => {
  const player = document.getElementById("player");

  if (!currentItem || !currentItem.video) {
    console.error("Aucune vidéo trouvée pour cet item.");
    return;
  }

  player.src = currentItem.video;
  player.classList.remove("hidden");
  player.play();
});
