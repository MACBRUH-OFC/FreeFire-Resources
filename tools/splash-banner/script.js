// Security Configuration
const PROTECTION = {
    owner: "MACBRUH FF",
    instagram: "https://www.instagram.com/macbruh_ff",
    apiKey: "secured_" + Math.random().toString(36).slice(2) + "_" + Date.now()
};

// Secure API Endpoint (hidden)
const SECURE_API = {
    get baseUrl() {
        return window.location.host.includes('github.io') 
            ? '/FreeFire-Resources/api/proxy'
            : '/api/proxy';
    },
    get headers() {
        return {
            'X-Authorized': PROTECTION.apiKey,
            'X-Source': 'official-tool'
        };
    }
};

// Anti-Theft Protection
function showProtectionAlert() {
    const alertHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            color: #ff6b6b;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            text-align: center;
            padding: 20px;
            font-family: 'Orbitron', sans-serif;
        ">
            <h1 style="font-size: 2.5rem; margin-bottom: 20px;">⚠️ PROTECTED CONTENT</h1>
            <p style="font-size: 1.5rem; margin-bottom: 30px;">
                This tool is created by ${PROTECTION.owner}
            </p>
            <a href="${PROTECTION.instagram}" target="_blank" style="
                color: #00a2ff;
                font-size: 1.2rem;
                text-decoration: none;
                border: 2px solid #00a2ff;
                padding: 10px 20px;
                border-radius: 5px;
                transition: all 0.3s;
            ">
                <i class="fab fa-instagram"></i> ${PROTECTION.instagram}
            </a>
        </div>
    `;
    document.body.innerHTML = alertHTML;
    throw new Error("Protection triggered");
}

// Debugger Detection
let debugDetectionCount = 0;
setInterval(() => {
    if ((typeof window._detectedDebugger === 'function') || debugDetectionCount > 3) {
        showProtectionAlert();
    }
    debugDetectionCount++;
}, 1000);

// Right-Click Protection
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showProtectionAlert();
});

// Secure Fetch Wrapper
async function protectedFetch(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...SECURE_API.headers,
                ...options.headers
            }
        });
        
        if (!response.ok) throw new Error('Secure fetch failed');
        return await response.json();
    } catch (error) {
        console.error("Protected fetch error:", error);
        showProtectionAlert();
        return {
            error: true,
            message: `Content protected by ${PROTECTION.owner}`,
            contact: PROTECTION.instagram,
            banners: []
        };
    }
}

// Your Existing Code (modified to use protectedFetch)
const regions = {
    "IND": "INDIA",
    "SG": "SINGAPORE",
    "BD": "BANGLADESH",
    "EU": "EUROPE",
    "CIS": "RUSSIA",
    "NA": "NORTH AMERICA",
    "ID": "INDONESIA",
    "PK": "PAKISTAN",
    "BR": "BRAZIL",
    "ME": "MIDDLE EAST",
    "TH": "THAILAND",
    "SAC": "LATAM",
    "VN": "VIETNAM"
};

const terminalBody = document.getElementById("terminal-body");
const terminalInput = document.getElementById("terminal-input");
const bannersContainer = document.getElementById("banners-container");
const mainTitle = document.getElementById("main-title");
const terminalContainer = document.getElementById("terminal-container");
const statusIndicator = document.getElementById("status-indicator");
const regionTitle = document.getElementById("region-title");
const backToTopButton = document.getElementById("backToTop");

let lastSelectedRegion = null;
let allBanners = {};
let loadingStates = {};
let backgroundLoadComplete = false;

// Function to add output to terminal
function addTerminalOutput(text, type = "info") {
    const output = document.createElement("div");
    output.className = `terminal_output terminal_output--${type}`;
    output.textContent = text;
    terminalBody.insertBefore(output, terminalBody.lastElementChild);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Function to fetch banners for a specific region with retry
async function fetchBannersForRegion(region, retries = 3) {
    try {
        const response = await protectedFetch(`${SECURE_API.baseUrl}?region=${region}`);
        return Array.isArray(response) ? response : [];
    } catch (error) {
        console.error(`Error fetching banners for ${region}:`, error);
        if (retries > 0) {
            console.log(`Retrying (${retries} attempts left)...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchBannersForRegion(region, retries - 1);
        }
        return [];
    }
}

