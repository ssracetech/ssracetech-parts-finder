// ==========================================
// SSRACETECH PARTS FINDER V3
// ==========================================

let v3Products = [];

// ==========================================
// LOAD PRODUCTS
// ==========================================

loadProducts().then(products => {

    v3Products = products;

    console.log(
        "🏁 SSRACETECH V3 READY",
        v3Products.length,
        "products loaded"
    );

});

// ==========================================
// SEARCH
// ==========================================

function ssrSearch(query){

    return v3Products

        .map(product => ({

            product,

            score: ssrScoreProduct(product, query)

        }))

        .sort((a,b)=>b.score-a.score)

.filter(x=>x.score >= 500)

.slice(0,5);

}

window.ssrSearch = ssrSearch;
// ================================
// SSRACETECH RESPONSE BUILDER V1
// ================================

function ssrBuildResponse(query){


    const results = ssrSearch(query);


    if(results.length === 0){

        return `
🏁 I couldn't find an exact match.

Try adding:
• engine size
• AN size
• vehicle
• product type
`;

    }



    // ================================
// V4 TOP 3 RECOMMENDATIONS
// ================================

const topResults = results.slice(0,3);

const best = topResults[0].product;

const bestScore = results[0].score;

const sku = best["Variant SKU"] || "N/A";

const price = best["Variant Price"]
    ? "$" + best["Variant Price"]
    : "Contact SS Racetech for pricing";

    let confidence = "";


    if(results[0].score >= 10000){

        confidence = "⭐⭐⭐⭐⭐ Excellent Match";

    }
    else if(results[0].score >= 5000){

        confidence = "⭐⭐⭐⭐ Very Good Match";

    }
    else if(results[0].score >= 2000){

        confidence = "⭐⭐⭐ Possible Match";

    }
    else{

        confidence = "⭐⭐ Needs More Information";

    }



    let response = `

🏁 I found this match for you:

⭐ ${best["Title"]}


SKU:

${sku}


PRICE:

${price}


MATCH CONFIDENCE:

${confidence}


WHY WE RECOMMEND IT:

`;



const search = query.toLowerCase();



// ================================
// INTELLIGENT RECOMMENDATION REASONS V3
// ================================

const productTitle = best["Title"].toLowerCase();


// ================================
// STARTER MOTOR
// ================================

if(
    search.includes("starter")
){

    response += `
✅ Correct starter motor application match
✅ High torque gear reduction design
✅ Reliable cranking performance for modified engines
`;

}


// ================================
// LS INTAKE / MANIFOLD
// ================================

else if(
    search.includes("intake") ||
    search.includes("manifold")
){


    // LS3 REQUEST

    if(
        search.includes("ls3") &&
        (
            productTitle.includes("ls3") ||
            productTitle.includes("l92")
        )
    ){

        response += `
✅ LS3/L92 intake application match
✅ High airflow performance manifold design
✅ 102mm throttle body compatible option
`;

    }


    // LS2 REQUEST

    else if(
        search.includes("ls2") &&
        productTitle.includes("ls2")
    ){

        response += `
✅ LS2 intake application match
✅ Cathedral port LS performance manifold
✅ Suitable for street and race engine builds
`;

    }


    // LS1 REQUEST

    else if(
        search.includes("ls1") &&
        productTitle.includes("ls1")
    ){

        response += `
✅ LS1 intake application match
✅ Cathedral port LS performance manifold
✅ Suitable for street and race engine builds
`;

    }


    // Generic LS fallback

    else if(
        productTitle.includes("ls")
    ){

        response += `
✅ LS performance intake manifold
✅ Designed for improved airflow
✅ Suitable for performance engine applications
`;

    }


    else{

        response += `
✅ Performance intake manifold application
✅ Designed for improved airflow
✅ Suitable for performance engine builds
`;

    }

}


// ================================
// AN / HOSE END / FITTINGS
// ================================

else if(
    search.includes("hose") ||
    search.includes("fitting") ||
    search.match(/-3an|-4an|-6an|-8an|-10an|-12an|-16an|-20an/)
){

    response += `
✅ Correct AN fitting category match
✅ Correct hose end / fitting style selection
✅ Suitable for performance plumbing applications
`;

}


// ================================
// TRANSMISSION COOLERS
// ================================
if(
    search.includes("cooler") ||
    search.includes("transmission")
){

    response += `
✅ Correct transmission cooling application
✅ Complete performance cooler system solution
✅ Ideal for high load street and race applications
`;

}


// ================================
// DEFAULT
// ================================

else{

    response += `
✅ Performance automotive component
✅ Selected from SS Racetech product range
✅ Suitable for performance applications
`;

}



response += `

I can also help check:
• vehicle compatibility
• matching fittings
• accessories
• alternatives

`;


response = response.replace(/\n/g,"<br>");

;


// ================================
// V5 CLEAN PRODUCT RESULTS
// ================================

let productCards = "";


results.slice(0,3).forEach((item,index)=>{


    if(index === 0){

        productCards += `
        
<div class="result-heading">

🏆 TOP MATCH

</div>

`;

    }


    if(index === 1){

        productCards += `
        
<div class="result-heading">

🥈 ALTERNATIVE OPTION

</div>

`;

    }


    if(index === 2){

        productCards += `
        
<div class="result-heading">

🥉 ANOTHER OPTION

</div>

`;

    }



    productCards += ssrCreateProductCard(
        item.product,
        item.score
    );


});



return response + productCards;

}

