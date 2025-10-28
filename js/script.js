// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const button = document.querySelector('button');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);



const API_KEY = "7qCRhuYQwi6LGzwfAl7Fc1E9b5mPS9rfmCVW6WMd";
button.addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Validate inputs
  if (!startDate || !endDate) {
    alert("Please select both start and end dates before continuing.");
    return;
  }

  // Show loading message
  gallery.innerHTML = `<p style="text-align:center;">🚀 Loading space images...</p>`;

  // NASA API URL
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Clear gallery
    gallery.innerHTML = "";

    // Handle single or multiple results
    const results = Array.isArray(data) ? data : [data];

    // Loop through each image and build cards
    results.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("gallery-item");

      const media = item.media_type === "image"
        ? `<img src="${item.url}" alt="${item.title}" style="cursor:pointer;">`
        : `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;

      div.innerHTML = `
        ${media}
        <p><strong>${item.title}</strong><br>${new Date(item.date).toDateString()}</p>
        <p>${item.explanation}</p>
      `;

      gallery.appendChild(div);
    });

  } catch (error) {
    console.error("Error fetching NASA data:", error);
    gallery.innerHTML = `<p style="text-align:center;color:red;">❌ Error loading NASA images. Please try again later.</p>`;
  }
});

// ===========================
// MODAL VIEW (POPUP)
// ===========================

// Create modal HTML
const modal = document.createElement('div');
modal.id = 'modal';
modal.style.display = 'none';
modal.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

modal.innerHTML = `
  <div id="modal-content" style="background:white;padding:20px;border-radius:10px;max-width:800px;margin:auto;position:relative;">
    <span id="close-modal" style="position:absolute;top:10px;right:20px;font-size:28px;cursor:pointer;">&times;</span>
    <img id="modal-img" src="" alt="" style="width:100%;max-height:400px;object-fit:cover;border-radius:8px;">
    <h3 id="modal-title" style="margin-top:10px;"></h3>
    <p id="modal-date" style="color:#555;"></p>
    <p id="modal-explanation" style="margin-top:10px;"></p>
  </div>
`;
document.body.appendChild(modal);

// Open modal when an image is clicked
gallery.addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item) return;

  const img = item.querySelector('img');
  if (!img) return; // skip videos

  const title = item.querySelector('strong').textContent;
  const date = item.querySelector('br').nextSibling.textContent.trim();
  const explanation = item.querySelectorAll('p')[1].textContent;

  document.getElementById('modal-img').src = img.src;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-date').textContent = date;
  document.getElementById('modal-explanation').textContent = explanation;

  modal.style.display = 'flex';
});

// Close modal when clicking X or outside
document.addEventListener('click', (e) => {
  if (e.target.id === 'close-modal' || e.target.id === 'modal') {
    modal.style.display = 'none';
  }
});
