/* ══════════════════════════════════════════════════════════
   Spatial Tech — GIS & Remote Sensing Website
   Interactive JavaScript: Nav, Chat AI, Tabs, Code Tools
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ─── NAV SCROLL & HAMBURGER ─── */
const nav = document.getElementById('mainNav');
const navLinks = document.getElementById('navLinks');
const navHamburger = document.getElementById('navHamburger');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

/* ─── SESSION: DISPLAY USER IN NAV ─── */
(function initUserBadge() {
  const SESSION_KEY = 'spatialtech_session';
  const sess = window.__session ||
    JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || 'null');
  if (sess && sess.id) {
    const badge = document.getElementById('navUserBadge');
    if (badge) {
      badge.style.display = 'list-item';
      const firstName = sess.name ? sess.name.split(' ')[0] : 'User';
      const avatar    = sess.avatar || '👤';
      const role      = sess.role === 'admin' ? '🛡️ Administrator' : '👤 Member';

      // Nav trigger
      document.getElementById('navUserAvatar').textContent = avatar;
      document.getElementById('navUserName').textContent   = firstName;

      // Dropdown info
      const da = document.getElementById('navDropdownAvatar');
      const dn = document.getElementById('navDropdownName');
      const dr = document.getElementById('navDropdownRole');
      if (da) da.textContent = avatar;
      if (dn) dn.textContent = sess.name || 'User';
      if (dr) dr.textContent = role;
    }
  }
})();

/* ─── USER DROPDOWN TOGGLE ─── */
function toggleUserDropdown() {
  const dropdown = document.getElementById('navUserDropdown');
  const chevron  = document.getElementById('navUserChevron');
  if (!dropdown) return;
  const isOpen = dropdown.classList.toggle('open');
  if (chevron) chevron.classList.toggle('open', isOpen);
}

// Close dropdown when clicking anywhere outside
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('navUserBadge');
  if (wrap && !wrap.contains(e.target)) {
    const dropdown = document.getElementById('navUserDropdown');
    const chevron  = document.getElementById('navUserChevron');
    if (dropdown) dropdown.classList.remove('open');
    if (chevron)  chevron.classList.remove('open');
  }
});

