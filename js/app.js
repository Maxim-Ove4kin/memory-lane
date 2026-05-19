// Main application logic - Mobile Optimized with Groups

const dataManager = new DataManager();
let currentGroupId = null;
let mapInstance = null;
let markersGroup = null;
let pickerMapInstance = null;
let pickerMarker = null;
let fullscreenMapInstance = null;
let fullscreenMarker = null;
let isFullscreenMode = false;

// DOM Elements
const groupsList = document.getElementById("groups-list");
const timeline = document.getElementById("timeline");
const membersGrid = document.getElementById("members-grid");
const badgesList = document.getElementById("badges-list");
const eventModal = document.getElementById("event-modal");
const groupModal = document.getElementById("group-modal");
const settingsModal = document.getElementById("settings-modal");
const eventForm = document.getElementById("event-form");
const groupForm = document.getElementById("group-form");
const searchInput = document.getElementById("search-input");
const groupsSearch = document.getElementById("groups-search");
const categoryFilter = document.getElementById("category-filter");
const yearFilter = document.getElementById("year-filter");
const themeToggle = document.getElementById("theme-toggle");
const mainNav = document.getElementById("main-nav");
const groupNav = document.getElementById("group-nav");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
	initNavigation();
	initTheme();
	renderGroupsList();
	setupEventListeners();
	setupBackButtons();
});

// Navigation between main screen and group screen
function initNavigation() {
	// Main navigation (Groups/Settings)
	const mainNavBtns = mainNav.querySelectorAll(".nav-btn");
	for (const btn of mainNavBtns) {
		btn.addEventListener("click", () => {
			const targetTab = btn.dataset.tab;

			for (const navBtn of mainNavBtns) {
				navBtn.classList.remove("active");
			}
			btn.classList.add("active");

			if (targetTab === "groups") {
				showGroupsList();
			} else if (targetTab === "settings") {
				settingsModal.style.display = "block";
				document.body.style.overflow = "hidden";
			}
		});
	}

	// Group navigation (Timeline/Members/Map/Badges)
	const groupNavBtns = groupNav.querySelectorAll(".nav-btn");
	for (const btn of groupNavBtns) {
		btn.addEventListener("click", () => {
			const targetTab = btn.dataset.tab;

			for (const navBtn of groupNavBtns) {
				navBtn.classList.remove("active");
			}
			for (const tabContent of document.querySelectorAll(".tab-content")) {
				tabContent.classList.remove("active");
			}

			btn.classList.add("active");
			document.getElementById(`${targetTab}-section`).classList.add("active");

			if (targetTab === "map") {
				setTimeout(() => initMap(), 50);
			}

			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	}
}

// Show groups list (main screen)
function showGroupsList() {
	currentGroupId = null;
	if (mapInstance) {
		mapInstance.remove();
		mapInstance = null;
		markersGroup = null;
	}
	for (const tabContent of document.querySelectorAll(".tab-content")) {
		tabContent.classList.remove("active");
	}
	document.getElementById("groups-section").classList.add("active");
	mainNav.style.display = "flex";
	groupNav.style.display = "none";
	renderGroupsList();
}

// Enter group
function enterGroup(groupId) {
	currentGroupId = groupId;
	const group = dataManager.getGroupById(groupId);

	document.getElementById("current-group-name").textContent = group.name;
	for (const tabContent of document.querySelectorAll(".tab-content")) {
		tabContent.classList.remove("active");
	}
	document.getElementById("timeline-section").classList.add("active");

	mainNav.style.display = "none";
	groupNav.style.display = "flex";
	for (const navBtn of groupNav.querySelectorAll(".nav-btn")) {
		navBtn.classList.remove("active");
	}
	groupNav.querySelector('[data-tab="timeline"]').classList.add("active");

	renderTimeline();
	renderMembers();
	renderBadges();
	populateYearFilter();
	populateAuthorSelect();
}

// Back buttons
function setupBackButtons() {
	document
		.getElementById("back-to-groups")
		.addEventListener("click", showGroupsList);
	document
		.getElementById("back-to-groups-members")
		.addEventListener("click", showGroupsList);
	document
		.getElementById("back-to-groups-map")
		.addEventListener("click", showGroupsList);
	document
		.getElementById("back-to-groups-badges")
		.addEventListener("click", showGroupsList);
}

// Theme Toggle
function initTheme() {
	const savedTheme = localStorage.getItem("theme") || "light";
	document.body.setAttribute("data-theme", savedTheme);
	updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
	themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
	const currentTheme = document.body.getAttribute("data-theme");
	const newTheme = currentTheme === "dark" ? "light" : "dark";
	document.body.setAttribute("data-theme", newTheme);
	localStorage.setItem("theme", newTheme);
	updateThemeIcon(newTheme);
	updateMapTiles(newTheme);
});

function updateMapTiles(theme) {
	const isDark = theme === "dark";
	const tileUrl = isDark
		? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
		: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

	const updateTiles = (mapInstance) => {
		mapInstance.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
				layer.setUrl(tileUrl);
			}
		});
	};

	if (mapInstance) updateTiles(mapInstance);
	if (pickerMapInstance) updateTiles(pickerMapInstance);
	if (fullscreenMapInstance) updateTiles(fullscreenMapInstance);
}

