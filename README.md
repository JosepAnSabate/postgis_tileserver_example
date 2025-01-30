## Overview
This project processes and visualizes bathymetric data using GDAL, geopandas PostGIS, and Mapbox GL-JS. The workflow involves raster-to-vector conversion, database integration, and creating an interactive web map for visualizing depth contours.

---

## Source Data
The Digital Elevation Model (DEM) used in this project was downloaded from the NOAA Data Viewer:

[NOAA Data Viewer](https://coast.noaa.gov/dataviewer/)

---

## Step 1: Raster to Vector Conversion
**Script:** `raster_to_pol.ipynb`

In this step I used only GDAL for working with the data. I also could have used rasterio but GDAL works well in large datasets, is fast and do the job. 

This step utilizes GDAL for:
- Extracting general raster information.
- Reprojecting the DEM to a suitable coordinate system.
- Converting raster data to vector format (shapefile) using `gdal.Polygonize()` or `gdal_contour()`.

**Note:**  
If the `gdal.Polygonize()` function becomes a bottleneck, the process can be parallelized. For performance benchmarking, refer to [Mapbox GDAL Polygonize Test](https://github.com/mapbox/gdal-polygonize-test).

---

## Step 2: Storing and Processing Data in PostGIS
**Script:** `postgis_bd.ipynb`
All the queries for the set-up are in the jupyter notebook file.

1. **Database Setup**:
   - Create a PostGIS-enabled PostgreSQL database.
   - Add required extensions and permissions.

2. **Data Import**:
   - Import vectorized data into PostGIS using GeoPandas.

3. **Smoothing Contours**:
   - Apply `ST_ChaikinSmoothing()` to create smoother depth contours.
   - Avoided `ST_Simplify()` to maintain resolution and ensure small rocks that could pose hazards remain visible.

---
## Step 3: Serving Data with pg_tileserv
**Setup**:
1. Download and install `pg_tileserv` on my windows laptop.
2. Set the database URL:
   ```bash
   set DATABASE_URL=postgresql://postgres:{password}@localhost:5432/bathymetry_db```
3. Execute  `pg_tileserv service` to serve bathymetric data as vector tiles.
	```bash
	pg_tileserv.exe
   ```

---
## Step 4: Web Map Visualization
The web map was built using [Mapbox GL-JS](https://docs.mapbox.com/mapbox-gl-js/). Key features include:
- **Color Palette**: Depth categories are visualized using a range of blue shades. For improved accessibility, you may consider palettes like `viridis` or `cividis`.
- **Interactive Popups**: Display depth information when a user clicks on a specific area.
