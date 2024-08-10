export function loadVideoLinks(planet) {
    // Placeholder function to load video links based on the planet (this should connect to a backend or local storage)
    return new Promise(resolve => {
        const links = [
            { url: 'https://www.youtube.com/watch?v=lFzbqFcePp8', label: 'Spanish Speech' }
        ];
        resolve(links);
    });
}

export function saveVideoLink(planet, link) {
    // Placeholder function to save a video link for a specific planet (this should connect to a backend or local storage)
    return new Promise(resolve => {
        console.log(`Saved link: ${link} for planet: ${planet}`);
        resolve();
    });
}
