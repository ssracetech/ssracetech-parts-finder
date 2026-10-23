(function () {
    "use strict";

    const $ = id => document.getElementById(id);

    // Remember a broad product request while asking for a size.
    let pendingFollowUpQuery = "";
    let pendingFollowUpType = "";
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[ch]);

    function plainText(html) {
        return String(html || "")
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
            .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;|&#160;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&quot;/gi, '"')
            .replace(/&#39;|&apos;/gi, "'")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            .replace(/\s+/g, " ")
            .trim();
    }


function normalise(text) {
    return String(text || "")
        .toLowerCase()
        // Common customer shorthand and catalogue wording variants.
        .replace(/\bally\b/g, "aluminium")
        .replace(/\baluminum\b/g, "aluminium")
        .replace(/\btubing\b/g, "tube")
        .replace(/\bhardline\b/g, "hard line")
        .replace(/\bbrakeline\b/g, "brake line")
        .replace(/<[^>]*>/g, " ")
        .replace(/[^a-z0-9.+-]+/g, " ")
        .trim();
}

function scoreSpecifications(product, query) {
    const rawQuery = String(query || "");
    const q = normalise(rawQuery);

    const productText = [
        product.title,
        product.tags,
        product.type,
        product.category,
        ...(product.variants || []).map(v =>
            [v.sku, v.option1, v.option2, v.option3].join(" ")
        )
    ].join(" ");

    let bonus = 0;

    // Prefer explicitly requested materials across all catalogue categories.
    const requestedMaterial =
        /\baluminium\b|\baluminum\b/.test(q) ? "aluminium" :
        /\bstainless\s+steel\b|\bstainless\b/.test(q) ? "stainless" :
        /\bsilicone\b/.test(q) ? "silicone" :
        /\bsteel\b/.test(q) ? "steel" :
        /\bplastic\b|\bnylon\b/.test(q) ? "plastic" : "";

    if (requestedMaterial) {
        const titleAndType = normalise(
            String(product.title || "") + " " +
            String(product.type || "") + " " +
            String(product.category || "") + " " +
            String(product.tags || "")
        );

        const isAluminium =
            /\baluminium\b|\baluminum\b/.test(titleAndType);
        const isStainless =
            /\bstainless\b/.test(titleAndType);
        const isSilicone = /\bsilicone\b/.test(titleAndType);
        const isSteel =
            /\bsteel\b/.test(titleAndType) && !isStainless;
        const isPlastic =
            /\bplastic\b|\bnylon\b/.test(titleAndType);

        const matchesMaterial =
            requestedMaterial === "aluminium" ? isAluminium :
            requestedMaterial === "stainless" ? isStainless :
            requestedMaterial === "silicone" ? isSilicone :
            requestedMaterial === "steel" ? isSteel :
            requestedMaterial === "plastic" ? isPlastic : false;

        const hasConflictingMaterial =
            requestedMaterial === "aluminium" &&
                (isStainless || isSilicone || isSteel) ||
            requestedMaterial === "stainless" &&
                (isAluminium || isSilicone) ||
            requestedMaterial === "silicone" &&
                (isAluminium || isStainless || isSteel) ||
            requestedMaterial === "steel" &&
                (isAluminium || isStainless || isSilicone) ||
            requestedMaterial === "plastic" &&
                (isAluminium || isStainless || isSilicone || isSteel);

        if (matchesMaterial) {
            bonus += 100;
        } else if (hasConflictingMaterial) {
            bonus -= 100;
        }
    }

    // Match requested inch sizes precisely: 3 inches is not 3.5 inches.
    function extractInchSizes(text) {
        const sizes = [];
        const pattern =
            /(?:^|[^0-9.])(\d+(?:\.\d+)?)\s*(?:inches|inch|in\.?\b|["]|\u2033)/gi;

        let match;
        while ((match = pattern.exec(String(text || ""))) !== null) {
            sizes.push(Number(match[1]));
        }
        return sizes;
    }

    const requestedSizes = extractInchSizes(rawQuery);
    const productSizes = extractInchSizes(productText);

    if (requestedSizes.length) {
        const sizeMatches = requestedSizes.every(size =>
            productSizes.some(productSize =>
                Math.abs(productSize - size) < 0.01
            )
        );

        if (sizeMatches) {
            bonus += 100;
        } else if (productSizes.length) {
            bonus -= 40;
        }
    }

    // Match the requested bend or elbow angle.
    const requestedAngles = [
        ...rawQuery.matchAll(/\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi)
    ].map(match => Number(match[1]));

    const productAngles = [
        ...productText.matchAll(/\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi)
    ].map(match => Number(match[1]));

    for (const angle of requestedAngles) {
        if (productAngles.includes(angle)) {
            bonus += 70;
        } else if (productAngles.length) {
            bonus -= 25;
        }
    }

    // Match metric dimensions such as M8 x 70 exactly.
    const metricPattern =
        /\bm\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i;

    const requestedMetric = rawQuery.match(metricPattern);
    const productMetric = productText.match(metricPattern);

    if (requestedMetric) {
        if (
            productMetric &&
            Math.abs(Number(productMetric[1]) - Number(requestedMetric[1])) < 0.01 &&
            Math.abs(Number(productMetric[2]) - Number(requestedMetric[2])) < 0.01
        ) {
            bonus += 150;
        } else if (productMetric) {
            bonus -= 40;
        }
    }

    // Prefer silicone bends when the customer specifically asks for one.
    if (/\bsilicone\b/.test(q) && /\bbend\b/.test(q)) {
        const title = normalise(product.title);
        const type = normalise(product.type + " " + product.category);

        if (/\bbend\b/.test(title)) {
            bonus += 35;
        } else if (/\b(elbow|coupler)\b/.test(title) &&
                   /\bsilicone\b/.test(title + " " + type)) {
            bonus += 15;
        }
    }

    return bonus;
}
    function scoreProduct(product, query) {
        const q = normalise(query);
        const terms = q.split(/\s+/).filter(Boolean);
        if (!terms.length) return 0;

        const title = normalise(product.title);
        const vendor = normalise(product.vendor);
        const type = normalise(
            String(product.type || "") + " " +
            String(product.category || "")
        );
        const tags = normalise(product.tags);
        const description = normalise(plainText(product.description));
        const variants = Array.isArray(product.variants)
            ? product.variants
            : [];

        const skus = normalise(variants.map(v => v.sku || "").join(" "));
        const options = normalise(variants.map(v =>
            [v.option1, v.option2, v.option3].filter(Boolean).join(" ")
        ).join(" "));

        const identity = normalise([
            product.title,
            product.type,
            product.category,
            product.tags
        ].join(" "));

        // Keep the existing hose-end intent and size protection.
        const wantsHoseEnd =
            /\bhose[\s-]*ends?\b/.test(q) ||
            /\bhoseend\b/.test(q) ||
            /\bhose[\s-]*tails?\b/.test(q);

        const isHoseEnd =
            /\bhose[\s-]*ends?\b/.test(identity) ||
            /\bhoseend\b/.test(identity) ||
            /\bhose[\s-]*tails?\b/.test(identity);

        const isAlternativeFitting =
            /\b(adapter|adaptor|union|connector|reducer|tee|elbow|bulkhead|flare|coupler|swivel)\b/.test(identity);

        if (wantsHoseEnd && !isHoseEnd && !isAlternativeFitting) {
            return 0;
        }

        const requestedAN = q.match(/(?:^|\s)-\s*0?(\d{1,2})\s*an\b/i);

        if (wantsHoseEnd && requestedAN) {
            const size = Number(requestedAN[1]);
            const sizeEvidence = normalise([
                product.title,
                product.tags,
                variants.map(v =>
                    [v.sku, v.option1, v.option2, v.option3].join(" ")
                ).join(" ")
            ].join(" "));

            const sizePattern = new RegExp(
                "(?:^|\\s)-?0?" + size + "\\s*(?:an)?(?:\\s|$)",
                "i"
            );

            if (!sizePattern.test(sizeEvidence)) return 0;
        }

        // Identify the main part type requested by the customer.
        const categoryGroups = [
            { pattern: /\b(starter|starting)\s*motor\b|\bmini\s*starter\b/, words: ["starter", "motor"] },
            { pattern: /\bhose[\s-]*ends?\b|\bhoseend\b|\bhose[\s-]*tails?\b/, words: ["hose", "end"] },
            { pattern: /\bsilicone\b.*\b(bend|elbow|coupler)\b|\b(bend|elbow|coupler)\b.*\bsilicone\b/, words: ["silicone", "bend"] },
            { pattern: /\b(screw|bolt|stud|fastener)s?\b/, words: ["screw", "bolt", "stud", "fastener"] },
            { pattern: /\b(water\s*neck|thermostat\s*housing)\b/, words: ["water", "neck"] },
            { pattern: /\b(fuel\s*rail)s?\b/, words: ["fuel", "rail"] },
            { pattern: /\b(flexplate|flywheel)s?\b/, words: ["flexplate", "flywheel"] },
            { pattern: /\b(gasket|seal)s?\b/, words: ["gasket", "seal"] },
            { pattern: /\b(?:aluminium|aluminum)\b.*\bdonuts?\b|\bdonuts?\b.*\b(?:aluminium|aluminum)\b/, words: ["donut"] },
            { pattern: /\b(intake|manifold)s?\b/, words: ["intake", "manifold"] },
            { pattern: /\b(reducer|reducing)\b/, words: ["reducer"] },
            { pattern: /\b(elbow|bend)s?\b/, words: ["elbow", "bend"] },
            { pattern: /\b(adapter|adaptor)s?\b/, words: ["adapter", "adaptor"] },
            { pattern: /\b(union|connector|coupler)s?\b/, words: ["union", "connector", "coupler"] }
        ];

        const requestedGroups = categoryGroups.filter(group =>
            group.pattern.test(q)
        );

        const productMatchesRequestedType = requestedGroups.length === 0 ||
            requestedGroups.some(group =>
                group.pattern.test(identity) ||
                group.pattern.test(title)
            );

        // A clearly different product type should not qualify on stray
        // words in its description alone.
        if (requestedGroups.length && !productMatchesRequestedType) {
            return 0;
        }

        let score = 0;

        // Air-filter intent: match the requested intake neck size.
        const wantsAirFilter =
            /\bair\s*filters?\b|\bpod\s*filters?\b/i.test(q);
        const filterSizeMatch =
            q.match(/\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/i);
        const explicitlyRequestsElement =
            /\b(element|cleaner|replacement|height|high)\b/i.test(q);

        if (
            wantsAirFilter &&
            filterSizeMatch &&
            !explicitlyRequestsElement
        ) {
            const requestedInches = Number(filterSizeMatch[1]);
            const productHasNeck = /\bneck\b/i.test(title);
            const productIsElement =
                /\b(element|cleaner|round\s*insert)\b/i.test(title);

            const neckMatch = title.match(
                /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")\s*neck\b|\bneck\b[^,;)]{0,20}?\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/i
            );
            const neckMMMatch = title.match(
                /\b(\d+(?:\.\d+)?)\s*mm\s*(?:\([^)]*\)\s*)?(?:neck)\b/i
            );

            let actualNeckInches = null;

            if (neckMatch) {
                actualNeckInches = Number(neckMatch[1] || neckMatch[2]);
            } else if (neckMMMatch) {
                actualNeckInches = Number(neckMMMatch[1]) / 25.4;
            }

            if (actualNeckInches !== null) {
                if (Math.abs(actualNeckInches - requestedInches) < 0.06) {
                    score += 100;
                } else {
                    score -= 100;
                }
            } else if (productHasNeck) {
                score += 10;
            }

            if (productIsElement && !productHasNeck) score -= 35;
        }

        // Exact title and SKU matches are strong evidence.
        if (title === q) score += 200;
        else if (title.includes(q)) score += 100;

        if (skus.split(/\s+/).includes(q)) score += 180;
        else if (skus.includes(q)) score += 80;

        // Product identity fields carry more weight than descriptions.
        let titleMatches = 0;
        let identityMatches = 0;
        let meaningfulTerms = 0;

        const stopWords = new Set([
            "a", "an", "the", "for", "and", "or", "to", "of",
            "with", "need", "want", "find", "me", "please"
        ]);

        const titleWords = title.split(/\s+/).filter(Boolean);

        function editDistance(a, b) {
            let previous = Array.from(
                { length: b.length + 1 },
                (_, i) => i
            );

            for (let i = 1; i <= a.length; i++) {
                let diagonal = previous[0];
                previous[0] = i;

                for (let j = 1; j <= b.length; j++) {
                    const above = previous[j];

                    previous[j] = Math.min(
                        previous[j] + 1,
                        previous[j - 1] + 1,
                        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
                    );

                    diagonal = above;
                }
            }

            return previous[b.length];
        }
        for (const term of terms) {
            if (stopWords.has(term)) continue;
            meaningfulTerms++;

            let best = 0;

            if (title.split(/\s+/).includes(term)) best = Math.max(best, 18);
            else if (title.includes(term)) best = Math.max(best, 10);

            if (skus.split(/\s+/).includes(term)) best = Math.max(best, 20);
            if (vendor.split(/\s+/).includes(term)) best = Math.max(best, 8);
            if (type.split(/\s+/).includes(term)) best = Math.max(best, 12);
            if (tags.split(/\s+/).includes(term)) best = Math.max(best, 9);
            if (options.split(/\s+/).includes(term)) best = Math.max(best, 8);

            // Description matches are deliberately weak so unrelated
            // products don't rise because of incidental wording.
            if (description.split(/\s+/).includes(term)) {
                best = Math.max(best, 1);
            }

            // Fuzzy-match ordinary words against product titles only.
            // Never fuzzy-match numbers, sizes, or part numbers.
            let fuzzyTitleMatch = false;

            if (best <= 1 && /^[a-z]{4,}$/.test(term)) {
                const maxDistance = term.length >= 8 ? 2 : 1;

                fuzzyTitleMatch = titleWords.some(word =>
                    /^[a-z]+$/.test(word) &&
                    Math.abs(word.length - term.length) <= maxDistance &&
                    editDistance(term, word) <= maxDistance
                );

                if (fuzzyTitleMatch) best = 12;
            }

            if (
                title.split(/\s+/).includes(term) ||
                fuzzyTitleMatch
            ) {
                titleMatches++;
            }

            score += best;

            if (
                title.split(/\s+/).includes(term) ||
                fuzzyTitleMatch ||
                type.split(/\s+/).includes(term) ||
                tags.split(/\s+/).includes(term)
            ) {
                identityMatches++;
            }
        }

        if (meaningfulTerms && titleMatches === meaningfulTerms) {
            score += 35;
        }

        if (meaningfulTerms > 1) {
            score += Math.round(
                (titleMatches / meaningfulTerms) * 45
            );
        }

        // Use catalogue descriptions to distinguish vehicle makes
        // and known engine families.
        const vehicleEvidence = normalise([
            product.title,
            product.tags,
            product.type,
            product.category,
            plainText(product.description)
        ].join(" ")).replace(/\bchev\b/g, "chevrolet");

        const queryVehicle = q.replace(/\bchev\b/g, "chevrolet");

        const wantsChevrolet = /\bchevrolet\b/.test(queryVehicle);
        const wantsFord = /\bford\b/.test(queryVehicle);
        const wantsHolden = /\bholden\b/.test(queryVehicle);

        const productChevrolet = /\bchevrolet\b/.test(vehicleEvidence);
        const productFord = /\bford\b/.test(vehicleEvidence);
        const productHolden = /\bholden\b/.test(vehicleEvidence);

        // Exclude clearly conflicting makes.
        if (wantsChevrolet && productFord && !productChevrolet) return 0;
        if (wantsChevrolet && productHolden && !productChevrolet) return 0;
        if (wantsFord && productChevrolet && !productFord) return 0;
        if (wantsFord && productHolden && !productFord) return 0;
        if (wantsHolden && productChevrolet && !productHolden) return 0;
        if (wantsHolden && productFord && !productHolden) return 0;

        // A traditional 350 Chevrolet search should not treat an
        // LS1/LS2-specific starter as a direct fitment match.
        const wants350Chevrolet =
            /\b350\b/.test(queryVehicle) && wantsChevrolet;

        const isLSSpecific =
            /\bls\s*1\b|\bls\s*2\b|\bls1\b|\bls2\b/.test(vehicleEvidence);

        if (wants350Chevrolet && isLSSpecific) return 0;

        const vehicleClues = terms.filter(term =>
            /^(chev|chevrolet|ford|holden|commodore|falcon|ls[1-9]?|sb|bb)$/.test(term)
        );

        for (const clue of vehicleClues) {
            const normalisedClue = clue === "chev" ? "chevrolet" : clue;

            if (vehicleEvidence.split(/\s+/).includes(normalisedClue)) {
                score += 25;
            } else if (requestedGroups.length) {
                score -= 12;
            }
        }
        if (requestedGroups.length) score += 30;

        return score > 0 ? score : 0;
    }
    function formatPrice(value) {
        if (value === "" || value == null) return "Price not listed";
        const number = Number(value);
        if (!Number.isFinite(number)) return escapeHTML(value);
        return number.toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD"
        });
    }

    function productCard(product) {
        const variant = product.variants.find(v => v.sku) || product.variants[0];
        const image = product.images[0] || (variant && variant.image) || "";
        const price = variant ? formatPrice(variant.price) : "Price not listed";
        const sku = variant && variant.sku ? variant.sku : "SKU not listed";
        const url = "https://racereadygear.com.au/products/" +
            encodeURIComponent(product.handle);

        return `
            <article class="v7-product">
                ${image ? `<img class="v7-product-image" src="${escapeHTML(image)}" alt="${escapeHTML(product.title)}" loading="lazy">` : ""}
                <div class="v7-product-info">
                    <strong>${escapeHTML(product.title)}</strong>
                    <div>SKU: ${escapeHTML(sku)}</div>
                    <div>${price}</div>
                    ${product.variants.length > 1
                        ? `<div>${product.variants.length} catalogue variants</div>` : ""}
                    <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">View product</a>
                </div>
            </article>`;
    }

    function addMessage(content, role) {
        const messages = $("messages");
        if (!messages) return;

        const row = document.createElement("div");
        row.className = "message-row " + (role === "user" ? "user-row" : "bot-row");

        const bubble = document.createElement("div");
        bubble.className = (role === "user" ? "user" : "bot") + " message-bubble";
        bubble.innerHTML = content;

        row.appendChild(bubble);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    async function sendV7Message(query) {
        query = String(query || "").trim();
        if (!query) return;

        const displayQuery = query;

        const isSizeReply =
            /^(?:\d+(?:\.\d+)?\s*(?:inch(?:es)?|in\.?|["]|\u2033)?)$/i.test(query);

        let requestedHoseSeries =
            (query.match(/\b(100|200|400)\s*series\b/i) || [])[1] || "";
        let answeringHoseSeries = false;

        if (pendingFollowUpQuery && pendingFollowUpType === "hose_series") {
            answeringHoseSeries = true;

            const isNotSureReply = /\bnot\s+sure\b/i.test(query);
            const seriesReply = query.match(/\b(100|200|400)\s*series\b/i);

            requestedHoseSeries = isNotSureReply
                ? ""
                : (seriesReply ? seriesReply[1] : "");

            // Restore the original request so the original size and intent remain.
            query = pendingFollowUpQuery;

            pendingFollowUpQuery = "";
            pendingFollowUpType = "";
        } else if (
            pendingFollowUpQuery &&
            pendingFollowUpType === "size" &&
            isSizeReply
        ) {
            query = pendingFollowUpQuery + " " + query;
            pendingFollowUpQuery = "";
            pendingFollowUpType = "";
        } else if (pendingFollowUpQuery) {
            pendingFollowUpQuery = "";
            pendingFollowUpType = "";
        }

        addMessage(escapeHTML(displayQuery), "user");

        const input = $("userInput");
        if (input) input.value = "";

        addMessage('<div class="message-label">SS RACETECH V7</div><p>Searching the catalogue...</p>', "bot");

        const messages = $("messages");
        const waiting = messages && messages.lastElementChild;

        try {
            const products = (await window.ssrV7Ready).filter(product =>
    String(product.status || "").trim().toLowerCase() === "active" &&
    String(product.published || "").trim().toLowerCase() === "true"
);
// V7 ACTIVE PRODUCT FILTER

const queryIsSiliconeBend =
    /\bsilicone\b/i.test(query) &&
    /\b(bend|elbow)\b/i.test(query) &&
    !/\b(reducer|reducing)\b/i.test(query);


            const queryIsHoseEnd =
                /\bhose[\s-]*ends?\b/i.test(query) ||
                /\bhoseend\b/i.test(query) ||
                /\bhose[\s-]*tails?\b/i.test(query);

            const queryIsHardline =
                /\bhard\s*line\b|\bhardline\b/i.test(normalise(query));

            const queryIsBrakeLine =
                /\bbrake\s*hard\s*line\b|\bbrake\s*line\b|\bbrakeline\b|\bbrake\s*(pipe|tubing)\b/i.test(normalise(query));

            const queryIsBrakeHardline =
                queryIsBrakeLine && queryIsHardline;



const getProductIdentity = product =>
    normalise(
        product.title + " " + product.tags + " " +
        product.type + " " + product.category
    );


const isExactHoseEnd = product => {
    const title = normalise(product.title);
    const rawTitle = String(product.title || "");

    // The product title must identify a genuine hose end.
    const isHoseEnd =
        /\bhose[\s-]*ends?\b|\bhoseend\b/i.test(title);

    // Hose tails are not interchangeable with AN hose ends.
    if (!isHoseEnd || /\bhose[\s-]*tails?\b/i.test(title)) {
        return false;
    }

    // Match the requested AN size when one is supplied.
    const requestedAN = query.match(/(?:^|\s)-\s*0?(\d{1,2})\s*AN\b/i);

    if (requestedAN) {
        const size = Number(requestedAN[1]);
        // Check the original product title, including its SKU.
        // Exact numeric tokens prevent -6 from matching -16 or -8.
        const sizeTokens = [
            ...rawTitle.matchAll(/-(\d{1,2})(?=$|[\s-])/g)
        ].map(match => Number(match[1]));

        if (!sizeTokens.includes(size)) return false;
    }

    // Identify the series from the product code, not the image or description.
    if (requestedHoseSeries) {
        const skuText = (product.variants || [])
            .map(variant => variant.sku || "")
            .join(" ");
        const seriesCode = (rawTitle + " " + skuText).match(
            /(?:^|[^0-9])([124]0\d)-\d{2}\b/i
        );

        if (!seriesCode) return false;

        const productSeries = String(Number(seriesCode[1][0]) * 100);
        if (productSeries !== requestedHoseSeries) return false;
    }

    // If straight is requested, exclude angled hose ends.
    const requestsStraight = /\bstraight\b/i.test(query);

    if (requestsStraight) {
        return /\bstraight\b/i.test(title) &&
            !/\b\d{1,3}\s*(?:degrees?|deg\b|\u00B0)/i.test(rawTitle);
    }

    // If a particular angle is requested, require that exact angle
    // to be stated in the product title.
    const requestedAngle = query.match(
        /\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/i
    );

    if (requestedAngle) {
        const angle = Number(requestedAngle[1]);
        const productAngles = [
            ...rawTitle.matchAll(
                /\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi
            )
        ].map(match => Number(match[1]));

        if (!productAngles.includes(angle)) return false;
    }

    return true;
};
const isOtherFitting = product =>
    /\b(adapter|adaptor|union|connector|reducer|tee|elbow|bulkhead|flare|coupler|swivel)\b/i.test(
        getProductIdentity(product)
    );


            const requestedMetric = query.match(
    /\bm\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i
);

const ranked = products
    .map(product => {
        const score =
            scoreProduct(product, query) +
            scoreSpecifications(product, query);

        // Final vehicle-fitment guard. This prevents another scoring
        // rule from reintroducing a clearly conflicting application.
        const fitmentText = normalise([
            product.title,
            product.tags,
            product.type,
            product.category,
            plainText(product.description)
        ].join(" ")).replace(/\bchev\b/g, "chevrolet");

        const fitmentQuery = normalise(query)
            .replace(/\bchev\b/g, "chevrolet");

        const wantsChevrolet = /\bchevrolet\b/.test(fitmentQuery);
        const wantsFord = /\bford\b/.test(fitmentQuery);
        const wantsHolden = /\bholden\b/.test(fitmentQuery);

        const productChevrolet = /\bchevrolet\b/.test(fitmentText);
        const productFord = /\bford\b/.test(fitmentText);
        const productHolden = /\bholden\b/.test(fitmentText);

        const wants350 = /\b350\b/.test(fitmentQuery);
        const wantsLS = /\bls\s*1\b|\bls1\b|\bls\s*2\b|\bls2\b/.test(fitmentQuery);
        const productIsLS = /\bls\s*1\b|\bls\s*2\b|\bls1\b|\bls2\b/.test(fitmentText);

        const conflictsWithVehicle =
            (wantsChevrolet && productFord && !productChevrolet) ||
            (wantsChevrolet && productHolden && !productChevrolet) ||
            (wantsFord && productChevrolet && !productFord) ||
            (wantsFord && productHolden && !productFord) ||
            (wantsHolden && productChevrolet && !productHolden) ||
            (wantsHolden && productFord && !productHolden) ||
            (wants350 && wantsChevrolet && productIsLS) ||
            (wantsLS && (productFord || productHolden)) ||
            (wantsLS && productChevrolet && !productIsLS);

        const finalScore = conflictsWithVehicle ? 0 : score;

        const productText = [
            product.title,
            product.tags,
            product.type,
            product.category,
            ...(product.variants || []).map(v =>
                [v.sku, v.option1, v.option2, v.option3].join(" ")
            )
        ].join(" ");

        const productMetric = productText.match(
            /\bm\s*(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i
        );

        const exactMetric = Boolean(
            requestedMetric &&
            productMetric &&
            Math.abs(Number(productMetric[1]) - Number(requestedMetric[1])) < 0.01 &&
            Math.abs(Number(productMetric[2]) - Number(requestedMetric[2])) < 0.01
        );

        return {
            product,
            score: finalScore,
            exactMetric
        };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => {
        const wantsAirFilter =
            /\b(?:air|pod)\s*filters?\b/i.test(query);

        const requestedFilterSizeMatch = query.match(
            /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/i
        );

        if (wantsAirFilter && requestedFilterSizeMatch) {
            const requestedNeckInches =
                Number(requestedFilterSizeMatch[1]);

            const getFilterDetails = item => {
                const title = String(item.product.title || "");

                const isPod =
                    /\bpod\s*(?:air\s*)?filter\b/i.test(title);

                const isElement =
                    /\b(element|cleaner|round\s*insert)\b/i.test(title);

                let neckInches = null;

                const mixedNeck = title.match(
                    /\b(\d+)\s*-\s*(\d+)\s*\/\s*(\d+)\s*(?:inch(?:es)?|in\b|")\s*neck\b/i
                );

                const mmNeck = title.match(
                    /\b(\d+(?:\.\d+)?)\s*mm\s*(?:\([^)]*\)\s*)?neck\b/i
                );

                const inchNeck = title.match(
                    /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")\s*neck\b/i
                );

                const parentheticalInchNeck = title.match(
                    /\b(\d+(?:\.\d+)?)\s*mm\s*\(\s*(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")\s*\)\s*neck\b/i
                );

                if (mixedNeck && Number(mixedNeck[3]) !== 0) {
                    neckInches =
                        Number(mixedNeck[1]) +
                        Number(mixedNeck[2]) / Number(mixedNeck[3]);
                } else if (parentheticalInchNeck) {
                    neckInches = Number(parentheticalInchNeck[2]);
                } else if (mmNeck) {
                    neckInches = Number(mmNeck[1]) / 25.4;
                } else if (inchNeck) {
                    neckInches = Number(inchNeck[1]);
                }

                const heightMatch = title.match(
                    /\b(\d+(?:\.\d+)?)\s*mm\s*high\b/i
                );

                const height = heightMatch
                    ? Number(heightMatch[1])
                    : null;

                if (neckInches !== null) {
                    if (
                        Math.abs(neckInches - requestedNeckInches) < 0.06
                    ) {
                        return {
                            rank: isPod ? 0 : 1,
                            height
                        };
                    }

                    return { rank: 4, height };
                }

                if (isElement) return { rank: 5, height };

                return {
                    rank: isPod ? 2 : 3,
                    height
                };
            };

            const filterA = getFilterDetails(a);
            const filterB = getFilterDetails(b);

            if (filterA.rank !== filterB.rank) {
                return filterA.rank - filterB.rank;
            }

            if (
                filterA.rank === 0 &&
                filterA.height !== null &&
                filterB.height !== null &&
                filterA.height !== filterB.height
            ) {
                return filterB.height - filterA.height;
            }
        }

        // Query-specific ranking: activate only for tube or bend searches.
        const queryText = normalise(String(query || ""));
        const wantsTube = /\b(tube|tubing|pipe|piping)\b/i.test(queryText);
        const wantsBend = /\b(bend|bends|elbow|elbows)\b/i.test(queryText);

        const requestedSizeMatch = String(query || "").match(
            /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/i
        );
        const requestedSize = requestedSizeMatch
            ? Number(requestedSizeMatch[1])
            : null;

        const requestedAngleMatch = String(query || "").match(
            /\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0|(?=\s+(?:bend|bends|elbow|elbows)\b))/i
        );
        const requestedAngle = requestedAngleMatch
            ? Number(requestedAngleMatch[1])
            : null;

        const requestedMaterial =
            /\baluminium\b|\baluminum\b/.test(queryText) ? "aluminium" :
            /\bstainless(?:\s+steel)?\b/.test(queryText) ? "stainless" :
            /\bsilicone\b/.test(queryText) ? "silicone" :
            /\bsteel\b/.test(queryText) ? "steel" :
            /\bplastic\b|\bnylon\b/.test(queryText) ? "plastic" : "";

        const useTubePriority = wantsTube && !wantsBend;
        const useBendPriority = wantsBend;

        if (useTubePriority || useBendPriority) {
            const getPriorityDetails = item => {
                const title = normalise([
                    item.product.title,
                    item.product.type,
                    item.product.category
                ].join(" "));

                const sizes = [
                    ...title.matchAll(
                        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/gi
                    )
                ].map(match => Number(match[1]));

                const exactSize = requestedSize !== null &&
                    sizes.some(size => Math.abs(size - requestedSize) < 0.01);

                const hasAluminium =
                    /\baluminium\b|\baluminum\b/.test(title);
                const hasStainless = /\bstainless\b/.test(title);
                const hasSilicone = /\bsilicone\b/.test(title);
                const hasSteel =
                    /\bsteel\b/.test(title) && !hasStainless;
                const hasPlastic = /\bplastic\b|\bnylon\b/.test(title);

                const materialMatches =
                    requestedMaterial === "aluminium" ? hasAluminium :
                    requestedMaterial === "stainless" ? hasStainless :
                    requestedMaterial === "silicone" ? hasSilicone :
                    requestedMaterial === "steel" ? hasSteel :
                    requestedMaterial === "plastic" ? hasPlastic : false;

                const materialConflicts =
                    requestedMaterial === "aluminium"
                        ? hasStainless || hasSilicone || hasSteel :
                    requestedMaterial === "stainless"
                        ? hasAluminium || hasSilicone :
                    requestedMaterial === "silicone"
                        ? hasAluminium || hasStainless || hasSteel :
                    requestedMaterial === "steel"
                        ? hasAluminium || hasStainless || hasSilicone :
                    requestedMaterial === "plastic"
                        ? hasAluminium || hasStainless || hasSilicone || hasSteel :
                    false;

                const materialRank = !requestedMaterial ? 0 :
                    materialMatches ? 0 :
                    materialConflicts ? 2 : 1;

                // Exclude hardware and fittings that mention tube or pipe
                // but are not themselves tube/pipe products.
                const isAccessory =
                    /\b(clamps?|separators?|valves?|fittings?|adapters?|adaptors?|brackets?|holders?|clips?|retainers?|mounts?|connectors?|couplers?|reducers?)\b/i
                        .test(title);

                const isTubeProduct =
                    /\b(tube|tubing|pipe|piping)\b/i.test(title) &&
                    !isAccessory;

                const isStraight = isTubeProduct &&
                    /\bstraight\b/i.test(title) &&
                    !/\b(elbow|bend|bends|coupler)\b/i.test(title);

                const isBend = isTubeProduct &&
                    /\b(elbow|bend|bends)\b/i.test(title);

                // Lower rank is better:
                // exact-size straight, exact-size bend, other exact-size
                // tube, then less-certain tube matches, then unrelated items.
                const tubeRank = !isTubeProduct ? 6 :
                    exactSize && isStraight ? 0 :
                    exactSize && isBend ? 1 :
                    exactSize ? 2 :
                    isStraight ? 3 :
                    isBend ? 4 : 5;

                const angles = [
                    ...title.matchAll(
                        /\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi
                    )
                ].map(match => Number(match[1]));

                const angleRank = requestedAngle === null ? 0 :
                    angles.includes(requestedAngle) ? 0 :
                    angles.length ? 2 : 1;

                return {
                    exactSize,
                    materialRank,
                    angleRank,
                    tubeRank
                };
            };

            const priorityA = getPriorityDetails(a);
            const priorityB = getPriorityDetails(b);

            // Tube searches: requested material first, then genuine product
            // type and exact size. This works across catalogue brands.
            if (useTubePriority) {
                if (
                    requestedMaterial &&
                    priorityA.materialRank !== priorityB.materialRank
                ) {
                    return priorityA.materialRank - priorityB.materialRank;
                }

                if (priorityA.tubeRank !== priorityB.tubeRank) {
                    return priorityA.tubeRank - priorityB.tubeRank;
                }
            }

            // Preserve size and angle priorities for bend/elbow searches.
            if (useBendPriority) {
                if (
                    requestedSize !== null &&
                    priorityA.exactSize !== priorityB.exactSize
                ) {
                    return priorityA.exactSize ? -1 : 1;
                }

                if (
                    requestedMaterial &&
                    priorityA.materialRank !== priorityB.materialRank
                ) {
                    return priorityA.materialRank - priorityB.materialRank;
                }

                if (priorityA.angleRank !== priorityB.angleRank) {
                    return priorityA.angleRank - priorityB.angleRank;
                }
            }
        }
        if (requestedMetric && a.exactMetric !== b.exactMetric) {
            return a.exactMetric ? -1 : 1;
        }

        return b.score - a.score ||
            a.product.title.localeCompare(b.product.title);
    });


// V7 EXPLICIT AN CONNECTION GUARD
// For general AN-size searches, verify the connection from the product
// title or description rather than relying on catalogue tags alone.
const requestedANConnection = query.match(
    /(?:^|\s)-\s*0?(\d{1,2})\s*AN\b/i
);

if (
    requestedANConnection &&
    !queryIsHoseEnd &&
    !queryIsHardline &&
    !queryIsBrakeLine
) {
    const requestedANSize = Number(requestedANConnection[1]);

    const verifiedANResults = ranked.filter(item => {
        const title = normalise(item.product.title || "");
        const description = normalise(
            plainText(item.product.description || "")
        );
        const evidence = title + " " + description;

        const explicitANConnection = new RegExp(
            "(?:-\\s*0?" + requestedANSize +
            "\\s*AN\\b|\\bAN\\s*-\\s*0?" +
            requestedANSize + "\\b)",
            "i"
        ).test(evidence);

        const genuineHoseEnd =
            /\bhose[\s-]*ends?\b|\bhoseend\b/i.test(title) &&
            !/\bhose[\s-]*tails?\b/i.test(title);

        const titleSizeTokens = [
            ...String(item.product.title || "").matchAll(
                /-(\d{1,2})(?=$|[\s-])/g
            )
        ].map(match => Number(match[1]));

        const correctlySizedHoseEnd =
            genuineHoseEnd &&
            titleSizeTokens.includes(requestedANSize);

        return explicitANConnection || correctlySizedHoseEnd;
    });

    ranked.splice(0, ranked.length, ...verifiedANResults);
}

// Keep aluminium donut searches strictly within the requested product type.
if (/\b(?:aluminium|aluminum)\b/i.test(query) && /\bdonuts?\b/i.test(query)) {
    const requestedSizeMatch = query.match(
        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\.?\b|["]|\u2033)/i
    );
    const requestedSize = requestedSizeMatch
        ? Number(requestedSizeMatch[1])
        : null;

    const donutMatches = ranked.filter(item => {
        const title = String(item.product.title || "");
        const identity = normalise(title);

        if (!/\b(?:aluminium|aluminum)\b/i.test(title)) return false;
        if (!/\bdonuts?\b/i.test(title)) return false;
        if (/\bstainless\b|\bchromolly\b|\bchromoly\b|\bsteel\b/i.test(title)) return false;

        if (requestedSize !== null) {
            const sizeMatch = title.match(
                /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\.?\b|["]|\u2033)/i
            );
            if (!sizeMatch || Math.abs(Number(sizeMatch[1]) - requestedSize) >= 0.01) {
                return false;
            }
        }

        return true;
    });

    ranked.splice(0, ranked.length, ...donutMatches);
}
const exactMetricResults = requestedMetric
    ? ranked.filter(item => item.exactMetric)
    : [];



const hardlineResults = queryIsHardline
    ? ranked.filter(item => {
        const title = normalise(item.product.title);
        const identity = getProductIdentity(item.product);

        const isBrakeProduct =
            /\bbrake\b|\bbrakes\b/i.test(identity);

        const isFuelLine =
            /\b(fuel\s*line|fuel\s*tube|hard\s*line)\b/i.test(title) &&
            /\b(tube|tubing|pipe|line|coil|roll)\b/i.test(title);

        const isRigidBrakeLine =
            /\bbrake\b/i.test(title) &&
            /\b(hard\s*line|brake\s*line|brake\s*tube|brake\s*tubing|brake\s*pipe)\b/i.test(title) &&
            /\b(tube|tubing|pipe|coil|roll|line)\b/i.test(title) &&
            !/\b(braided|hose|cleaner|paste|pad|pads|caliper|valve|clamp|p[\s-]*clamp|bracket)\b/i.test(title);

        if (queryIsBrakeHardline) {
            return isRigidBrakeLine ||
                /\bPFE398\b/i.test(String(item.product.sku || "")) ||
                /\bPFE398\b/i.test(title);
        }
        return !isBrakeProduct && isFuelLine;
    }).slice(0, 10)
    : [];

const brakeLineResults = queryIsBrakeLine
    ? ranked.filter(item => {
        const title = normalise(item.product.title);
        if (!/\bbrake\b/i.test(title)) return false;

        return /\b(line|tube|tubing|pipe|braided|hose\s*end|hose)\b/i.test(title) &&
            !/\b(clamp|p[\s-]*clamp|bracket)\b/i.test(title);
    }).slice(0, 10)
    : [];

// V7 SILICONE REDUCER FILTER
const queryIsSiliconeReducer =
    /\b(reducer|reducing)\b/i.test(query) &&
    (
        /\bsilicone\b/i.test(query) ||
        /\b\d+(?:\.\d+)?\s*(?:inches?\b|in\.?\b|["\u2033])\s*(?:to|-)\s*\d+(?:\.\d+)?\s*(?:inches?\b|in\.?\b|["\u2033])/i.test(query)
    );

const siliconeReducerResults = queryIsSiliconeReducer
    ? ranked.filter(item => {
        const title = normalise(item.product.title || "");
        const identity = getProductIdentity(item.product);

        // Require a silicone reducer, not just any reducer.
        if (!/\bsilicone\b/i.test(identity)) return false;
        if (!/\breducer|reducing\b/i.test(identity)) return false;

        // Read common catalogue formats such as 3", 3.00in and 3 inch.
        const sizeText = [
            item.product.title,
            item.product.tags,
            item.product.type,
            item.product.category,
            item.product.description
        ].map(value => plainText(String(value || ""))).join(" ");

        const inchSizes = [
            ...sizeText.matchAll(
                /\b(\d+(?:\.\d+)?)\s*(?:inches?\b|in\.?\b|["\u2033])/gi
            )
        ].map(match => Number(match[1]));

        const requestedSizes = [
            ...query.matchAll(
                /\b(\d+(?:\.\d+)?)\s*(?:inches?\b|in\.?\b|["\u2033])/gi
            )
        ].map(match => Number(match[1]));

        // A requested size must match at least one reducer end.
        return requestedSizes.length === 0 ||
            requestedSizes.every(size =>
                inchSizes.some(productSize =>
                    Math.abs(productSize - size) < 0.01
                )
            );
    }).slice(0, 10)
    : [];
const exactResults =
    queryIsHardline
        ? hardlineResults
        : queryIsBrakeLine
            ? brakeLineResults
            : requestedMetric && exactMetricResults.length
        ? exactMetricResults.slice(0, 10)
        : queryIsSiliconeBend
            ? ranked.filter(item => {
                const identity = getProductIdentity(item.product);
                const title = normalise(item.product.title);

                const isSilicone =
                    /\bsilicone\b/i.test(identity);

                const isBend =
    /\b(bend|elbow|coupler)\b/i.test(title);

                const isReducer =
                    /\breducer\b/i.test(identity);

                const requestedAngles = [
                    ...query.matchAll(
                        /\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi
                    )
                ].map(match => Number(match[1]));

                const requestedInches = [
                    ...query.matchAll(
                        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\.?\b|["]|\u2033)/gi
                    )
                ].map(match => Number(match[1]));

                const productText = [
                    item.product.title,
                    item.product.tags,
                    item.product.type,
                    item.product.category
                ].join(" ");

                const productAngles = [
                    ...productText.matchAll(
                        /\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi
                    )
                ].map(match => Number(match[1]));

                const productInches = [
                    ...productText.matchAll(
                        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\.?\b|["]|\u2033)/gi
                    )
                ].map(match => Number(match[1]));

                const angleMatches =
                    !requestedAngles.length ||
                    requestedAngles.every(angle =>
                        productAngles.includes(angle)
                    );

                const sizeMatches =
                    !requestedInches.length ||
                    requestedInches.every(size =>
                        productInches.some(productSize =>
                            Math.abs(productSize - size) < 0.01
                        )
                    );
                return isSilicone &&
                    isBend &&
                    !isReducer &&
                    angleMatches &&
                    sizeMatches;
            }).slice(0, 10)
            : queryIsSiliconeReducer
            ? siliconeReducerResults
            : queryIsHoseEnd
                ? ranked.filter(item =>
                    isExactHoseEnd(item.product)
                ).slice(0, 10)
            : /\b(?:air|pod)\s*filters?\b/i.test(query)
                ? ranked.filter(item => {
                    const title = String(item.product.title || "");
                    return /\b(?:air|pod)\s*filters?\b/i.test(title);
                }).slice(0, 10)
                                : (() => {
                    const queryTerms = normalise(query)
                        .split(/\s+/)
                        .filter(term =>
                            term.length > 2 &&
                            !["the", "and", "for", "with", "need", "want", "find", "me", "please"].includes(term)
                        );

                    const generalResults = queryTerms.length >= 3
                        ? ranked.filter(item => {
                            const title = normalise(item.product.title || "");
                            const titleMatches = queryTerms.filter(term =>
                                title.split(/\s+/).includes(term)
                            ).length;

                            return titleMatches >= 2 && item.score >= 40;
                        })
                        : ranked;

                    const seen = new Set();

                    return generalResults.filter(item => {
                        const key = String(
                            item.product.handle ||
                            item.product.variants?.[0]?.sku ||
                            item.product.title ||
                            ""
                        ).trim().toLowerCase();

                        if (!key || seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    }).slice(0, 10);
                })();

const reducerAlternativeResults = queryIsSiliconeReducer && siliconeReducerResults.length === 0
    ? ranked.filter(item => {
        const product = item.product;
        const identity = getProductIdentity(product);

        if (!/\bsilicone\b/i.test(identity)) return false;
        if (!/\breducer|reducing\b/i.test(identity)) return false;

        const productText = [
            product.title,
            product.tags,
            product.type,
            product.category,
            product.description
        ].map(value => plainText(String(value || ""))).join(" ");

        const productSizes = [
            ...productText.matchAll(
                /\b(\d+(?:\.\d+)?)\s*(?:inches?\b|in\.?\b|["\u2033])/gi
            )
        ].map(match => Number(match[1]));

        const requestedSizes = [
            ...query.matchAll(
                /\b(\d+(?:\.\d+)?)\s*(?:inches?\b|in\.?\b|["\u2033])/gi
            )
        ].map(match => Number(match[1]));

        return requestedSizes.length > 0 &&
            requestedSizes.some(size =>
                productSizes.some(productSize =>
                    Math.abs(productSize - size) < 0.01
                )
            );
    }).slice(0, 5)
    : [];
const alternativeResults = queryIsHoseEnd
    ? ranked.filter(item => {
        const product = item.product;
        const title = String(product.title || "");
        const identity = getProductIdentity(product);

        if (isExactHoseEnd(product)) return false;
        if (!isOtherFitting(product)) return false;

        // Never suggest exhaust parts or unrelated tubing as fitting alternatives.
        if (/\b(?:exhaust|intercooler tubing|mandrel bent tubing)\b/i.test(title)) {
            return false;
        }

        // When the query includes an AN size, require that same size
        // for alternative fittings, even when the customer writes "-6 hose end".
        const requestedAN = query.match(/(?:^|\s)-\s*0?(\d{1,2})(?:\s*AN\b|\s+(?=hose[\s-]*ends?\b|hoseend\b|hose[\s-]*tails?\b))/i);

        if (requestedAN) {
            const size = Number(requestedAN[1]);

            const sizePattern = new RegExp(
                "(?:^|[^a-z0-9])-" +
                "(?:0*" + size + ")" +
                "(?:\\s*AN)?(?=$|[^0-9])",
                "i"
            );

            if (!sizePattern.test(title)) return false;
        }

        return true;
    }).slice(0, 3)
    : [];

const results = queryIsHoseEnd
    ? exactResults.concat(alternativeResults)
    : queryIsSiliconeReducer
        ? (siliconeReducerResults.length
            ? siliconeReducerResults
            : reducerAlternativeResults)
        : exactResults;


            if (!waiting) return;

            const bubble = waiting.querySelector(".message-bubble");
            if (!bubble) return;

            const asksForHoseSeries =
                queryIsHoseEnd &&
                exactResults.length > 0 &&
                !requestedHoseSeries &&
                !answeringHoseSeries &&
                !/\b(?:100|200|400)\s*series\b/i.test(query);

            if (asksForHoseSeries) {
                pendingFollowUpQuery = query;
                pendingFollowUpType = "hose_series";
                bubble.innerHTML =
                    '<div class="message-label">SS RACETECH V7</div>' +
                    '<p>Which Speedflow hose-end series are you after?</p>' +
                    '<div class="v7-series-choices">' +
                    '<div><button type="button" onclick="quickAsk(\'100 Series\')">100 Series</button><p>For compatible 100/120 Series braided hose.</p></div>' +
                    '<div><button type="button" onclick="quickAsk(\'200 Series\')">200 Series</button><p>For compatible 200 Series Teflon-braided hose.</p></div>' +
                    '<div><button type="button" onclick="quickAsk(\'400 Series\')">400 Series</button><p>For compatible 400, 332 and 598 Series hose.</p></div>' +
                    '<button type="button" onclick="quickAsk(\'Not sure\')">Not sure - show all matching options</button>' +
                    '</div>';
                return;
            }
            const asksForDonutSize =
                results.length > 0 &&
                /\b(?:aluminium|aluminum)\b/i.test(query) &&
                /\bdonuts?\b/i.test(query) &&
                !/(?:\b\d+(?:\.\d+)?\s*(?:inch(?:es)?|in\.?)\b|\b\d+(?:\.\d+)?\s*["\u2033])/i.test(query);

            if (asksForDonutSize) {
                pendingFollowUpQuery = query;
                pendingFollowUpType = "size";
                bubble.innerHTML =
                    '<div class="message-label">SS RACETECH V7</div>' +
                    '<p>We have aluminium donuts in the catalogue. What size are you after?</p>';
                return;
            }

            if (!results.length) {
                bubble.innerHTML =
                    '<div class="message-label">SS RACETECH V7</div>' +
                    '<p>I couldn\'t find a confident match for that search. Try a product name, brand, SKU or size.</p>';
                return;
            }

            bubble.innerHTML =
                '<div class="message-label">SS RACETECH V7</div>' +
                (queryIsSiliconeReducer && !siliconeReducerResults.length
                    ? '<p>I couldn\'t find an exact match for a silicone reducer with all the requested sizes in our current catalogue.</p>' +
                      '<p>No worries, though! Here are some alternatives we do stock that may help with your setup.</p>' +
                      '<h3>Closest available options</h3>' +
                      '<div class="v7-results">' +
                      reducerAlternativeResults.map(item => productCard(item.product)).join("") +
                      '</div>' +
                      '<h3>Can\'t find the exact size?</h3>' +
                      '<p>Contact SS Racetech and we\'ll help you look at your options.</p>'
                    : queryIsHoseEnd
                    ? (exactResults.length
                        ? '<h3>Exact Matches</h3><div class="v7-results">' +
                            exactResults.map(item => productCard(item.product)).join("") +
                            '</div>'
                        : '<h3>Exact Matches</h3><p>No exact hose-end matches found for that search.</p>') +
                      (alternativeResults.length
                        ? '<h3>Other Fittings to Consider</h3>' +
                            '<p>These fittings may help connect components. Check the connection type and size before ordering.</p>' +
                            '<div class="v7-results">' +
                            alternativeResults.map(item => productCard(item.product)).join("") +
                            '</div>'
                        : '')
                    : `<p>Found ${results.length} relevant catalogue result${results.length === 1 ? "" : "s"}:</p>` +
                      '<div class="v7-results">' +
                      results.map(item => productCard(item.product)).join("") +
                      '</div>');
        } catch (error) {
            if (waiting) {
                const bubble = waiting.querySelector(".message-bubble");
                if (bubble) bubble.textContent =
                    "Sorry, the catalogue couldn't be loaded. Check that the page is being served from the project folder and try again.";
            }
            console.error(error);
        }
    }

    window.sendMessage = () => sendV7Message($("userInput")?.value || "");
    window.quickAsk = query => {
        const input = $("userInput");
        if (input) input.value = query;
        sendV7Message(query);
    };

    document.addEventListener("DOMContentLoaded", () => {
        const input = $("userInput");
        if (input) {
            input.addEventListener("keydown", event => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    window.sendMessage();
                }
            });
        }
    });
})();




