function logoutUser() {
  const SESSION_KEY = 'spatialtech_session';
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

/* ─── THEME TOGGLE (DARK / LIGHT MODE) ─── */
(function initTheme() {
  const saved = localStorage.getItem('spatialtech_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('spatialtech_theme', next);
}


navHamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const open = navLinks.classList.contains('open');
  navHamburger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── ACTIVE NAV LINKS ON SCROLL ─── */
const sections = document.querySelectorAll('section[id], div[id]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

/* ─── KNOWLEDGE CARD EXPAND ─── */
function toggleExpand(btn) {
  const content = btn.nextElementSibling;
  const isOpen = content.classList.contains('open');
  content.classList.toggle('open', !isOpen);
  // Update button text/icon
  if (!isOpen) {
    btn.innerHTML = 'Show Less ↑';
    setTimeout(() => content.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
  } else {
    btn.innerHTML = 'Explore More ↓';
  }
}

/* ─── TECHNOLOGY TABS ─── */
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

/* ─── CODE TOOL FILTER ─── */
function filterTools(lang, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tool-card').forEach(card => {
    if (lang === 'all' || card.dataset.lang === lang) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ─── COPY CODE ─── */
function copyCode(btn) {
  const code = btn.closest('.tool-card').querySelector('code');
  if (!code) return;
  navigator.clipboard.writeText(code.textContent).then(() => {
    btn.textContent = '✅';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = code.textContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅';
    setTimeout(() => { btn.textContent = '📋'; }, 2000);
  });
}

/* ─── CHAT AUTO-RESIZE ─── */
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

/* ─── CHAT KEYBOARD HANDLER ─── */
function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

/* ─── GEO KNOWLEDGE BASE ─── */
const geoKnowledgeBase = [

  /* ════════════════════════════════════════════
     CODE SCRIPT ENTRIES — returned when user
     asks for code / scripts / examples
     ════════════════════════════════════════════ */

  // ── NDVI PYTHON SCRIPT ──
  {
    patterns: ['ndvi code', 'ndvi python', 'python ndvi', 'code for ndvi', 'script for ndvi', 'ndvi script', 'write ndvi', 'ndvi calculation code', 'give ndvi code', 'ndvi rasterio', 'calculate ndvi python'],
    answer: `**NDVI Calculation — Full Python Script**

\`\`\`python
import rasterio
import numpy as np
import matplotlib.pyplot as plt

def calculate_ndvi(red_path, nir_path, output_path=None):
    """
    Calculate NDVI from Red and NIR band raster files.
    NDVI = (NIR - Red) / (NIR + Red)
    
    Args:
        red_path   : Path to Red band raster (e.g., Landsat Band 4 or Sentinel-2 B04)
        nir_path   : Path to NIR band raster (e.g., Landsat Band 5 or Sentinel-2 B08)
        output_path: Optional path to save NDVI GeoTIFF
    Returns:
        ndvi (numpy array)
    """
    with rasterio.open(red_path) as red_ds:
        red   = red_ds.read(1).astype(np.float32)
        meta  = red_ds.meta.copy()

    with rasterio.open(nir_path) as nir_ds:
        nir = nir_ds.read(1).astype(np.float32)

    # Avoid division by zero
    np.seterr(divide='ignore', invalid='ignore')
    ndvi = np.where((nir + red) == 0, 0, (nir - red) / (nir + red))

    print(f"NDVI Stats → Min: {ndvi.min():.4f}  Max: {ndvi.max():.4f}  Mean: {ndvi.mean():.4f}")

    if output_path:
        meta.update(dtype='float32', count=1, nodata=-9999)
        with rasterio.open(output_path, 'w', **meta) as dst:
            dst.write(ndvi.astype(np.float32), 1)
        print(f"Saved: {output_path}")

    # Plot
    plt.figure(figsize=(10, 6))
    plt.imshow(ndvi, cmap='RdYlGn', vmin=-1, vmax=1)
    plt.colorbar(label='NDVI')
    plt.title('NDVI Map')
    plt.axis('off')
    plt.tight_layout()
    plt.show()

    return ndvi

# ── Usage ──
# For Sentinel-2 (use B04=Red, B08=NIR)
ndvi = calculate_ndvi(
    red_path='S2_B04_Red.tif',
    nir_path='S2_B08_NIR.tif',
    output_path='ndvi_output.tif'
)
\`\`\`

**Band Guide:**
| Satellite | Red Band | NIR Band |
|-----------|----------|----------|
| Landsat 8/9 | Band 4 | Band 5 |
| Sentinel-2  | Band 4 (B04) | Band 8 (B08) |
| MODIS       | Band 1 | Band 2 |

**Install:** \`pip install rasterio numpy matplotlib\``
  },

  // ── GEE NDVI ──
  {
    patterns: ['gee ndvi', 'earth engine ndvi', 'ndvi gee code', 'google earth engine ndvi', 'gee ndvi code', 'ndvi javascript gee', 'ndvi sentinel gee'],
    answer: `**NDVI — Google Earth Engine JavaScript Script**

\`\`\`javascript
// ── GEE NDVI Script — Sentinel-2 ──

// 1. Define your Area of Interest (AOI)
var roi = ee.Geometry.Rectangle([77.0, 12.0, 78.5, 13.5]); // Karnataka, India
// Or draw your own polygon in the GEE Code Editor map

// 2. Load Sentinel-2 Surface Reflectance
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(roi)
  .filterDate('2024-01-01', '2024-04-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()  // Cloud-free composite
  .clip(roi);

// 3. Calculate NDVI
var ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI');

// 4. Visualize
var ndviVis = { min: -0.2, max: 0.8, palette: ['#d73027','#f46d43','#fee08b','#d9ef8b','#91cf60','#1a9850'] };
Map.centerObject(roi, 9);
Map.addLayer(ndvi, ndviVis, 'NDVI — Sentinel-2');

// 5. Add NDVI as a band to the image
var s2WithNDVI = s2.addBands(ndvi);

// 6. Time Series Chart
var chart = ui.Chart.image.series({
  imageCollection: ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(roi)
    .filterDate('2023-01-01', '2024-01-01')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
    .map(function(img){ return img.normalizedDifference(['B8','B4']).rename('NDVI'); }),
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 10,
  xProperty: 'system:time_start'
}).setOptions({ title: 'NDVI Time Series 2023', vAxis: { title: 'NDVI', minValue: -1, maxValue: 1 } });
print(chart);

// 7. Export to Drive
Export.image.toDrive({
  image: ndvi,
  description: 'NDVI_Sentinel2',
  folder: 'GEE_Exports',
  region: roi,
  scale: 10,
  fileFormat: 'GeoTIFF'
});
\`\`\`

**Run:** Paste into [code.earthengine.google.com](https://code.earthengine.google.com) and click **Run**.`
  },

  // ── FLOOD MAPPING SAR ──
  {
    patterns: ['flood mapping code', 'sar flood code', 'flood detection code', 'flood python', 'flood gee', 'sentinel-1 flood', 'sar flood script', 'flood mapping script', 'write flood code'],
    answer: `**SAR Flood Mapping — Google Earth Engine Script**

\`\`\`javascript
// ── Sentinel-1 SAR Flood Detection ──

// 1. Study Area (example: Bangladesh)
var geometry = ee.Geometry.Rectangle([88.0, 22.5, 92.5, 25.5]);
Map.centerObject(geometry, 7);

// 2. Helper: Load & process Sentinel-1
function getS1(startDate, endDate) {
  return ee.ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(geometry)
    .filterDate(startDate, endDate)
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
    .filter(ee.Filter.eq('instrumentMode', 'IW'))
    .select('VV')
    .map(function(img) {
      return img.focal_mean(50, 'circle', 'meters'); // Speckle filter
    })
    .mean()
    .clip(geometry);
}

// 3. Before-flood and During-flood images
var before = getS1('2024-05-01', '2024-06-01');
var after  = getS1('2024-07-15', '2024-08-15');

// 4. Detect flood (SAR backscatter drop > 3 dB)
var diff  = after.subtract(before);
var flood = diff.lt(-3);  // >3dB decrease = likely flood

// 5. Remove permanent water using JRC data
var permanentWater = ee.Image('JRC/GSW1_4/GlobalSurfaceWater')
  .select('seasonality').gte(10);
var floodMasked = flood.where(permanentWater, 0);

// 6. Visualize
Map.addLayer(before, {min:-25, max:0}, 'SAR Before', false);
Map.addLayer(after,  {min:-25, max:0}, 'SAR After',  false);
Map.addLayer(floodMasked.updateMask(floodMasked),
  {palette:['#0000FF']}, 'Flood Extent');

// 7. Calculate flooded area
var area = floodMasked.multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: geometry,
    scale: 10,
    maxPixels: 1e10
  });
print('Flooded Area (m²):', area.get('VV'));
print('Flooded Area (km²):', ee.Number(area.get('VV')).divide(1e6));

// 8. Export
Export.image.toDrive({
  image: floodMasked.toFloat(),
  description: 'Flood_Extent_SAR',
  folder: 'GEE_Exports',
  region: geometry,
  scale: 10
});
\`\`\``
  },

  // ── LULC CLASSIFICATION PYTHON ──
  {
    patterns: ['lulc code', 'land use classification code', 'random forest classification code', 'land cover python', 'lulc python', 'classification script', 'write lulc code', 'python classification code', 'rf classification gis', 'sklearn classification satellite'],
    answer: `**LULC Random Forest Classification — Full Python Script**

\`\`\`python
import numpy as np
import rasterio
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, cohen_kappa_score
import matplotlib.pyplot as plt
import seaborn as sns

def classify_lulc(image_path, training_csv, output_path, n_estimators=150):
    """
    Random Forest LULC Classification from multiband raster.
    
    Args:
        image_path    : Multiband GeoTIFF (e.g., Sentinel-2 6-band composite)
        training_csv  : CSV with columns [B1, B2, ..., Bn, Label]
        output_path   : Output classified GeoTIFF path
        n_estimators  : Number of RF trees (default 150)
    """
    print("Loading image...")
    with rasterio.open(image_path) as src:
        img   = src.read().astype(np.float32)   # (bands, rows, cols)
        meta  = src.meta.copy()
        n_bands, n_rows, n_cols = img.shape

    # Reshape for sklearn: (n_pixels, n_bands)
    X_all = img.reshape(n_bands, -1).T

    print("Loading training data...")
    df = pd.read_csv(training_csv)
    X  = df.drop('Label', axis=1).values
    y  = df['Label'].values

    print(f"Training samples: {len(y)} | Classes: {np.unique(y)}")

    # Stratified train/test split
    X_tr, X_val, y_tr, y_val = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    print(f"Training RF with {n_estimators} trees...")
    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_features='sqrt',
        n_jobs=-1,
        random_state=42,
        oob_score=True
    )
    clf.fit(X_tr, y_tr)

    # Validation
    y_pred = clf.predict(X_val)
    print("\\n── Accuracy Report ──")
    print(classification_report(y_val, y_pred))
    print(f"OOB Score  : {clf.oob_score_:.4f}")
    print(f"Kappa      : {cohen_kappa_score(y_val, y_pred):.4f}")

    # Confusion matrix plot
    cm = confusion_matrix(y_val, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title('Confusion Matrix')
    plt.ylabel('Actual'); plt.xlabel('Predicted')
    plt.tight_layout(); plt.show()

    # Feature importance
    importance = pd.Series(clf.feature_importances_,
                            index=[f'Band_{i+1}' for i in range(n_bands)])
    print("\\n── Feature Importance ──")
    print(importance.sort_values(ascending=False))

    # Classify full image
    print("\\nClassifying full image...")
    classified = clf.predict(X_all).reshape(n_rows, n_cols)

    # Save result
    meta.update(dtype='uint8', count=1, nodata=0)
    with rasterio.open(output_path, 'w', **meta) as dst:
        dst.write(classified.astype(np.uint8), 1)
    print(f"\\nSaved: {output_path}")
    return clf, classified

# ── Usage ──
clf, result = classify_lulc(
    image_path='sentinel2_composite.tif',
    training_csv='training_samples.csv',
    output_path='lulc_classified.tif',
    n_estimators=150
)
\`\`\`

**Install:** \`pip install rasterio numpy pandas scikit-learn matplotlib seaborn\``
  },

  // ── BATCH REPROJECT ──
  {
    patterns: ['reproject code', 'reproject python', 'batch reproject', 'change crs python', 'convert crs code', 'python crs change', 'write reproject script', 'rasterio reproject'],
    answer: `**Batch Reproject Rasters — Python Script**

\`\`\`python
import os
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from pathlib import Path

def reproject_raster(src_path, dst_path, target_crs='EPSG:4326',
                     resampling=Resampling.bilinear):
    """Reproject a single raster to target CRS."""
    with rasterio.open(src_path) as src:
        transform, width, height = calculate_default_transform(
            src.crs, target_crs, src.width, src.height, *src.bounds
        )
        meta = src.meta.copy()
        meta.update(crs=target_crs, transform=transform,
                    width=width, height=height)

        with rasterio.open(dst_path, 'w', **meta) as dst:
            for band_idx in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, band_idx),
                    destination=rasterio.band(dst, band_idx),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs=target_crs,
                    resampling=resampling
                )

def batch_reproject(input_folder, output_folder, target_crs='EPSG:4326',
                    ext='.tif'):
    """Batch reproject all rasters in a folder."""
    inp  = Path(input_folder)
    out  = Path(output_folder)
    out.mkdir(parents=True, exist_ok=True)

    files = list(inp.glob(f'*{ext}'))
    print(f"Found {len(files)} {ext} files")

    for f in files:
        dst = out / f'reproj_{f.name}'
        print(f"  Reprojecting: {f.name} → {target_crs}")
        reproject_raster(str(f), str(dst), target_crs)
        print(f"  ✓ Saved: {dst.name}")

    print("\\nDone! All files reprojected.")

# ── Usage ──
# Single file
reproject_raster('input.tif', 'output_wgs84.tif', 'EPSG:4326')

# Batch folder
batch_reproject(
    input_folder='./raw_rasters',
    output_folder='./reprojected',
    target_crs='EPSG:32643'  # UTM Zone 43N (Central India)
)
\`\`\`

**Common EPSG codes:** \`EPSG:4326\` WGS84 · \`EPSG:3857\` Web Mercator · \`EPSG:32643\` UTM 43N`
  },

  // ── SHAPEFILE VECTOR OPS ──
  {
    patterns: ['geopandas code', 'shapefile python', 'vector gis python', 'clip shapefile code', 'dissolve code', 'buffer python gis', 'python spatial join', 'geopandas script', 'write geopandas code', 'vector analysis python'],
    answer: `**GeoPandas Vector Analysis — Complete Script**

\`\`\`python
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point, Polygon
import matplotlib.pyplot as plt

# ── 1. Load & Inspect ──
gdf = gpd.read_file('districts.shp')
print(f"CRS: {gdf.crs}  |  Features: {len(gdf)}  |  Columns: {list(gdf.columns)}")

# ── 2. Reproject ──
gdf_utm = gdf.to_crs('EPSG:32643')   # UTM Zone 43N for India

# ── 3. Buffer (500m around features) ──
gdf_buf = gdf_utm.copy()
gdf_buf['geometry'] = gdf_utm.buffer(500)
gdf_buf.to_file('districts_buffer_500m.shp')

# ── 4. Dissolve by attribute ──
dissolved = gdf_utm.dissolve(by='STATE_NAME', aggfunc='sum').reset_index()
dissolved.to_file('states_dissolved.shp')
print(f"Dissolved: {len(dissolved)} states")

# ── 5. Clip vector by polygon ──
study_area = gpd.read_file('study_area.shp').to_crs(gdf_utm.crs)
clipped = gpd.clip(gdf_utm, study_area)
clipped.to_file('districts_clipped.shp')

# ── 6. Spatial Join (points in polygons) ──
points = gpd.read_file('sample_points.shp').to_crs(gdf_utm.crs)
joined = gpd.sjoin(points, gdf_utm[['STATE_NAME','geometry']],
                   how='left', predicate='within')
print(joined[['STATE_NAME']].value_counts())

# ── 7. Calculate area (sq km) ──
gdf_utm['area_km2'] = gdf_utm.area / 1e6
print(gdf_utm[['NAME','area_km2']].sort_values('area_km2', ascending=False).head())

# ── 8. Export to GeoJSON ──
dissolved.to_crs('EPSG:4326').to_file('states.geojson', driver='GeoJSON')

# ── 9. Plot ──
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
gdf.plot(ax=axes[0], column='POPULATION', cmap='YlOrRd', legend=True)
axes[0].set_title('Population Distribution')
clipped.plot(ax=axes[1], color='lightblue', edgecolor='navy')
axes[1].set_title('Study Area — Clipped')
plt.tight_layout()
plt.savefig('vector_analysis.png', dpi=150)
plt.show()
\`\`\`

**Install:** \`pip install geopandas shapely matplotlib\``
  },

  // ── LEAFLET WEB MAP ──
  {
    patterns: ['leaflet code', 'leaflet map code', 'web map code', 'javascript map code', 'interactive map code', 'write leaflet', 'html map code', 'leaflet script', 'webmap javascript'],
    answer: `**Interactive Leaflet Web Map — Complete HTML+JS**

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GIS Web Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: sans-serif; }
    #map { height: 100vh; }
    #info { position: absolute; top: 10px; left: 60px; z-index: 1000;
            background: rgba(0,0,0,0.75); color: #fff; padding: 8px 14px;
            border-radius: 8px; font-size: 13px; }
  </style>
</head>
<body>
<div id="map"></div>
<div id="info">Click the map to get coordinates</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  // 1. Initialize map (centered on India)
  const map = L.map('map').setView([20.5937, 78.9629], 5);

  // 2. Basemap layers
  const basemaps = {
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }),
    'Satellite': L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri' }
    ),
    'Terrain': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap'
    })
  };
  basemaps['OpenStreetMap'].addTo(map);

  // 3. Layer control
  L.control.layers(basemaps, {}, { collapsed: false }).addTo(map);

  // 4. Scale bar
  L.control.scale({ metric: true, imperial: false }).addTo(map);

  // 5. Click coordinates
  map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    document.getElementById('info').innerHTML =
      \`Lat: \${lat.toFixed(5)} | Lng: \${lng.toFixed(5)}\`;
    L.popup()
      .setLatLng(e.latlng)
      .setContent(\`<b>📍 Location</b><br>Lat: \${lat.toFixed(5)}<br>Lng: \${lng.toFixed(5)}\`)
      .openOn(map);
  });

  // 6. Add marker with popup
  const marker = L.marker([28.6139, 77.2090])
    .bindPopup('<b>🏛️ New Delhi</b><br>Capital of India')
    .addTo(map);

  // 7. Load GeoJSON (if you have a file)
  // fetch('data.geojson').then(r => r.json()).then(data => {
  //   L.geoJSON(data, {
  //     style: { color: '#3b82f6', weight: 2, fillOpacity: 0.3 },
  //     onEachFeature: (feature, layer) => {
  //       layer.bindPopup(JSON.stringify(feature.properties, null, 2));
  //     }
  //   }).addTo(map);
  // });
</script>
</body>
</html>
\`\`\`

Save as **map.html** and open in browser. No server needed!`
  },

  // ── GDAL CLI ──
  {
    patterns: ['gdal code', 'gdal commands', 'gdal script', 'gdal python', 'gdal cli', 'give gdal commands', 'raster conversion code', 'gdal bash', 'write gdal'],
    answer: `**Essential GDAL Commands & Python Script**

**Command Line (CLI):**
\`\`\`bash
# ── Raster Info ──
gdalinfo input.tif                              # Inspect raster
gdalinfo -stats input.tif                       # With statistics

# ── Reproject ──
gdalwarp -t_srs EPSG:4326 input.tif output.tif              # To WGS84
gdalwarp -t_srs EPSG:32643 -r bilinear input.tif utm43n.tif  # To UTM 43N

# ── Clip by shapefile ──
gdalwarp -cutline boundary.shp -crop_to_cutline input.tif clipped.tif

# ── Resample ──
gdalwarp -tr 10 10 -r bilinear input_30m.tif output_10m.tif  # 30m → 10m

# ── Convert format ──
gdal_translate -of GTiff input.img output.tif
gdal_translate -of COG -co COMPRESS=LZW input.tif output_cog.tif

# ── Band stack ──
gdal_merge.py -separate -o stacked.tif red.tif green.tif blue.tif nir.tif

# ── Vector ──
ogr2ogr -f GeoJSON output.geojson input.shp        # SHP → GeoJSON
ogr2ogr -t_srs EPSG:32643 output_utm.shp input.shp # Reproject SHP
ogrinfo -al -so input.shp                          # Vector info
\`\`\`

**Python with GDAL (osgeo):**
\`\`\`python
from osgeo import gdal, ogr, osr

# Open raster
ds = gdal.Open('input.tif')
band = ds.GetRasterBand(1)
data = band.ReadAsArray()
nodata = band.GetNoDataValue()
print(f"Shape: {data.shape}, NoData: {nodata}")
print(f"Min: {data.min()}, Max: {data.max()}")

# Get projection
proj = ds.GetProjection()
gt   = ds.GetGeoTransform()  # (xmin, xres, 0, ymax, 0, -yres)
print(f"Origin: ({gt[0]:.4f}, {gt[3]:.4f}), Pixel size: {gt[1]:.4f}")

ds = None  # Close

# Reproject programmatically
gdal.Warp('output_wgs84.tif', 'input.tif',
          dstSRS='EPSG:4326', resampleAlg='bilinear')
print("Done!")
\`\`\`

**Install:** \`conda install -c conda-forge gdal\` (recommended)`
  },

  // ── PYTHON GIS FULL WORKFLOW ──
  {
    patterns: ['gis python code', 'python gis script', 'full gis workflow', 'complete gis script', 'python geospatial code', 'python remote sensing code', 'python satellite analysis', 'rasterio python code'],
    answer: `**Complete GIS & Remote Sensing Python Workflow**

\`\`\`python
# ── Full Python GIS Analysis Pipeline ──
import numpy as np
import rasterio
from rasterio.mask import mask
import geopandas as gpd
from shapely.geometry import mapping
import matplotlib.pyplot as plt

# ── Step 1: Clip Raster by Vector Boundary ──
def clip_raster_by_vector(raster_path, vector_path, output_path):
    gdf = gpd.read_file(vector_path)
    with rasterio.open(raster_path) as src:
        # Reproject vector to match raster CRS
        gdf = gdf.to_crs(src.crs)
        shapes = [mapping(geom) for geom in gdf.geometry]
        out_image, out_transform = mask(src, shapes, crop=True, nodata=-9999)
        meta = src.meta.copy()
        meta.update(height=out_image.shape[1], width=out_image.shape[2],
                    transform=out_transform, nodata=-9999)
        with rasterio.open(output_path, 'w', **meta) as dst:
            dst.write(out_image)
    print(f"Clipped raster saved: {output_path}")
    return output_path

# ── Step 2: Compute Spectral Indices ──
def compute_indices(b4, b3, b8, b11):
    """Compute NDVI, NDWI, NDBI from Sentinel-2 bands."""
    np.seterr(divide='ignore', invalid='ignore')
    ndvi = np.where((b8+b4)==0, 0, (b8-b4)/(b8+b4))   # Vegetation
    ndwi = np.where((b3+b8)==0, 0, (b3-b8)/(b3+b8))   # Water
    ndbi = np.where((b11+b8)==0, 0, (b11-b8)/(b11+b8)) # Built-up
    return ndvi, ndwi, ndbi

# ── Step 3: Zonal Statistics ──
def zonal_stats(raster_path, vector_path, stat='mean'):
    """Calculate zonal statistics for each feature."""
    from rasterstats import zonal_stats as zs
    gdf = gpd.read_file(vector_path)
    with rasterio.open(raster_path) as src:
        gdf = gdf.to_crs(src.crs)
        stats = zs(gdf, src.read(1), affine=src.transform,
                   stats=[stat, 'min', 'max', 'std'], nodata=src.nodata)
    gdf['zonal_mean'] = [s['mean'] for s in stats]
    return gdf

# ── Step 4: Full Run ──
if __name__ == '__main__':
    # Load multiband image
    with rasterio.open('sentinel2_bands.tif') as src:
        bands = src.read().astype(np.float32)

    b3,b4,b8,b11 = bands[2], bands[3], bands[7], bands[10]  # Sentinel-2
    ndvi, ndwi, ndbi = compute_indices(b4, b3, b8, b11)

    # Plot indices
    fig, axs = plt.subplots(1, 3, figsize=(15, 4))
    for ax, arr, title, cmap in zip(axs, [ndvi,ndwi,ndbi],
                                     ['NDVI','NDWI','NDBI'],
                                     ['RdYlGn','RdYlBu','RdPu']):
        im = ax.imshow(arr, cmap=cmap, vmin=-1, vmax=1)
        ax.set_title(title); ax.axis('off')
        plt.colorbar(im, ax=ax, shrink=0.8)
    plt.tight_layout()
    plt.savefig('indices_map.png', dpi=150, bbox_inches='tight')
    plt.show()
    print("Analysis complete!")
\`\`\`

**Install:** \`pip install rasterio geopandas numpy matplotlib rasterstats\``
  },

  // ── PostGIS SQL ──
  {
    patterns: ['postgis', 'postgis code', 'spatial sql', 'postgis query', 'postgresql gis', 'spatial database code', 'postgis script', 'spatial query code'],
    answer: `**PostGIS Spatial SQL — Essential Queries**

\`\`\`sql
-- ── PostGIS Setup ──
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- ── 1. Create a spatial table ──
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    population INTEGER,
    geom GEOMETRY(Point, 4326)  -- WGS84 lat/lon
);
CREATE INDEX idx_cities_geom ON cities USING GIST(geom);

-- ── 2. Insert features ──
INSERT INTO cities (name, population, geom) VALUES
  ('Delhi',   32941000, ST_GeomFromText('POINT(77.2090 28.6139)', 4326)),
  ('Mumbai',  20667656, ST_GeomFromText('POINT(72.8777 19.0760)', 4326)),
  ('Chennai', 10971108, ST_GeomFromText('POINT(80.2707 13.0827)', 4326));

-- ── 3. Find cities within 500 km of a point ──
SELECT name, population,
  ROUND(ST_Distance(
    geom::geography,
    ST_GeomFromText('POINT(78.9629 20.5937)', 4326)::geography
  ) / 1000, 2) AS distance_km
FROM cities
WHERE ST_DWithin(
  geom::geography,
  ST_GeomFromText('POINT(78.9629 20.5937)', 4326)::geography,
  500000  -- 500 km in meters
)
ORDER BY distance_km;

-- ── 4. Buffer analysis (1 km buffer around cities) ──
SELECT name, ST_Buffer(geom::geography, 1000)::geometry AS buffer_geom
FROM cities;

-- ── 5. Spatial join — points in polygon ──
SELECT p.name, r.state_name
FROM points p
JOIN regions r ON ST_Within(p.geom, r.geom);

-- ── 6. Area calculation (sq km) ──
SELECT name,
  ROUND((ST_Area(geom::geography) / 1e6)::numeric, 2) AS area_km2
FROM polygons_table
ORDER BY area_km2 DESC;

-- ── 7. Nearest neighbour ──
SELECT a.name, b.name AS nearest_city,
  ST_Distance(a.geom::geography, b.geom::geography) / 1000 AS km
FROM cities a
CROSS JOIN LATERAL (
  SELECT name, geom FROM cities
  WHERE id != a.id
  ORDER BY a.geom <-> geom
  LIMIT 1
) b;

-- ── 8. Convert to GeoJSON ──
SELECT json_build_object(
  'type', 'FeatureCollection',
  'features', json_agg(ST_AsGeoJSON(t.*)::json)
) FROM cities AS t;
\`\`\`

**Connect Python to PostGIS:**
\`\`\`python
import geopandas as gpd
from sqlalchemy import create_engine

engine = create_engine('postgresql://user:password@localhost:5432/gisdb')
gdf = gpd.read_postgis("SELECT * FROM cities", engine, geom_col='geom')
print(gdf)
\`\`\``
  },

  // ── CHANGE DETECTION ──
  {
    patterns: ['change detection code', 'change detection python', 'change detection gee', 'land cover change', 'change analysis code', 'before after comparison code', 'ndvi change code'],
    answer: `**Change Detection — Python Script**

\`\`\`python
import numpy as np
import rasterio
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

def detect_change(img_before_path, img_after_path, threshold=0.15,
                   output_path='change_map.tif'):
    """
    Raster-based change detection using image differencing.
    Works for NDVI, NDWI, or any single-band index.
    
    Args:
        img_before_path: Before image path (GeoTIFF)
        img_after_path : After image path (GeoTIFF)
        threshold      : Change threshold (e.g. 0.15 for NDVI)
        output_path    : Output change map path
    """
    with rasterio.open(img_before_path) as src:
        before = src.read(1).astype(np.float32)
        meta   = src.meta.copy()
        nodata = src.nodata

    with rasterio.open(img_after_path) as src:
        after = src.read(1).astype(np.float32)

    # Mask nodata
    if nodata is not None:
        mask = (before == nodata) | (after == nodata)
    else:
        mask = np.zeros(before.shape, dtype=bool)

    diff = after - before  # Positive = gain, Negative = loss

    # Classify change
    change = np.zeros(diff.shape, dtype=np.int8)
    change[diff >  threshold] = 1   # Gain / increase
    change[diff < -threshold] = -1  # Loss / decrease
    change[mask] = 0

    # Statistics
    gain  = np.sum(change == 1)
    loss  = np.sum(change == -1)
    total = before.size
    print(f"Gain pixels  : {gain:,}  ({gain/total*100:.1f}%)")
    print(f"Loss pixels  : {loss:,}  ({loss/total*100:.1f}%)")
    print(f"No change    : {np.sum(change==0):,} ({np.sum(change==0)/total*100:.1f}%)")

    # Save
    meta.update(dtype='int8', count=1, nodata=0)
    with rasterio.open(output_path, 'w', **meta) as dst:
        dst.write(change, 1)

    # Visualize
    cmap = ListedColormap(['#d73027','#f7f7f7','#1a9850'])
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    axes[0].imshow(before, cmap='RdYlGn', vmin=-1, vmax=1)
    axes[0].set_title('Before')
    axes[1].imshow(after,  cmap='RdYlGn', vmin=-1, vmax=1)
    axes[1].set_title('After')
    im = axes[2].imshow(change, cmap=cmap, vmin=-1, vmax=1)
    axes[2].set_title('Change Map')
    for ax in axes: ax.axis('off')
    plt.colorbar(im, ax=axes[2], ticks=[-1,0,1],
                 label='Loss | No Change | Gain')
    plt.tight_layout()
    plt.savefig('change_detection.png', dpi=150)
    plt.show()
    return change

# ── Usage (NDVI Change) ──
change = detect_change(
    img_before_path='ndvi_2020.tif',
    img_after_path='ndvi_2024.tif',
    threshold=0.15,
    output_path='ndvi_change_2020_2024.tif'
)
\`\`\``
  },

  // ── DEM ANALYSIS ──
  {
    patterns: ['dem analysis', 'dem python code', 'slope aspect code', 'terrain analysis code', 'elevation analysis python', 'hillshade code', 'dem script'],
    answer: `**DEM Terrain Analysis — Python Script**

\`\`\`python
import numpy as np
import rasterio
from rasterio.transform import from_bounds
import matplotlib.pyplot as plt

def terrain_analysis(dem_path, output_prefix='terrain'):
    """
    Compute slope, aspect, and hillshade from a DEM.
    
    Args:
        dem_path       : Path to Digital Elevation Model (GeoTIFF)
        output_prefix  : Prefix for output files
    """
    with rasterio.open(dem_path) as src:
        dem   = src.read(1).astype(np.float32)
        meta  = src.meta.copy()
        res_x = src.res[0]  # Pixel size in X
        res_y = src.res[1]  # Pixel size in Y

    nodata = meta.get('nodata', -9999)
    dem[dem == nodata] = np.nan

    print(f"DEM Stats → Min: {np.nanmin(dem):.1f}m  Max: {np.nanmax(dem):.1f}m  "
          f"Mean: {np.nanmean(dem):.1f}m")

    # ── Slope ──
    dy, dx = np.gradient(dem, res_y, res_x)
    slope  = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))

    # ── Aspect ──
    aspect = np.degrees(np.arctan2(-dx, dy)) % 360

    # ── Hillshade ──
    azimuth  = 315.0  # NW light source
    altitude = 45.0   # 45° sun elevation
    az_rad   = np.deg2rad(360.0 - azimuth + 90)
    alt_rad  = np.deg2rad(altitude)
    hillshade = (np.cos(alt_rad) * np.cos(np.deg2rad(slope)) +
                 np.sin(alt_rad) * np.sin(np.deg2rad(slope)) *
                 np.cos(az_rad - np.deg2rad(aspect)))
    hillshade = np.clip(hillshade * 255, 0, 255).astype(np.uint8)

    # ── Save outputs ──
    meta.update(dtype='float32', count=1, nodata=-9999)
    for arr, name in [(slope, 'slope'), (aspect, 'aspect')]:
        out = arr.copy(); out[np.isnan(dem)] = -9999
        with rasterio.open(f'{output_prefix}_{name}.tif', 'w', **meta) as dst:
            dst.write(out.astype(np.float32), 1)
        print(f"Saved: {output_prefix}_{name}.tif")

    meta.update(dtype='uint8', nodata=0)
    with rasterio.open(f'{output_prefix}_hillshade.tif', 'w', **meta) as dst:
        dst.write(hillshade, 1)
    print(f"Saved: {output_prefix}_hillshade.tif")

    # ── Plot ──
    fig, axs = plt.subplots(2, 2, figsize=(12, 10))
    axs[0,0].imshow(dem, cmap='terrain'); axs[0,0].set_title('DEM (Elevation)')
    axs[0,1].imshow(slope, cmap='YlOrRd', vmin=0, vmax=60); axs[0,1].set_title('Slope (°)')
    axs[1,0].imshow(aspect, cmap='hsv', vmin=0, vmax=360); axs[1,0].set_title('Aspect (°)')
    axs[1,1].imshow(hillshade, cmap='gray'); axs[1,1].set_title('Hillshade')
    for ax in axs.flat: ax.axis('off')
    plt.tight_layout()
    plt.savefig('terrain_analysis.png', dpi=150)
    plt.show()
    return slope, aspect, hillshade

# ── Usage ──
slope, aspect, hs = terrain_analysis('srtm_dem.tif', 'terrain_output')
\`\`\``
  },

  // GIS vs RS concepts at top
  {
    patterns: ['difference between gis', 'gis vs remote sensing', 'gis and remote sensing different', 'what is gis', 'what is remote sensing'],
    answer: `**GIS (Geographic Information Systems)** and **Remote Sensing** are closely related but distinct disciplines:

**GIS** is a framework for capturing, storing, manipulating, analyzing, and presenting spatial and geographic data. It integrates maps with databases to analyze patterns and relationships.
- Focus: Data management, spatial analysis, visualization
- Tools: ArcGIS, QGIS, PostGIS
- Data types: Vectors (points, lines, polygons) and rasters

**Remote Sensing** is the science of acquiring information about Earth's surface using sensors that are not in direct contact — typically satellites or aircraft.
- Focus: Image acquisition, processing, and interpretation
- Tools: ENVI, SNAP, Google Earth Engine
- Data types: Satellite imagery, aerial photos, LiDAR

🔗 **How they work together:** Remote sensing provides the raw imagery data, which is then brought into a GIS for spatial analysis, map making, and decision support.

**Example workflow:** Sentinel-2 satellite captures imagery (Remote Sensing) → NDVI is calculated → Vegetation map is created and analyzed in QGIS (GIS).`
  },
  // NDVI
  {
    patterns: ['ndvi', 'normalized difference vegetation', 'calculate ndvi', 'vegetation index', 'plant health'],
    answer: `**NDVI (Normalized Difference Vegetation Index)** is the most widely used vegetation index in remote sensing.

**Formula:**
\`\`\`
NDVI = (NIR - Red) / (NIR + Red)
\`\`\`

**Value ranges:**
| Value | Meaning |
|-------|---------|
| -1 to 0 | Water, bare soil, built-up |
| 0 to 0.2 | Sparse vegetation, bare soil |
| 0.2 to 0.5 | Moderate vegetation |
| 0.5 to 1.0 | Dense, healthy vegetation |

**Band assignments:**
- **Landsat 8/9:** Band 5 (NIR), Band 4 (Red)
- **Sentinel-2:** Band 8 (NIR), Band 4 (Red)
- **MODIS:** Band 2 (NIR), Band 1 (Red)

**Python code (rasterio):**
\`\`\`python
ndvi = (nir.astype(float) - red.astype(float)) / (nir + red)
\`\`\`

**Google Earth Engine:**
\`\`\`javascript
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
\`\`\`

**Applications:** Crop monitoring, drought assessment, deforestation mapping, biomass estimation, precision agriculture.`
  },
  // SAR
  {
    patterns: ['sar', 'synthetic aperture radar', 'radar remote sensing', 'sentinel-1', 'microwave'],
    answer: `**SAR (Synthetic Aperture Radar)** is an active microwave remote sensing technology that is independent of weather and sunlight. 

**How it works:**
1. Sensor emits microwave pulses toward Earth
2. Backscattered energy is recorded
3. Satellite motion is used to synthesize a large antenna — enabling fine spatial resolution

**Key advantages of SAR:**
- ☁️ **All-weather:** Penetrates clouds, rain, and smoke
- 🌙 **Day & Night:** Active sensor, doesn't need sunlight
- 🌊 **Penetration:** L-band penetrates vegetation; C-band is sensitive to surface roughness

**Sentinel-1 SAR:**
- C-band (5.6 cm wavelength)
- Dual polarization: VV + VH
- 5-day revisit at equator
- Free and open access

**Polarizations:**
- **VV:** Surface roughness, urban structures
- **VH:** Vegetation structure, soil moisture
- **HH:** Ice, ocean

**Applications:** Flood mapping, subsidence monitoring (InSAR), crop type classification, ship detection, glacier dynamics, forest biomass.

**Key tools:** ESA SNAP, GAMMA, SARSCAPE, Google Earth Engine.`
  },
  // DEM DSM DTM
  {
    patterns: ['dem', 'dsm', 'dtm', 'digital elevation model', 'terrain model', 'surface model'],
    answer: `**DEM, DSM, and DTM** are all digital elevation representations but capture different things:

| Model | Full Name | What it represents |
|-------|-----------|-------------------|
| **DEM** | Digital Elevation Model | Generic term — can refer to DSM or DTM |
| **DSM** | Digital Surface Model | Top of everything (buildings, trees, infrastructure) |
| **DTM** | Digital Terrain Model | Bare earth surface (vegetation and buildings removed) |

**Visualization:**
\`\`\`
DSM:  ▲ building top  🌳 tree top
DTM:  ___ground level_______________
\`\`\`

**Key Difference:** 
- **DSM - DTM = nDSM** (normalized DSM = height above ground)
- nDSM is used to extract vegetation height, building heights

**Common Sources:**
- **SRTM:** 30m global DTM from NASA (radar-based)
- **ASTER GDEM:** 30m global from NASA/METI
- **Copernicus DEM:** 30m/90m from TanDEM-X
- **LiDAR:** Ground-based, sub-meter accuracy DTM/DSM
- **Drone SfM:** Site-specific, cm accuracy

**Applications:** Flood modeling, slope analysis, landslide susceptibility, viewshed analysis, orthorectification, volume calculations.`
  },
  // Coordinate Systems
  {
    patterns: ['coordinate system', 'projection', 'epsg', 'crs', 'wgs84', 'utm', 'convert coordinate'],
    answer: `**Coordinate Reference Systems (CRS)** define how spatial data relates to the real-world Earth.

**Two main types:**
1. **Geographic CRS (GCS)** — Uses latitude/longitude (angular units, degrees)
   - Most common: **WGS84 (EPSG:4326)** — used by GPS
2. **Projected CRS (PCS)** — Flat 2D plane (linear units, meters/feet)
   - Most common: **UTM** (Universal Transverse Mercator)

**When to use each:**
| Use Case | Recommended CRS |
|----------|----------------|
| Web maps / GPS data storage | WGS84 (EPSG:4326) |
| Area/distance calculations | UTM (EPSG:326XX) |
| India-specific work | WGS84 / UTM Zone 43N (EPSG:32643) |
| Global analysis | WGS84 or Web Mercator (EPSG:3857) |

**UTM zones for India:** Zone 42N–46N depending on longitude

**Python conversion with GeoPandas:**
\`\`\`python
import geopandas as gpd
gdf = gpd.read_file('data.shp')
gdf_utm = gdf.to_crs('EPSG:32643')   # Convert to UTM Zone 43N
gdf_wgs = gdf_utm.to_crs('EPSG:4326') # Back to WGS84
\`\`\`

**GDAL command:**
\`\`\`bash
gdalwarp -t_srs EPSG:32643 input.tif output_utm.tif
\`\`\``
  },
  // GEE
  {
    patterns: ['google earth engine', 'gee', 'earth engine', 'how to start gee', 'earthengine'],
    answer: `**Google Earth Engine (GEE)** is a cloud-based geospatial analysis platform with petabytes of freely available Earth observation data.

**Getting Started:**
1. **Sign up** at [earthengine.google.com](https://earthengine.google.com) — free for research/education
2. **Code Editor:** [code.earthengine.google.com](https://code.earthengine.google.com) (JavaScript)
3. **Python API:** Install \`earthengine-api\` via pip

**Key concepts:**
- \`ee.Image\` — Single raster image
- \`ee.ImageCollection\` — Time stack of images
- \`ee.Geometry\` — Spatial geometry (Point, Polygon)
- \`ee.FeatureCollection\` — Vector features
- \`ee.Reducer\` — Statistical operations

**Quick start (JavaScript):**
\`\`\`javascript
// Load Sentinel-2 and display NDVI
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2024-01-01', '2024-06-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median();

var ndvi = s2.normalizedDifference(['B8', 'B4']);
Map.addLayer(ndvi, {min:0, max:0.8, palette:['red','yellow','green']}, 'NDVI');
\`\`\`

**Best free resources:**
- [developers.google.com/earth-engine](https://developers.google.com/earth-engine)
- [spatialthoughts.com](https://spatialthoughts.com) — excellent GEE tutorials
- [geemap.org](https://geemap.org) — Python interface for GEE`
  },
  // Machine Learning
  {
    patterns: ['machine learning', 'deep learning', 'random forest', 'classification', 'cnn', 'satellite image classification', 'ml for gis'],
    answer: `**Machine Learning for Satellite Image Analysis** is a rapidly growing field offering powerful tools for automated feature extraction.

**Common ML Algorithms for Remote Sensing:**
| Algorithm | Best Use Case | Library |
|-----------|--------------|---------|
| **Random Forest** | LULC classification, multi-class | scikit-learn |
| **SVM** | Small training datasets, hyperspectral | scikit-learn |
| **XGBoost** | High accuracy, tabular spatial features | xgboost |
| **CNN (U-Net)** | Semantic segmentation, building detection | PyTorch, TensorFlow |
| **Vision Transformers** | Large-scale change detection | PyTorch |

**Typical LULC Workflow:**
\`\`\`python
from sklearn.ensemble import RandomForestClassifier
clf = RandomForestClassifier(n_estimators=100, n_jobs=-1)
clf.fit(X_train, y_train)  # X: spectral bands, y: class labels
classified = clf.predict(X_all_pixels)
\`\`\`

**Google Earth Engine ML:**
\`\`\`javascript
var classifier = ee.Classifier.smileRandomForest(100)
  .train(trainingData, 'class', bands);
var classified = image.classify(classifier);
\`\`\`

**Key considerations:**
- Always validate with separate test data (stratified split)
- Use overall accuracy, kappa coefficient, confusion matrix
- Collect representative training samples for each class
- Augment training data for deep learning (rotation, flip, crop)

**Pre-trained Geospatial Models:** Prithvi (IBM/NASA), RemoteCLIP, SkySense, GeoSAM`
  },
  // Photogrammetry
  {
    patterns: ['photogrammetry', 'drone mapping', 'sfm', 'structure from motion', 'uav', 'point cloud', 'orthophoto'],
    answer: `**Photogrammetry** is the science of making measurements from photographs. Modern **drone photogrammetry** using Structure from Motion (SfM) has revolutionized surveying.

**Drone Mapping Workflow:**
1. **Mission Planning** — Area, altitude, overlap (front 80%, side 70%), GSD
2. **GCPs** — Surveyed Ground Control Points for cm-accuracy georeferencing
3. **Data Collection** — Autonomous flight with nadiral/oblique cameras
4. **SfM Processing** — Software aligns images, builds dense point cloud
5. **Product Generation** — DEM/DSM, orthomosaic, 3D mesh, contours

**Key Accuracy Factors:**
- GCP distribution and quality (RTK/PPK helps)
- Image overlap and GSD (Ground Sample Distance)
- Flying altitude (lower = better resolution)
- Camera quality and shutter speed

**Popular Software:**
| Software | License | Specialty |
|----------|---------|-----------|
| **Agisoft Metashape** | Paid | Gold standard SfM/MVS |
| **Pix4D** | Paid/Subscription | Agriculture, engineering |
| **OpenDroneMap (ODM)** | Free/Open Source | Community driven |
| **DJI Terra** | Paid | DJI drone integration |
| **RealityCapture** | Paid | Speed + large datasets |

**GSD Formula:**
\`GSD (cm/pixel) = (Altitude × Sensor Width) / (Focal Length × Image Width)\`

**Output formats:** GeoTIFF orthophoto, LAZ point cloud, OBJ/FBX 3D mesh, DXF contours, KML/SHP boundaries.`
  },
  // Python GIS
  {
    patterns: ['python gis', 'geopandas', 'rasterio', 'shapely', 'python geospatial', 'python for gis'],
    answer: `**Python is the #1 language for GIS & Remote Sensing.** Here are the key libraries:

**Vector Analysis:**
\`\`\`python
import geopandas as gpd
gdf = gpd.read_file('roads.shp')
gdf_buffered = gdf.buffer(500)          # 500m buffer
clipped = gpd.clip(gdf, study_area)    # Clip to region
merged = gpd.sjoin(gdf1, gdf2, predicate='intersects')
\`\`\`

**Raster Processing:**
\`\`\`python
import rasterio
import numpy as np

with rasterio.open('dem.tif') as src:
    data = src.read(1)       # Read band 1
    transform = src.transform
    crs = src.crs
    nodata = src.nodata
\`\`\`

**Geometry Operations (Shapely):**
\`\`\`python
from shapely.geometry import Point, Polygon, LineString
pt = Point(77.5946, 12.9716)          # Bangalore
buf = pt.buffer(0.01)                 # ~1km buffer in degrees
poly = Polygon([(0,0),(1,0),(1,1),(0,1)])
\`\`\`

**Essential Library Stack:**
| Library | Purpose |
|---------|---------|
| GeoPandas | Vector data analysis |
| Rasterio | Raster reading/writing |
| Shapely | Geometry operations |
| Folium / Leafmap | Interactive maps |
| Geemap | Google Earth Engine Python |
| GDAL (osgeo) | Low-level raster/vector |
| Pyproj | Coordinate transformations |
| Matplotlib + Contextily | Static maps |

**Install:**
\`\`\`bash
pip install geopandas rasterio shapely folium geemap contextily
\`\`\``
  },
  // LULC Classification
  {
    patterns: ['lulc', 'land use', 'land cover', 'lulc classification', 'land use land cover'],
    answer: `**LULC (Land Use / Land Cover)** mapping is one of the most common remote sensing applications.

**The complete workflow:**

**1. Data Acquisition**
- Sentinel-2 (10m, 13 bands) or Landsat 8/9 (30m)
- Choose cloud-free images during the target season
- Apply atmospheric correction (BOA reflectance)

**2. Feature Engineering**
\`\`\`python
# Compute spectral indices
ndvi  = (B8  - B4)  / (B8  + B4)   # Vegetation
ndwi  = (B3  - B8)  / (B3  + B8)   # Water bodies
ndbi  = (B11 - B8A) / (B11 + B8A)  # Built-up
savi  = 1.5 * (B8 - B4) / (B8 + B4 + 0.5) # Soil-adj vegetation
\`\`\`

**3. Training Sample Collection**
- Use QGIS or GEE to digitize representative polygons
- Aim for 100+ samples per class (minimum 50)
- Common classes: Water, Forest, Agriculture, Urban, Barren, Wetland

**4. Classification**
- Random Forest (most popular)
- SVM (good for limited training data)
- Deep learning (U-Net for pixel segmentation)

**5. Accuracy Assessment**
- Overall Accuracy (target > 85%)
- Kappa Coefficient (target > 0.80)
- Producer's and User's accuracy per class
- Confusion matrix

**GEE entire workflow:**
\`\`\`javascript
var classified = image.classify(
  ee.Classifier.smileRandomForest(100).train(training, 'class', bands)
);
\`\`\``
  },
  // Resolution types
  {
    patterns: ['spatial resolution', 'temporal resolution', 'spectral resolution', 'radiometric resolution', 'resolution types'],
    answer: `**The Four Resolutions of Remote Sensing Imagery:**

**1. Spatial Resolution** — Size of the ground area represented by one pixel
| Category | Resolution | Example Sensor |
|----------|-----------|---------------|
| Very Low | >1km | MODIS (1km), AVHRR |
| Low | 100m–1km | NOAA, GOES |
| Medium | 10m–100m | Sentinel-2 (10m), Landsat (30m) |
| High | 1m–10m | SPOT-6 (1.5m), RapidEye (5m) |
| Very High | <1m | WorldView-3 (31cm), IKONOS (1m) |

**2. Spectral Resolution** — Number and width of spectral bands
- Multispectral: 3–15 bands (RGB, NIR, SWIR)
- Hyperspectral: 100–300+ narrow bands (for material identification)

**3. Temporal Resolution** — How often the sensor revisits the same area
- MODIS: Daily (global)
- Sentinel-2: 5 days (at equator)
- Landsat: 16 days
- Planet: Daily (commercial)

**4. Radiometric Resolution** — Sensitivity to detect intensity differences
- 8-bit: 256 grey levels (older sensors)
- 10-bit: 1024 levels (Sentinel-2)
- 16-bit: 65,536 levels (Landsat, high-end sensors)

**Trade-offs:** Higher spatial resolution usually means smaller swath width and longer revisit time. A 30cm pixel satellite may only revisit every few days.`
  },
  // Software recommendations
  {
    patterns: ['software recommendation', 'best gis software', 'which software', 'start with qgis', 'arcgis vs qgis'],
    answer: `**ArcGIS vs QGIS — Which should you use?**

| Feature | ArcGIS Pro | QGIS |
|---------|-----------|------|
| **Cost** | Paid (license) | Free, open source |
| **Industry Adoption** | Government, enterprise | Academia, NGO, small orgs |
| **User Interface** | More polished | Feature-rich but complex |
| **Analysis Tools** | Comprehensive | Equivalent via plugins |
| **3D** | Excellent (ArcGIS Pro) | Good (Qgis2threejs, GRASS) |
| **Python** | arcpy (proprietary) | PyQGIS + geopandas |
| **Web GIS** | ArcGIS Online | Not native, but QGIS Server |
| **Best for** | Professional, enterprise | Learning, research, open source |

**My recommendation for beginners:** Start with **QGIS** — free, full-featured, excellent community.

**Essential QGIS plugins:**
- QuickOSM (download OpenStreetMap data)
- HCMGIS (basemaps)
- Point Sampling Tool
- Semi-Automatic Classification Plugin (SCP) for image classification
- QGIS2Web (export to Leaflet/MapLibre)
- OTB (Orfeo Toolbox) for advanced image processing

**For satellite analysis:** Use **QGIS + Google Earth Engine** together — they complement each other perfectly.`
  },
  // Flood mapping
  {
    patterns: ['flood', 'flood mapping', 'flood detection', 'inundation', 'disaster mapping'],
    answer: `**Flood Mapping using Remote Sensing** is critical for disaster response and risk management.

**Best Approaches:**

**1. SAR-based (Best — works through clouds)**
Using Sentinel-1 before/after comparison:
\`\`\`javascript
// GEE flood detection
var before = s1.filterDate('before').mean();
var after  = s1.filterDate('during').mean();
var diff = after.subtract(before);
var flood = diff.lt(-3);  // >3dB decrease = potential flood
\`\`\`

**2. Optical + NDWI**
\`\`\`
NDWI = (Green - NIR) / (Green + NIR)
MNDWI = (Green - SWIR) / (Green + SWIR)
Threshold: NDWI > 0.0 → Water
\`\`\`

**3. Multi-temporal analysis**
Compare pre-event and during-event images

**Sentinel-1 Advantages for flood mapping:**
- Not blocked by clouds (critical during monsoon/cyclone)
- Free and open access
- 6–12 day revisit
- 10m spatial resolution

**Validation:**
- Field GPS points
- Gauge station data
- VHR optical imagery
- Social media reports (volunteered geographic information)

**Workflow:**
1. Download S1 images (before/after)
2. Calibration → Speckle filtering → Geocoding in SNAP
3. Threshold backscatter difference
4. Apply permanent water mask, DEM slope filter
5. Calculate flood area and affected population`
  }
];

/* ─── DEFAULT / FALLBACK RESPONSES ─── */
const defaultResponses = [
  "That's a great question about **{topic}**! In GIS and Remote Sensing, this involves several key concepts. Could you provide more specific details so I can give you a more precise answer? You can ask about: specific software commands, code examples, satellite data sources, analysis workflows, or concepts.",
  "**{topic}** is an important topic in the geospatial field. I'd be happy to elaborate — are you looking for conceptual understanding, practical code examples, or software-specific guidance?",
  "Excellent question! **{topic}** relates to several areas in GIS & Remote Sensing. For the most helpful answer, let me know if you need: (1) theory and concepts, (2) Python/GEE code, (3) software tutorials, or (4) data sources."
];

/* ─── DETECT IF USER IS ASKING FOR CODE ─── */
const CODE_INTENT_WORDS = [
  'code', 'script', 'write', 'give me', 'show me', 'example', 'snippet',
  'sample', 'program', 'function', 'implement',
  'create a', 'generate', 'build a', 'develop', 'make a'
];

function detectCodeIntent(q) {
  return CODE_INTENT_WORDS.some(w => q.includes(w));
}

/* ─── NORMALIZE QUESTION FOR BETTER MATCHING ─── */
function normalizeQuestion(q) {
  return q
    .toLowerCase()
    .replace(/[?!.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ─── CHECK FOR KEYWORD ANSWERS ─── */
function findAnswer(question) {
  const q = normalizeQuestion(question);
  const hasCodeIntent = detectCodeIntent(q);

  // First pass: exact pattern match (highest priority)
  for (const entry of geoKnowledgeBase) {
    if (entry.patterns.some(p => q.includes(p))) {
      return entry.answer;
    }
  }

  // Second pass: if user is asking for code, try broad topic keyword matching
  // against entries that contain actual code blocks
  if (hasCodeIntent) {
    const codeEntries = geoKnowledgeBase.filter(e => e.answer && e.answer.includes('```'));

    // Topic → keywords to search in patterns
    const topicMap = {
      'ndvi':           ['ndvi'],
      'vegetation':     ['ndvi'],
      'flood':          ['flood'],
      'inundation':     ['flood'],
      'lulc':           ['lulc'],
      'land use':       ['lulc'],
      'land cover':     ['lulc'],
      'classification': ['lulc'],
      'random forest':  ['lulc'],
      'reproject':      ['reproject'],
      'convert crs':    ['reproject'],
      'warp':           ['reproject'],
      'geopandas':      ['geopandas'],
      'shapefile':      ['shapefile'],
      'vector':         ['geopandas'],
      'buffer':         ['geopandas'],
      'dissolve':       ['geopandas'],
      'leaflet':        ['leaflet'],
      'web map':        ['leaflet'],
      'html map':       ['leaflet'],
      'gdal':           ['gdal'],
      'cli':            ['gdal'],
      'rasterio':       ['rasterio'],
      'geospatial':     ['rasterio'],
      'postgis':        ['postgis'],
      'spatial sql':    ['postgis'],
      'change detect':  ['change detection'],
      'before after':   ['change detection'],
      'dem':            ['dem analysis'],
      'elevation':      ['dem analysis'],
      'terrain':        ['dem analysis'],
      'slope':          ['dem analysis'],
      'hillshade':      ['dem analysis'],
    };

    for (const [kw, searchTerms] of Object.entries(topicMap)) {
      if (q.includes(kw)) {
        const match = codeEntries.find(e =>
          searchTerms.some(st => e.patterns.some(p => p.includes(st)))
        );
        if (match) return match.answer;
      }
    }

    // No local KB match — let Groq AI handle it
    return null;
  }

  return null;
}

/* ─── FORMAT MARKDOWN TO HTML ─── */
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`{3}([\w]*)\n([\s\S]*?)`{3}/gm, (_, lang, code) =>
      `<pre><code>${escapeHtml(code.trim())}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^\|(.+)\|$/gm, (line) => {
      const cells = line.split('|').slice(1, -1);
      if (cells.every(c => /^[-:]+$/.test(c.trim()))) return '';
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>')
    .replace(/(<table>)/, '<div class="md-table"><table>')
    .replace(/(<\/table>)/, '</table></div>')
    .replace(/^#{1,4}\s+(.+)$/gm, (_, t) => `<strong class="md-heading">${t}</strong>`)
    .replace(/^[\*\-]\s+(.+)$/gm, (_, t) => `<li>${t}</li>`)
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ─── ADD MESSAGE TO CHAT ─── */
function addMessage(content, role = 'bot') {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = `msg-avatar ${role === 'bot' ? 'bot' : 'user'}-avatar`;
  avatar.textContent = role === 'bot' ? '🛰️' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (role === 'bot') {
    bubble.innerHTML = `<p>${formatMarkdown(content)}</p>`;
  } else {
    bubble.textContent = content;
  }

  div.appendChild(avatar);
  div.appendChild(bubble);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

/* ─── TYPING INDICATOR ─── */
function showTyping() {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'typingIndicator';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar bot-avatar';
  avatar.textContent = '🛰️';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

  div.appendChild(avatar);
  div.appendChild(bubble);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

/* ─── GIS EXPERT SYSTEM PROMPT FOR MAIN CHAT ─── */
const GIS_EXPERT_PROMPT = `You are an expert GIS (Geographic Information Systems) and Remote Sensing scientist, software trainer, and educator with 20+ years of hands-on experience. You have DEEP, PRACTICAL knowledge in:

**GIS Desktop Software (complete UI & workflow knowledge):**
- ArcGIS / ArcMap / ArcGIS Pro: editing tools, geodatabases, symbology, map layouts, Model Builder, attribute tables, spatial joins, geoprocessing toolbox, saving edits, snapping, topology rules, field calculator, selection by attributes/location, raster calculator, 3D Analyst, Network Analyst, labels & annotation
- QGIS: all core tools, Python console (PyQGIS), processing toolbox, SAGA/GRASS/OTB providers, styles & symbology, print composer/layout, digitising, attribute table, expressions, plugins (QuickMapServices, MMQGIS, etc.)
- ERDAS IMAGINE: image processing, supervised/unsupervised classification, mosaic, subset, band combinations, radiometric & geometric correction
- ENVI: hyperspectral analysis, target detection, IDL scripting, spectral libraries, SAR analysis
- ESA SNAP: Sentinel-1 SAR calibration, InSAR processing, Sentinel-2 preprocessing, Sen2Cor, S-1 Toolbox
- Global Mapper, AutoCAD Map 3D, GRASS GIS, SAGA GIS, MapInfo, Surfer

**Remote Sensing:**
- Satellite platforms: Sentinel-1/2/3, Landsat 5/7/8/9, MODIS, ASTER, SPOT, WorldView, Planet SmallSats, IKONOS
- Sensors: multispectral, hyperspectral, SAR/radar, thermal IR, LiDAR, passive & active systems
- Image preprocessing: atmospheric correction (FLAASH, Sen2Cor, 6S), radiometric calibration, orthorectification, pan-sharpening, mosaicking, cloud masking
- Spectral indices: NDVI, NDWI, NDBI, EVI, SAVI, MNDWI, NBR, LST, RVI, NDSI, BAI
- Classification: Maximum Likelihood, Random Forest, SVM, Neural Networks, OBIA (eCognition), accuracy assessment, confusion matrix, kappa

**Programming & Cloud Platforms:**
- Python: GDAL, Rasterio, GeoPandas, Shapely, Fiona, Pyproj, scikit-learn, numpy, matplotlib, xarray, folium
- Google Earth Engine (GEE): JavaScript & Python APIs, ee.Image, ee.ImageCollection, time series, exports, UI charts
- R language: sf, terra, tmap, ggplot2, leaflet, raster
- JavaScript: Leaflet.js, OpenLayers, Mapbox GL JS, Turf.js
- PostGIS / PostgreSQL: ST_ spatial functions, spatial queries
- GDAL/OGR command-line: gdalwarp, gdal_translate, gdal_merge, ogr2ogr, gdalinfo

**Applications & Domains:**
- Land use / land cover (LULC) mapping and change detection
- Vegetation health, crop monitoring, precision agriculture
- Flood mapping, disaster management, urban heat islands
- DEM / DSM / DTM analysis: slope, aspect, curvature, viewshed, hillshade, watershed delineation
- InSAR for subsidence, glacier dynamics
- Environmental monitoring, coastal mapping, forest inventory

RESPONSE RULES:
1. ALWAYS give COMPLETE, detailed, practical answers — NEVER vague one-liners or say "I cannot answer"
2. For SOFTWARE HOW-TO questions (ArcMap, ArcGIS Pro, QGIS, ERDAS, SNAP, etc.):
   - Give EXACT numbered steps with full menu paths (e.g. "Editor toolbar → Start Editing → select layer")
   - State exact button names, toolbar names, dialog boxes, and checkbox labels
   - Include keyboard shortcuts (e.g. Ctrl+S to save)
   - Cover both ArcMap (classic) and ArcGIS Pro if relevant, noting UI differences
   - Warn about the most common mistakes and gotchas
3. For CONCEPT questions: Give clear explanations with real-world GIS examples
4. For CODE questions: Provide COMPLETE working, copy-paste-ready code with inline comments
5. Structure all answers with bold headings, numbered steps, and bullet points for easy reading
6. Answer ANY question related to GIS, Remote Sensing, geospatial software, spatial analysis, satellite data, cartography, or mapping — NO topic is out of scope
7. Always end with a ⚠️ Common Pitfall or 💡 Pro Tip section
8. Answer in the same language the user uses (Hindi/English/mixed)
9. If the question is ambiguous, answer for the most common use case and offer to clarify`;

/* ─── CALL GROQ FROM MAIN CHAT ─── */
async function callGroqForGIS(question) {
  const apiKey = localStorage.getItem('spatialtech_groq_key_admin');
  if (!apiKey) return null; // No key saved — use fallback

  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: GIS_EXPERT_PROMPT },
            { role: 'user',   content: question }
          ],
          temperature: 0.3,
          max_tokens: 4096,
        })
      });

      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 6000));
        continue;
      }
      if (!res.ok) continue;

      const data  = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply;

    } catch (e) {
      continue;
    }
  }
  return null;
}

/* ─── SEND MESSAGE ─── */
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const question = input.value.trim();
  if (!question) return;

  input.value = '';
  input.style.height = 'auto';

  // Disable send while processing
  const sendBtn = document.getElementById('chatSend');
  if (sendBtn) sendBtn.disabled = true;

  addMessage(question, 'user');
  showTyping();

  // Step 1: Try the local knowledge base first (instant)
  const kbAnswer = findAnswer(question);
  if (kbAnswer) {
    await new Promise(r => setTimeout(r, 400)); // tiny natural delay
    hideTyping();
    addMessage(kbAnswer, 'bot');
    if (sendBtn) sendBtn.disabled = false;
    return;
  }

  // Step 2: Try Groq API for any question not in KB
  const groqAnswer = await callGroqForGIS(question);
  hideTyping();

  if (groqAnswer) {
    addMessage(groqAnswer, 'bot');
  } else {
    // Step 3: No key set yet — guide user
    const hasKey = !!localStorage.getItem('spatialtech_groq_key_admin');
    if (!hasKey) {
      addMessage(
        `🛰️ **Great question about** *"${question}"*!\n\n` +
        `To get a **complete, detailed answer** with step-by-step process, methods, data sources, and code:\n\n` +
        `**👉 Set up your free AI key:**\n` +
        `1. Go to **Code Tools** → click **🤖 AI Code Assistant**\n` +
        `2. Click **🔑 API Key** → get your free key at [console.groq.com](https://console.groq.com)\n` +
        `3. Come back here and ask again — I'll give you a complete expert answer!\n\n` +
        `*Alternatively, try one of the quick questions above for instant answers.*`,
        'bot'
      );
    } else {
      addMessage(
        `⏳ **AI is temporarily busy.** Please wait 30 seconds and ask again.\n\n` +
        `Your question: *"${question}"* — I'll answer it with full detail once the service is available!`,
        'bot'
      );
    }
  }

  if (sendBtn) sendBtn.disabled = false;
}


/* ─── RELATED TOPICS SUGGESTER ─── */
function generateRelatedTopics(question) {
  const q = question.toLowerCase();
  const suggestions = [];

  if (q.includes('python') || q.includes('code')) {
    suggestions.push('Python code examples for GIS');
  }
  if (q.includes('sentinel') || q.includes('landsat') || q.includes('satellite')) {
    suggestions.push('Satellite data sources and downloads');
  }
  if (q.includes('map') || q.includes('qgis') || q.includes('arcgis')) {
    suggestions.push('Desktop GIS software comparison');
  }
  if (q.includes('aerial') || q.includes('drone') || q.includes('uav')) {
    suggestions.push('Drone mapping and photogrammetry workflow');
  }

  if (suggestions.length > 0) {
    return `\n\n**You might also be interested in:**\n${suggestions.map(s => `• ${s}`).join('\n')}`;
  }
  return '\n\n**Try asking:** "What is NDVI?", "How does SAR work?", "Python code for GIS?", "Best satellite for urban mapping?"';
}

/* ─── QUICK QUESTION HANDLER ─── */
function askQuestion(question) {
  document.getElementById('chatInput').value = question;
  sendMessage();
  document.getElementById('chat').scrollIntoView({ behavior: 'smooth' });
}

/* ─── SCROLL ANIMATIONS (Intersection Observer) ─── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.know-card, .tech-card, .tool-card, .resource-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  animObserver.observe(el);
});

/* ─── INLINE TABLE FORMATTING ADDED TO CSS DYNAMICALLY ─── */
(function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .md-table { overflow-x: auto; margin: 0.75rem 0; }
    .md-table table { border-collapse: collapse; width: 100%; font-size: 0.83em; }
    .md-table td { padding: 0.4rem 0.7rem; border: 1px solid rgba(57,255,133,0.12); }
    .md-table tr:first-child td { background: rgba(57,255,133,0.1); font-weight: 700; color: #39ff85; }
    .md-heading { display: block; color: #39ff85; margin: 0.75rem 0 0.25rem; font-size: 0.95em; }
    .msg-bubble ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
    .nav-link.active { color: #39ff85; }
    /* Knowledge card expand animation */
    .btn-expand { transition: all 0.3s ease; }
  `;
  document.head.appendChild(style);
})();

/* ─── COPY HERO IMAGE TO RELATIVE PATH ─── */
// The hero image is referenced relatively, so it needs to be in the same folder.
// This is handled by the actual file placement.

console.log('🌍 Spatial Tech — GIS & Remote Sensing Hub loaded successfully!');
console.log('💬 Chat Knowledge Base: ' + geoKnowledgeBase.length + ' topic entries');

/* ═══════════════════════════════════════════════════════════
   ASK MODAL — Code Snippet Q&A Feature
   ═══════════════════════════════════════════════════════════ */

let currentCodeContext = '';

/* Per-snippet quick chips */
const snippetChips = {
  'Calculate NDVI': ['What is NDVI?', 'Change band numbers', 'Use with Sentinel-2', 'Output to GeoTIFF'],
  'Batch Reproject Rasters': ['Change target CRS', 'Support other formats', 'Add error handling', 'What is EPSG:4326?'],
  'NDVI Time Series Chart (GEE)': ['Change date range', 'Different satellite', 'Export chart to CSV', 'Filter by region'],
  'SAR Flood Mapping (GEE)': ['What is SAR?', 'Change threshold -3dB', 'Export flood map', 'Add permanent water mask'],
  'Dissolve & Clip Shapefile': ['What is dissolve?', 'Change dissolve field', 'Handle CRS mismatch', 'Save as GeoJSON'],
  'Interactive Leaflet Map': ['Add WMS layer', 'Custom marker icons', 'Export as HTML', 'Add search bar'],
  'Essential GDAL Commands': ['Convert to GeoJSON', 'Batch processing tip', 'Mosaic multiple files', 'Compress GeoTIFF'],
  'Random Forest LULC Classification': ['How many trees needed?', 'What is kappa?', 'Add validation step', 'Export confusion matrix'],
};

/* Code-context-aware Q&A knowledge */
const codeQA = [
  // NDVI
  {
    ctx: ['NDVI', 'ndvi', 'rasterio', 'Calculate NDVI'], q: ['what is ndvi', 'how ndvi works', 'explain ndvi'],
    a: '**NDVI** (Normalized Difference Vegetation Index) measures vegetation health:\n\n`NDVI = (NIR - Red) / (NIR + Red)`\n\nValues range from **-1 to +1**:\n- `< 0` → Water, clouds, snow\n- `0–0.2` → Bare / sparse vegetation\n- `0.2–0.5` → Moderate vegetation\n- `> 0.5` → Dense, healthy vegetation\n\nThis script uses `rasterio` to read two separate band files and computes NDVI pixel-by-pixel.'
  },
  {
    ctx: ['NDVI', 'rasterio'], q: ['sentinel', 'band', 'which band', 'sentinel-2'],
    a: 'For **Sentinel-2**, change the band files:\n- `red_path` → Band 4 (B04.tif)\n- `nir_path` → Band 8 (B08.tif)\n\nFor **Landsat 8/9**:\n- `red_path` → Band 4\n- `nir_path` → Band 5\n\nFor **MODIS**: Band 1 (Red), Band 2 (NIR)'
  },
  // Reproject
  {
    ctx: ['Reproject', 'reproj', 'reproject', 'EPSG'], q: ['epsg', 'crs', 'coordinate', 'utm', 'wgs'],
    a: '**Common EPSG codes:**\n- `EPSG:4326` → WGS84 (lat/lon), global standard\n- `EPSG:3857` → Web Mercator (Google Maps)\n- `EPSG:32643` → UTM Zone 43N (Central India)\n- `EPSG:32644` → UTM Zone 44N (East India)\n\nChange `target_crs` in the function call to any EPSG code you need.'
  },
  {
    ctx: ['Reproject'], q: ['other format', 'not tif', 'shapefile', 'vector'],
    a: 'This script is for **raster** files (`.tif`). For **vector** reprojection use GeoPandas:\n\n```python\nimport geopandas as gpd\ngdf = gpd.read_file("input.shp")\ngdf_reproj = gdf.to_crs("EPSG:32643")\ngdf_reproj.to_file("output_utm.shp")\n```'
  },
  // GEE general
  {
    ctx: ['GEE', 'Earth Engine', 'NDVI Time Series', 'SAR Flood'], q: ['export', 'download', 'save'],
    a: 'To **export** from Google Earth Engine to Google Drive:\n\n```javascript\nExport.image.toDrive({\n  image: latestNDVI,\n  description: "NDVI_export",\n  folder: "GEE_exports",\n  scale: 10,\n  region: roi,\n  fileFormat: "GeoTIFF"\n});\n```\nThen click **Run** in the Tasks panel.'
  },
  // SAR / Flood
  {
    ctx: ['SAR', 'Flood', 'Sentinel-1'], q: ['threshold', '3db', '-3', 'why -3'],
    a: 'The **-3 dB threshold** is a standard rule: a decrease of >3 dB in SAR backscatter between before/after images typically indicates flooding, because water surfaces scatter radar away from the sensor (specular reflection → very low return).\n\nYou can tune this value depending on your area — drier regions may need `-2`, wetter areas `-4` or lower.'
  },
  {
    ctx: ['SAR', 'Flood'], q: ['what is sar', 'how sar works', 'sar remote sensing'],
    a: '**SAR (Synthetic Aperture Radar)** is an active microwave sensor that:\n- Emits its own microwave pulses ☁️ Works through clouds & at night\n- Measures how much energy bounces back\n- Flooded areas scatter waves away → appear very dark in SAR images\n\nSentinel-1 (C-band SAR) is free from ESA and ideal for flood mapping.'
  },
  // Dissolve / Clip
  {
    ctx: ['Dissolve', 'Clip', 'Shapefile', 'GeoPandas'], q: ['what is dissolve', 'dissolve meaning'],
    a: '**Dissolve** merges multiple features that share the same attribute value into a single feature.\n\nExample: 100 district polygons → 28 state polygons by dissolving on `STATE_NAME`.\n\n`aggfunc="sum"` means numeric fields are summed. You can also use `"mean"`, `"first"`, `"count"`, etc.'
  },
  {
    ctx: ['Dissolve', 'Clip', 'GeoPandas'], q: ['geojson', 'save geojson', 'output format'],
    a: 'To save as **GeoJSON** instead of shapefile:\n\n```python\ndissolved.to_file("output.geojson", driver="GeoJSON")\n```\n\nOther formats: `"GPKG"` (GeoPackage), `"ESRI Shapefile"` (default), `"FlatGeobuf"`.'
  },
  // Leaflet
  {
    ctx: ['Leaflet', 'Interactive', 'JavaScript', 'WebMap'], q: ['wms', 'add wms', 'tile layer'],
    a: 'To add a **WMS layer** from a GeoServer or ArcGIS server:\n\n```javascript\nconst wms = L.tileLayer.wms("https://your-server/wms", {\n  layers: "your_layer_name",\n  format: "image/png",\n  transparent: true,\n  attribution: "Your Source"\n}).addTo(map);\n```'
  },
  {
    ctx: ['Leaflet'], q: ['marker', 'custom marker', 'popup icon'],
    a: 'To use a **custom marker icon**:\n\n```javascript\nconst myIcon = L.icon({\n  iconUrl: "marker.png",\n  iconSize: [32, 32],\n  iconAnchor: [16, 32],\n  popupAnchor: [0, -32]\n});\nL.marker([lat, lng], { icon: myIcon }).addTo(map);\n```'
  },
  // GDAL
  {
    ctx: ['GDAL', 'CLI', 'ogr', 'gdal'], q: ['mosaic', 'merge raster', 'combine raster'],
    a: 'To **mosaic multiple rasters** into one:\n\n```bash\n# Mosaic all TIFs in a folder\ngdal_merge.py -o mosaic.tif tile1.tif tile2.tif tile3.tif\n\n# Or use a wildcard (Linux/Mac)\ngdal_merge.py -o mosaic.tif *.tif\n```'
  },
  {
    ctx: ['GDAL', 'CLI'], q: ['compress', 'lzw', 'file size', 'smaller'],
    a: 'To **compress a GeoTIFF** (reduce file size):\n\n```bash\ngdal_translate -of GTiff -co COMPRESS=LZW -co PREDICTOR=2 input.tif output_lzw.tif\n\n# Or DEFLATE for better compression:\ngdal_translate -of GTiff -co COMPRESS=DEFLATE -co PREDICTOR=2 input.tif output_deflate.tif\n```'
  },
  // Random Forest
  {
    ctx: ['Random Forest', 'LULC', 'Classification', 'sklearn'], q: ['how many trees', 'n_estimators', '100 trees'],
    a: '**Number of trees (`n_estimators`)**:\n- `100` is a good default for most datasets\n- More trees = better accuracy but slower\n- For large imagery (>10M pixels), use `50–100`\n- For smaller datasets, `200–500` improves results\n\nMonitor **OOB (Out-of-Bag) error** to find the optimal number.'
  },
  {
    ctx: ['Random Forest', 'LULC'], q: ['kappa', 'accuracy', 'validation', 'confusion matrix'],
    a: '**Accuracy metrics explained:**\n- **Overall Accuracy**: % of pixels correctly classified (target >85%)\n- **Kappa Coefficient**: Agreement beyond chance (>0.8 = "almost perfect")\n- **Producer\'s Accuracy**: How well actual class is mapped\n- **User\'s Accuracy**: Reliability of predicted class\n\n```python\nfrom sklearn.metrics import confusion_matrix, cohen_kappa_score\nprint("Kappa:", cohen_kappa_score(y_val, y_pred))\n```'
  },
];

/* Generic code question fallbacks */
const genericCodeAnswers = [
  '**Great question!** In GIS code, modifications like this are usually done by changing parameters in the function call or updating the configuration variables at the top of the script. Would you like to be more specific about what you want to change?',
  'For **GIS Python scripts**, best practices include:\n- Adding `try/except` blocks for error handling\n- Using `pathlib.Path` for cross-platform file paths\n- Logging with `print()` or the `logging` module\n- Testing with small datasets first before full runs.',
  '**Common issues with this type of GIS code:**\n- CRS mismatch between input layers\n- Missing Python packages (install with `pip`)\n- File path errors (use raw strings `r"C:\\path"` on Windows)\n- NoData values causing incorrect calculations — always check `src.nodata`.',
];

/* ── Open Ask Modal ── */
function openAskModal(btn, codeName) {
  currentCodeContext = codeName;
  document.getElementById('askCodeName').textContent = codeName;
  document.getElementById('askModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Reset messages to initial
  const msgs = document.getElementById('askMessages');
  msgs.innerHTML = `
    <div class="ask-msg bot-msg">
      <div class="ask-avatar bot">🤖</div>
      <div class="ask-bubble">
        <strong>Hi! I'm SpatialBot.</strong> I can help you understand the <em>${codeName}</em> code — how it works, how to modify it, common errors, or how to use it in your project. What would you like to know?
      </div>
    </div>`;

  // Set quick chips
  const chips = document.getElementById('askChips');
  const chipList = snippetChips[codeName] || ['How does this work?', 'Common errors?', 'How to install dependencies?', 'Modify for my data?'];
  chips.innerHTML = chipList.map(c =>
    `<button class="ask-chip" onclick="sendAskChip('${c}')">${c}</button>`
  ).join('');

  // Focus input
  setTimeout(() => document.getElementById('askInput').focus(), 300);
}

/* ── Close Ask Modal ── */
function closeAskModal() {
  document.getElementById('askModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('askInput').value = '';
}

function closeAskOnOverlay(e) {
  if (e.target === document.getElementById('askModalOverlay')) closeAskModal();
}

/* ── Escape key closes modal ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAskModal();
});

/* ── Auto-resize ask textarea ── */
function autoResizeAsk(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

/* ── Keyboard handler ── */
function handleAskKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAskMessage();
  }
}

/* ── Quick chip click ── */
function sendAskChip(text) {
  document.getElementById('askInput').value = text;
  sendAskMessage();
}

/* ── Add message to Ask modal ── */
function addAskMessage(html, role) {
  const msgs = document.getElementById('askMessages');
  const div = document.createElement('div');
  div.className = `ask-msg ${role === 'user' ? 'user-msg' : 'bot-msg'}`;
  const avatar = document.createElement('div');
  avatar.className = `ask-avatar ${role === 'user' ? 'user' : 'bot'}`;
  avatar.textContent = role === 'user' ? '👤' : '🤖';
  const bubble = document.createElement('div');
  bubble.className = 'ask-bubble';
  if (role === 'bot') {
    bubble.innerHTML = html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`{3}([\w]*)\n([\s\S]*?)`{3}/gm, (_, lang, code) =>
        `<pre style="background:rgba(0,0,0,0.4);border:1px solid rgba(139,92,246,0.2);border-radius:8px;padding:0.6rem 0.8rem;overflow-x:auto;margin:0.5rem 0;font-family:'Fira Code',monospace;font-size:0.78em">${code.trim()}</pre>`)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  } else {
    bubble.textContent = html;
  }
  div.appendChild(avatar);
  div.appendChild(bubble);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ── Show typing in Ask modal ── */
function showAskTyping() {
  const msgs = document.getElementById('askMessages');
  const div = document.createElement('div');
  div.className = 'ask-msg bot-msg';
  div.id = 'askTyping';
  div.innerHTML = `<div class="ask-avatar bot">🤖</div>
    <div class="ask-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideAskTyping() {
  const t = document.getElementById('askTyping');
  if (t) t.remove();
}

/* ── Find answer for Ask modal ── */
function findAskAnswer(question) {
  const q = question.toLowerCase();
  const ctx = currentCodeContext.toLowerCase();

  for (const entry of codeQA) {
    const ctxMatch = entry.ctx.some(c => ctx.includes(c.toLowerCase()) || c.toLowerCase().includes(ctx.split(' ')[0].toLowerCase()));
    const qMatch = entry.q.some(p => q.includes(p));
    if (ctxMatch && qMatch) return entry.a;
  }
  // Try global knowledge base
  for (const entry of geoKnowledgeBase) {
    if (entry.patterns.some(p => q.includes(p))) return entry.answer;
  }
  return null;
}

/* ── Send message in Ask modal ── */
function sendAskMessage() {
  const input = document.getElementById('askInput');
  const question = input.value.trim();
  if (!question) return;

  input.value = '';
  input.style.height = 'auto';

  addAskMessage(question, 'user');
  showAskTyping();

  const delay = 500 + Math.random() * 700;
  setTimeout(() => {
    hideAskTyping();
    const answer = findAskAnswer(question);
    if (answer) {
      addAskMessage(answer, 'bot');
    } else {
      const words = question.split(' ').filter(w => w.length > 3).slice(0, 4).join(' ') || 'this topic';
      const fallback = genericCodeAnswers[Math.floor(Math.random() * genericCodeAnswers.length)];
      addAskMessage(fallback, 'bot');
    }
  }, delay);
}
