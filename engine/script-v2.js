// ======================================
// SSRACETECH PARTS FINDER V2
// MAIN CONTROLLER
// ======================================


let v2Products = [];


// ==========================
// START APPLICATION
// ==========================

loadProducts()

.then(data => {

    v2Products = data;


    console.log(
        "🏁 SSRACETECH V2 READY",
        v2Products.length,
        "products loaded"
    );


});


// ======================================
// SSRACETECH INTELLIGENCE ENGINE V2
// ======================================


function ssrScoreProduct(product, query) {


    let score = 0;





    // ==========================
    // IGNORE EMPTY PRODUCTS
    // ==========================

    if(
        !product ||
        !product["Title"] ||
        product["Title"].trim() === ""
    ){

        return -999999;

    }



    // ==========================
// SEARCH NORMALISATION
// ==========================

let search = query
    .toLowerCase()
    .trim();


let title = (
    (product["Title"] || "") +
    " " +
    (product["Variant SKU"] || "")
)
.toLowerCase();


// DEBUG
// console.log(title);


// ==========================
// BASE PRODUCT MATCH
// ==========================

let words = search.split(" ");


words.forEach(word => {


    if(
        word.length > 2 &&
        title.includes(word)
    ){

        score += 100;

    }


});



// ======================================
// PRODUCT CATEGORY LOCK
// ======================================


// ======================================
// MASTER ENGINE DETECTION
// ======================================

const isLS =
    search.includes("ls") ||
    search.includes("ls1") ||
    search.includes("ls2") ||
    search.includes("ls3") ||
    search.includes("ls6") ||
    search.includes("lsx");

const isHolden =
    search.includes("holden") ||
    search.includes("253") ||
    search.includes("308") ||
    search.includes("304") ||
    search.includes("commodore") ||
    search.includes("torana");

const isFord =
    search.includes("ford") ||
    search.includes("289") ||
    search.includes("302") ||
    search.includes("351") ||
    search.includes("windsor") ||
    search.includes("cleveland");

const isChev =
    search.includes("chevrolet") ||
    search.includes("chevy") ||
    search.includes("350") ||
    search.includes("383") ||
    search.includes("454");

const isStarter =
    search.includes("starter");

const isIntake =
    search.includes("intake") ||
    search.includes("manifold");

const isSpeedflow =
    search.includes("speedflow") ||
    search.includes("an") ||
    search.includes("fitting");


// ==========================
// STARTER MOTOR INTELLIGENCE V5
// ==========================


if(search.includes("starter")){


    // ==========================
    // MUST BE REAL STARTER
    // ==========================


    if(title.includes("starter motor")){

        score += 30000;

    }
    else{

        score -= 60000;

    }



    // ==========================
    // PROFLOW PRIORITY
    // ==========================


    if(title.includes("proflow")){

        score += 8000;

    }



    // ==========================
// HARD STARTER PRODUCT LOCK V5
// ==========================


if(search.includes("starter")){


    // Anything without starter motor gets heavily removed

    if(!title.includes("starter motor")){

        score -= 150000;

    }



    // Extra punishment for engine parts matching keywords only

    if(
        title.includes("freeze plug") ||
        title.includes("timing cover") ||
        title.includes("dipstick") ||
        title.includes("distributor") ||
        title.includes("water neck") ||
        title.includes("manifold") ||
        title.includes("intake") ||
        title.includes("sensor") ||
        title.includes("hose") ||
        title.includes("fuel")
    ){

        score -= 150000;

    }


}



    // ==========================
    // REMOVE BATTERY / ARP ETC
    // ==========================


    if(
        title.includes("battery") ||
        title.includes("battery cable") ||
        title.includes("arp") ||
        title.includes("stud")
    ){

        score -= 80000;

    }



    // ==========================
    // UNKNOWN GENERIC STARTER
    // ==========================


    // ==========================
// UNKNOWN GENERIC STARTER
// ==========================

if(title.includes("snb010")){

    score -= 150000;

}



   // ==========================
// LS FAMILY INTELLIGENCE V7
// ==========================

if(isLS){


    // ==========================
    // TRUE LS PRODUCT MATCH
    // ==========================


    if(
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("lsx")
    ){

        score += 80000;

    }



    // ==========================
    // LS STARTER MOTOR BOOST
    // ==========================


    if(
        title.includes("starter motor") &&
        (
            title.includes("ls1") ||
            title.includes("ls2") ||
            title.includes("ls3") ||
            title.includes("lsx")
        )
    ){

        score += 60000;

    }



    // ==========================
    // LS INTAKE BOOST
    // ==========================


    if(
        title.includes("intake manifold") &&
        (
            title.includes("ls1") ||
            title.includes("ls2") ||
            title.includes("ls3")
        )
    ){

        score += 50000;

    }



    // ==========================
    // REMOVE WRONG FAMILIES
    // ==========================


    if(
        title.includes("ford") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351")
    ){

        score -= 150000;

    }



    if(
        title.includes("holden") &&
        !title.includes("ls1")
    ){

        score -= 100000;

    }



    // ==========================
    // CHEVROLET GENERIC PENALTY
    // ==========================


    if(
        title.includes("chevrolet v8") ||
        title.includes("chevy v8")
    ){

        score -= 50000;

    }



}



// ==========================
// HOLDEN FAMILY INTELLIGENCE V8
// ==========================

if(
    search.includes("holden") ||
    search.includes("308") ||
    search.includes("253") ||
    search.includes("304") ||
    search.includes("commodore") ||
    search.includes("torana")
){


    // ==========================
    // TRUE HOLDEN STARTER MATCH
    // ==========================

    if(
        title.includes("starter motor") &&
        (
            title.includes("holden") ||
            title.includes("commodore") ||
            title.includes("torana") ||
            title.includes("308") ||
            title.includes("253") ||
            title.includes("304")
        )
    ){

        score += 120000;

    }



    // ==========================
    // EXACT V8 ENGINE MATCH
    // ==========================

    if(
        search.includes("308") ||
        search.includes("253") ||
        search.includes("304")
    ){

        if(
            title.includes("308") ||
            title.includes("253") ||
            title.includes("304")
        ){

            score += 80000;

        }
        else{

            score -= 50000;

        }

    }



    // ==========================
    // HARD STARTER PRODUCT LOCK
    // ==========================

    // ==========================
// ABSOLUTE STARTER LOCK
// ==========================

if(search.includes("starter")){


    if(!title.includes("starter motor")){

        score -= 500000;

    }


}



    // ==========================
    // REMOVE WRONG ENGINE FAMILIES
    // ==========================

    if(
        title.includes("ford") ||
        title.includes("windsor") ||
        title.includes("cleveland") ||
        title.includes("289") ||
        title.includes("302") ||
        title.includes("351")
    ){

        score -= 150000;

    }



    if(
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("lsx")
    ){

        score -= 150000;

    }



    // ==========================
    // REMOVE CHEVROLET CROSS MATCH
    // ==========================

    if(
        title.includes("chevrolet") ||
        title.includes("chevy") ||
        title.includes("chev v8")
    ){

        score -= 100000;

    }



    // ==========================
    // REMOVE NON STARTER HOLDEN PARTS
    // ==========================

    if(
        title.includes("water pump") ||
        title.includes("intake") ||
        title.includes("manifold") ||
        title.includes("sensor") ||
        title.includes("gasket") ||
        title.includes("camshaft") ||
        title.includes("belt") ||
        title.includes("thermostat") ||
        title.includes("housing")
    ){

        score -= 150000;

    }


}



// ==========================
// FORD FAMILY INTELLIGENCE V7
// ==========================

if(isFord){


    // ==========================
    // TRUE FORD STARTER MATCH
    // ==========================

    if(
        title.includes("starter motor") &&
        (
            title.includes("ford") ||
            title.includes("windsor") ||
            title.includes("cleveland") ||
            title.includes("289") ||
            title.includes("302") ||
            title.includes("351") ||
            title.includes("429") ||
            title.includes("460")
        )
    ){

        score += 120000;

    }



    // ==========================
    // EXACT ENGINE MATCHING
    // ==========================


    if(search.includes("351")){


        if(
            title.includes("351") ||
            title.includes("windsor") ||
            title.includes("cleveland")
        ){

            score += 80000;

        }
        else{

            score -= 50000;

        }

    }



    if(search.includes("302")){


        if(
            title.includes("302") ||
            title.includes("windsor")
        ){

            score += 80000;

        }
        else{

            score -= 50000;

        }

    }



    if(search.includes("289")){


        if(
            title.includes("289") ||
            title.includes("windsor")
        ){

            score += 80000;

        }
        else{

            score -= 50000;

        }

    }



    // ==========================
    // BIG BLOCK FORD
    // ==========================

    if(
        search.includes("429") ||
        search.includes("460")
    ){


        if(
            title.includes("429") ||
            title.includes("460") ||
            title.includes("big block")
        ){

            score += 80000;

        }
        else{

            score -= 50000;

        }


    }



    // ==========================
    // HARD STARTER PRODUCT LOCK
    // ==========================

    if(search.includes("starter")){


        if(!title.includes("starter motor")){

            score -= 500000;

        }


    }



    // ==========================
    // REMOVE WRONG ENGINE FAMILIES
    // ==========================


    if(
        title.includes("holden") ||
        title.includes("commodore") ||
        title.includes("torana") ||
        title.includes("308") ||
        title.includes("253") ||
        title.includes("304")
    ){

        score -= 150000;

    }



    if(
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("lsx")
    ){

        score -= 150000;

    }



    // ==========================
    // REMOVE CHEVROLET CROSS MATCH
    // ==========================

    if(
        title.includes("chevrolet") ||
        title.includes("chevy") ||
        title.includes("chev v8")
    ){

        score -= 150000;

    }



}



// ==========================
// CHEVROLET FAMILY INTELLIGENCE V6
// ==========================

if(
    search.includes("chevrolet") ||
    search.includes("chevy") ||
    search.includes("sbc") ||
    search.includes("bbc") ||
    search.includes("350")
){


    if(
        title.includes("chevrolet") ||
        title.includes("chevy") ||
        title.includes("gm")
    ){

        score += 100000;

    }


    if(
        title.includes("ford") ||
        title.includes("holden") ||
        title.includes("ls1")
    ){

        score -= 80000;

    }


}






    // ==========================
    // GENERIC STARTER SEARCH
    // ==========================


    if(
        search === "starter" ||
        search === "starter motor"
    ){


        // Premium known starters first

        if(title.includes("mastertorque")){

            score += 20000;

        }


        if(title.includes("powertorque")){

            score += 15000;

        }


        if(title.includes("infini clock")){

            score += 10000;

        }


        // Put unknown generic last

        if(title === "starter motor snb010"){

            score -= 50000;

        }


    }


}
// ==========================
// INTAKE MANIFOLD INTELLIGENCE V3
// ==========================

if(

    search.includes("intake") ||
    search.includes("manifold") ||
    search.includes("airmax") ||
    search.includes("tunnel") ||
    search.includes("ram") ||
    search.includes("hi ram") ||
    search.includes("hi-ram") ||
    search.includes("hiram") ||
    search.includes("cathedral") ||
    search.includes("rectangle")

){


    // ==========================
    // HARD INTAKE PRODUCT LOCK
    // ==========================

    if(
        title.includes("intake manifold") ||
        title.includes("intake manifold kit") ||
        title.includes("tunnel ram") ||
        title.includes("hi-ram")
    ){

        score += 60000;

    }
    else{

        score -= 180000;

    }



    // ==========================
// REMOVE NON INTAKE PRODUCTS
// ==========================

if(

    !title.includes("intake manifold")

){

    score -= 200000;

}



// ==========================
// REMOVE INTAKE ACCESSORIES
// ==========================

if(

    title.includes("gasket") ||
    title.includes("bracket") ||
    title.includes("throttle cable") ||
    title.includes("steam") ||
    title.includes("oil") ||
    title.includes("lifter") ||
    title.includes("sensor") ||
    title.includes("bolt") ||
    title.includes("bolts") ||
    title.includes("stud") ||
    title.includes("stud kit")

){

    score -= 200000;

}



    // ==========================
// LS FAMILY V2
// ==========================

if(
    search.includes("ls") ||
    search.includes("ls1") ||
    search.includes("ls2") ||
    search.includes("ls3") ||
    search.includes("ls6")
){


    if(
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls3") ||
        title.includes("ls6")
    ){

        score += 60000;

    }



    // ==========================
    // LS1 CATHEDRAL PRIORITY
    // ==========================

    if(search.includes("ls1")){


        if(
            title.includes("ls1") &&
            title.includes("cathedral")
        ){

            score += 60000;

        }


        if(title.includes("ls3") || title.includes("l92")){

            score -= 30000;

        }


        if(title.includes("tunnel ram")){

            score -= 30000;

        }


    }



    // ==========================
    // LS3 RECTANGLE PRIORITY
    // ==========================

    if(search.includes("ls3")){


        if(
            title.includes("ls3") ||
            title.includes("l92") ||
            title.includes("rectangle")
        ){

            score += 80000;

        }


        if(title.includes("ls1")){

            score -= 40000;

        }


    }



}



    // ==========================
    // CATHEDRAL PORT
    // ==========================

    if(search.includes("cathedral")){

        if(
            title.includes("cathedral") ||
            title.includes("ls1") ||
            title.includes("ls2") ||
            title.includes("ls6")
        ){

            score += 90000;

        }
        else{

            score -= 60000;

        }

    }



    // ==========================
// RECTANGLE PORT / LS3-L92 V2
// ==========================

if(search.includes("rectangle")){


    // ==========================
    // TRUE RECTANGLE PORT MATCH
    // ==========================

    if(
        title.includes("rectangle") ||
        title.includes("ls3") ||
        title.includes("l92")
    ){

        score += 100000;

    }
    else{

        score -= 60000;

    }



    // ==========================
    // LS3 / L92 HARD PRIORITY
    // ==========================

    if(
        search.includes("ls3") ||
        search.includes("l92")
    ){


        if(
            title.includes("ls3") ||
            title.includes("l92") ||
            title.includes("rectangle")
        ){

            score += 150000;

        }
        else{

            score -= 200000;

        }



        // ==========================
        // REMOVE WRONG PORT TYPES
        // ==========================

        if(
            title.includes("cathedral") ||
            title.includes("ls1") ||
            title.includes("ls2") ||
            title.includes("ls6")
        ){

            score -= 150000;

        }



        // ==========================
        // REMOVE WRONG ENGINE FAMILIES
        // ==========================

        if(
            title.includes("holden") ||
            title.includes("commodore") ||
            title.includes("torana") ||
            title.includes("253") ||
            title.includes("308") ||
            title.includes("304")
        ){

            score -= 300000;

        }



        if(
            title.includes("ford") ||
            title.includes("302") ||
            title.includes("351") ||
            title.includes("cleveland") ||
            title.includes("windsor")
        ){

            score -= 300000;

        }



        if(
            title.includes("big block") ||
            title.includes("small block") ||
            title.includes("sbc") ||
            title.includes("bbc")
        ){

            score -= 200000;

        }


    }


}



    // ==========================
    // REMOVE WRONG LS PORT TYPES
    // ==========================

    if(
        title.includes("cathedral") ||
        title.includes("ls1") ||
        title.includes("ls2") ||
        title.includes("ls6")
    ){

        score -= 80000;

    }



    // ==========================
    // REMOVE WRONG ENGINE FAMILIES
    // ==========================

    if(
        search.includes("ls3") &&
        (
            title.includes("ford") ||
            title.includes("302") ||
            title.includes("351") ||
            title.includes("cleveland") ||
            title.includes("big block") ||
            title.includes("small block") ||
            title.includes("sbc")
        )
    ){

        score -= 150000;

    }


}



    // ==========================
// PENALISE CATHEDRAL PORT
// ==========================

if(
    title.includes("cathedral") ||
    title.includes("ls1") ||
    title.includes("ls2") ||
    title.includes("ls6")
){

    score -= 80000;

}



    // ==========================
    // AIRMAX
    // ==========================

    if(search.includes("airmax")){

        if(title.includes("airmax")){

            score += 90000;

        }
        else{

            score -= 40000;

        }

    }



    // ==========================
    // TUNNEL RAM
    // ==========================

    if(
        search.includes("tunnel") ||
        search.includes("ram")
    ){

        if(title.includes("tunnel ram")){

            score += 120000;

        }
        else{

            score -= 40000;

        }

    }



    // ==========================
    // HI-RAM
    // ==========================

    if(
        search.includes("hi ram") ||
        search.includes("hi-ram") ||
        search.includes("hiram")
    ){

        if(
            title.includes("hi-ram") ||
            title.includes("hi ram") ||
            title.includes("hiram")
        ){

            score += 120000;

        }
        else{

            score -= 40000;

        }

    }


}