// Function to load banners for a region if not already loaded
async function ensureBannersLoaded(region) {
    if (!allBanners[region] || allBanners[region].length === 0) {
        if (!loadingStates[region]) {
            loadingStates[region] = true;
            allBanners[region] = await fetchBannersForRegion(region);
            loadingStates[region] = false;
            
            if (!backgroundLoadComplete) {
                updateStatusIndicator();
            }
        } else {
            while (loadingStates[region]) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }
    return allBanners[region];
}

// Function to update status indicator
function updateStatusIndicator() {
    const loadedRegions = Object.keys(allBanners).filter(region => allBanners[region].length > 0).length;
    const totalRegions = Object.keys(regions).length;
    
    if (loadedRegions === totalRegions) {
        statusIndicator.innerHTML = '<i class="fas fa-check-circle"></i> <span>All banners loaded</span>';
        setTimeout(() => {
            statusIndicator.style.opacity = '0';
            setTimeout(() => statusIndicator.style.display = 'none', 500);
        }, 2000);
        backgroundLoadComplete = true;
    } else {
        statusIndicator.innerHTML = `<i class="fas fa-circle-notch loading-icon"></i> <span>Loading ${loadedRegions}/${totalRegions} regions...</span>`;
    }
}

// Function to display banners for a selected region
async function displayBanners(region) {
    if (lastSelectedRegion === region) return;

    lastSelectedRegion = region;
    regionTitle.textContent = regions[region];
    regionTitle.style.display = "block";
    bannersContainer.innerHTML = '<div class="loader"></div>';
    bannersContainer.style.display = "grid";
    terminalInput.blur();

    setTimeout(() => {
        regionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    try {
        const banners = await ensureBannersLoaded(region);

        if (!Array.isArray(banners) || banners.length === 0) {
            bannersContainer.innerHTML = `
                <div class="fallback-banner">
                    <p>No banners available for ${regions[region] || region}</p>
                    <button onclick="retryLoadingBanners('${region}')" class="redirect-button">
                        <i class="fas fa-sync-alt"></i> Retry Loading
                    </button>
                </div>
            `;
            return;
        }

        const sortedBanners = banners.sort((a, b) => {
            const aStart = new Date(a.start * 1000);
            const bStart = new Date(b.start * 1000);
            return bStart - aStart;
        });

        let bannersHtml = sortedBanners.map(event => {
            const startDate = new Date(event.start * 1000);
            const endDate = new Date(event.end * 1000);
            const isUpcoming = startDate > new Date();
            
            const formattedStartDate = startDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            const formattedEndDate = endDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            return `
            <div class="banner ${isUpcoming ? 'upcoming' : ''}">
                ${isUpcoming ? '<div class="upcoming-tag">UPCOMING</div>' : ''}
                <div class="banner-image-container">
                    <img src="${event.url}" loading="lazy" alt="${event.title}" 
                        onerror="handleImageError(this)" 
                        onload="handleImageLoad(this)">
                    <div class="image-loading">Loading...</div>
                </div>
                <div class="banner-title">${event.title || 'Untitled Event'}</div>
                <div class="event-date">
                    Start: ${formattedStartDate} <br>
                    End: ${formattedEndDate}
                </div>
                <div class="button-container">
                    ${event.redirect && isValidUrl(event.redirect) ? 
                        `<a href="${event.redirect}" target="_blank" rel="noopener noreferrer" class="redirect-button">
                            <i class="fas fa-external-link-alt"></i> Learn More
                        </a>` : ''}
                    <button class="copy-info-button" 
                        onclick="copyInfo('${escapeHtml(event.title || 'Untitled Event')}', 
                                '${escapeHtml(formattedStartDate)} - ${escapeHtml(formattedEndDate)}', 
                                '${escapeHtml(event.url)}')">
                        <i class="far fa-copy"></i> Copy Info
                    </button>
                </div>
            </div>
            `;
        }).join("");

        bannersContainer.innerHTML = bannersHtml;

    } catch (error) {
        console.error("Error displaying banners:", error);
        bannersContainer.innerHTML = `
            <div class="fallback-banner">
                <p>Error loading banners for ${regions[region] || region}</p>
                <button onclick="retryLoadingBanners('${region}')" class="redirect-button">
                    <i class="fas fa-sync-alt"></i> Retry Loading
                </button>
            </div>
        `;
    }
}

// Function to handle terminal input
function handleTerminalInput(e) {
    if (e.key === "Enter") {
        const input = terminalInput.value.trim().toUpperCase();
        terminalInput.value = "";
        
        addTerminalOutput(`$ ${input}`, "command");
        
        if (regions[input]) {
            addTerminalOutput(`Loading banners for ${regions[input]}...`, "success");
            displayBanners(input);
        } else {
            addTerminalOutput(`Error: '${input}' is not a valid region code.`, "error");
        }
    }
}

// Function to retry loading banners
async function retryLoadingBanners(region) {
    displayBanners(region);
}

// Image loading handlers
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/300x150?text=Banner+Not+Available';
    const container = img.closest('.banner-image-container');
    if (container) {
        const loadingElement = container.querySelector('.image-loading');
        if (loadingElement) {
            loadingElement.textContent = 'Image Not Available';
            loadingElement.style.color = '#ff6b6b';
        }
    }
}

function handleImageLoad(img) {
    const container = img.closest('.banner-image-container');
    if (container) {
        const loadingElement = container.querySelector('.image-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Function to escape HTML for safe insertion
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Function to validate URLs
function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Function to copy event info to clipboard
function copyInfo(title, dateRange, link) {
    const textToCopy = `Event Name: ${title}\n\nEvent Date: ${dateRange}\n\nEvent Link: ${link}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert("Event info copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy using clipboard API:", err);
                fallbackCopyText(textToCopy);
            });
    } else {
        fallbackCopyText(textToCopy);
    }
}

// Fallback method using document.execCommand
function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("Event info copied to clipboard!");
        } else {
            alert("Failed to copy info. Please copy manually.");
        }
    } catch (err) {
        console.error("Fallback copy failed:", err);
        alert("Failed to copy info. Please copy manually.");
    } finally {
        document.body.removeChild(textArea);
    }
}

// Function to preload all banners in background
async function preloadAllBanners() {
    const regionKeys = Object.keys(regions);
    for (const region of regionKeys) {
        if (!allBanners[region]) {
            await ensureBannersLoaded(region);
        }
    }
}

// Back to Top Button functionality
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize the page
function initializePage() {
    terminalInput.addEventListener('keypress', handleTerminalInput);
    terminalInput.focus();
    preloadAllBanners();
}

// Start the initialization when the page loads
document.addEventListener('DOMContentLoaded', initializePage);

// Global access for HTML onclick handlers
window.retryLoadingBanners = retryLoadingBanners;
window.handleImageError = handleImageError;
window.handleImageLoad = handleImageLoad;
window.copyInfo = copyInfo;
window.isValidUrl = isValidUrl;