window.ssrBuildResponse = ssrBuildResponse;
// ================================
// SSRACETECH SCORING ENGINE V3
// ================================

function ssrScoreProduct(product, query){

    let score = 0;

    const title = (
        product["Title"] || ""
    ).toLowerCase();

    const search = query.toLowerCase();


// ================================
// STARTER MOTOR STRICT FILTER V1
// ================================

if(search.includes("starter")){


    if(
        title.includes("starter") ||
        title.includes("starter motor")
    ){

        score += 10000;

    }
    else{

        score -= 20000;

    }


    if(
        title.includes("water pump") ||
        title.includes("pulley") ||
        title.includes("gasket") ||
        title.includes("alternator") ||
        title.includes("bracket") ||
        title.includes("sensor")
    ){

        score -= 20000;

    }// ================================
// V4 TOP 3 PRODUCT RESULTS
// ================================

}


// ================================
// STARTER MOTOR INTELLIGENCE V5
// ================================

if(search.includes("starter")){


    // Must actually be a starter

    if(
        title.includes("starter") ||
        title.includes("starter motor")
    ){

        score += 10000;

    }
    else{

        score -= 50000;

    }



    // Remove unrelated products

    if(
        title.includes("water pump") ||
        title.includes("pulley") ||
        title.includes("gasket") ||
        title.includes("alternator") ||
        title.includes("bracket") ||
        title.includes("sensor") ||
        title.includes("bolt") ||
        title.includes("stud")
    ){

        score -= 50000;

    }



// ================================
// LS STARTER LOCK
// ================================

if(
    search.includes("ls1") ||
    search.includes("ls2") ||
    search.includes("ls3") ||
    search.includes("lsx")
){

    if(
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("lsx")
    ){

        score += 25000;

    }


    if(
        title.includes("chevrolet") ||
        title.includes("chevy") ||
        title.includes("gm")
    ){

        score += 8000;

    }


    if(
        title.includes("ford") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351")
    ){

        score -= 40000;

    }


    if(
        title.includes("253") ||
        title.includes("308") ||
        title.includes("304") ||
        title.includes("commodore") ||
        title.includes("torana")
    ){

        score -= 30000;

    }

}



// ================================
// HOLDEN STARTER LOCK
// ================================

if(
    search.includes("holden") ||
    search.includes("308") ||
    search.includes("253") ||
    search.includes("304") ||
    search.includes("commodore") ||
    search.includes("torana")
){


    if(
        title.includes("holden") ||
        title.includes("commodore") ||
        title.includes("torana") ||
        title.includes("253") ||
        title.includes("308") ||
        title.includes("304")
    ){

        score += 30000;

    }


    if(
        title.includes("ford") ||
        title.includes("falcon") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351")
    ){

        score -= 50000;

    }

}



// ================================
// FORD STARTER LOCK
// ================================

if(
    search.includes("ford") ||
    search.includes("falcon") ||
    search.includes("289") ||
    search.includes("302") ||
    search.includes("351")
){


    if(
        title.includes("ford") ||
        title.includes("falcon") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351")
    ){

        score += 30000;

    }


    if(
        title.includes("holden") ||
        title.includes("commodore") ||
        title.includes("torana") ||
        title.includes("308")
    ){

        score -= 50000;

    }

}



// ================================
// GENERIC STARTER SEARCH
// ================================

if(
    search === "starter" ||
    search === "starter motor"
){

    // Prefer common performance starters

    if(
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("chevrolet") ||
        title.includes("holden") ||
        title.includes("commodore")
    ){

        score += 5000;

    }


    // Stop Ford random win

    if(
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351") ||
        title.includes("windsor") ||
        title.includes("cleveland")
    ){

        score -= 5000;

    }

}

}

if(
    search.includes("ls1") &&
    search.includes("starter")
){

    if(
        title.includes("ls1")
    ){

        score += 10000;

    }


    if(
        title.includes("ls2")
    ){

        score += 8000;

    }


    if(
        title.includes("chevrolet v8") &&
        !title.includes("ls1") &&
        !title.includes("ls2")
    ){

        score -= 3000;

    }

}
// ================================
// SPEEDFLOW AN FITTING INTELLIGENCE V1
// ================================

if(
    search.includes("an") ||
    search.includes("hose") ||
    search.includes("fitting")
){

    // Speedflow preference

    if(title.includes("speedflow")){

        score += 500;

    }

// ================================
// SPEEDFLOW SIZE SEARCH BALANCE
// ================================

if(
    search.includes("speedflow") &&
    search.includes("hose end")
){

    if(title.includes("speedflow")){
        score += 2000;
    }

}

    // Hose end match

    if(
        search.includes("hose end") &&
        title.includes("hose end")
    ){

        score += 2000;

    }



   // ================================
// EXACT AN SIZE MATCHING V5
// ================================

let requestedSize = null;


// Detect requested AN size

if(search.includes("-3an")) requestedSize = "3";
if(search.includes("-4an")) requestedSize = "4";
if(search.includes("-6an")) requestedSize = "6";
if(search.includes("-8an")) requestedSize = "8";
if(search.includes("-10an")) requestedSize = "10";
if(search.includes("-12an")) requestedSize = "12";
if(search.includes("-16an")) requestedSize = "16";
if(search.includes("-20an")) requestedSize = "20";



if(requestedSize){


    // Correct size matches

    if(
        title.includes("-" + requestedSize + " ") ||
        title.includes("-0" + requestedSize + " ") ||
        title.includes("-" + requestedSize + "an")
    ){

        score += 3000;

    }



    // Wrong AN sizes

    const sizes = [
        "3",
        "4",
        "6",
        "8",
        "10",
        "12",
        "16",
        "20"
    ];


    sizes.forEach(size=>{


        if(size !== requestedSize){


            if(
                title.includes("-" + size + " ") ||
                title.includes("-0" + size + " ") ||
                title.includes("-" + size + "an")
            ){

                score -= 8000;

            }


        }


    });


}


// ================================
// ANGLE MATCHING V3
// ================================


if(search.includes("90")){


    if(title.includes("90 degree")){

        score += 3000;

    }


    if(
        title.includes("30 degree") ||
        title.includes("45 degree") ||
        title.includes("60 degree") ||
        title.includes("120 degree") ||
        title.includes("150 degree") ||
        title.includes("180 degree")
    ){

        score -= 6000;

    }

}



if(search.includes("60")){


    if(title.includes("60 degree")){

        score += 3000;

    }


    if(
    title.includes("30 degree") ||
    title.includes("45 degree") ||
    title.includes("60 degree") ||
    title.includes("120 degree") ||
    title.includes("150 degree") ||
    title.includes("180 degree")
){

    score -= 12000;

}
// ================================
// FORCE WRONG ANGLE PENALTY V4
// ================================

if(search.includes("90")){


    if(
        title.includes("60 degree") ||
        title.includes("45 degree") ||
        title.includes("120 degree") ||
        title.includes("150 degree") ||
        title.includes("180 degree") ||
        title.includes("60°") ||
        title.includes("45°") ||
        title.includes("120°") ||
        title.includes("150°") ||
        title.includes("180°")
    ){

        score -= 12000;

    }


}
}



if(search.includes("45")){


    if(title.includes("45 degree")){

        score += 3000;

    }
// ================================
// ANGLE REQUIRED FILTER
// ================================

if(
    search.includes("90") ||
    search.includes("45") ||
    search.includes("60")
){

    if(
        title.includes("straight")
    ){

        score -= 8000;

    }

}

    if(
        title.includes("30 degree") ||
        title.includes("60 degree") ||
        title.includes("90 degree") ||
        title.includes("120 degree") ||
        title.includes("150 degree") ||
        title.includes("180 degree")
    ){

        score -= 6000;

    }

}
// ================================
// STRAIGHT HOSE END FILTER V2
// ================================

if(
    search.includes("90") ||
    search.includes("45") ||
    search.includes("60")
){

    if(
        title.includes("straight")
    ){

        score -= 12000;

    }

}
// ================================
// HOSE END TYPE EXCLUSIONS
// ================================

if(search.includes("hose end")){


    if(
        title.includes("bulkhead") ||
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("female to male") ||
        title.includes("male to female")
    ){

        score -= 7000;

    }

}
// ================================
// BRAKE FITTING EXCLUSIONS
// ================================

if(search.includes("hose end")){


    if(
        title.includes("brake") ||
        title.includes("adr") ||
        title.includes("banjo")
    ){

        score -= 8000;

    }

}
// ================================
// KIT / ASSEMBLY EXCLUSIONS
// ================================

if(search.includes("hose end")){


    if(
        title.includes("kit") ||
        title.includes("assembly") ||
        title.includes("line kit") ||
        title.includes("fuel line kit")
    ){

        score -= 7000;

    }

}
} // CLOSE SPEEDFLOW INTELLIGENCE
// ================================
// HOSE END PRODUCT FILTER V2
// ================================

if(search.includes("hose end")){


    // Reward actual hose ends

    if(title.includes("hose end")){

        score += 3000;

    }
// ================================
// TRANSMISSION FAMILY INTELLIGENCE V2
// ================================

if(
    search.includes("4l80") ||
    search.includes("4l60") ||
    search.includes("700r4")
){

    // Transmission cooler products are preferred

    if(
        title.includes("transmission cooler") ||
        title.includes("trans cooler") ||
        title.includes("ultra cool")
    ){

        score += 5000;

    }


    // Remove unrelated transmission parts

    if(
        title.includes("bolt") ||
        title.includes("flexplate") ||
        title.includes("converter") ||
        title.includes("arp")
    ){

        score -= 10000;

    }

}

    // Remove non hose-end products

    if(
        !title.includes("hose end")
    ){

        score -= 10000;

    }


    // Remove accessories

    if(
        title.includes("sleeve") ||
        title.includes("mandrel") ||
        title.includes("tube") ||
        title.includes("pipe") ||
        title.includes("bend") ||
        title.includes("clamp")
    ){

        score -= 8000;

    }


    // Remove adapters

    if(
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("bulkhead")
    ){

        score -= 7000;

    }

}
// ================================
// FINAL ANGLE MATCH FILTER
// ================================

if(search.includes("90")){

    if(
        !title.includes("90 degree") &&
        !title.includes("90°")
    ){

        score -= 10000;

    }

}


if(search.includes("60")){

    if(
        !title.includes("60 degree") &&
        !title.includes("60°")
    ){

        score -= 10000;

    }

}


if(search.includes("45")){

    if(
        !title.includes("45 degree") &&
        !title.includes("45°")
    ){

        score -= 10000;

    }

}
// ================================
// TRANSMISSION COOLER INTELLIGENCE V1
// ================================

if(
    search.includes("cooler") ||
    search.includes("transmission")
){

    // Correct products

    if(
        title.includes("cooler") ||
        title.includes("transmission cooler")
    ){

        score += 5000;

    }


    // Prefer kits

    if(
        title.includes("kit") ||
        title.includes("fan")
    ){

        score += 1000;

    }


    // Remove unrelated transmission parts

    if(
        title.includes("adapter") ||
        title.includes("banjo") ||
        title.includes("bolt") ||
        title.includes("fitting") ||
        title.includes("catalogue") ||
        title.includes("cap") ||
        title.includes("nut")
    ){

        score -= 8000;

    }

}
// ================================
// REMOVE INTERCOOLER FALSE MATCHES
// ================================

if(search.includes("transmission cooler")){


    if(
        title.includes("intercooler") ||
        title.includes("air intake") ||
        title.includes("intake tubing")
    ){

        score -= 8000;

    }

}
// ================================
// TRANSMISSION COOLER REFINEMENT V2
// ================================

if(search.includes("transmission cooler")){


    // Remove oil coolers

    if(
        title.includes("oil cooler") ||
        title.includes("engine oil")
    ){

        score -= 8000;

    }


    // Prefer complete cooler kits

    if(
        title.includes("transmission cooler kit") ||
        title.includes("ultra cool")
    ){

        score += 1500;

    }


    // Put hoses below complete systems

    if(
        title.includes("hose") ||
        title.includes("line")
    ){

        score -= 3000;

    }

}
// ================================
// TRANSMISSION COOLER FINAL FILTER V3
// ================================

if(search.includes("transmission cooler")){


    if(
        title.includes("transmission cooler") ||
        title.includes("trans cooler")
    ){

        score += 3000;

    }


    if(
        title.includes("hose") ||
        title.includes("per meter")
    ){

        score -= 5000;

    }


    if(
        title.includes("water pump") ||
        title.includes("pulley")
    ){

        score -= 8000;

    }

}
// ================================
// TRANSMISSION COOLER STRICT MODE
// ================================

if(search.includes("transmission cooler")){


    if(
        !title.includes("cooler")
    ){

        score -= 10000;

    }


    if(
        title.includes("filter") ||
        title.includes("pan") ||
        title.includes("sump") ||
        title.includes("gasket")
    ){

        score -= 10000;

    }

}
// ================================
// INTAKE MANIFOLD INTELLIGENCE V2
// ================================

if(
    search.includes("intake") ||
    search.includes("manifold")
){

    // Must be an intake product

    if(
        !title.includes("intake") &&
        !title.includes("manifold")
    ){

        score -= 30000;

    }


    // Remove obvious wrong categories

    if(
        title.includes("water pump") ||
        title.includes("starter") ||
        title.includes("cooler") ||
        title.includes("fitting") ||
        title.includes("hose")
    ){

        score -= 50000;

    }

} // CLOSE INTAKE MANIFOLD INTELLIGENCE



// ================================
// LS FAMILY MATCHING V3
// ================================


if(
    search.includes("ls1")
){

    if(title.includes("ls1")){
        score += 10000;
    }


    // Shared LS1/LS2 products are acceptable

    if(
        title.includes("ls2") &&
        title.includes("ls1")
    ){

        score += 3000;

    }


    if(title.includes("ls3")){
        score -= 10000;
    }

}



if(
    search.includes("ls2")
){

    if(title.includes("ls2")){
        score += 10000;
    }


    // Shared LS1/LS2 products

    if(
        title.includes("ls1") &&
        title.includes("ls2")
    ){

        score += 3000;

    }


    if(title.includes("ls3")){
        score -= 10000;
    }

}



if(
    search.includes("ls3")
){

    if(
        title.includes("ls3") ||
        title.includes("l92")
    ){

        score += 12000;

    }


    if(title.includes("ls1")){
        score -= 10000;
    }


    if(title.includes("ls2")){
        score -= 8000;
    }


}



// ================================
// CATHEDRAL PORT INTELLIGENCE V3
// ================================


if(
    search.includes("cathedral") ||
    search.includes("cathedral port")
){

    if(
        title.includes("cathedral") ||
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls6")
    ){

        score += 5000;

    }


    if(
        title.includes("oval port") ||
        title.includes("big block") ||
        title.includes("bbc") ||
        title.includes("small block") ||
        title.includes("sbc")
    ){

        score -= 15000;

    }

}



// ================================
// LS3 FEATURE BONUS
// ================================


if(search.includes("ls3")){


    if(title.includes("102mm")){

        score += 2000;

    }


}



// ================================
// STRICT LS3 INTAKE LOCK
// ================================

if(search.includes("ls3")){


    if(
        !title.includes("ls3") &&
        !title.includes("l92")
    ){

        score -= 10000;

    }


}



    // Remove unrelated LS3 products

if(
    title.includes("strap") ||
    title.includes("bracket") ||
    title.includes("alternator") ||
    title.includes("mount")
){

    score -= 12000;

}


// ================================
// LS1 SPECIFIC V2
// ================================

if(search.includes("ls1")){


    if(title.includes("ls1")){

        score += 8000;

    }


    // LS generic intake fallback

    if(
        title.includes("ls intake") &&
        !title.includes("ls1")
    ){

        score += 3000;

    }


    // Wrong engine family penalty

    if(
        title.includes("253") ||
        title.includes("308") ||
        title.includes("holden v8") ||
        title.includes("cleveland") ||
        title.includes("windsor")
    ){

        score -= 15000;

    }


    // LS1 cathedral port preference

    if(
        search.includes("intake")
    ){

        if(
            title.includes("cathedral")
        ){

            score += 4000;

        }


        if(
            title.includes("tunnel ram")
        ){

            score -= 2000;

        }

    }


}



    // ================================
    // BRAND PREFERENCE
    // ================================

    if(title.includes("proflow")){

        score += 500;

    }



    // ================================
    // REMOVE NON INTAKE RESULTS
    // ================================

    if(
        title.includes("starter") ||
        title.includes("motor") ||
        title.includes("gasket") ||
        title.includes("bolt") ||
        title.includes("sensor")
    ){

        score -= 10000;

    }
// ================================
// INTAKE MANIFOLD CLEANUP V2
// ================================

if(
    search.includes("intake manifold")
){

    // Remove exhaust parts

    if(
        title.includes("exhaust") ||
        title.includes("gasket") ||
        title.includes("header")
    ){

        score -= 10000;

    }


    // Prefer complete intake kits

    if(
        title.includes("intake manifold") ||
        title.includes("hi-ram") ||
        title.includes("airmax")
    ){

        score += 3000;

    }

}
// ================================
// ENGINE FAMILY EXACT MATCHING V3
// ================================


if(
    search.includes("ls3")
){

    // Penalise wrong LS families

    if(
        title.includes("ls1") ||
        title.includes("ls2")
    ){

        score -= 8000;

    }


    // Reward LS3 / L92

    if(
        title.includes("ls3") ||
        title.includes("l92")
    ){

        score += 5000;

    }


    // STRICT LS3 INTAKE FINAL LOCK

    if(
        search.includes("intake") ||
        search.includes("manifold")
    ){

        if(
            title.includes("intake") ||
            title.includes("manifold")
        ){

            if(
                !title.includes("ls3") &&
                !title.includes("l92")
            ){

                score -= 15000;

            }

        }

    }


} // CLOSE LS3 SEARCH



// ================================
// LS2 SPECIFIC V3
// ================================

if(
    search.includes("ls2")
){

    // Penalise wrong LS families

    if(
        title.includes("ls1") ||
        title.includes("ls3")
    ){

        score -= 8000;

    }


    // Reward LS2

    if(
        title.includes("ls2")
    ){

        score += 5000;

    }


    // LS2 wrong engine family lock

    if(
        title.includes("ford") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("302w") ||
        title.includes("351") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("small block") ||
        title.includes("sbc") ||
        title.includes("bbc")
    ){

        score -= 30000;

    }

}



if(
    search.includes("ls1")
){

    // Penalise wrong LS families

    if(
        title.includes("ls2") ||
        title.includes("ls3")
    ){

        score -= 8000;

    }


    // Reward LS1

    if(
        title.includes("ls1")
    ){

        score += 5000;

    }

} // CLOSE LS1 SEARCH


// ================================
// FINAL SCORE RETURN
// ================================

return score;

} // CLOSE ssrScoreProduct


window.ssrSearch = ssrSearch;
window.ssrBuildResponse = ssrBuildResponse;


// ================================
// CHAT CONNECTOR V3
// ================================

function sendMessage(){

    const input = document.getElementById("userInput");

    const message = input.value.trim();

    if(!message){
        return;
    }

    console.log("USER QUERY:", message);

    const reply = ssrBuildResponse(message);

    const chat = document.getElementById("messages");

    chat.innerHTML += `
        <div class="user-message">
            ${message}
        </div>

        <div class="bot-message">
            ${reply}
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

    input.value = "";

}