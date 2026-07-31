const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

window.products = [];


// Load SS Racetech product database
fetch("products_export_1.csv")
.then(response => response.text())
.then(data => {


    function parseCSV(text) {

        const rows = [];
        let row = [];
        let value = "";
        let insideQuotes = false;


        for (let i = 0; i < text.length; i++) {

            const char = text[i];


            if (char === '"') {

                if (insideQuotes && text[i + 1] === '"') {

                    value += '"';
                    i++;

                } else {

                    insideQuotes = !insideQuotes;

                }

            }

            else if (char === "," && !insideQuotes) {

                row.push(value);
                value = "";

            }

            else if (char === "\n" && !insideQuotes) {

                row.push(value);
                rows.push(row);

                row = [];
                value = "";

            }

            else {

                value += char;

            }

        }


        if(value || row.length){

            row.push(value);
            rows.push(row);

        }


        return rows;

    }



    const rows = parseCSV(data);


    const headers = rows[0];



   window.products = rows.slice(1).map(row => {

    let product = {};

    headers.forEach((header,index)=>{

        product[header] = row[index] || "";

    });

    return product;

});


console.log("Products loaded:", window.products.length);



})
.catch(error => {

    console.log("CSV loading error:", error);

});





function addMessage(text, sender) {

    const div = document.createElement("div");

    div.className = sender;

    div.innerHTML = text;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

}





