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


function buildProductIntro(results, query) {
    const items = (results || [])
        .slice(0, 3)
        .map(item => item.product || item)
        .filter(Boolean);

    if (!items.length) {
        return "";
    }

    const cleanQuery = plainText(query)
        .replace(/[.!?]+$/, "")
        .trim();

    const firstTitle = plainText(items[0].title);

    const introStart = cleanQuery
        ? "I've found catalogue options for " + escapeHTML(cleanQuery) + "."
        : "I've found some options in our catalogue.";

    let intro = "<p>" + introStart;

    if (firstTitle) {
        intro += " The top result is " + escapeHTML(firstTitle) + ".";
    }

    const stopWords = new Set([
        "the", "and", "for", "with", "our", "you", "your",
        "from", "that", "this", "are", "was", "were", "need",
        "want", "find", "looking", "please", "some", "more",
        "option", "options", "product", "products", "part",
        "parts", "collection", "collections", "accessory",
        "accessories", "motor", "vehicle", "inch", "inches",
        "degree", "degrees", "mm", "black", "silver"
    ]);

    function getTerms(value) {
        return [...new Set(
            normalise(plainText(value))
                .split(/\s+/)
                .filter(word =>
                    word.length > 1 &&
                    !/^\d+(?:\.\d+)?$/.test(word) &&
                    !stopWords.has(word)
                )
        )];
    }

    const queryTerms = getTerms(cleanQuery);

    const productContext = items.map(item => [
        item.title,
        item.type,
        item.tags,
        item.description,
        item.subtype,
        item.family,
        item.brand
    ].map(value => plainText(value || "")).join(" ")).join(" ");

    const productTerms = getTerms(productContext);
    const collections = Array.isArray(window.ssrV7Collections)
        ? window.ssrV7Collections
        : [];

    const matches = collections.map(collection => {
        const title = plainText(collection.title);
        const url = String(collection.url || "");
        const collectionTerms = getTerms(title);

        if (
            !title ||
            !/^https:\/\/racereadygear\.com\.au\/collections\/[a-z0-9-]+\/?$/i.test(url)
        ) {
            return null;
        }

        const queryAngleMatch = cleanQuery.match(/(?:^|\D)(45|60|90|120|135|180)\s*(?:degrees?|deg\b|°)/i);
        const collectionAngleMatch = title.match(/(?:^|\D)(45|60|90|120|135|180)\s*(?:degrees?|deg\b|°)/i);

        const queryAngle = queryAngleMatch ? Number(queryAngleMatch[1]) : null;
        const collectionAngle = collectionAngleMatch ? Number(collectionAngleMatch[1]) : null;

        if (
            queryAngle !== null &&
            collectionAngle !== null &&
            queryAngle !== collectionAngle
        ) {
            return null;
        }

        let score = 0;

        for (const term of collectionTerms) {
            if (queryTerms.includes(term)) score += 3;
            if (productTerms.includes(term)) score += 1;
        }

        return { title, url, score };
    })
    .filter(collection => collection && collection.score >= 4)
    .sort((a, b) => b.score - a.score);

    const selected = [];
    const seenHandles = new Set();

    for (const collection of matches) {
        const handle = collection.url
            .replace(/\/+$/, "")
            .split("/")
            .pop();

        if (seenHandles.has(handle)) continue;

        selected.push(collection);
        seenHandles.add(handle);

        if (selected.length >= 2) break;
    }

    if (selected.length) {
        intro += " Explore related collections: " +
            selected.map(collection =>
                '<a href="' + escapeHTML(collection.url) + '">' +
                escapeHTML(collection.title) +
                "</a>"
            ).join(" or ") +
            ".";
    }

    intro +=
        " Check each listing for the exact dimensions, materials and specifications before ordering.</p>";

    return intro;
}

