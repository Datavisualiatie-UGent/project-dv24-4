import * as d3 from "d3";


/**
 * This function calculates the number of months between two dates.
 * @param date1
 * @param date2
 * @returns {number}
 */
export function calculateMonthsBetween(date1, date2) {
    const startDate = new Date(date1);
    const endDate = new Date(date2);

    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();

    return years * 12 + months;
}


function getNormalizedSiteCumulativeCountsGemeente(siteTotalCountsMeanPerMonth, totalMothsCount, siteActiveSince, gemeenteActiveSince, siteIDs) {
    const siteCumulativeCounts = new Map();
    for (let [siteID, counts] of siteTotalCountsMeanPerMonth) {
        let cumulativeCounts = Array.from({length: totalMothsCount}, () => 0);

        const firstActiveMonth = siteActiveSince.get(siteID);
        // if the site is not active yet, we don't need to calculate the cumulative average
        if (firstActiveMonth >= cumulativeCounts.length) continue;

        cumulativeCounts[firstActiveMonth] = counts[firstActiveMonth];
        for (let i = firstActiveMonth + 1; i < cumulativeCounts.length; i++) {
            // look at the previous month divided by 2 to get the better trend
            cumulativeCounts[i] = (counts[i] + cumulativeCounts[i - 1]) / 2;
        }

        // other way to calculate the cumulative average
        /*for (let i = firstActiveMonth; i < cumulativeCounts.length; i++) {
            let cumulativeCount = 0;
            for (let j = firstActiveMonth; j <= i; j++) {
                cumulativeCount += counts[j];
            }
            cumulativeCounts[i] = cumulativeCount / (i + 1);
        }*/
        siteCumulativeCounts.set(siteID, cumulativeCounts);
    }


    const siteCumulativeCountsGemeente = new Map();
    for (let [gemeente, sites] of siteIDs) {

        let gemeenteCounts = Array.from({length: totalMothsCount}, () => 0)

        for (let index = 0; index < gemeenteCounts.length; index++) {
            let total = 0;
            let devide = 0;
            for (let site of sites) {
                if (siteActiveSince.get(site) <= index) {
                    total += siteCumulativeCounts.get(site)[index];
                    devide++;
                }
            }
            if (devide !== 0) {
                gemeenteCounts[index] = total / devide;
            } else {
                gemeenteCounts[index] = 0;
            }
        }
        if (gemeenteCounts.some(count => count > 0)) {
            siteCumulativeCountsGemeente.set(gemeente, gemeenteCounts);
        }
    }

    const normalizedSiteCumulativeCountsGemeente = new Map();
    for (let [gemeente, counts] of siteCumulativeCountsGemeente) {
        const firstCount = counts[gemeenteActiveSince.get(gemeente)];

        normalizedSiteCumulativeCountsGemeente.set(gemeente, counts.map(d => {
            if (d === 0) return 0;
            let percentageChange = ((d - firstCount) / firstCount);
            return percentageChange;
        }));
    }
    return normalizedSiteCumulativeCountsGemeente;
}


export function getResult(header, tellingen, siteIDs,sites) {

    function getElement(row, nameRow) {
        return row.split(",")[header.indexOf(nameRow)];
    }


    // + 1 because we want to include the last month
    const totalMothsCount = calculateMonthsBetween(getElement(tellingen[0], "van"), getElement(tellingen[tellingen.length - 1], "tot")) + 1;


    const siteActiveSince = new Map();
    for (let site of sites) {
        const monthsBetween = calculateMonthsBetween(getElement(tellingen[0], "van"), site.datum_van);
        if (monthsBetween < 0) {
            siteActiveSince.set(site.siteID, 0);
        } else {
            siteActiveSince.set(site.siteID, monthsBetween);
        }
    }

    const gemeenteActiveSince = new Map();
    for (let [gemeente, sites] of siteIDs) {
        const firstActiveMonth = d3.min(sites.map(siteID => siteActiveSince.get(siteID)));
        if (firstActiveMonth < 0) {
            gemeenteActiveSince.set(gemeente, 0);
        } else {
            gemeenteActiveSince.set(gemeente, firstActiveMonth);
        }
    }


    const siteTotalCounts = new Map();
    const siteTotalCountsDates = new Map();
// hier uit kan je de index halen en totaal aantal maanden

    for (let telling of tellingen) {
        if (!siteTotalCounts.has(getElement(telling, "siteID"))) {
            siteTotalCounts.set(getElement(telling, "siteID"), Array.from({length: totalMothsCount}, () => 0));
            siteTotalCountsDates.set(getElement(telling, "siteID"), Array.from({length: totalMothsCount}, () => null));
        }

        const diffMonth = calculateMonthsBetween(getElement(tellingen[0], "van"), getElement(telling, "van"));

        const siteCountsDate = siteTotalCountsDates.get(getElement(telling, "siteID"));

        if (siteCountsDate[diffMonth] === null) {
            siteCountsDate[diffMonth] = new Date(getElement(telling, "van"));
        }

        let siteCounts = siteTotalCounts.get(getElement(telling, "siteID"));
        siteCounts[diffMonth] += Number(getElement(telling, "aantal"));

        if (siteCountsDate[diffMonth] > new Date(getElement(telling, "van"))) {
            siteCountsDate[diffMonth] = new Date(getElement(telling, "van"));
        }
    }

    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    let siteTotalCountsMeanPerMonth = new Map();
    for (let [siteID, counts] of siteTotalCounts) {
        siteTotalCountsMeanPerMonth.set(siteID, Array.from({length: totalMothsCount}, () => 0));

        const siteCountsDate = siteTotalCountsDates.get(siteID);

        for (let i = 0; i < counts.length; i++) {

            if (siteCountsDate[i] === null) continue;

            siteTotalCountsMeanPerMonth.get(siteID)[i] = counts[i] / getDaysInMonth(siteCountsDate[i].getMonth(), siteCountsDate[i].getFullYear())
        }
    }

    return {
        normalizedSiteCumulativeCountsGemeente: Object.fromEntries(getNormalizedSiteCumulativeCountsGemeente(siteTotalCountsMeanPerMonth, totalMothsCount, siteActiveSince, gemeenteActiveSince, siteIDs)),
        totalMothsCount: totalMothsCount,
        gemeenteActiveSince: Object.fromEntries(gemeenteActiveSince),
        startDate: getElement(tellingen[0], "van"),
    }
}