# Country Border Finder (Leaflet + OpenCage + GeoNames)

This web app allows users to:
- Geolocate their current position
- Identify the country they’re in using OpenCage's reverse geocoding API
- Display the country border using GeoJSON data and Leaflet
- Look up other countries manually by name and country code (GeoNames)

---

## 🌍 Tech Stack

- JavaScript (AJAX, jQuery)
- PHP (API calls + file handling)
- Leaflet (map display)
- OpenCage Geocoding API
- GeoNames API
- GeoJSON for country borders
- Bootstrap (upcoming)

---

## 🚀 How to Run Locally

1. **Clone or download the project**
2. **Start a local server (e.g. XAMPP or MAMP)**
3. **Set up your API key:**

Create the file:

```
php/config.php
```

Add this:

```php
<?php
define('OPENCAGE_API_KEY', 'your_api_key_here');
```

4. Open `index.html` in the browser via your local server (e.g. `http://localhost/camino/index.html`)

---

## 🛑 Do Not Track

Sensitive files are excluded via `.gitignore`:

- `php/config.php`
- `.DS_Store`


---

## 📦 Folder Structure

```
project-root/
├── index.html
├── script.js
├── style.css
├── php/
│   ├── getCountryFromCoords.php
│   ├── getCountryList.php
│   ├── getCities.php
│   ├── getCityInfo.php
│   └── config.php (not tracked)
├── data/
│   └── countryBorders.geo.json
```

---

## ✍️ Author

Amaia Artola  
Built as part of a portfolio/full-stack learning project.

