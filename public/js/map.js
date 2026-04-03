document.addEventListener('DOMContentLoaded', async function() {
    const mapElement = document.getElementById('map');
    if (mapElement && window.maptilersdk && window.MAP_API_KEY) {
        try {
            window.maptilersdk.config.apiKey = window.MAP_API_KEY;

            // Ensure coordinates are in proper array format [lng, lat]
            let center = [16.62662018, 49.2125578]; // default
            if (window.LISTING_COORDINATES && Array.isArray(window.LISTING_COORDINATES)) {
                center = window.LISTING_COORDINATES;
            }

            const map = new window.maptilersdk.Map({
                container: 'map',
                style: window.maptilersdk.MapStyle.STREETS,
                center: center,
                zoom: 14 
            });

            map.addControl(new window.maptilersdk.NavigationControl(), 'top-right');

            // Add marker if listing coordinates are available
            if (window.LISTING_COORDINATES && Array.isArray(window.LISTING_COORDINATES)) {
                const marker = new window.maptilersdk.Marker({ color: '#FF0000' })
                    .setLngLat(window.LISTING_COORDINATES)
                    .setPopup(new window.maptilersdk.Popup().setHTML(
                        `<div><strong>${window.LISTING_TITLE || 'Listing'}</strong></div>`
                    ))
                    .addTo(map);
            }
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    } else {
        console.warn('Map element or MapTiler SDK not found');
    }
});