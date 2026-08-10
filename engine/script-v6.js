// ======================================
// SSRACETECH V6 MASTER ENGINE
// CLEAN REBUILD
// ======================================

console.log("🏁 SSRACETECH V6 ENGINE ONLINE");


// ======================================
// V6 QUERY ANALYSER
// ======================================

// ======================================
// QUERY INTELLIGENCE V6
// ======================================

function ssrAnalyseQueryV6(query) {

    const search =
        query
            .toLowerCase()
            .trim();


    const intent = {

        raw: search,

        category: null,

        brand: null,

        engine: null,

        size: null,

        angle: null,

        fittingType: null

    };


    // ==================================
// CATEGORY
// ==================================


// ==================================
// HOSE END / AN FITTINGS
// ==================================

if (
    search.includes("hose") ||
    search.includes("hose end") ||
    search.includes("hoseend")
) {

    intent.category = "hose";

}


// ==================================
// TEE
// ==================================

if (
    search.includes("tee")
) {

    intent.category = "tee";

}


// ==================================
// UNION
// ==================================

if (
    search.includes("union")
) {

    intent.category = "union";

}


// ==================================
// ADAPTER
// ==================================

if (
    search.includes("adapter") ||
    search.includes("adaptor")
) {

    intent.category = "adapter";

}


// ==================================
// STARTER
// ==================================

if (
    search.includes("starter")
) {

    intent.category = "starter";

}


// ==================================
// INTAKE
// ==================================

if (
    search.includes("intake") ||
    search.includes("manifold")
) {

    intent.category = "intake";

}


// ==================================
// BRAND
// ==================================

if (
    search.includes("speedflow")
) {

    intent.brand = "speedflow";

}


if (
    search.includes("proflow")
) {

    intent.brand = "proflow";

}


// ==================================
// AN SIZE
// ==================================

const sizeMatch =
    search.match(
        /-(\d+)\s*(?:an)\b/i
    );


if (
    sizeMatch
) {

    intent.size =
        "-" + sizeMatch[1];

}


// ==================================
// ANGLE
// ==================================

const angleMatch =
    search.match(
        /\b(30|45|60|90|120|150|180)\b/
    );


if (
    angleMatch
) {

    intent.angle =
        angleMatch[0];

}


if (
    search.includes("straight")
) {

    intent.angle = "0";

}


// ==================================
// FITTING TYPE
// ==================================

if (
    search.includes("hose end") ||
    search.includes("hoseend")
) {

    intent.fittingType =
        "hose_end";

}


else if (
    search.includes("tee")
) {

    intent.fittingType =
        "tee";

}


else if (
    search.includes("adapter") ||
    search.includes("adaptor")
) {

    intent.fittingType =
        "adapter";

}


else if (
    search.includes("union")
) {

    intent.fittingType =
        "union";

}


console.log(
    "🧠 V6 INTENT:",
    intent
);


return intent;

}


// ======================================
// V6 SCORING ENGINE
// ======================================