// Render Groups List
function renderGroupsList(searchQuery = "") {
	const groups = dataManager.getGroups(searchQuery);
	groupsList.innerHTML = "";

	if (groups.length === 0) {
		groupsList.innerHTML =
			'<p class="empty-state">Пока нет групп. Создайте первую!</p>';
		return;
	}

	for (const group of groups) {
		const card = document.createElement("div");
		card.className = "group-card";
		card.innerHTML = `
            <div class="group-avatar">${group.name.charAt(0).toUpperCase()}</div>
            <div class="group-info">
                <h3>${group.name}</h3>
                <p class="group-meta">👥 ${group.members.length} участников • 📝 ${group.events.length} событий</p>
                ${group.description ? `<p class="group-description">${group.description}</p>` : ""}
            </div>
        `;
		card.addEventListener("click", () => enterGroup(group.id));
		groupsList.appendChild(card);
	}
}

// Groups search with position change
const searchBarBottom = document.getElementById("search-bar-bottom");

groupsSearch.addEventListener("focus", () => {
	searchBarBottom.classList.add("active");
	setTimeout(() => {
		groupsSearch.scrollIntoView({ behavior: "smooth", block: "start" });
	}, 100);
});

groupsSearch.addEventListener("blur", () => {
	if (!groupsSearch.value) {
		searchBarBottom.classList.remove("active");
	}
});

groupsSearch.addEventListener("input", (e) => {
	renderGroupsList(e.target.value);
	if (!e.target.value) {
		searchBarBottom.classList.remove("active");
	}
});

// Render Timeline
function renderTimeline(filters = {}) {
	if (!currentGroupId) return;

	const events = dataManager.getEvents(currentGroupId, filters);
	timeline.innerHTML = "";

	if (events.length === 0) {
		timeline.innerHTML =
			'<p class="empty-state">Пока нет воспоминаний. Добавьте первое!</p>';
		return;
	}

	for (const event of events) {
		const member = dataManager.getMemberById(currentGroupId, event.author_id);
		const card = createEventCard(event, member);
		timeline.appendChild(card);
	}
}

function createEventCard(event, member) {
	const card = document.createElement("div");
	card.className = "event-card";
	const locationHtml =
		event.location &&
		(event.location.address ||
			(event.location.lat !== 0 && event.location.lng !== 0))
			? `<div class="event-location" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">📍 ${event.location.address || `${event.location.lat.toFixed(4)}, ${event.location.lng.toFixed(4)}`}</div>`
			: "";

	card.innerHTML = `
        <div class="event-date">${formatDate(event.date)}</div>
        <div class="event-category">${getCategoryIcon(event.category)} ${event.category}</div>
        <h3>${event.title}</h3>
        ${locationHtml}
        <p class="event-description">${formatMarkdown(event.description)}</p>
        <div class="event-author">Автор: ${member ? member.name : "Неизвестно"}</div>
    `;
	return card;
}

