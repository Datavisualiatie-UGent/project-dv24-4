function extractInstallationDate(d) {
    const date = new Date(d.datum_van);
    return 'Datum eerste telling: ' + String(date.getDate()).padStart(2, '0') + '/' + String((date.getMonth() + 1)).padStart(2, '0') + '/' + date.getFullYear();
}

export function createPopUp(d) {
    return 'Naam site: ' + d.naam + '<br>' +
        'Naam gemeente: ' + d.gemeente + '<br>' +
        'Interval tellingen: ' + d.interval + "minuten" + '<br>' +
        extractInstallationDate(d)
}