function ssrScoreProductV6(
    product,
    intent
) {

    let score = 0;


    const title =
        (
            product["Title"] || ""
        )
        .toLowerCase();


    if (
        !title
    ) {

        return -999999;

    }


    console.log(
        "DEBUG V6 TITLE:",
        title
    );


    // ======================================
    // BASIC WORD MATCH
    // ======================================

    intent.raw
        .split(/\s+/)
        .forEach(
            word => {

                if (
                    word.length > 2 &&
                    title.includes(word)
                ) {

                    score += 100;

                }

            }
        );


    // ======================================
// BRAND INTELLIGENCE
// ======================================

if (
    intent.brand &&
    title.includes(intent.brand)
) {

    score += 3000;

}


// ======================================
// SPEEDFLOW BONUS
// ======================================

if (
    (
        intent.fittingType === "adapter" ||
        intent.fittingType === "tee" ||
        intent.fittingType === "union" ||
        intent.fittingType === "hose_end"
    ) &&
    title.includes("speedflow")
) {

    score += 2000;

}


// ======================================
// PROFLOW BONUS
// ======================================

if (
    (
        intent.fittingType === "adapter" ||
        intent.fittingType === "tee" ||
        intent.fittingType === "union" ||
        intent.fittingType === "hose_end"
    ) &&
    title.includes("proflow")
) {

    score += 2000;

}


// ======================================
// TEE INTELLIGENCE
// ======================================

if (
    intent.category === "tee"
) {


    // ==================================
    // REAL TEE FITTING DETECTION
    // ==================================

    const isRealTeeFitting = (

        title.includes("tee fitting") ||

        title.includes("flare tee") ||

        title.includes("bulkhead tee") ||

        title.includes("tee swivel") ||

        title.includes("tee on run") ||

        title.includes("tee on branch") ||

        title.includes("male tee") ||

        title.includes("female tee") ||

        title.includes("tee -") ||

        title.match(
            /\btee\b.*\bfitting\b/i
        )

    );


    // ==================================
    // REAL TEE PRODUCT MATCH
    // ==================================

    if (
        isRealTeeFitting
    ) {

        score += 50000;

    }
    else {

        score -= 80000;

    }


    // ==================================
    // SIZE MATCH
    // ==================================

    if (
        intent.size
    ) {

        const teeSize =
            new RegExp(
                intent.size +
                "\\s*(?:an|male|female)\\b",
                "i"
            );

        const anyANSize =
            /-\d+\s*(?:an|male|female)\b/i;


        // EXACT REQUESTED SIZE

        if (
            teeSize.test(title)
        ) {

            score += 15000;

        }


        // WRONG AN SIZE

        else if (
            anyANSize.test(title)
        ) {

            score -= 40000;

        }

    }


    // ==================================
    // REMOVE WELD BUNGS / RANDOM FITTINGS
    // ==================================

    if (
        title.includes("bung") ||
        title.includes("weld") ||
        title.includes("bolt") ||
        title.includes("pie cut")
    ) {

        score -= 100000;

    }


    // ==================================
    // SPEEDFLOW BONUS
    // ==================================

    if (
        title.includes("speedflow")
    ) {

        score += 5000;

    }

}

// ======================================
// REMOVE WRONG PRODUCT TYPES
// ======================================

if (
    intent.category !== "adapter" &&
    (
        title.includes("hose end") ||
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("union") ||
        title.includes("hose")
    )
) {

    score -= 80000;

}


// ======================================
// REMOVE RANDOM MATCHES
// ======================================

if (
    title.includes("power steering") ||
    title.includes("clamp") ||
    title.includes("filter") ||
    title.includes("exhaust")
) {

    score -= 80000;

}


// ======================================
// UNION INTELLIGENCE
// ======================================

if (
    intent.category === "union"
) {


    // ==================================
    // REAL UNION PRODUCT MATCH
    // ==================================

    if (
        title.includes("union")
    ) {

        score += 50000;

    }
    else {

        score -= 80000;

    }


    // ==================================
    // SIZE MATCH
    // ==================================

    if (
        intent.size
    ) {

        const unionSize =
            new RegExp(
                intent.size + "\\s*(?:an|male|female)\\b",
                "i"
            );

        const anyANSize =
            /-\d+\s*(?:an|male|female)\b/i;


        if (
            unionSize.test(title)
        ) {

            score += 15000;

        }
        else if (
            anyANSize.test(title)
        ) {

            score -= 40000;

        }

    }


    // ==================================
    // SPEEDFLOW BONUS
    // ==================================

    if (
        title.includes("speedflow")
    ) {

        score += 5000;

    }


    // ==================================
    // REMOVE WRONG FITTING FAMILIES
    // ==================================

    if (
        title.includes("hose end") ||
        title.includes("tee") ||
        title.includes("adapter") ||
        title.includes("adaptor")
    ) {

        score -= 80000;

    }


    // ==================================
    // REMOVE RANDOM PRODUCTS
    // ==================================

    if (
        title.includes("kit") ||
        title.includes("filter") ||
        title.includes("spark") ||
        title.includes("jet") ||
        title.includes("protector")
    ) {

        score -= 100000;

    }

}


// ======================================
// ADAPTER INTELLIGENCE
// ======================================

if (
    intent.category === "adapter"
) {


    // ==================================
    // REAL AN ADAPTER DETECTION
    // ==================================

    const isRealANAdapter = (

        (
            title.includes("adapter") ||
            title.includes("adaptor") ||
            title.includes("flare reducer") ||
            title.includes("dual adapter") ||
            title.includes("dual adaptor") ||
            title.includes("male to") ||
            title.includes("female to")
        )

        &&

        (
            // Explicit AN terminology
            title.includes(" an ") ||

            // -3AN / -6AN / -10AN etc.
            /-\d+\s*an\b/i.test(title) ||

            // -3 male / -6 male / -10 female etc.
            /-\d+\s*(?:male|female)\b/i.test(title) ||

            // Known Speedflow adapter families
            /\b(314|380|346|700|741|742|922|950)-\d+/i.test(title)
        )

    );


    // ==================================
// DEBUG ADAPTER CHECK
// ==================================

console.log(
    "ADAPTER CHECK:",
    title,
    isRealANAdapter
);


// ======================================
// HARD REJECT OBVIOUS NON-ADAPTERS
// ======================================

if (
    title.includes("heim") ||
    title.includes("rod end") ||
    title.includes("uniball") ||
    title.includes("misalignment") ||
    title.includes("spacer") ||
    title.includes("jam nut") ||
    title.includes("quarter turn") ||
    title.includes("fastener") ||
    title.includes("washer") ||
    title.includes("bend") ||
    title.includes("silicone") ||
    title.includes("reservoir mount")
) {

    score -= 200000;

}


// ======================================
// HARD REJECT NON-FITTING PRODUCTS
// ======================================

if (
    title.includes("fuel pump") ||
    title.includes("gauge") ||
    title.includes("sensor") ||
    title.includes("regulator") ||
    title.includes("filter") ||
    title.includes("valve") ||
    title.includes("firesleeve") ||
    title.includes("heat sleeve")
) {

    score -= 200000;

}


// ======================================
// REAL ADAPTER BONUS
// ======================================

if (
    isRealANAdapter
) {

    score += 75000;

}
else {

    score -= 75000;

}


// ======================================
// ADAPTER SIZE INTELLIGENCE
// ======================================

if (
    intent.size
) {

    const productANSize =
        title.match(
            /-(\d+)\s*(?:an|male|female)\b/i
        );


        if (
        productANSize
    ) {

        const detectedSize =
            "-" +
            productANSize[1];

        // ==============================
        // EXACT AN SIZE MATCH
        // ==============================

        if (
            detectedSize === intent.size
        ) {

            score += 80000;

        }

        // ==============================
        // WRONG AN SIZE
        // ==============================

        else {

            score -= 200000;

        }

    }

}
    
}


// ======================================
// EXACT AN SIZE PRIORITY
// ======================================

if (
    intent.size
) {

    const exactAN =
        new RegExp(
            intent.size + "\\s*an\\b",
            "i"
        );


    if (
        exactAN.test(title)
    ) {

        score += 30000;

    }

}


// ======================================
// AN TERMINOLOGY BONUS
// ======================================

if (
    intent.size &&
    (
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("male to") ||
        title.includes("female to") ||
        title.includes("male adapter") ||
        title.includes("female adapter")
    )
) {

    const anTerminology =
        new RegExp(
            intent.size + "\\s*an\\b",
            "i"
        );


    if (
        anTerminology.test(title)
    ) {

        score += 15000;

    }

}


// ======================================
// EXACT AN SIZE INTELLIGENCE
// ======================================

if (
    intent.size
) {

    const exactANSize =
        new RegExp(
            intent.size + "\\s*an\\b",
            "i"
        );

    const anyANSize =
        /-\d+\s*an\b/i;


    // ==============================
    // EXACT REQUESTED AN SIZE
    // ==============================

    if (
        exactANSize.test(title)
    ) {

        score += 30000;

    }

}


// ======================================
// AN CONVERSION BONUS
// ======================================

if (
    intent.size &&
    title.includes(" to ")
) {

    const anConversion =
        new RegExp(
            intent.size + "\\s*an\\b",
            "i"
        );


    if (
        anConversion.test(title)
    ) {

        score += 10000;

    }

}


// ======================================
// NPT ONLY PENALTY
// ======================================

if (
    intent.raw.includes("an") &&
    title.includes("npt") &&
    !/-\d+\s*an\b/i.test(title)
) {

    score -= 25000;

}

// ======================================
// REMOVE OTHER FITTING FAMILIES
// ======================================

if (
    intent.fittingType === "adapter" &&
    (
        title.includes("hose end") ||
        title.includes(" tee ") ||
        title.endsWith(" tee") ||
        title.includes("union") ||
        title.includes("elbow") ||
        title.includes("coupler") ||
        title.includes("bulkhead")
    )
) {

    score -= 80000;

}


// ======================================
// REMOVE RANDOM PRODUCTS
// ======================================

if (
    intent.fittingType === "adapter" &&
    (
        title.includes("spark") ||
        title.includes("protector") ||
        title.includes("jet") ||
        title.includes("clamp")
    )
) {

    score -= 100000;

}


// ======================================
// STRICT ANGLE INTELLIGENCE
// ======================================

if (
    intent.angle
) {

    const requestedAngle =
        String(intent.angle);


    // ==============================
    // EXACT REQUESTED ANGLE
    // ==============================

    if (
        title.includes(requestedAngle + " degree") ||
        title.includes(requestedAngle + "°") ||
        title.includes(requestedAngle + "deg")
    ) {

        score += 30000;

    }


    // ==============================
    // WRONG ANGLE DETECTION
    // ==============================

    const wrongAngle =
        title.match(
            /\b(30|45|60|90|120|150|180)\b/
        );


    if (
        wrongAngle &&
        wrongAngle[0] !== requestedAngle
    ) {

        score -= 30000;

    }

}


// ======================================
// STRAIGHT WHEN ANGLE REQUESTED
// ======================================

if (
    intent.angle &&
    title.includes("straight")
) {

    score -= 40000;

}


// ==============================
// HOSE END ANGLE WORD PENALTY
// ==============================

if (
    intent.angle &&
    title.includes("hose end")
) {

    if (
        !title.includes(intent.angle + " degree") &&
        !title.includes(intent.angle + "°") &&
        !title.includes(intent.angle + "deg")
    ) {

        score -= 5000;

    }

}


// ======================================
// REMOVE NON HOSE END FITTINGS
// ======================================

if (
    intent.fittingType === "hose_end" &&
    (
        title.includes("female to male") ||
        title.includes("male to") ||
        title.includes("port")
    )
) {

    score -= 40000;

}


// ==============================
// REMOVE KITS / ASSEMBLIES
// ==============================

if (
    intent.fittingType === "hose_end" &&
    (
        title.includes("kit") ||
        title.includes("line kit") ||
        title.includes("assembly")
    )
) {

    score -= 50000;

}


// ==============================
// CLOSE HOSE END CLEANUP
// ==============================


// ==============================
// ADAPTER FINAL FILTER
// ==============================

if (
    intent.category === "adapter"
) {

    if (
        !(
            title.includes("adapter") ||
            title.includes("adaptor") ||
            title.includes("male to") ||
            title.includes("female to") ||
            title.includes("flare reducer") ||
            title.includes("dual adapter") ||
            title.includes("dual adaptor") ||
            title.match(
                /\b(380|346|700|741|922|950)-\d+/i
            )
        )
    ) {

        score -= 200000;

    }

}


// ==============================
// WELD BUNG PENALTY
// ==============================

if (
    intent.category === "adapter" &&
    (
        title.includes("weld bung") ||
        title.includes("weld-on") ||
        title.includes("weld on")
    )
) {

    score -= 30000;

}


// ==============================
// WRONG PRODUCT TYPE PENALTY
// ==============================

if (
    intent.category !== "adapter" &&
    (
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("bulkhead") ||
        title.includes("hose tail") ||
        title.includes("tail") ||
        title.includes("port")
    )
) {

    score -= 50000;

}


// ==============================
// WRONG SIZE PENALTY
// ==============================

// Size penalties are handled by the
// individual fitting-family intelligence.
//
// Adapter:
//   exact size  +80,000
//   wrong size -200,000
//
// Tee / Union:
//   exact size  +15,000
//   wrong size -40,000


return score;

}

