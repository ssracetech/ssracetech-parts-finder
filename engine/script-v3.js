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



    const best = results[0].product;
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

    if(
        productTitle.includes("ls3") ||
        productTitle.includes("l92")
    ){

        response += `
✅ LS3/L92 intake application match
✅ High airflow performance manifold design
✅ 102mm throttle body compatible option
`;

    }

    else if(
        productTitle.includes("ls1")
    ){

        response += `
✅ LS1 intake application match
✅ Performance airflow upgrade component
✅ Suitable for street and race engine builds
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
✅ Correct AN size match
✅ Correct hose end style and angle
✅ Suitable for performance plumbing applications
`;

}


// ================================
// TRANSMISSION COOLERS
// ================================

else if(
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


return response;

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

    }

}


// ================================
// LS1 STARTER INTELLIGENCE V2
// ================================

if(
    search.includes("ls1") &&
    search.includes("starter")
){


    // Strong LS1 starter match

    if(
        title.includes("ls1") &&
        title.includes("starter")
    ){

        score += 15000;

    }


    // Accept LS2/LS1 shared starters

    if(
        title.includes("ls1/ls2") ||
        title.includes("ls1 ls2") ||
        title.includes("ls1/ls2")
    ){

        score += 10000;

    }


    // Holden LS1 applications

    if(
        title.includes("holden") ||
        title.includes("commodore")
    ){

        score += 5000;

    }


    // Prefer LS1 over LS2 only products

    if(
        title.includes("ls2") &&
        !title.includes("ls1")
    ){

        score -= 5000;

    }


    // Remove wrong starter families

    if(
        title.includes("ford") ||
        title.includes("falcon") ||
        title.includes("windsor") ||
        title.includes("chevrolet v8") ||
        title.includes("small block")
    ){

        score -= 10000;

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

        score -= 10000;

    }



    // ================================
    // LS FAMILY MATCHING
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
            title.includes("lsx") ||
            title.includes("l92")
        ){

            score += 5000;

        }


        // Wrong engine families

        if(
            title.includes("small block") ||
            title.includes("big block") ||
            title.includes("sbc") ||
            title.includes("bbc")
        ){

            score -= 5000;

        }

    }

} // CLOSE LS FAMILY MATCHING



// ================================
// LS3 / L92 SPECIFIC V2
// ================================

if(search.includes("ls3")){


    // Must actually be an intake product

    if(
        title.includes("intake") ||
        title.includes("manifold")
    ){

        score += 8000;

    }


    // LS3 / L92 match

    if(
        title.includes("ls3") ||
        title.includes("l92")
    ){

        score += 5000;

    }


    // 102mm throttle body bonus

    if(title.includes("102mm")){

        score += 2000;

    }


} // CLOSE LS3 / L92 SPECIFIC V2



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
// LS1 SPECIFIC
// ================================

    if(search.includes("ls1")){


        if(title.includes("ls1")){

            score += 8000;

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


    // ================================
    // STRICT LS3 INTAKE FINAL LOCK
    // ================================

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


}



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


    console.log(
        "USER QUERY:",
        message
    );


    const reply = ssrBuildResponse(message);


    const chat = document.getElementById("messages");


    chat.innerHTML += `

<div class="user-message">

${message}

</div>


<div class="bot-message">

${reply.replace(/\n/g,"<br>")}

</div>

`;


    input.value = "";

}



window.sendMessage = sendMessage;