// Render Members
function renderMembers() {
	if (!currentGroupId) return;

	const members = dataManager.getMembers(currentGroupId);
	membersGrid.innerHTML = "";

	for (const member of members) {
		const card = document.createElement("div");
		card.className = "member-card";
		card.innerHTML = `
            <h3>${member.name}</h3>
            <p class="member-bio">${member.bio}</p>
            <div class="member-badges">
                ${member.badges.map((b) => `<span class="badge">${b}</span>`).join("")}
            </div>
            ${member.quote ? `<p class="member-quote">"${member.quote}"</p>` : ""}
            <p class="member-stats">📝 Воспоминаний: ${member.stats}</p>
		`;
		membersGrid.appendChild(card);
	}
}

// Render Badges
function renderBadges() {
	if (!currentGroupId) return;

	const members = dataManager.getMembers(currentGroupId);
	badgesList.innerHTML = "";

	const allBadges = members.flatMap((m) =>
		m.badges.map((b) => ({ badge: b, member: m.name })),
	);

	if (allBadges.length === 0) {
		badgesList.innerHTML = '<p class="empty-state">Пока нет ачивок</p>';
		return;
	}

	for (const { badge, member } of allBadges) {
		const item = document.createElement("div");
		item.className = "badge-item";
		item.innerHTML = `<span class="badge-icon">🏆</span> <strong>${badge}</strong> - ${member}`;
		badgesList.appendChild(item);
	}
}

// Map functionality - Apple Photos style
function initMap() {
	if (!currentGroupId) return;

	const events = dataManager.getEventsWithLocation(currentGroupId);
	const mapEl = document.getElementById("map");
	const mapEmptyEl = document.getElementById("map-empty");

	if (events.length === 0) {
		if (mapEl) mapEl.style.display = "none";
		if (mapEmptyEl) mapEmptyEl.style.display = "flex";
		if (mapInstance) {
			mapInstance.remove();
			mapInstance = null;
			markersGroup = null;
		}
		return;
	}

	if (mapEl) mapEl.style.display = "block";
	if (mapEmptyEl) mapEmptyEl.style.display = "none";

	if (!mapInstance) {
		mapInstance = L.map("map", {
			zoomControl: false,
			attributionControl: false,
		}).setView([55.7558, 37.6173], 3);

		L.tileLayer(getTileUrl(getCurrentTheme()), {
			maxZoom: 19,
		}).addTo(mapInstance);
	}

	if (!markersGroup) {
		markersGroup = L.markerClusterGroup({
			zoomToBoundsOnClick: false,
			maxClusterRadius: 50,
			iconCreateFunction: (cluster) => {
				const childCount = cluster.getChildCount();
				let c = " marker-cluster-";
				if (childCount < 10) {
					c += "small";
				} else if (childCount < 100) {
					c += "medium";
				} else {
					c += "large";
				}
				return new L.DivIcon({
					html: `<div><span>${childCount}</span></div>`,
					className: `marker-cluster${c}`,
					iconSize: new L.Point(40, 40),
				});
			},
		});

		markersGroup.on("clusterclick", (a) => {
			const childMarkers = a.layer.getAllChildMarkers();
			let popupContent = '<div class="map-popup-cluster">';
			popupContent += `<h3>События в этой области (${childMarkers.length})</h3>`;
			popupContent += '<ul class="map-popup-cluster-list">';

			for (const marker of childMarkers) {
				const event = marker.options.eventData;
				popupContent += `
					<li>
						<div>
							<strong>${formatDate(event.date)}</strong><br>
							${event.title}
						</div>
						<button class="btn-detail" onclick="viewEventDetails(${event.id})">Детали</button>
					</li>
				`;
			}

			popupContent += "</ul></div>";

			L.popup()
				.setLatLng(a.latlng)
				.setContent(popupContent)
				.openOn(mapInstance);
		});

		markersGroup.addTo(mapInstance);
	} else {
		markersGroup.clearLayers();
	}

	setTimeout(() => {
		mapInstance.invalidateSize();

		const bounds = L.latLngBounds(
			events.map((e) => [e.location.lat, e.location.lng]),
		);
		if (bounds.isValid()) {
			mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
		}

		for (const event of events) {
			const icon = L.divIcon({
				className: "custom-marker",
				html: getCategoryIcon(event.category),
				iconSize: [40, 40],
				iconAnchor: [20, 40],
			});

			const marker = L.marker([event.location.lat, event.location.lng], {
				icon,
				eventData: event,
			});

			const popupContent = createMapPopup(event);
			marker.bindPopup(popupContent);

			markersGroup.addLayer(marker);
		}
	}, 100);
}