// ======================================
// SPEEDFLOW / AN FITTING INTELLIGENCE V4
// ======================================


if(
    search.includes("speedflow") ||
    search.includes("fitting") ||
    search.includes("hose end") ||
    search.includes("an")
){


    // ==========================
    // BRAND PRIORITY
    // ==========================

    if(title.includes("speedflow")){

        score += 5000;

    }



// ==========================
// HARD AN SIZE LOCK V7
// ==========================


const requestedSizes = [
    "-3",
    "-4",
    "-6",
    "-8",
    "-10",
    "-12",
    "-16",
    "-20"
];


requestedSizes.forEach(size => {


    if(search.includes(size + "an")){


        // Correct size

        if(
            title.includes(size + "an") ||
            title.includes(size + " ")
        ){

            score += 40000;

        }



        // Wrong sizes

        requestedSizes.forEach(otherSize => {


            if(otherSize !== size){


                if(
                    title.includes(otherSize + "an") ||
                    title.includes(otherSize + " ")
                ){

                    score -= 90000;

                }


            }


        });


    }


});



    // ==========================
    // HOSE END SEARCH
    // ==========================

    if(
        search.includes("hose end") ||
        (
            search.includes("speedflow") &&
            search.includes("-6an")
        )
    ){

        if(title.includes("hose end")){

            score += 50000;

        }

    }



    // ==========================
    // UNION SEARCH
    // ==========================

    if(search.includes("union")){


        if(title.includes("union")){

            score += 50000;

        }


    }
    else{


        if(title.includes("union")){

            score -= 15000;

        }


    }



    // ==========================
    // ADAPTER SEARCH
    // ==========================

    if(
        search.includes("adapter") ||
        search.includes("adaptor")
    ){


        if(
            title.includes("adapter") ||
            title.includes("adaptor")
        ){

            score += 50000;

        }


    }



    // ==========================
    // ANGLE MATCHING
    // ==========================

    if(search.includes("90")){


        if(title.includes("90")){

            score += 15000;

        }

    }


    if(search.includes("45")){


        if(title.includes("45")){

            score += 15000;

        }

    }



    // ==========================
    // REMOVE WRONG PRODUCTS
    // ==========================


    if(
        title.includes("tank") ||
        title.includes("overflow") ||
        title.includes("battery") ||
        title.includes("brake line")
    ){

        score -= 50000;

    }



    if(
        title.includes("clamp") ||
        title.includes("p-clamp")
    ){

        score -= 50000;

    }



    if(
        title.includes("hose per meter") ||
        title.includes("teflon hose") ||
        title.includes("braided hose")
    ){

        score -= 50000;

    }



    if(title.includes("metric")){

        score -= 30000;

    }



    if(title.includes("barb")){

    score -= 30000;

}


// } // CLOSE SPEEDFLOW INTELLIGENCE



// ======================================
// CLOSE SCORE FUNCTION
// ======================================

return score;

}


// ======================================
// SEARCH ENGINE
// ======================================


function ssrSearch(query){


    return v2Products

    .map(product => {


        return {

            product,

            score:ssrScoreProduct(
                product,
                query
            )

        };


    })


    .sort((a,b)=>b.score-a.score)


    .slice(0,5);


}



// ======================================
// TEST COMMAND
// ======================================


window.ssrSearch = ssrSearch;