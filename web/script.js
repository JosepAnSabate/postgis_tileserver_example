mapboxgl.accessToken = ''; 

map = new mapboxgl.Map({
    container: 'map', 
    style:'mapbox://styles/mapbox/streets-v11',
    projection: 'globe',
    center: [-84.4, 29.9], 
    zoom: 13
});


map.on('load', () => {
    // Add the bathymetry source (vector tiles)
    map.addSource('bathymetry', {
        type: 'vector',
        tiles: ['http://localhost:7800/public.bathymetry_depth/{z}/{x}/{y}.pbf'],
        minzoom: 0,
        maxzoom: 22
    });

    // Add a layer to display the bathymetry data with unique colors for each depth range
    map.addLayer({
        id: 'bathymetry_depth',
        type: 'fill',
        source: 'bathymetry',
        'source-layer': 'public.bathymetry_depth', 
        paint: {
            'fill-color': [
                'match',
                ['get', 'depth'],
                '0 to -0.5', '#99ddff', // Very light blue
                '-0.5 to -1', '#3399ff',
                '-1 to -2', '#0066ff', 
                '-2 to -5', '#0000ff', 
                '-5 to -10', '#000066', // Dark blue
                '#CCCCCC' 
            ],
            'fill-opacity': 0.8, 
            'fill-outline-color': '#FFFFFF' // White outline for visibility
        }
    });

    // Add click event to show a popup with the depth value
    map.on('click', 'bathymetry_depth', (e) => {
        const depth = e.features[0].properties.depth; // Get the depth property
        const coordinates = e.lngLat; // Get the clicked coordinates

        // Create a popup and set its content
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<strong>Depth:</strong>  ${depth} meters.`)
            .addTo(map);
    });

    // Change the cursor to a pointer when hovering over the layer
    map.on('mouseenter', 'bathymetry_depth', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Reset the cursor when not hovering
    map.on('mouseleave', 'bathymetry_depth', () => {
        map.getCanvas().style.cursor = '';
    });
});


  
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');