function searchProducts(question) {

    const search = question.toLowerCase().trim();

    const words = search
        .split(/\s+/)
        .filter(word => word.length > 2);


    // Smart category filtering
    let filteredProducts = products;


    if (search.includes("intake")) {

        filteredProducts = products.filter(product => {

             const title = (product.Title || "").toLowerCase();

            return (
                title.includes("intake") ||
                title.includes("manifold")
            );

        });

    }


    else if (search.includes("starter")) {

        filteredProducts = products.filter(product => {

            const title = (product.Title || "").toLowerCase();

            return title.includes("starter");

        });

    }


    else if (search.includes("alternator")) {

        filteredProducts = products.filter(product => {

            const title = (product.Title || "").toLowerCase();

            return title.includes("alternator");

        });

    }


    else if (search.includes("cooler")) {

        filteredProducts = products.filter(product => {

            const title = (product.Title || "").toLowerCase();

            return title.includes("cooler");

        });

    }


    else if (search.includes("hose end")) {

        filteredProducts = products.filter(product => {

            const title = (product.Title || "").toLowerCase();

            return title.includes("hose end");

        });

    }


    else if (search.includes("arp")) {

    filteredProducts = products.filter(product => {

        const title = (product.Title || "").toLowerCase();

        return title.includes("arp");

    });

}


// ==========================
// START SEARCH RESULTS
// ==========================

const results = filteredProducts

    .map(product => {


        const title =
            (product.Title || "").toLowerCase();


        const sku =
            (product["Variant SKU"] || "").toLowerCase();



        // ==========================
        // SKU NORMALISATION
        // ==========================

        const cleanProductSKU =
            sku.replace(/[^a-z0-9]/g, "");


        const cleanSearchSKU =
            search.replace(/[^a-z0-9]/g, "");



        // =====================================================
// SSRACETECH PARTS FINDER V2
// PRODUCT SCORING ENGINE
// =====================================================


let score = 0;


// -----------------------------------------------------
// NORMALISE SEARCH
// -----------------------------------------------------

// -----------------------------------------------------
// NORMALISE SEARCH
// -----------------------------------------------------

const cleanSearch = search.toLowerCase().trim();


// -----------------------------------------------------
// AN SIZE DETECTION
// -----------------------------------------------------

const anSizeMatch = cleanSearch.match(/-?\d+an/i);

const searchedAN = anSizeMatch
    ? anSizeMatch[0].replace("an","").replace("-","")
    : null;


// -----------------------------------------------------
// SEARCH TYPE DETECTION
// -----------------------------------------------------

const genericStarterSearch =
    cleanSearch === "starter" ||
    cleanSearch === "starter motor";


// -----------------------------------------------------
// DETECT DEGREE ANGLES
// -----------------------------------------------------

const degreeMatch = cleanSearch.match(/\d+\s*degree|\d+\s*°/g) || [];


// -----------------------------------------------------
// DETECT COMMON FABRICATION TERMS
// -----------------------------------------------------

const fabricationSearch =
    cleanSearch.includes("bend") ||
    cleanSearch.includes("elbow") ||
    cleanSearch.includes("tube") ||
    cleanSearch.includes("hose") ||
    cleanSearch.includes("reducer") ||
    cleanSearch.includes("joiner") ||
    cleanSearch.includes("coupler");



// -----------------------------------------------------
// SIZE / DIAMETER MATCH INTELLIGENCE
// -----------------------------------------------------

if (typeof sizeNumbers !== "undefined") {

    sizeNumbers.forEach(size => {


        const sizePatterns = [

            size + " inch",
            size + '"',
            size + ".00",
            size + ".0",
            size + "in",
            size + " inch hose",
            size + '" hose'

        ];


        if (
            sizePatterns.some(pattern =>
                title.includes(pattern)
            )
        ) {

            score += 6000;

        }


        // Extra boost for exact diameter matches

        if (
            title.includes(size + '"') ||
            title.includes(size + " inch")
        ) {

            score += 2000;

        }


        // Convert inch search to mm match

        let mmSize = Math.round(Number(size) * 25.4);


        if (
            title.includes(mmSize + "mm")
        ) {

            score += 5000;

        }


    });

}


const angleNumbers = cleanSearch.match(/\b(45|60|90|120|180)\b/g);


if (angleNumbers) {

    angleNumbers.forEach(angle => {

        if (title.includes(angle)) {

            score += 7000;

        }

    });

}
// -----------------------------------------------------
// SILICONE BEND PRODUCT PRIORITY
// -----------------------------------------------------

if (
    cleanSearch.includes("silicone") &&
    cleanSearch.includes("bend") &&
    title.includes("silicone bend")
) {

    score += 2000;

}



// -----------------------------------------------------
// PRODUCT FAMILIES
// -----------------------------------------------------

const family = {

    starter:
        title.includes("starter") ||
        title.includes("startor"),

    alternator:
        title.includes("alternator"),

    transmission:
        title.includes("transmission") ||
        title.includes("4l60") ||
        title.includes("4l80") ||
        title.includes("700r4"),

    speedflow:
        title.includes("speedflow"),

    hose:
        title.includes("hose"),

    fitting:
        title.includes("fitting") ||
        title.includes("adapter"),

    ls:
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("ls6") ||
        title.includes("lsx"),

    ford:
        title.includes("ford") ||
        title.includes("falcon") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351") ||
        title.includes("429") ||
        title.includes("460"),

    holden:
        title.includes("holden") ||
        title.includes("commodore") ||
        title.includes("torana") ||
        title.includes("253") ||
        title.includes("304") ||
        title.includes("308"),

    chevrolet:
    title.includes("chevrolet") ||
    title.includes("chevy") ||
    title.includes("gm"),


silicone:
    title.includes("silicone"),


hose:
    title.includes("hose"),


bend:
    title.includes("bend"),


reducer:
    title.includes("reducer"),


joiner:
    title.includes("joiner"),

};



// -----------------------------------------------------
// SEARCH FAMILIES
// -----------------------------------------------------

const searchFamily = {

    starter:
        cleanSearch.includes("starter"),

    ls:
        cleanSearch.includes("ls1") ||
        cleanSearch.includes("ls2") ||
        cleanSearch.includes("ls3") ||
        cleanSearch.includes("ls6") ||
        cleanSearch.includes("lsx"),

    ford:
        cleanSearch.includes("ford") ||
        cleanSearch.includes("falcon") ||
        cleanSearch.includes("windsor") ||
        cleanSearch.includes("cleveland") ||
        cleanSearch.includes("289") ||
        cleanSearch.includes("302") ||
        cleanSearch.includes("351") ||
        cleanSearch.includes("429") ||
        cleanSearch.includes("460"),

    holden:
        cleanSearch.includes("holden") ||
        cleanSearch.includes("commodore") ||
        cleanSearch.includes("torana") ||
        cleanSearch.includes("253") ||
        cleanSearch.includes("304") ||
        cleanSearch.includes("308"),

    chevrolet:
        cleanSearch.includes("chevrolet") ||
        cleanSearch.includes("chevy") ||
        cleanSearch.includes("gm")
        ,
        
silicone:
    search.includes("silicone"),

hose:
    search.includes("hose"),

bend:
    search.includes("bend"),

reducer:
    search.includes("reducer"),

joiner:
    search.includes("joiner"),

};



// -----------------------------------------------------
// EXACT SKU MATCH
// -----------------------------------------------------

if (cleanProductSKU === cleanSearchSKU) {

    score += 50000;

    product.exactMatch = true;

}



// -----------------------------------------------------
// TITLE MATCH
// -----------------------------------------------------

if (title.includes(cleanSearch)) {

    score += 3000;

}



// -----------------------------------------------------
// WORD MATCHING
// -----------------------------------------------------

const matches = words.filter(word =>
    title.includes(word)
);


score += matches.length * 200;


if (matches.length === words.length) {

    score += 1000;

}



// -----------------------------------------------------
// CATEGORY MATCH
// -----------------------------------------------------

// Product category match

if (
    searchFamily.starter &&
    family.starter
) {

    score += 8000;

}



if (
    searchFamily.alternator &&
    family.alternator
) {

    score += 8000;

}



if (
    searchFamily.intake &&
    family.intake
) {

    score += 8000;

}



if (
    searchFamily.cooler &&
    family.cooler
) {

    score += 8000;

}
if (searchFamily.silicone && family.silicone) {

    score += 9000;

}

if (searchFamily.hose && family.hose) {

    score += 4000;

}

if (searchFamily.bend && family.bend) {

    score += 5000;

}

if (searchFamily.reducer && family.reducer) {

    score += 6000;

}

if (searchFamily.joiner && family.joiner) {

    score += 6000;

}


// -----------------------------------------------------
// ENGINE FAMILY MATCH
// -----------------------------------------------------

if (
    searchFamily.ls &&
    family.ls
) {

    score += 7000;


    // Exact LS generation bonus

    if (
        cleanSearch.includes("ls1") &&
        title.includes("ls1")
    ) {

        score += 8000;

    }


    if (
        cleanSearch.includes("ls2") &&
        title.includes("ls2")
    ) {

        score += 8000;

    }


    if (
        cleanSearch.includes("ls3") &&
        title.includes("ls3")
    ) {

        score += 8000;

    }


    if (
        cleanSearch.includes("lsx") &&
        title.includes("lsx")
    ) {

        score += 8000;

    }


    // Wrong LS generation penalty

    if (
        cleanSearch.includes("ls3") &&
        (
            title.includes("ls1") ||
            title.includes("ls2")
        )
    ) {

        score -= 5000;

    }


    if (
        cleanSearch.includes("ls1") &&
        title.includes("ls3")
    ) {

        score -= 3000;

    }

}



if (
    searchFamily.ford &&
    family.ford
) {

    score += 7000;


    // Ford engine size matching

    if (
        cleanSearch.includes("351") &&
        title.includes("351")
    ) {

        score += 8000;

    }


    if (
        cleanSearch.includes("302") &&
        title.includes("302")
    ) {

        score += 8000;

    }


    if (
        cleanSearch.includes("289") &&
        title.includes("289")
    ) {

        score += 8000;

    }

}



if (
    searchFamily.holden &&
    family.holden
) {

    score += 7000;


    if (
        cleanSearch.includes("308") &&
        title.includes("308")
    ) {

        score += 8000;

    }


    if (
        cleanSearch.includes("253") &&
        title.includes("253")
    ) {

        score += 8000;

    }

}



if (
    searchFamily.chevrolet &&
    family.chevrolet
) {

    score += 7000;

}





    if (
        title.includes("snb010") ||
        title === "starter motor"
    ) {

        score -= 6000;

    }

// -----------------------------------------------------
// GENERIC STARTER SEARCH BALANCE
// -----------------------------------------------------

if (
    genericStarterSearch &&
    family.starter
) {

    score += 4000;


    // -----------------------------------------------------
    // PREMIUM PERFORMANCE STARTERS
    // -----------------------------------------------------

    if (title.includes("mastertorque")) {

    score += 3000;

}


    if (title.includes("powertorque")) {

        score += 4000;

    }


    if (title.includes("infini")) {

        score += 4000;

    }


    if (title.includes("gear reduction")) {

        score += 2000;

    }


    if (title.includes("high torque")) {

        score += 2000;

    }



    // -----------------------------------------------------
    // REMOVE VEHICLE-SPECIFIC ADVANTAGE IN GENERIC SEARCH
    // -----------------------------------------------------

    if (
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("lsx")
    ) {

        score -= 8000;

    }



    if (
        title.includes("ford") ||
        title.includes("falcon") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351") ||
        title.includes("429") ||
        title.includes("460")
    ) {

        score -= 9000;

    }



    if (
        title.includes("holden") ||
        title.includes("commodore") ||
        title.includes("torana") ||
        title.includes("253") ||
        title.includes("304") ||
        title.includes("308")
    ) {

        score -= 5000;

    }



    if (
        title.includes("chevrolet") ||
        title.includes("chevy") ||
        title.includes("gm")
    ) {

        score -= 7000;

    }



    // -----------------------------------------------------
    // PREFER BROADER PERFORMANCE STARTERS
    // -----------------------------------------------------

    if (
        title.includes("mastertorque") ||
        title.includes("infini")
    ) {

        score += 1000;

    }



        // -----------------------------------------------------
    // PENALISE UNKNOWN / INCOMPLETE STARTER LISTINGS
    // -----------------------------------------------------

    if (
        title.includes("snb010") ||
        title === "starter motor"
    ) {

        score -= 6000;

    }


}



// -----------------------------------------------------
// BRAND BONUS
// -----------------------------------------------------

if (title.includes("proflow")) {

    score += 300;

}


if (title.includes("speedflow")) {

    score += 300;

}



// -----------------------------------------------------
// INTAKE FALSE MATCH REMOVAL
// -----------------------------------------------------

if (

    search.includes("intake") &&

    (

        title.includes("bracket") ||
        title.includes("cable") ||
        title.includes("adapter") ||
        title.includes("gasket") ||
        title.includes("mount")

    )

) {

    return null;

}



// -----------------------------------------------------
// STARTER FALSE MATCH REMOVAL
// -----------------------------------------------------

if (

    searchFamily.starter &&

    (

        title.includes("stud") ||
        title.includes("nut") ||
        title.includes("carburetor") ||
        title.includes("carb") ||
        title.includes("radius") ||
        title.includes("bracket") ||
        title.includes("mount")

    )

) {

    return null;

}



// ==========================
// RETURN PRODUCT SCORE
// ==========================

return {

    product: product,
    score: score

};


})


// ==========================
// REMOVE EMPTY RESULTS
// ==========================

.filter(item => item !== null)


// ==========================
// GENERIC STARTER FINAL BALANCE
// ==========================

.map(item => {


    const title =
        (item.product.Title || "").toLowerCase();



        if (
        search === "starter" ||
        search === "starter motor"
    ) {


        // Reduce LS-specific advantage

        if (
            title.includes("ls1") ||
            title.includes("ls2") ||
            title.includes("ls3") ||
            title.includes("lsx")
        ) {

            item.score -= 5000;

        }



        // Reduce Ford-specific advantage

        if (
            title.includes("ford") ||
            title.includes("falcon") ||
            title.includes("windsor") ||
            title.includes("cleveland") ||
            title.includes("289") ||
            title.includes("302") ||
            title.includes("351") ||
            title.includes("429") ||
            title.includes("460")
        ) {

            item.score -= 5000;

        }



        // Reduce Holden-specific advantage

        if (
            title.includes("holden") ||
            title.includes("commodore") ||
            title.includes("torana") ||
            title.includes("253") ||
            title.includes("304") ||
            title.includes("308")
        ) {

            item.score -= 5000;

        }



        // Reduce Chevrolet-specific advantage

        if (
            title.includes("chevrolet") ||
            title.includes("chevy") ||
            title.includes("gm")
        ) {

            item.score -= 5000;

        }



        // Penalise incomplete / generic starter listings

        if (
            title.includes("snb010") ||
            title === "starter motor"
        ) {

            item.score -= 6000;

        }


    }


    return item;

})


// ==========================
// SORT BEST MATCH FIRST
// ==========================

.sort((a,b)=> b.score - a.score)

// ==========================
// FAMILY FILTER AFTER SCORING
// ==========================

.filter(item => {


    const title = (item.product.Title || "").toLowerCase();



    // ==========================
// LS SEARCHES
// ==========================

if (
    search.includes("ls") ||
    search.includes("ls1") ||
    search.includes("ls2") ||
    search.includes("ls3") ||
    search.includes("ls6") ||
    search.includes("lsx")
) {

    return (
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("ls6") ||
        title.includes("lsx") ||
        title.includes(" ls ")
    );

}



    // ==========================
    // HOLDEN SEARCHES
    // ==========================

    if (
        search.includes("holden") ||
        search.includes("commodore") ||
        search.includes("torana") ||
        search.includes("253") ||
        search.includes("304") ||
        search.includes("308")
    ) {

        return (

            title.includes("holden") ||
            title.includes("commodore") ||
            title.includes("torana") ||
            title.includes("253") ||
            title.includes("304") ||
            title.includes("308")

        );

    }



    // ==========================
    // FORD SEARCHES
    // ==========================

    if (
        search.includes("ford") ||
        search.includes("falcon") ||
        search.includes("289") ||
        search.includes("302") ||
        search.includes("351") ||
        search.includes("429") ||
        search.includes("460")
    ) {

        return (

            title.includes("ford") ||
            title.includes("falcon") ||
            title.includes("windsor") ||
            title.includes("cleveland") ||
            title.includes("289") ||
            title.includes("302") ||
            title.includes("351") ||
            title.includes("429") ||
            title.includes("460")

        );

    }



    return true;


})


.slice(0,3);



if (results.length === 0) {

    return null;

}


let reply = "";


// Smart AI introduction
if (search.includes("starter")) {

    reply +=
        "🏁 <strong>I found these starter motors that best match your search.</strong><br>" +
        "The closest match appears first.<br><br>";

}

else if (search.includes("intake")) {

    reply +=
        "🏁 <strong>I found these intake products.</strong><br>" +
        "The best matching intake manifolds appear first.<br><br>";

}

else if (search.includes("hose end")) {

    reply +=
        "🏁 <strong>I found these hose ends.</strong><br>" +
        "Results are ranked by AN size and angle.<br><br>";

}

else if (search.includes("speedflow")) {

    reply +=
        "🏁 <strong>I found these Speedflow products.</strong><br>" +
        "Showing the closest matching fittings first.<br><br>";

}

else if (search.includes("proflow")) {

    reply +=
        "🏁 <strong>I found these Proflow products.</strong><br>" +
        "Showing the closest matching products first.<br><br>";

}

else if (search.includes("transmission")) {

    reply +=
        "🏁 <strong>I found these transmission products.</strong><br>" +
        "The closest matches are shown first.<br><br>";

}

else if (search.includes("arp")) {

    reply +=
        "🏁 <strong>I found these ARP products.</strong><br>" +
        "Showing the closest matching hardware first.<br><br>";

}

else {

    reply +=
        "🏁 <strong>I found these products that best match your search.</strong><br><br>";

}


// AI recommendation
const best = results[0].product;

const bestTitle = best.Title.toLowerCase();

let recommendation = "This is the closest match based on your search.";

let reasons = [];

let applicationReasons = [];


// ==========================
// GENERIC STARTER EXPLANATION
// ==========================

if (
    search === "starter" ||
    search === "starter motor"
) {

    recommendation =
    "This performance starter motor is recommended because it offers high torque gear reduction performance and is suitable for a range of performance applications.";

}


// ==========================
// HOLDEN 304 COMPATIBILITY EXPLANATION
// ==========================

if (
    search.includes("304") &&
    (
        bestTitle.includes("holden") ||
        bestTitle.includes("commodore") ||
        bestTitle.includes("torana") ||
        bestTitle.includes("253") ||
        bestTitle.includes("308")
    )
) {

    reasons.push(
        "Holden V8 starter family compatibility match"
    );


    applicationReasons.push(
        "Suitable for Holden V8 performance applications"
    );

}

// Exact part number
if (best.exactMatch) {

    recommendation =
    "This is the exact part number you searched for and matches our catalogue listing.";

}


// LS Starter Motors
else if (
    search.includes("ls") &&
    bestTitle.includes("starter motor") &&
    (
        bestTitle.includes("ls1") ||
        bestTitle.includes("ls2")
    )
) {

    recommendation =
    "This LS starter motor is recommended because it is designed for LS1/LS2 applications with high torque gear reduction performance.";

    reasons.push("LS1 / LS2 application match");
    reasons.push("Starter motor category match");
    reasons.push("High torque gear reduction design");

    applicationReasons.push("LS engine application detected");
    applicationReasons.push("Performance replacement part");

}   // 👈 THIS closing bracket finishes LS starter section


// 👇 PASTE THE HOLDEN CODE HERE (one blank line underneath is perfect)

// Holden V8 Starter Motors
else if (
    bestTitle.includes("starter motor") &&
    (
        bestTitle.includes("holden") ||
        bestTitle.includes("commodore") ||
        bestTitle.includes("torana") ||
        bestTitle.includes("253") ||
        bestTitle.includes("308") ||
        bestTitle.includes("304")
    )
) {

    recommendation =
    "This Holden V8 starter motor is recommended for classic Holden applications and provides reliable high-torque starting performance.";

    reasons.push("Holden V8 application match");
    reasons.push("Commodore / Torana compatibility match");
    reasons.push("Starter motor category match");

    applicationReasons.push("Holden V8 engine detected");
    applicationReasons.push("Classic performance application");
    applicationReasons.push("Suitable replacement upgrade");

}


// Ford V8 Starter Motors
else if (
    bestTitle.includes("starter motor") &&
    (
        bestTitle.includes("ford") ||
        bestTitle.includes("falcon") ||
        bestTitle.includes("windsor") ||
        bestTitle.includes("cleveland") ||
        bestTitle.includes("289") ||
        bestTitle.includes("302") ||
        bestTitle.includes("351")
    )
) {

    recommendation =
    "This Ford V8 starter motor is recommended for Windsor and Cleveland applications and provides reliable high-torque starting performance.";

    reasons.push("Ford V8 application match");
    reasons.push("Windsor / Cleveland compatibility match");
    reasons.push("Starter motor category match");

    applicationReasons.push("Ford V8 engine detected");
    applicationReasons.push("Classic performance application");
    applicationReasons.push("Suitable replacement upgrade");

}


// Ford Falcon Alternators
else if (
    bestTitle.includes("alternator") &&
    (
        bestTitle.includes("ford") ||
        bestTitle.includes("falcon") ||
        bestTitle.includes("xr") ||
        bestTitle.includes("v8")
    )
) {

    recommendation =
    "This Ford Falcon alternator is recommended for reliable charging performance and is a great upgrade for street and performance applications.";

    reasons.push("Ford Falcon application match");
    reasons.push("Alternator category match");
    reasons.push("140 amp charging upgrade");

    applicationReasons.push("Ford vehicle application detected");
    applicationReasons.push("V-belt alternator setup");
    applicationReasons.push("Performance electrical upgrade");

}
// LS Race Intake / Tunnel Ram / Hi-Ram
else if (
    bestTitle.includes("tunnel ram") ||
    bestTitle.includes("fabricated") ||
    bestTitle.includes("hi-ram") ||
    bestTitle.includes("high ram")
) {

    recommendation =
    "This LS performance intake manifold is recommended for high airflow race applications where maximum intake flow and RPM capability are required.";

    reasons.push("LS race intake match");
    reasons.push("Fabricated high airflow design match");
    reasons.push("Performance intake category match");

    applicationReasons.push("LS performance build detected");
    applicationReasons.push("High RPM application");
    applicationReasons.push("Race style intake upgrade");

}


// LS Cathedral Port Intake
else if (
    bestTitle.includes("intake manifold") &&
    (
        bestTitle.includes("cathedral") ||
        bestTitle.includes("ls1") ||
        bestTitle.includes("ls2") ||
        bestTitle.includes("ls6")
    )
) {

    recommendation =
    "This LS cathedral port intake manifold is recommended for LS1/LS2 applications and is designed to improve airflow and street performance.";

    reasons.push("LS cathedral port application match");
    reasons.push("LS1 / LS2 compatibility match");
    reasons.push("Intake manifold category match");

    applicationReasons.push("LS engine application detected");
    applicationReasons.push("Cathedral port heads detected");
    applicationReasons.push("Street performance upgrade");

}


// General LS Intake
else if (
    bestTitle.includes("intake manifold") &&
    bestTitle.includes("ls")
) {

    recommendation =
    "This LS intake manifold is recommended because it matches your LS engine application and is designed to improve airflow and performance.";

    reasons.push("LS engine application match");
    reasons.push("Intake manifold category match");

    applicationReasons.push("LS engine detected");
    applicationReasons.push("Performance intake upgrade");

}


// Speedflow Hose Ends
else if (
    bestTitle.includes("speedflow") &&
    bestTitle.includes("hose end")
) {

    recommendation =
    "This Speedflow hose end matches your AN fitting requirements and is ideal for building quality fuel, oil and transmission lines.";

    reasons.push("Speedflow brand match");
    reasons.push("AN fitting style match");
    reasons.push("Hose end application match");

}
// Silicone Hose Products

else if (
    bestTitle.includes("silicone") &&
    (
        bestTitle.includes("hose") ||
        bestTitle.includes("bend") ||
        bestTitle.includes("coupler") ||
        bestTitle.includes("reducer") ||
        bestTitle.includes("elbow")
    )
) {

    recommendation =
    "This silicone hose product is recommended because it matches your size, style and performance hose requirements for intake and fabrication applications.";


    reasons.push("Silicone hose category match");
    reasons.push("Diameter / style match");
    reasons.push("Air intake and fabrication application match");


    applicationReasons.push("Suitable for turbo and intake piping applications");
    applicationReasons.push("Performance fabrication component");
    applicationReasons.push("Designed for high temperature air systems");

}



// Stainless / Aluminium Tube Bends

else if (
    (
        bestTitle.includes("stainless") ||
        bestTitle.includes("aluminium") ||
        bestTitle.includes("aluminum")
    )
    &&
    (
        bestTitle.includes("bend") ||
        bestTitle.includes("u-bend") ||
        bestTitle.includes("tube")
    )
) {

    recommendation =
    "This fabrication bend is recommended because it matches your tubing requirements for custom exhaust and performance fabrication applications.";


    reasons.push("Fabrication bend category match");
    reasons.push("Diameter and angle match");
    reasons.push("Tubing application match");


    applicationReasons.push("Suitable for exhaust fabrication");
    applicationReasons.push("Custom performance fabrication use");
    applicationReasons.push("Ideal for custom piping projects");

}
// -----------------------------------------------------
// SILICONE HOSE / BEND INTELLIGENCE
// -----------------------------------------------------

else if (
    bestTitle.includes("silicone") &&
    (
        bestTitle.includes("bend") ||
        bestTitle.includes("elbow") ||
        bestTitle.includes("coupler") ||
        bestTitle.includes("hose")
    )
) {

    recommendation =
    "This silicone hose component is recommended because it matches your diameter, angle and intake piping requirements.";

    reasons.push("Silicone hose category match");
    reasons.push("Diameter / style match");
    reasons.push("Performance intake application match");

    applicationReasons.push("Suitable for turbo and intake piping");
    applicationReasons.push("High temperature air system application");
    applicationReasons.push("Performance fabrication component");

}
// General Hose Ends
else if (
    bestTitle.includes("hose end")
) {

    recommendation =
    "This hose end matches your fitting search and is selected based on AN size, angle and fitting style.";

}
// ==========================
// SILICONE HOSE / BEND / REDUCER EXPLANATION
// ==========================

else if (
    bestTitle.includes("silicone") &&
    (
        bestTitle.includes("hose") ||
        bestTitle.includes("bend") ||
        bestTitle.includes("reducer") ||
        bestTitle.includes("coupler")
    )
) {

    recommendation =
    "This silicone hose product is recommended because it matches your size, style and performance hose requirements for intake and fabrication applications.";


    reasons.push("Silicone hose category match");
    reasons.push("Diameter / style match");
    reasons.push("Air intake and fabrication application match");


    applicationReasons.push("Suitable for turbo and intake piping applications");
    applicationReasons.push("Performance fabrication component");
    applicationReasons.push("Designed for high temperature air systems");

}


// ==========================
// STAINLESS / ALUMINIUM BENDS
// ==========================

else if (
    (
        bestTitle.includes("stainless") ||
        bestTitle.includes("316")
    ) &&
    bestTitle.includes("bend")
)
{

    recommendation =
    "This stainless steel bend is recommended because it matches your fabrication requirements for exhaust and custom piping applications.";


    reasons.push("Stainless bend category match");
    reasons.push("Diameter and angle match");
    reasons.push("Fabrication tubing application match");


    applicationReasons.push("Suitable for exhaust fabrication");
    applicationReasons.push("304/316 stainless tubing application");
    applicationReasons.push("Custom performance fabrication use");

}


else if (
    bestTitle.includes("aluminium") &&
    (
        bestTitle.includes("bend") ||
        bestTitle.includes("u-bend")
    )
)
{

    recommendation =
    "This aluminium bend is recommended for lightweight custom fabrication and intake piping applications.";


    reasons.push("Aluminium bend category match");
    reasons.push("Diameter and shape match");
    reasons.push("Lightweight fabrication component");


    applicationReasons.push("Suitable for intake fabrication");
    applicationReasons.push("Performance piping application");
    applicationReasons.push("Custom build component");

}

// LS Intake Manifolds
else if (
    bestTitle.includes("intake manifold") &&
    (
        bestTitle.includes("ls1") ||
        bestTitle.includes("ls2") ||
        bestTitle.includes("cathedral")
    )
) {

    recommendation =
    "This LS intake manifold is recommended for LS cathedral port applications and is designed for improved airflow and engine performance.";

}


// General Intake Manifolds
else if (
    bestTitle.includes("intake manifold")
) {

    recommendation =
    "This intake manifold is recommended because it matches your engine application and is designed to improve airflow and performance.";

}


// Transmission Coolers
else if (
    bestTitle.includes("transmission cooler")
) {

    recommendation =
    "This transmission cooler is recommended to help reduce transmission temperatures and improve drivetrain reliability.";

    reasons.push("Transmission cooling application match");
    reasons.push("Helps control operating temperatures");
    reasons.push("Ideal for performance and reliability upgrades");

}


// ARP Hardware
else if (
    bestTitle.includes("arp")
) {

    recommendation =
    "This ARP hardware is recommended for high-performance applications where strength and reliability are important.";

    reasons.push("ARP performance hardware match");
    reasons.push("High strength fastener application");
    reasons.push("Designed for high-performance builds");

}

// AI recommendation confidence

let confidence = "⭐⭐⭐⭐⭐ Excellent Match";


if (best.exactMatch) {

    confidence = "✅ EXACT PART NUMBER MATCH";

}

else if (results[0].score < 500) {

    confidence = "⭐⭐⭐ Possible Match";

}

else if (results[0].score < 900) {

    confidence = "⭐⭐⭐⭐ Good Match";

}

if (results[0].score < 800) {

    confidence = "⭐⭐⭐ Possible Match";

}


reply += `

<div class="ai-summary">

<strong>⭐ TOP MATCH</strong>

<br><br>

<strong>${best.Title}</strong>

<br><br>

<strong>MATCH CONFIDENCE:</strong>

<br>

${confidence}

<br><br>

<strong>${best.exactMatch ? "WHY WE FOUND THIS PART:" : "WHY WE RECOMMEND IT:"}</strong>

<br><br>

${recommendation}

<br><br>

<strong>WHY IT MATCHED:</strong>

<br><br>

${reasons.length
? reasons.map(r => "✅ " + r).join("<br>")
: "✅ Product category match<br>✅ Performance application match<br>✅ Catalogue match"}

<br><br>

<strong>APPLICATION:</strong>

<br><br>

${applicationReasons.length
? applicationReasons.map(r => "✅ " + r).join("<br>")
: 
(
    search.includes("silicone") ||
    search.includes("hose") ||
    search.includes("bend") ||
    search.includes("reducer")
)

?
"✅ Intake and fabrication application<br>✅ Performance piping component<br>✅ Suitable for custom automotive builds"

:

(
    search.includes("intake")
)

?
"✅ Performance intake upgrade<br>✅ Designed to improve airflow and engine performance"

:

(
    search.includes("starter")
)

?
"✅ Suitable for street and performance engine builds<br>✅ High torque replacement upgrade"

:

"✅ Suitable for street and performance automotive applications"

}

`;


// ==========================
// DISPLAY PRODUCTS
// ==========================

let displayedProducts = [];

results.forEach(item => {

    const product = item.product;


    // Remove duplicate product titles
    if (displayedProducts.includes(product.Title)) {
        return;
    }

    displayedProducts.push(product.Title);


    const partNumber =
    product["Variant SKU"]?.trim() ||
    product["Google Shopping / MPN"]?.trim() ||
    "N/A";


reply += `

<div class="product-card">

    ${product["Image Src"] ?
        `<img src="${product["Image Src"]}" width="180">`
        : ""}

    <br>

    🔧 <strong>${product.Title}</strong><br><br>

    🏷️ Part Number: ${partNumber}<br>

    💰 Price: $${product["Variant Price"] || "N/A"} AUD<br><br>

    🛒 <a href="https://racereadygear.com.au/products/${product.Handle}" target="_blank">
        View Product
    </a>

</div>

<br>

`;

});


return reply;

}