function createMapPopup(event) {
	const dateStr = formatDate(event.date);
	const categoryIcon = getCategoryIcon(event.category);
	const locationStr =
		event.location.address ||
		`📍 ${Math.abs(event.location.lat).toFixed(2)}°, ${Math.abs(event.location.lng).toFixed(2)}°`;

	return `
        <div class="map-popup">
            <div class="map-popup-content">
                <div class="map-popup-date">${categoryIcon} ${dateStr}</div>
                <h3 class="map-popup-title">${event.title}</h3>
                <p class="map-popup-location">📍 ${locationStr}</p>
                <div class="map-popup-actions">
                    <button class="map-popup-btn map-popup-btn-secondary" onclick="viewEventDetails(${event.id})">Подробнее</button>
                </div>
            </div>
        </div>
    `;
}

function viewEventDetails(eventId) {
	if (!currentGroupId) return;

	const group = dataManager.getGroupById(currentGroupId);
	const event = group.events.find((e) => e.id === eventId);
	if (!event) return;

	showGroupsList();

	setTimeout(() => {
		enterGroup(currentGroupId);

		const navBtns = groupNav.querySelectorAll(".nav-btn");
		for (const navBtn of navBtns) {
			navBtn.classList.remove("active");
		}
		for (const tabContent of document.querySelectorAll(".tab-content")) {
			tabContent.classList.remove("active");
		}

		groupNav.querySelector('[data-tab="timeline"]').classList.add("active");
		document.getElementById("timeline-section").classList.add("active");

		setTimeout(() => {
			const eventCard = document.querySelector(".event-card");
			if (eventCard) {
				eventCard.scrollIntoView({ behavior: "smooth", block: "center" });
			}
		}, 300);
	}, 100);
}

// FAB button - context aware
document.getElementById("add-btn").addEventListener("click", () => {
	if (currentGroupId) {
		// Inside group - add event
		eventModal.style.display = "block";
		setTimeout(() => initPickerMap(), 50);
	} else {
		// Main screen - create group
		groupModal.style.display = "block";
	}
	document.body.style.overflow = "hidden";
});

// Modal close buttons

for (const closeBtn of document.querySelectorAll(".close")) {
	closeBtn.addEventListener("click", () => {
		const modalType = closeBtn.dataset.modal;
		if (modalType === "event") {
			eventModal.style.display = "none";
		} else if (modalType === "group") {
			groupModal.style.display = "none";
		} else if (modalType === "settings") {
			settingsModal.style.display = "none";
		}
		document.body.style.overflow = "";
	});
}

// Close modals on outside click
window.addEventListener("click", (e) => {
	if (e.target === eventModal) {
		eventModal.style.display = "none";
		document.body.style.overflow = "";
	}
	if (e.target === groupModal) {
		groupModal.style.display = "none";
		document.body.style.overflow = "";
	}
	if (e.target === settingsModal) {
		settingsModal.style.display = "none";
		document.body.style.overflow = "";
	}
});

// Group Form Submit
groupForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const groupData = {
		name: document.getElementById("group-name").value,
		description: document.getElementById("group-description").value,
	};

	dataManager.addGroup(groupData);
	renderGroupsList();
	groupForm.reset();
	groupModal.style.display = "none";
	document.body.style.overflow = "";

	showToast("Группа создана!");
});