function normalise(text) {
    return String(text || "")
        .toLowerCase()
        // Common customer shorthand and catalogue wording variants.
        .replace(/\bally\b/g, "aluminium")
        .replace(/\baluminum\b/g, "aluminium")
        .replace(/\btubing\b/g, "tube")
        .replace(/\bpiping\b/g, "pipe")
        .replace(/\bpipes\b/g, "pipe")
        .replace(/\btubes\b/g, "tube")
        .replace(/\belbows\b/g, "elbow")
        .replace(/\bbends\b/g, "bend")
        .replace(/\bstraight-length\b/g, "straight")
        .replace(/\b90\s*degree\b/g, "90 degree")
        .replace(/\b45\s*degree\b/g, "45 degree")
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


    // Match requested inch sizes precisely, preferring the product title
    // over broad catalogue categories and metadata.
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
    const productTitleText = String(product.title || "");
    const titleSizes = extractInchSizes(productTitleText);
    const productSizes = extractInchSizes(productText);

    if (requestedSizes.length) {
        for (const size of requestedSizes) {
            const exactTitleSize = titleSizes.some(productSize =>
                Math.abs(productSize - size) < 0.01
            );

            const exactOtherSize = titleSizes.length === 0 &&
                productSizes.some(productSize =>
                    Math.abs(productSize - size) < 0.01
                );

            if (exactTitleSize || exactOtherSize) {
                bonus += 100;
            } else if (titleSizes.length || productSizes.length) {
                bonus -= 40;
            }
        }
    }

    // Match the requested bend or elbow angle, preferring title evidence.
    const requestedAngles = [
        ...rawQuery.matchAll(/\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi)
    ].map(match => Number(match[1]));

    const titleAngles = [
        ...productTitleText.matchAll(/\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi)
    ].map(match => Number(match[1]));

    const productAngles = [
        ...productText.matchAll(/\b(\d{1,3})\s*(?:degrees?|deg\b|\u00B0)/gi)
    ].map(match => Number(match[1]));

    for (const angle of requestedAngles) {
        const exactTitleAngle = titleAngles.includes(angle);
        const exactOtherAngle = titleAngles.length === 0 &&
            productAngles.includes(angle);

        if (exactTitleAngle || exactOtherAngle) {
            bonus += 70;
        } else if (titleAngles.length || productAngles.length) {
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

        // Treat pipe and tube as related search terms across the catalogue.
        // This is a ranking aid only; it does not override size, angle,
        // material, or product-shape checks.
        const asksForPipe = /\bpipe\b/.test(q);
        const asksForTube = /\btube\b/.test(q);
        const productMentionsPipe = /\bpipe\b/.test(title);
        const productMentionsTube = /\btube\b/.test(title);
        const pipeTubeEquivalent =
            (asksForPipe && productMentionsTube) ||
            (asksForTube && productMentionsPipe);
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
            { pattern: /\b(?:cooling|coolant|radiator|heater)\b.*\b(?:hoses?|joiners?|couplers?)\b|\b(?:hoses?|joiners?|couplers?)\b.*\b(?:cooling|coolant|radiator|heater)\b/i, productPattern: /\b(?:cooling|coolant|radiator|heater)\b.*\b(?:hoses?|joiners?|couplers?)\b|\b(?:hoses?|joiners?|couplers?)\b.*\b(?:cooling|coolant|radiator|heater)\b/i, words: ["cooling", "coolant", "radiator", "heater", "hose", "joiner", "coupler"] },
            { pattern: /\bhose[\s-]*ends?\b|\bhoseend\b|\bhose[\s-]*tails?\b/, words: ["hose", "end"] },
            { pattern: /\bsilicone\b.*\b(bend|elbow|coupler)\b|\b(bend|elbow|coupler)\b.*\bsilicone\b/, words: ["silicone", "bend"] },
            { pattern: /\b(screw|bolt|stud|fastener)s?\b/, words: ["screw", "bolt", "stud", "fastener"] },
            { pattern: /\bwater\s*pumps?\b|\bmechanical\s*pumps?\b|\belectric\s*water\s*pumps?\b/i, productPattern: /\bwater\s*pumps?\b(?!\s*(?:bolt|gasket|seal|repair\s*kit|mounting\s*kit)\b)/i, words: ["water", "pump"] },
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
            requestedGroups.some(group => {
                const productPattern = group.productPattern || group.pattern;
                return productPattern.test(identity) ||
                    productPattern.test(title);
            });

        // A clearly different product type should not qualify on stray
        // words in its description alone.
        if (requestedGroups.length && !productMatchesRequestedType) {
            return 0;
        }

        // Exclude accessories when the customer asks for a water pump.
        const wantsWaterPump = /\bwater\s*pumps?\b/i.test(q);
        const waterPumpAccessory =
            /\b(?:bolt|gasket|seal|bracket|pulley)\b|\bbelt\s*drive\b|\b(?:repair|mounting)\s*kit\b|\b(?:gilmer|belt)\b.*\bkit\b|\bkit\b.*\b(?:gilmer|belt)\b/i;

        if (wantsWaterPump && waterPumpAccessory.test(title)) {
            return 0;
        }

        let score = 0;

        if (pipeTubeEquivalent) score += 8;

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
            plainText(product.description),
            product.searchText || "",
            JSON.stringify(product.attributes || {})
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
            }
            // Missing vehicle evidence is not proof of incompatibility.
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
        } else if (
            pendingFollowUpQuery &&
            pendingFollowUpType === "general"
        ) {
            query = window.ssrV7Conversation
                ? window.ssrV7Conversation.mergeReply(pendingFollowUpQuery, query)
                : pendingFollowUpQuery + " " + query;
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

const queryIsCoolingHoseJoiner =
    /\b(cooling|coolant|radiator|heater)\b/i.test(query) &&
    /\bhose\b/i.test(query) &&
    /\b(joiners?|couplers?)\b/i.test(query);

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
        // Use catalogue identity, not incidental description mentions,
        // for make and engine-family fitment checks.
        const fitmentText = normalise([
            product.title,
            product.tags,
            product.type,
            product.category
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

        // Engine-family guard: distinguish Ford Windsor, Cleveland
        // and Modified families using the product's catalogue identity.
        const familyEvidence = normalise([
            product.title,
            product.tags,
            product.type,
            product.category
        ].join(" "));

        const wantsWindsor = /\bwindsor\b/i.test(fitmentQuery);
        const wantsCleveland =
            /\bcleveland\b|\b351\s*c\b|\b351c\b/i.test(fitmentQuery);
        const wantsModified =
            /\b351\s*m\b|\b351m\b|\b400\s*m\b|\b400m\b|\bmodified\b/i.test(fitmentQuery);

        const productWindsor = /\bwindsor\b/i.test(familyEvidence);
        const productCleveland =
            /\bcleveland\b|\b351\s*c\b|\b351c\b/i.test(familyEvidence);
        const productModified =
            /\b351\s*m\b|\b351m\b|\b400\s*m\b|\b400m\b/i.test(familyEvidence);

        const productBigBlockFord =
            /\bford\b/i.test(familyEvidence) &&
            /\b(?:429|460)\b/i.test(familyEvidence);

        const conflictsWithEngineFamily =
            (wantsWindsor &&
                (productCleveland || productModified) &&
                !productWindsor) ||
            (wantsCleveland &&
                (productWindsor || productModified) &&
                !productCleveland) ||
            (wantsModified &&
                (productWindsor || productCleveland) &&
                !productModified) ||
            (wantsFord && productIsLS) ||
            ((wantsWindsor || wantsCleveland) &&
                productBigBlockFord &&
                !productWindsor &&
                !productCleveland);

        const finalScore =
            conflictsWithVehicle || conflictsWithEngineFamily ? 0 : score;

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

                const materialText = normalise(
                    title + " " + String(item.product.tags || "")
                );

                const sizes = [
                    ...title.matchAll(
                        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/gi
                    )
                ].map(match => Number(match[1]));

                const exactSize = requestedSize !== null &&
                    sizes.some(size => Math.abs(size - requestedSize) < 0.01);

                const hasAluminium =
                    /\baluminium\b|\baluminum\b/.test(materialText);
                const hasStainless = /\bstainless\b/.test(materialText);
                const hasSilicone = /\bsilicone\b/.test(materialText);
                const hasSteel =
                    /\bsteel\b/.test(materialText) && !hasStainless;
                const hasPlastic = /\bplastic\b|\bnylon\b/.test(materialText);
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

                const isFabricatedShape =
    /\b(half\s*donut|donut|pie\s*cut|oval\s*tub(?:e|ing)|oval\s*exhaust)\b/i.test(title);
                const isTubeProduct =
                    /\b(tube|tubing|pipe|piping)\b/i.test(title) &&
                    !isAccessory &&
                    !isFabricatedShape;

                const isStraight = isTubeProduct &&
                    (/\bstraight\b/i.test(title) ||
                     /\btube\b/i.test(title) && !/\b(elbow|bend|bends|coupler)\b/i.test(title)) &&
                    !/\b(elbow|bend|bends|coupler)\b/i.test(title);

                const isBend =
                    /\b(elbow|bend|bends)\b/i.test(title) &&
                    !isAccessory;

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


            // Tube searches: prioritise requested material, angle,
            // exact diameter, then the genuine tube/bend product type.
            // These rules apply across brands and catalogue categories.
            if (useTubePriority) {
                if (
                    requestedMaterial &&
                    priorityA.materialRank !== priorityB.materialRank
                ) {
                    return priorityA.materialRank - priorityB.materialRank;
                }

                                if (
                    requestedAngle !== null &&
                    priorityA.angleRank !== priorityB.angleRank
                ) {
                    return priorityA.angleRank - priorityB.angleRank;
                }

                // Prefer product shape before exact size for tube searches.
                if (priorityA.tubeRank !== priorityB.tubeRank) {
                    return priorityA.tubeRank - priorityB.tubeRank;
                }

                if (
                    requestedSize !== null &&
                    priorityA.exactSize !== priorityB.exactSize
                ) {
                    return priorityA.exactSize ? -1 : 1;
                }
            }

            // Bend/elbow searches: prioritise requested material,
            // then angle and exact diameter.
            if (useBendPriority) {
                if (
                    requestedMaterial &&
                    priorityA.materialRank !== priorityB.materialRank
                ) {
                    return priorityA.materialRank - priorityB.materialRank;
                }

                if (priorityA.angleRank !== priorityB.angleRank) {
                    return priorityA.angleRank - priorityB.angleRank;
                }

                                // For tube searches, prefer the correct product shape
                // before exact-size matches on fabricated assemblies.
                if (priorityA.tubeRank !== priorityB.tubeRank) {
                    return priorityA.tubeRank - priorityB.tubeRank;
                }

                if (
                    requestedSize !== null &&
                    priorityA.exactSize !== priorityB.exactSize
                ) {
                    return priorityA.exactSize ? -1 : 1;
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

        // Some catalogue adapters describe their AN end as "-6 Flare".
        // Accept that wording only when the product also identifies NPT.
        const requestedNPT = /\bNPT\b/i.test(query);
        const explicitFlareConnection =
            requestedNPT &&
            /\bNPT\b/i.test(evidence) &&
            new RegExp(
                "-\\s*0?" + requestedANSize + "\\s*flare\\b",
                "i"
            ).test(evidence);

        // When NPT size is specified, require that same size and thread
        // standard in the product evidence, not merely an AN-size match.
        const requestedNPTSize = requestedNPT
            ? query.match(/\b\d+\s*\/\s*\d+|\b\d+(?:\.\d+)?/i)
            : null;

        // Use original catalogue wording for thread sizes so fractions
        // such as 1/2 are not lost by normalise().
        const rawEvidence = [
            item.product.title || "",
            plainText(item.product.description || "")
        ].join(" ");

        const evidenceHasInvertedFlare =
            /\binverted\s+flare\b/i.test(rawEvidence);

        const evidenceNPTSizeMatches = requestedNPTSize
            ? new RegExp(
                "(?<![\\d.])" +
                requestedNPTSize[0].replace(/\s+/g, "") +
                "\\s*(?:[\u0022\u2033]|in(?:ch(?:es)?)?\\b)?\\s*NPT\\b|" +
                "\\bNPT\\s*(?:" +
                requestedNPTSize[0].replace(/\s+/g, "") +
                ")",
                "i"
            ).test(rawEvidence)
            : /\bNPT\b/i.test(rawEvidence);

        const nptSizeMatches =
            !requestedNPT ||
            (
                /\bNPT\b/i.test(rawEvidence) &&
                !evidenceHasInvertedFlare &&
                evidenceNPTSizeMatches
            );

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

        return (explicitANConnection || correctlySizedHoseEnd || explicitFlareConnection) && nptSizeMatches;
    });

    ranked.splice(0, ranked.length, ...verifiedANResults);
// V7 STRICT FILTER FOR EXPLICIT AN-TO-NPT CONNECTION REQUESTS
// Require both requested connection sizes to be confirmed in the
// original catalogue title or description.
const strictANRequest = query.match(/(?:^|\s)-\s*0?(\d{1,2})\s*AN\b/i);
const strictNPTRequest = query.match(/\b(\d+\s*\/\s*\d+|\d+(?:\.\d+)?)\s*NPT\b/i);

if (
    strictANRequest &&
    strictNPTRequest &&
    !queryIsHoseEnd &&
    !queryIsHardline &&
    !queryIsBrakeLine
) {
    const strictANSize = Number(strictANRequest[1]);
    const strictNPTSize = strictNPTRequest[1].replace(/\s+/g, "");
    const escapedNPTSize = strictNPTSize.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const strictConnectionResults = ranked.filter(item => {
        const rawEvidence = [
            item.product.title || "",
            plainText(item.product.description || "")
        ].join(" ");

        const hasExactNPT = new RegExp(
            "(?<![\\d.])" + escapedNPTSize +
            "\\s*[\\\"\\u2033]*\\s*(?:in(?:ch(?:es)?)?\\b\\s*)?NPT\\b|" +
            "\\bNPT\\s*" + escapedNPTSize + "(?![\\d.])",
            "i"
        ).test(rawEvidence);

        const hasExactAN = new RegExp(
            "(?:-\\s*0?" + strictANSize +
            "\\s*AN\\b|\\bAN\\s*-\\s*0?" + strictANSize +
            "\\b|-\\s*0?" + strictANSize + "\\s*flare\\b)",
            "i"
        ).test(rawEvidence);

        const isInvertedFlare = /\binverted\s+flare\b/i.test(rawEvidence);

        return hasExactNPT && hasExactAN && !isInvertedFlare;
    });

    ranked.splice(0, ranked.length, ...strictConnectionResults);
}
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



                    const queryTextForFallback = normalise(query);

                    const queryNeedsPipeShape =
                        /\b(pipe|piping|tube|tubing|intake|bend|bends|elbow|elbows)\b/i.test(queryTextForFallback) &&
                        (
                            /\b(45|60|90|180)\s*(?:degrees?|deg\b|\u00B0)/i.test(queryTextForFallback) ||
                            /\bstraight\b/i.test(queryTextForFallback) ||
                            /\b\d+(?:\.\d+)?\s*(?:inch(?:es)?|in\b|")/i.test(queryTextForFallback) ||
                            /\b(aluminium|aluminum|stainless|silicone|steel|plastic|nylon)\b/i.test(queryTextForFallback)
                        );

                    const requestedFallbackSizeMatch = queryTextForFallback.match(
                        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|")/i
                    );
                    const requestedFallbackSize = requestedFallbackSizeMatch
                        ? Number(requestedFallbackSizeMatch[1])
                        : null;

                    const requestedFallbackAngleMatch = queryTextForFallback.match(
                        /\b(45|60|90|180)\s*(?:degrees?|deg\b|\u00B0)/i
                    );
                    const requestedFallbackAngle = requestedFallbackAngleMatch
                        ? Number(requestedFallbackAngleMatch[1])
                        : null;

                    const requestedFallbackMaterial =
                        /\baluminium\b|\baluminum\b/i.test(queryTextForFallback) ? "aluminium" :
                        /\bstainless\b/i.test(queryTextForFallback) ? "stainless" :
                        /\bsilicone\b/i.test(queryTextForFallback) ? "silicone" :
                        /\bsteel\b/i.test(queryTextForFallback) ? "steel" :
                        /\bplastic\b|\bnylon\b/i.test(queryTextForFallback) ? "plastic" : "";


                    const generalResults = queryTerms.length >= 3
                        ? ranked.filter(item => {
                            const product = item.product;
                            const rawTitle = String(product.title || "");
const title = normalise(rawTitle);

                            const titleWords = title.split(/\s+/);
                            const titleMatches = queryTerms.filter(term =>
                                titleWords.includes(term)
                            ).length;

                            const isPipeTubeSearch =
                                /\b(pipe|piping|tube|tubing)\b/i.test(queryTextForFallback);

                            // Category-aware discovery for cooling hoses and joiners.
                            // Match the product's own catalogue identity, not just its title.
                            const fallbackProductIdentity = normalise([
                                product.title,
                                product.tags,
                                product.type,
                                product.category
                            ].join(" "));

                            const isCoolingHoseQuery =
                                /\b(?:cooling|coolant|radiator|heater)\b/i.test(queryTextForFallback) &&
                                /\b(?:hose|joiner|coupler)\b/i.test(queryTextForFallback);

                            const isCoolingHoseProduct =
                                /\b(?:cooling|coolant|radiator|heater)\b.*\b(?:hoses?|joiners?|couplers?)\b|\b(?:hoses?|joiners?|couplers?)\b.*\b(?:cooling|coolant|radiator|heater)\b/i.test(fallbackProductIdentity);

                            const isCoolingCategoryMatch =
                                isCoolingHoseQuery &&
                                isCoolingHoseProduct &&
                                item.score >= 30;

                            // Explicit cooling hose joiner/coupler intent:
                            // reject ordinary hose lengths and unrelated couplers.
                            const requestsJoinerOrCoupler =
                                /\b(joiners?|couplers?)\b/i.test(queryTextForFallback);

                            const joinerProductTitle = normalise(rawTitle);

                            const isRelevantJoinerProduct =
                                /\b(joiners?|couplers?)\b/i.test(joinerProductTitle) &&
                                /\b(silicone|hose|coolant|cooling|radiator|heater)\b/i.test(joinerProductTitle) &&
                                !/\b(reducers?|elbows?|bends?)\b/i.test(joinerProductTitle);

                            if (
                                isCoolingHoseQuery &&
                                requestsJoinerOrCoupler &&
                                !isRelevantJoinerProduct
                            ) {
                                return false;
                            }

                            // Keep the existing thresholds unless the product
                            // has a credible match for the requested cooling category.
                            if (isPipeTubeSearch) {
                                if (titleMatches < 1 || item.score < 20) {
                                    return false;
                                }
                            } else if (
                                !isCoolingCategoryMatch &&
                                !(isCoolingHoseQuery && requestsJoinerOrCoupler && isRelevantJoinerProduct) &&
                                (titleMatches < 2 || item.score < 40)
                            ) {
                                return false;
                            }

                            if (queryNeedsPipeShape) {
                                const isRelevantShape =
                                    /\b(pipe|piping|tube|tubing|bend|bends|elbow|elbows)\b/i.test(title);

                                const isUnrelatedAccessory =
                                    /\b(water neck|adapter|adaptor|valve|bracket|clamp|fitting|connector|bulkhead|thermostat)\b/i.test(title);

                                const isStraightProduct =
                                    /\b(straight|straight-length)\b/i.test(title);

                                const requestsBend =
                                    /\b(bend|bends|elbow|elbows)\b/i.test(queryTextForFallback);

                                const requestsStraight =
                                    /\bstraight\b/i.test(queryTextForFallback);

                                const requestsGenericPipe =
                                    /\b(pipe|piping|tube|tubing|intake)\b/i.test(queryTextForFallback) &&
                                    !requestsBend &&
                                    requestedFallbackAngle === null &&
                                    !requestsStraight;

                                const isBendProduct =
                                    /\b(bend|bends|elbow|elbows)\b/i.test(title);

                                if (!isRelevantShape || isUnrelatedAccessory) {
                                    return false;
                                }

                                // A straight-tube request must return straight products.
                                if (requestsStraight && (!isStraightProduct || isBendProduct)) {
                                    return false;
                                }

                                // A general pipe/tube request should prioritise
                                // straight pipe rather than bends or elbows.
                                if (requestsGenericPipe && (isBendProduct || isStraightProduct === false && /\b(clamp|bracket|valve|adapter|adaptor)\b/i.test(title))) {
                                    return false;
                                }

                                // An explicit bend/elbow search must not return
                                // a straight length of tube.
                                if (
                                    requestsBend &&
                                    (!isBendProduct || isStraightProduct)
                                ) {
                                    return false;
                                }

                                // Extract specifications from the product title.
                                const productSizes = [
    ...rawTitle.matchAll(
        /\b(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\.?\b|["\u2033])/gi
    )
].map(match => Number(match[1]));

                                const productAngles = [
    ...rawTitle.matchAll(
        /\b(45|60|90|180)\s*(?:degrees?|deg\b|\u00B0)/gi
    )
].map(match => Number(match[1]));

                                // Reject a conflicting diameter whenever the
                                // title explicitly gives a diameter.
                                if (
                                    requestedFallbackSize !== null &&
                                    productSizes.length > 0 &&
                                    !productSizes.some(size =>
                                        Math.abs(size - requestedFallbackSize) < 0.01
                                    )
                                ) {
                                    return false;
                                }

                                // Reject a conflicting angle whenever the
                                // title explicitly gives an angle.
                                if (
                                    requestedFallbackAngle !== null &&
                                    productAngles.length > 0 &&
                                    !productAngles.includes(requestedFallbackAngle)
                                ) {
                                    return false;
                                }

                                // Straight products cannot satisfy an angled
                                // pipe/bend search.
                                if (
                                    requestedFallbackAngle !== null &&
                                    isStraightProduct
                                ) {
                                    return false;
                                }

                                // Keep material matching generic across brands.
                                if (requestedFallbackMaterial) {
                                    const hasRequestedMaterial =
                                        requestedFallbackMaterial === "aluminium"
                                            ? /\baluminium\b|\baluminum\b/i.test(title)
                                            : requestedFallbackMaterial === "stainless"
                                            ? /\bstainless\b/i.test(title)
                                            : requestedFallbackMaterial === "silicone"
                                            ? /\bsilicone\b/i.test(title)
                                            : requestedFallbackMaterial === "steel"
                                            ? /\bsteel\b/i.test(title) &&
                                              !/\bstainless\b/i.test(title)
                                            : /\bplastic\b|\bnylon\b/i.test(title);

                                    if (!hasRequestedMaterial) {
                                        return false;
                                    }
                                }
                            }

                            return true;
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
const coolingHoseAlternativeResults = queryIsCoolingHoseJoiner
    ? ranked.filter(item => {
        const title = String(item.product.title || "");
        return /\bheater hose\b/i.test(title) &&
            !/\bT[\s-]*piece\b/i.test(title);
    }).slice(0, 3)
    : [];

const coolingTPieceAlternativeResults = queryIsCoolingHoseJoiner
    ? ranked.filter(item =>
        /\bheater hose\b.*\bT[\s-]*piece\b|\bT[\s-]*piece\b.*\bheater hose\b/i
            .test(String(item.product.title || ""))
    ).slice(0, 3)
    : [];

const coolingAlternativeResults = [
    ...coolingHoseAlternativeResults,
    ...coolingTPieceAlternativeResults
];

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

const results = queryIsCoolingHoseJoiner
    ? exactResults.concat(coolingAlternativeResults)
    : queryIsHoseEnd
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

            const conversationFollowUp = window.ssrV7Conversation
                ? window.ssrV7Conversation.getFollowUp(query)
                : null;

            if (conversationFollowUp) {
                pendingFollowUpQuery = query;
                pendingFollowUpType = conversationFollowUp.type;

                const optionButtons = conversationFollowUp.options.map(option =>
                    '<button type="button" onclick="quickAsk(\'' +
                    option +
                    '\')">' +
                    option +
                    '</button>'
                ).join("");

                bubble.innerHTML =
                    '<div class="message-label">SS RACETECH V7</div>' +
                    '<p>' + conversationFollowUp.question + '</p>' +
                    '<div class="v7-conversation-choices">' +
                    optionButtons +
                    '</div>';
                return;
            }
            if (!results.length && !queryIsCoolingHoseJoiner) {
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
                    : queryIsCoolingHoseJoiner
                    ? (exactResults.length
                        ? '<h3>Exact Matches</h3><div class="v7-results">' +
                            exactResults.map(item => productCard(item.product)).join("") +
                            '</div>'
                        : '<p>No exact cooling hose joiner match was found.</p>') +
                      (coolingHoseAlternativeResults.length
                        ? '<h3>Related alternative ? Heater hose</h3>' +
                            '<p>These are heater hose products, not confirmed joiners.</p>' +
                            '<div class="v7-results">' +
                            coolingHoseAlternativeResults.map(item => productCard(item.product)).join("") +
                            '</div>'
                        : '') +
                      (coolingTPieceAlternativeResults.length
                        ? '<h3>Related alternative ? Heater hose T-piece</h3>' +
                            '<p>This is a T-piece option, not a confirmed exact cooling-hose joiner match.</p>' +
                            '<div class="v7-results">' +
                            coolingTPieceAlternativeResults.map(item => productCard(item.product)).join("") +
                            '</div>'
                        : '')
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
                    : buildProductIntro(results, query) +
  `<p>Found ${results.length} relevant catalogue result${results.length === 1 ? "" : "s"}:</p>` +
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
