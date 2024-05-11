import L from 'npm:leaflet';


/**
 * Extracts the installation date from a site
 * @param d the site
 * @returns {string} the installation date
 */
function extractInstallationDate(d) {
    const date = new Date(d.datum_van);
    return 'Datum eerste telling: ' + String(date.getDate()).padStart(2, '0') + '/' + String((date.getMonth() + 1)).padStart(2, '0') + '/' + date.getFullYear();
}

/**
 * Creates a popup for a site
 * @param d the site
 * @returns {string} the popup HTML String
 */
function createPopUp(d) {
    return 'Naam site: ' + d.naam + '<br>' +
        'Naam gemeente: ' + d.gemeente + '<br>' +
        'Interval tellingen: ' + d.interval + "minuten" + '<br>' +
        extractInstallationDate(d)
}

/**
 * Returns a smaller bounds
 * @param bounds the bounds to make smaller
 * @param shrinkAmount the amount to shrink the bounds
 * @returns the smaller bounds
 */
function makeSmallerBounds(bounds, shrinkAmount) {
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const smallerNorthEast = L.latLng(northEast.lat - shrinkAmount, northEast.lng - shrinkAmount);
    const smallerSouthWest = L.latLng(southWest.lat + shrinkAmount, southWest.lng + shrinkAmount);

    return L.latLngBounds(smallerSouthWest, smallerNorthEast);
}


/**
 * Limits a point to a bounds
 * @param point the point to limit
 * @param bounds the bounds to limit to
 * @returns the point limited to the bounds
 */
function limitToBounds(point, bounds) {
    const lat = Math.max(Math.min(point.lat, bounds.getNorth()), bounds.getSouth());
    const lng = Math.max(Math.min(point.lng, bounds.getEast()), bounds.getWest());
    return L.latLng(lat, lng);
}


/**
 * Checks if the map is within the bounds and moves it back if it is not
 * @param map the map to check
 * @param bounds the bounds to check
 */
function checkBounds(map, bounds) {
    let newCenter = map.getCenter();
    if (!bounds.contains(newCenter)) {
        newCenter = limitToBounds(newCenter, makeSmallerBounds(bounds, 0.5));
        map.panTo(newCenter, {animate: true, duration: 1});
    }
}


/**
 * Creates a map with the given sites
 * @param sites the sites to create the map with
 */
export function createMap(sites) {
    // create map
    const northEast = L.latLng(51.6, 6.05),
        southWest = L.latLng(50.4, 2.5),
        bounds = L.latLngBounds(southWest, northEast);

    const centerLat = (southWest.lat + northEast.lat) / 2;
    const centerLng = (southWest.lng + northEast.lng) / 2;


    const map = L.map('map', {
        center: [centerLat, centerLng],
        bounds: bounds,
        maxBoundsViscosity: 0.9,
        zoomControl: false,
    }).setView([centerLat, centerLng], 9);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        minZoom: 9
    }).addTo(map);

    const markers = [];

    // add markers
    sites.forEach((d) => {
        const marker = L.marker([d.lat, d.long]).addTo(map)
            .bindPopup(createPopUp(d))
            .bindTooltip(d.naam);
        markers.push(marker);
    });


    // check bounds
    map.on('moveend', () => {
        checkBounds(map, bounds);
    });
}