// Event Form Submit
eventForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const eventData = {
		title: document.getElementById("event-title").value,
		date: document.getElementById("event-date").value,
		category: document.getElementById("event-category").value,
		description: document.getElementById("event-description").value,
		author_id: Number.parseInt(document.getElementById("event-author").value),
	};

	dataManager.addEvent(currentGroupId, eventData);
	renderTimeline();
	renderMembers();
	renderGroupsList();
	populateYearFilter();
	eventForm.reset();

	if (pickerMarker) {
		pickerMapInstance.removeLayer(pickerMarker);
		pickerMarker = null;
	}
	document.getElementById("event-lat").value = "";
	document.getElementById("event-lng").value = "";

	eventModal.style.display = "none";
	document.body.style.overflow = "";

	showToast("Воспоминание добавлено!");
});

// Filters
function setupEventListeners() {
	searchInput.addEventListener("input", applyFilters);
	categoryFilter.addEventListener("change", applyFilters);
	yearFilter.addEventListener("change", applyFilters);

	const searchBtn = document.getElementById("search-address-btn");
	const addressInput = document.getElementById("event-address");

	if (searchBtn) {
		searchBtn.addEventListener("click", searchAddress);
	}

	if (addressInput) {
		addressInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				searchAddress();
			}
		});
	}

	const expandBtn = document.getElementById("expand-picker-map-btn");
	if (expandBtn) {
		expandBtn.addEventListener("click", openFullscreenMap);
	}

	const closeFullscreenBtn = document.getElementById(
		"close-fullscreen-map-btn",
	);
	if (closeFullscreenBtn) {
		closeFullscreenBtn.addEventListener("click", closeFullscreenMap);
	}

	const confirmLocationBtn = document.getElementById("confirm-location-btn");
	if (confirmLocationBtn) {
		confirmLocationBtn.addEventListener("click", confirmFullscreenLocation);
	}

	const fullscreenModal = document.getElementById("fullscreen-map-modal");
	if (fullscreenModal) {
		fullscreenModal.addEventListener("click", (e) => {
			if (e.target === fullscreenModal) {
				closeFullscreenMap();
			}
		});
	}
}

function openFullscreenMap() {
	isFullscreenMode = true;
	const modal = document.getElementById("fullscreen-map-modal");
	modal.style.display = "block";
	document.body.style.overflow = "hidden";

	setTimeout(() => {
		if (!fullscreenMapInstance) {
			fullscreenMapInstance = L.map("fullscreen-picker-map", {
				zoomControl: false,
				attributionControl: false,
			}).setView([55.7558, 37.6173], 10);

			L.tileLayer(getTileUrl(getCurrentTheme()), {
				maxZoom: 19,
			}).addTo(fullscreenMapInstance);

			fullscreenMapInstance.on("click", async (e) => {
				await setFullscreenMarkerLocation(e.latlng.lat, e.latlng.lng, true);
			});
		} else {
			fullscreenMapInstance.invalidateSize();
		}

		const latVal = document.getElementById("event-lat").value;
		const lngVal = document.getElementById("event-lng").value;
		if (latVal && lngVal) {
			setFullscreenMarkerLocation(
				Number.parseFloat(latVal),
				Number.parseFloat(lngVal),
				false,
			);
		}

		const addrVal = document.getElementById("event-address").value;
		document.getElementById("fullscreen-address-display").textContent =
			addrVal || "";
	}, 100);
}

function closeFullscreenMap() {
	isFullscreenMode = false;
	const modal = document.getElementById("fullscreen-map-modal");
	modal.style.display = "none";
	document.body.style.overflow = "";
}