function botReply(question) {


    const productResults = searchProducts(question);


    if(productResults){

        return productResults;

    }


    const q = question.toLowerCase();



    if (q.includes("-6")) {

        return "🔧 I can help find -6AN fittings. Try adding the angle you need, for example: <strong>-6AN 90 degree hose end</strong>.";

    }



    if (q.includes("ls1")) {

        return "🏁 I can help find LS1 parts. Try a specific search like <strong>LS1 starter motor</strong>, <strong>LS intake</strong>, or a part number.";

    }



    if (q.includes("transmission")) {

        return "🚗 I can search transmission coolers, fittings and accessories. Try your transmission model or cooler size.";

    }



    if (q.includes("speedflow")) {

        return "💥 I can search Speedflow fittings. Try the AN size or angle you need.";

    }



    return "🤖 Try searching by product name, part number, AN size, LS model, Speedflow, or Proflow.";

}








function sendMessage() {

    console.log("SEND FIRED");

    const text = input.value.trim();


    if (text === "") return;


    addMessage(text, "user");


    input.value = "";


    setTimeout(() => {

        addMessage(botReply(text), "bot");

    },400);

}






sendBtn.addEventListener("click", sendMessage);





input.addEventListener("keypress", function(e){


    if(e.key === "Enter"){


        sendMessage();


    }


});