// ======================================
// V6 SEARCH
// ======================================

function ssrSearchV6(query) {

    const intent =
        ssrAnalyseQueryV6(query);


    const results = [];


    ssrV5Products.forEach(
        product => {

            const score =
                ssrScoreProductV6(
                    product,
                    intent
                );


            results.push({

                product,
                score

            });

        }
    );


    // ==============================
    // REMOVE BAD RESULTS
    // ==============================

    const filteredResults =
        results.filter(
            x => x.score > 0
        );


    // ==============================
    // SORT BEST FIRST
    // ==============================

    filteredResults.sort(
        (a, b) =>
            b.score - a.score
    );


    // ==============================
    // DEBUG RESULTS
    // ==============================

    console.log(
        "🏆 V6 RESULTS",
        filteredResults.slice(0, 5)
    );


    // ==============================
    // RETURN TOP 5
    // ==============================

    return filteredResults.slice(0, 5);

}


// ======================================
// EXPORTS
// ======================================

window.ssrAnalyseQueryV6 =
ssrAnalyseQueryV6;

window.ssrScoreProductV6 =
ssrScoreProductV6;

window.ssrSearchV6 =
ssrSearchV6;
// ======================================
// V6 CHAT / UI HANDLER
// ======================================

function sendMessage() {

    console.log("🏁 V6 SEND FIRED");


    const input =
        document.getElementById("userInput");


    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    console.log(
        "🏁 V6 USER QUERY:",
        message
    );


    // ==================================
    // RUN V6 SEARCH
    // ==================================

    const results =
        ssrSearchV6(message);


    console.log(
        "🏆 V6 SEARCH RESULTS:",
        results
    );


    const chat =
        document.getElementById("messages");


    // ==================================
    // USER MESSAGE
    // ==================================

    chat.innerHTML += `

        <div class="user-message">

            ${message}

        </div>

    `;


    // ==================================
    // BUILD BOT RESPONSE
    // ==================================

    let reply = "";


    if (
        results.length === 0
    ) {

        reply = `

            <div class="bot-message">

                ❌ Sorry, I couldn't find a strong
                matching product.

                <br><br>

                Try something like:

                <br>

                • -6AN tee

                <br>

                • -10AN union

                <br>

                • -8AN adapter

            </div>

        `;

    }

    else {

        reply = `

            <div class="bot-message">

                <strong>🏆 TOP V6 MATCHES</strong>

                <br><br>

        `;


        results.forEach(
            result => {

                const product =
                    result.product;


                const title =
                    product["Title"] || "Product";


                const sku =
                    product["SKU"] ||
                    product["Variant SKU"] ||
                    "";


                const price =
                    product["Variant Price"] ||
                    product["Price"] ||
                    "";


                const handle =
                    product["Handle"] ||
                    "";


                const image =
                    product["Image Src"] ||
                    product["Image"] ||
                    "";


                const url =
                    handle
                        ? `https://racereadygear.com.au/products/${handle}`
                        : "#";


                reply += `

                    <div class="product-card">

                        ${
                            image
                            ? `
                                <img
                                    src="${image}"
                                    style="max-width:180px;"
                                >
                              `
                            : ""
                        }

                        <br>

                        <strong>
                            ${title}
                        </strong>

                        <br><br>

                        ${
                            sku
                            ? `SKU: ${sku}<br>`
                            : ""
                        }

                        ${
                            price
                            ? `$${price}<br>`
                            : ""
                        }

                        <br>

                        <strong>
                            Match Score:
                            ${result.score}
                        </strong>

                        <br><br>

                        ${
                            handle
                            ? `
                                <a
                                    href="${url}"
                                    target="_blank"
                                >
                                    View Product →
                                </a>
                              `
                            : ""
                        }

                    </div>

                    <br>

                `;

            }
        );


        reply += `

            </div>

        `;

    }


// ==================================
// ADD BOT RESPONSE
// ==================================

chat.innerHTML += reply;


// ==================================
// SCROLL TO BOTTOM
// ==================================

chat.scrollTop =
    chat.scrollHeight;


// ==================================
// CLEAR INPUT
// ==================================

input.value = "";

}


// ======================================
// MAKE V6 AVAILABLE TO BROWSER CONSOLE
// ======================================

window.ssrAnalyseQueryV6 =
    ssrAnalyseQueryV6;

window.ssrScoreProductV6 =
    ssrScoreProductV6;

window.ssrSearchV6 =
    ssrSearchV6;


// ======================================
// MAKE SEND MESSAGE AVAILABLE TO HTML
// ======================================

window.sendMessage =
    sendMessage