async function confirmFullscreenLocation() {
	if (!fullscreenMarker) return;
	const lat = fullscreenMarker.getLatLng().lat;
	const lng = fullscreenMarker.getLatLng().lng;

	document.getElementById("event-lat").value = lat;
	document.getElementById("event-lng").value = lng;

	const addressDisplay = document.getElementById(
		"fullscreen-address-display",
	).textContent;
	document.getElementById("event-address").value = addressDisplay;

	if (pickerMarker) {
		pickerMarker.setLatLng([lat, lng]);
	} else {
		pickerMarker = L.marker([lat, lng]).addTo(pickerMapInstance);
	}
	pickerMapInstance.setView([lat, lng], pickerMapInstance.getZoom());

	closeFullscreenMap();
}

async function setFullscreenMarkerLocation(lat, lng, fetchAddress = false) {
	if (fullscreenMarker) {
		fullscreenMarker.setLatLng([lat, lng]);
	} else {
		fullscreenMarker = L.marker([lat, lng]).addTo(fullscreenMapInstance);
	}
	fullscreenMapInstance.setView([lat, lng], fullscreenMapInstance.getZoom());

	if (fetchAddress) {
		document.getElementById("fullscreen-address-display").textContent =
			"Определяем адрес...";
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`,
				{
					headers: {
						"User-Agent": "MemoryLanePWA/1.0",
					},
				},
			);
			const data = await response.json();
			if (data?.display_name) {
				const addressParts = data.display_name.split(", ");
				const simpleAddress = addressParts.slice(0, 3).join(", ");
				document.getElementById("fullscreen-address-display").textContent =
					simpleAddress;
			} else {
				document.getElementById("fullscreen-address-display").textContent =
					`${lat.toFixed(4)}, ${lng.toFixed(4)}`;
			}
		} catch {
			document.getElementById("fullscreen-address-display").textContent =
				`${lat.toFixed(4)}, ${lng.toFixed(4)}`;
		}
	}
}

function getTileUrl(theme) {
	return theme === "dark"
		? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
		: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
}

function getCurrentTheme() {
	return document.body.getAttribute("data-theme") || "light";
}

function initPickerMap() {
	const pickerMapEl = document.getElementById("picker-map");
	if (!pickerMapEl) return;

	if (!pickerMapInstance) {
		pickerMapInstance = L.map("picker-map", {
			zoomControl: false,
			attributionControl: false,
		}).setView([55.7558, 37.6173], 9);

		L.tileLayer(getTileUrl(getCurrentTheme()), {
			maxZoom: 19,
		}).addTo(pickerMapInstance);

		pickerMapInstance.on("click", async (e) => {
			if (isFullscreenMode) {
				await setFullscreenMarkerLocation(e.latlng.lat, e.latlng.lng, true);
			} else {
				await setPickerLocation(e.latlng.lat, e.latlng.lng, true);
			}
		});
	} else {
		if (pickerMarker) {
			pickerMapInstance.removeLayer(pickerMarker);
			pickerMarker = null;
		}
		if (!isFullscreenMode) {
			pickerMapInstance.setView([55.7558, 37.6173], 9);
		}
	}

	setTimeout(() => {
		pickerMapInstance.invalidateSize();
	}, 100);
}

async function setPickerLocation(lat, lng, fetchAddress = false) {
	document.getElementById("event-lat").value = lat;
	document.getElementById("event-lng").value = lng;

	if (pickerMarker) {
		pickerMarker.setLatLng([lat, lng]);
	} else {
		pickerMarker = L.marker([lat, lng]).addTo(pickerMapInstance);
	}

	pickerMapInstance.setView([lat, lng], pickerMapInstance.getZoom());

	if (fetchAddress) {
		const addressInput = document.getElementById("event-address");
		addressInput.placeholder = "Определяем адрес...";
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`,
				{
					headers: {
						"User-Agent": "MemoryLanePWA/1.0",
					},
				},
			);
			const data = await response.json();
			if (data?.display_name) {
				const addressParts = data.display_name.split(", ");
				const simpleAddress = addressParts.slice(0, 3).join(", ");
				addressInput.value = simpleAddress;
			} else {
				addressInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
			}
		} catch (error) {
			console.error("Reverse geocoding error:", error);
			addressInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
		} finally {
			addressInput.placeholder = "Введите адрес для поиска...";
		}
	}
}

async function searchAddress() {
	const address = document.getElementById("event-address").value.trim();
	if (!address) return;
	const searchBtn = document.getElementById("search-address-btn");
	const origContent = searchBtn.innerHTML;
	searchBtn.innerHTML = "⌛";
	searchBtn.disabled = true;
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&accept-language=ru&limit=1`,
			{
				headers: {
					"User-Agent": "MemoryLanePWA/1.0",
				},
			},
		);
		const data = await response.json();
		if (data?.length > 0) {
			const { lat, lon, display_name } = data[0];
			const parsedLat = Number.parseFloat(lat);
			const parsedLng = Number.parseFloat(lon);
			await setPickerLocation(parsedLat, parsedLng, false);
			const addressParts = display_name.split(", ");
			const simpleAddress = addressParts.slice(0, 3).join(", ");
			document.getElementById("event-address").value = simpleAddress;
			if (isFullscreenMode && fullscreenMapInstance) {
				setFullscreenMarkerLocation(parsedLat, parsedLng, false);
				document.getElementById("fullscreen-address-display").textContent =
					simpleAddress;
			}
		} else {
			showToast("Адрес не найден");
		}
	} catch (error) {
		console.error("Geocoding error:", error);
		showToast("Ошибка при поиске адреса");
	} finally {
		searchBtn.innerHTML = origContent;
		searchBtn.disabled = false;
	}
}

function applyFilters() {
	const filters = {
		search: searchInput.value,
		category: categoryFilter.value,
		year: yearFilter.value,
	};
	renderTimeline(filters);
}

// Export/Import
document.getElementById("export-btn").addEventListener("click", () => {
	dataManager.exportData();
	settingsModal.style.display = "none";
	document.body.style.overflow = "";
	showToast("Данные экспортированы!");
});

document.getElementById("import-btn").addEventListener("click", () => {
	document.getElementById("import-file").click();
});

document.getElementById("import-file").addEventListener("change", (e) => {
	const file = e.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (event) => {
			if (dataManager.importData(event.target.result)) {
				showToast("Данные импортированы!");
				setTimeout(() => location.reload(), 1000);
			} else {
				showToast("Ошибка импорта данных");
			}
		};
		reader.readAsText(file);
	}
});

// Helper Functions
function populateYearFilter() {
	if (!currentGroupId) return;

	const years = dataManager.getYears(currentGroupId);
	yearFilter.innerHTML = '<option value="">Все годы</option>';
	for (const year of years) {
		const option = document.createElement("option");
		option.value = year;
		option.textContent = year;
		yearFilter.appendChild(option);
	}
}

function populateAuthorSelect() {
	if (!currentGroupId) return;

	const members = dataManager.getMembers(currentGroupId);
	const select = document.getElementById("event-author");
	select.innerHTML = '<option value="">Автор</option>';
	for (const member of members) {
		const option = document.createElement("option");
		option.value = member.id;
		option.textContent = member.name;
		select.appendChild(option);
	}
}

function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString("ru-RU", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function getCategoryIcon(category) {
	const icons = {
		Travel: "✈️",
		Humor: "😄",
		Achievement: "🏆",
	};
	return icons[category] || "📌";
}

function formatMarkdown(text) {
	return text
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/g, "<em>$1</em>")
		.replace(/\n/g, "<br>");
}

function showToast(message) {
	const toast = document.createElement("div");
	toast.style.cssText = `
        position: fixed;
        bottom: calc(var(--bottom-nav-height) + 20px);
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-dark);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        z-index: 1001;
        animation: slideUp 0.3s;
        box-shadow: 0 4px 12px var(--shadow);
    `;
	toast.textContent = message;
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.style.animation = "fadeOut 0.3s";
		setTimeout(() => toast.remove(), 300);
	}, 2000);
}

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener(
	"touchend",
	(e) => {
		const now = Date.now();
		if (now - lastTouchEnd <= 300) {
			e.preventDefault();
		}
		lastTouchEnd = now;
	},
	false,
);
