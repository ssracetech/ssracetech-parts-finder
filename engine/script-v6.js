// ======================================
// SSRACETECH V6 MASTER ENGINE
// CLEAN FOUNDATION
// ======================================

console.log("SSRACETECH V6 ENGINE ONLINE");


// ======================================
// V6 QUERY ANALYSER
// ======================================

function ssrAnalyseQueryV6(query) {

    const search =
        String(query || "")
            .toLowerCase()
            .trim();


    const intent = {

    raw: search,

    category: null,

    brand: null,

    engine: null,

    size: null,

    nptSize: null,

    nptGender: null,

    anGender: null,

    angle: null,

    fittingType: null,

    siliconeType: null,

    siliconeSize: null,

    material: null,

    diameter: null,

    angleDegrees: null,

    productFamily: null,

    coolingType: null,

    suspensionType: null


};


    // ==================================
// CATEGORY
// ==================================

const isANConnectionQuery =
    /-\d+\s*(?:an)?\s*(?:male|female)\b/i.test(search) ||
    /\b(?:male|female)\s*-\d+\s*(?:an)?\b/i.test(search);


const isANAdapterConversion =
    isANConnectionQuery &&
    (
        search.includes("adapter") ||
        search.includes("adaptor") ||
        search.includes("reducer") ||
        search.includes("expander")
    );


// ==================================
// HOSE / HOSE END
// ==================================

if (
    search.includes("hose end") ||
    search.includes("hose-end") ||
    search.includes("hoseend") ||
    search.includes("hose tail")
) {

    intent.category = "hose_end";

    intent.fittingType = "hose_end";

}
else if (
    search === "hose" ||
    search.startsWith("hose ")
) {

    intent.category = "hose";

}


// ==================================
// TEE
// ==================================

else if (
    search.includes("tee")
) {

    intent.category = "tee";

}


// ==================================
// AN ADAPTER
// ==================================

else if (
    isANAdapterConversion
) {

    intent.category = "adapter";

}


// ==================================
// EXPLICIT ADAPTER
// ==================================

else if (
    search.includes("adapter") ||
    search.includes("adaptor")
) {

    intent.category = "adapter";

}


// ==================================
// SILICONE
// ==================================
//
// IMPORTANT:
//
// Explicit AN / NPT reducer queries are
// NOT silicone reducers.
//
// Examples:
//
// -8AN reducer
// -8AN to -6AN reducer
// 1/2 NPT to -6AN reducer
//
// These must remain available for the
// fitting reducer intelligence.
//
// ==================================

else if (
    search.includes("silicone")
) {

    intent.category = "silicone";

}
else if (
    (
        search.includes("coupler") ||
        search.includes("intercooler") ||
        search.includes("air intake")
    ) &&
    !search.includes("aluminium") &&
    !search.includes("aluminum") &&
    !search.includes("stainless")
) {

    intent.category = "silicone";

}
else if (
    search.includes("reducer") &&
    !/-\d+\s*an\b/i.test(search) &&
    !/\bnpt\b/i.test(search) &&
    !search.includes("aluminium") &&
    !search.includes("aluminum") &&
    !search.includes("stainless")
) {

    intent.category = "silicone";

}


// ==================================
// ELBOW
// ==================================

else if (
    search.includes("elbow") &&
    !search.includes("aluminium") &&
    !search.includes("aluminum") &&
    !search.includes("stainless") &&
    !search.includes("silicone")
) {

    intent.category = "elbow";

}


// ==================================
// UNION
// ==================================

else if (
    search.includes("union")
) {

    intent.category = "union";

}


// ==================================
// STARTER
// ==================================

else if (
    search.includes("starter")
) {

    intent.category = "starter";

}


// ==================================
// ALTERNATOR
// ==================================

else if (
    search.includes("alternator")
) {

    intent.category = "alternator";

}


// ==================================
// COOLING
// ==================================

else if (
    search.includes("water pump") ||
    search.includes("waterpump")
) {

    intent.category = "cooling";
    intent.coolingType = "water_pump";

}
else if (
    search.includes("radiator cap") ||
    search.includes("radiator-cap")
) {

    intent.category = "cooling";
    intent.coolingType = "radiator_cap";

}
else if (
    search.includes("radiator")
) {

    intent.category = "cooling";
    intent.coolingType = "radiator";

}
else if (
    search.includes("transmission cooler") ||
    search.includes("trans cooler")
) {

    intent.category = "cooling";
    intent.coolingType = "transmission_cooler";

}
else if (
    search.includes("oil cooler")
) {

    intent.category = "cooling";
    intent.coolingType = "oil_cooler";

}
else if (
    search.includes("water neck") ||
    search.includes("waterneck")
) {

    intent.category = "cooling";
    intent.coolingType = "water_neck";

}
else if (
    search.includes("thermostat housing") ||
    search.includes("thermostat-housing")
) {

    intent.category = "cooling";
    intent.coolingType = "thermostat_housing";

}
else if (
    search.includes("overflow tank") ||
    search.includes("overflow bottle")
) {

    intent.category = "cooling";
    intent.coolingType = "overflow_tank";

}
else if (
    search.includes("cooling system") ||
    search.includes("cooling")
) {

    intent.category = "cooling";
    intent.coolingType = null;

}

// ==================================
// ==================================
// SUSPENSION
// ==================================

else if (
    search.includes("shock rebuild kit") ||
    (
        search.includes("rebuild kit") &&
        (
            search.includes("shock") ||
            search.includes("shocks")
        )
    )
) {

    intent.category = "suspension";
    intent.suspensionType = "shock_rebuild_kit";

}
else if (
    search.includes("bypass shock") ||
    search.includes("shock absorber") ||
    search.includes("shocks") ||
    search.includes("shock")
) {

    intent.category = "suspension";
    intent.suspensionType = "shock";

}
else if (
    search.includes("cable rod end")
) {

    intent.category = "suspension";
    intent.suspensionType = "cable_rod_end";

}
else if (
    search.includes("uniball cup")
) {

    intent.category = "suspension";
    intent.suspensionType = "uniball_cup";

}
else if (
    search.includes("uniball") ||
    search.includes("spherical bearing")
) {

    intent.category = "suspension";
    intent.suspensionType = "uniball";

}
else if (
    search.includes("misalignment spacer")
) {

    intent.category = "suspension";
    intent.suspensionType = "misalignment_spacer";

}
else if (
    search.includes("jam nut") ||
    search.includes("dust boot") ||
    search.includes("rod end boot")
) {

    intent.category = "suspension";
    intent.suspensionType = "rod_end_accessory";

}
else if (
    search.includes("limiting strap clevis")
) {

    intent.category = "suspension";
    intent.suspensionType = "limiting_strap_accessory";

}
else if (
    search.includes("limiting strap")
) {

    intent.category = "suspension";
    intent.suspensionType = "suspension_limiting_strap";

}
else if (
    search.includes("bung")
) {

    intent.category = "suspension";
    intent.suspensionType = "suspension_bung";

}
else if (
    search.includes("bushing") ||
    search.includes("bush") ||
    search.includes("nolathane") ||
    search.includes("spring eye") ||
    search.includes("pivot bush")
) {

    intent.category = "suspension";
    intent.suspensionType = "suspension_bushing";

}
else if (
    search.includes("spindle snout")
) {

    intent.category = "suspension";
    intent.suspensionType = "spindle_snout";

}
else if (
    search.includes("pivot housing")
) {

    intent.category = "suspension";
    intent.suspensionType = "pivot_housing";

}
else if (
    search.includes("extension spring") ||
    search.includes("coil spring")
) {

    intent.category = "suspension";
    intent.suspensionType = "spring";

}
else if (
    search.includes("heim joint") ||
    search.includes("heim") ||
    search.includes("rod end")
) {

    intent.category = "suspension";
    intent.suspensionType = "rod_end";

}
else if (
    search.includes("suspension")
) {

    intent.category = "suspension";
    intent.suspensionType = null;

}
// INTAKE
// ==================================

else if (
    search.includes("intake") ||
    search.includes("manifold")
) {

    intent.category = "intake";

}
// ==================================
// ==================================

  // ==================================
  // HOLLEY SMALL PARTS
  // ==================================

  else if (
      search.includes("holley") &&
      (
          search.includes("small parts") ||
          search.includes("main jet") ||
          search.includes("main jets") ||
          search.includes("power valve") ||
          search.includes("needle") ||
          search.includes("needle and seat") ||
          search.includes("accelerator pump") ||
          search.includes("discharge nozzle") ||
          search.includes("float") ||
          search.includes("diaphragm") ||
          search.includes("metering block") ||
          search.includes("fuel bowl") ||
          search.includes("rebuild kit") ||
          search.includes("fast idle cam") ||
          search.includes("choke") ||
          search.includes("throttle stud") ||
          search.includes("throttle lever")
      )
  ) {

      intent.category = "holley_small_parts";

  }
// GENERIC FITTING
// ==================================

if (
    !intent.category &&
    (
        search.includes("fitting") ||
        search.includes("fittings") ||
        search.includes("y block") ||
        search.includes("y-block")
    )
) {

    intent.category = "fitting";

    intent.fittingType = "fitting";

}

// SILICONE PRODUCT TYPE
// ==================================

if (
    search.includes("reducer") &&
    !/-\d+\s*an\b/i.test(search) &&
    !/\bnpt\b/i.test(search)
) {

    intent.siliconeType = "reducer";

}
else if (
    search.includes("bend") ||
    search.includes("elbow")
) {

    intent.siliconeType = "bend";

}
else if (
    search.includes("coupler")
) {

    intent.siliconeType = "coupler";

}
else if (
    search.includes("hose")
) {

    intent.siliconeType = "hose";

}


// ==================================
// SILICONE REDUCER TWO-SIZE DETECTION
// ==================================

if (
    intent.category === "silicone" &&
    intent.siliconeType === "reducer"
) {

    const reducerSizes =
        search.match(
            /\d+(?:\.\d+)?(?=\s*(?:inch|in|")|\b)/gi
        );


    if (
        reducerSizes &&
        reducerSizes.length >= 2
    ) {

        intent.siliconeFromSize =
            reducerSizes[0];


        intent.siliconeToSize =
            reducerSizes[1];

    }

}


// ==================================
// V6 SILICONE SIZE DETECTION
// ==================================

if (
    intent.category === "silicone"
) {

    const siliconeSizeMatch =
        search.match(
            /(\d+(?:\.\d+)?)\s*(?:inch|in|")/i
        );


    if (
        siliconeSizeMatch
    ) {

        intent.siliconeSize =
            siliconeSizeMatch[1];

    }

}
// ======================================
// V6 GENERIC SPECIFICATION INTELLIGENCE
// ======================================


// ======================================
// MATERIAL
// ======================================

if (
    search.includes("silicone")
) {

    intent.material = "silicone";

}
else if (
    search.includes("aluminium") ||
    search.includes("aluminum")
) {

    intent.material = "aluminium";

}
else if (
    search.includes("stainless") ||
    search.includes("stainless steel")
) {

    intent.material = "stainless";

}
else if (
    search.includes("steel")
) {

    intent.material = "steel";

}


// ======================================
// DIAMETER / SIZE
// ======================================

const genericDiameterMatch =
    search.match(
        /\b(\d+(?:\.\d+)?)\s*(?:inch|inches|in)\b|\b(\d+(?:\.\d+)?)\s*["']/i
    );

if (
    genericDiameterMatch
) {

    intent.diameter =
        Number(
            genericDiameterMatch[1] ||
            genericDiameterMatch[2]
        );

}


// ======================================
// ANGLE / DEGREE
// ======================================
//
// IMPORTANT:
//
// An angleDegrees value MUST have an
// explicit angle indicator.
//
// Valid:
// - 30 degree
// - 45 degrees
// - 60 deg
// - 90?
//
// Invalid:
// - -6 AN
// - -8 AN
// - -10 AN
// - -12 AN
//
// A bare number must NEVER become an angle.
//

const genericAngleMatch =
    search.match(
        /\b(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i
    );


if (
    genericAngleMatch
) {

    intent.angleDegrees =
        Number(
            genericAngleMatch[1]
        );

}

// ======================================
// PRODUCT FAMILY
// ======================================

if (
    search.includes("pie cut") ||
    search.includes("piecut")
) {

    intent.productFamily =
        "pie_cut";

}
else if (
    search.includes("silicone") &&
    (
        search.includes("bend") ||
        search.includes("elbow") ||
        /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i.test(search)
    )
) {

    intent.productFamily =
        "silicone_bend";

}
else if (
    (
        search.includes("aluminium") ||
        search.includes("aluminum")
    ) &&
    (
        search.includes("bend") ||
        search.includes("elbow")
    )
) {

    intent.productFamily =
        "aluminium_bend";

}
else if (
    search.includes("stainless") &&
    (
        search.includes("bend") ||
        search.includes("elbow")
    )
) {

    intent.productFamily =
        "stainless_bend";

}
else if (
    search.includes("bend") ||
    search.includes("elbow")
) {

    intent.productFamily =
        "bend";

}
    // ==================================
    // BRAND
    // ==================================

    if (search.includes("speedflow")) {

        intent.brand = "speedflow";

    }
    else if (search.includes("proflow")) {

        intent.brand = "proflow";

    }
    // ==================================
    // ENGINE / APPLICATION INTELLIGENCE
    // ==================================

    // ==================================
    // LS FAMILY
    // ==================================

    if (
        search.includes("ls1")
    ) {

        intent.engine = "ls1";

    }
    else if (
        search.includes("ls2")
    ) {

        intent.engine = "ls2";

    }
    else if (
        search.includes("ls3") ||
        search.includes("l92")
    ) {

        intent.engine = "ls3";

    }
    else if (
    search.includes("lsx")
) {

    intent.engine = "lsx";

}
else if (
    search === "ls" ||
    /\bls\b/.test(search)
) {

    intent.engine = "ls";

}


    // ==================================
    // HOLDEN 253
    // ==================================

    else if (
        search.includes("253")
    ) {

        intent.engine = "holden_253";

    }


    // ==================================
    // HOLDEN 304
    // ==================================

    else if (
        search.includes("304")
    ) {

        intent.engine = "holden_304";

    }


    // ==================================
    // HOLDEN 308
    // ==================================

    else if (
        search.includes("308")
    ) {

        intent.engine = "holden_308";

    }


    // ==================================
    // GENERIC HOLDEN
    // ==================================

    else if (
        search.includes("holden") ||
        search.includes("commodore") ||
        search.includes("torana")
    ) {

        intent.engine = "holden";

    }


    // ==================================
    // FORD 289
    // ==================================

    else if (
        search.includes("289")
    ) {

        intent.engine = "ford_289";

    }


    // ==================================
    // FORD 302
    // ==================================

    else if (
        search.includes("302")
    ) {

        intent.engine = "ford_302";

    }


    // ==================================
    // FORD 351
    // ==================================

    else if (
        search.includes("351")
    ) {

        intent.engine = "ford_351";

    }


    // ==================================
    // FORD WINDSOR
    // ==================================

    else if (
        search.includes("windsor")
    ) {

        intent.engine = "ford_windsor";

    }


    // ==================================
    // FORD CLEVELAND
    // ==================================

    else if (
        search.includes("cleveland")
    ) {

        intent.engine = "ford_cleveland";

    }


    // ==================================
    // GENERIC FORD
    // ==================================

    else if (
        search.includes("ford") ||
        search.includes("falcon")
    ) {

        intent.engine = "ford";

    }

    // ==================================
// NPT SIZE V2
// ==================================

const nptMatch =
    search.match(
        /\b(\d+\/\d+|\d+(?:\.\d+)?)\s*["']?\s*npt\b/i
    );

if (nptMatch) {

    intent.nptSize =
        nptMatch[1];

}


// ==================================
// NPT GENDER
// ==================================

if (
    search.includes("female npt") ||
    search.includes("npt female")
) {

    intent.nptGender = "female";

}
else if (
    search.includes("male npt") ||
    search.includes("npt male")
) {

    intent.nptGender = "male";

}


// ==================================
// AN SIZE V2
// ==================================

const anMatch =
    search.match(
        /(?:^|\s)-?(\d+)\s*an\b/i
    );

if (anMatch) {

    intent.size =
        "-" + anMatch[1];

}
else {

    // ==================================
    // BARE AN SIZE
    // ==================================

    const bareAN =
        search.match(
            /(?:^|[\s,:(])-(\d+)\b/i
        );

    if (
        bareAN &&
        !intent.nptSize
    ) {

        intent.size =
            "-" + bareAN[1];

    }

}
// ==================================
// AN / FLARE TYPE
// ==================================

if (
    /-\d+\s*an\b/i.test(search)
) {

    intent.anType = "an";

}
else if (
    /-\d+\s*flare\b/i.test(search)
) {

    intent.anType = "flare";

}
else {

    intent.anType = null;

}

// ==================================
// ==================================
// AN CONNECTION INTELLIGENCE
// ==================================


// ==================================
// FIND ALL AN CONNECTIONS
// ==================================
//
// Supports:
//
// -6AN
// -6 AN
// -6AN male
// -6 AN male
// -6AN female
// -6 AN female
//
// Gender is optional.
//

const anConnectionRegex =
    /(?:^|[^A-Za-z0-9])(?:\b(male|female)\s+)?-(\d+)\s*(?:an\b\s*)?(male|female)?\b/gi;


const anConnections = [];


let anConnectionMatch;


while (
    (
        anConnectionMatch =
            anConnectionRegex.exec(
                search
            )
    ) !== null
) {

    anConnections.push({

    size:
        "-" +
        anConnectionMatch[2],

    gender:
        (
            anConnectionMatch[1] ||
            anConnectionMatch[3]
        )
            ? (
                anConnectionMatch[1] ||
                anConnectionMatch[3]
            ).toLowerCase()
            : null,

    index:
        anConnectionMatch.index

});

}


// ==================================
// NPT POSITION
// ==================================

const nptPositionMatch =
    search.match(
        /\b\d+(?:\/\d+|\.\d+)?\s*["']?\s*npt\b/i
    );


const nptPosition =
    nptPositionMatch
        ? nptPositionMatch.index
        : -1;


// ==================================
// FIRST AN CONNECTION
// ==================================

const firstANConnection =
    anConnections[0] || null;


// ==================================
// SECOND AN CONNECTION
// ==================================

const secondANConnection =
    anConnections[1] || null;


// ==================================
// CONNECTION DIRECTION
// ==================================
//
// IMPORTANT:
//
// Direction is determined from the
// actual position of the connections
// in the user's query.
//
// -3 AN male to 1/8 NPT male
// => an_to_npt
//
// 1/8 NPT male to -3 AN male
// => npt_to_an
//
// -6 AN male to -6 AN female
// => an_to_an
//
// ==================================

if (
    firstANConnection &&
    nptPosition >= 0
) {

    intent.size =
        firstANConnection.size;


    intent.anGender =
        firstANConnection.gender;


    if (
        firstANConnection.index <
        nptPosition
    ) {

        intent.connectionDirection =
            "an_to_npt";

    }

    else {

        intent.connectionDirection =
            "npt_to_an";

    }

}


// ==================================
// AN -> AN
// ==================================

else if (
    firstANConnection &&
    secondANConnection
) {

    intent.size =
        firstANConnection.size;


    intent.anGender =
        firstANConnection.gender;


    intent.toSize =
        secondANConnection.size;


    intent.toAnGender =
        secondANConnection.gender;


    intent.connectionDirection =
        "an_to_an";

}


// ==================================
// SINGLE AN CONNECTION
// ==================================

else if (
    firstANConnection
) {

    intent.size =
        firstANConnection.size;


    intent.anGender =
        firstANConnection.gender;

}


// ==================================
// GENDER-NEUTRAL SECOND AN SIZE
// ==================================
//
// Used only when the query contains
// TWO AN connections.
//
// IMPORTANT:
//
// Do NOT allow this fallback to change
// an_to_npt or npt_to_an.
//
// Examples:
//
// -6 AN male to -6 AN female
// -6 AN male to -8 AN
//
// Must NOT affect:
//
// -3 AN male to 1/8 NPT male
// 1/8 NPT male to -3 AN male
//
// ==================================

if (
    !intent.toSize &&
    intent.size &&
    intent.connectionDirection !== "an_to_npt" &&
    intent.connectionDirection !== "npt_to_an"
) {

    const remainingAN =
        search.match(
            /\bto\s+(-\s*\d+)\s*(?:an\b|male\b|female\b|$)/i
        );


    if (
        remainingAN
    ) {

        intent.toSize =
            remainingAN[1]
                .replace(
                    /\s+/g,
                    ""
                );


        intent.connectionDirection =
            "an_to_an";

    }

}


// ==================================
// NPT / AN CONNECTION DIRECTION
// ==================================
//
// Handles BOTH:
//
// -6AN to 3/8 NPT
// 3/8 NPT to -6AN
//
// Gender is optional.
//

if (
    intent.nptSize &&
    intent.size &&
    nptPosition >= 0
) {

    console.log(
        "NPT/AN DEBUG:",
        {
            search: search,
            size: intent.size,
            nptSize: intent.nptSize,
            nptPosition: nptPosition,
            firstANConnection: firstANConnection
        }
    );


    // ==================================
    // FIND AN POSITION
    // ==================================

    let anPosition = -1;


    // ==================================
    // EXPLICIT AN CONNECTION
    // ==================================

    if (
        firstANConnection
    ) {

        anPosition =
            firstANConnection.index;

    }


    // ==================================
    // GENDER-NEUTRAL AN POSITION
    // ==================================

    else {

        const neutralANMatch =
            search.match(
                /-\d+\s*an\b/i
            );


        if (
            neutralANMatch
        ) {

            anPosition =
                neutralANMatch.index;

        }

    }


    // ==================================
    // AN POSITION DEBUG
    // ==================================

    console.log(
        "NPT/AN POSITION:",
        {
            anPosition: anPosition,
            nptPosition: nptPosition
        }
    );


    // ==================================
    // NPT -> AN
    // ==================================

    if (
        anPosition >= 0 &&
        nptPosition <
        anPosition
    ) {

        intent.connectionDirection =
            "npt_to_an";

    }


    // ==================================
    // AN -> NPT
    // ==================================

    else if (
        anPosition >= 0 &&
        anPosition <
        nptPosition
    ) {

        intent.connectionDirection =
            "an_to_npt";

    }


    // ==================================
    // NO VALID DIRECTION
    // ==================================

    else {

        intent.connectionDirection =
            null;

    }


    // ==================================
    // DIRECTION DEBUG
    // ==================================

    console.log(
        "NPT/AN DIRECTION RESULT:",
        intent.connectionDirection
    );

}


// ==================================
// END AN CONNECTION INTELLIGENCE
// ==================================

// ==================================
// ANGLE INTELLIGENCE
// ==================================
//
// IMPORTANT:
//
// An angle MUST have an explicit angle
// indicator.
//
// Valid:
// - 30 degree
// - 45 degrees
// - 60 deg
// - 90?
//
// Invalid:
// - -6 AN
// - -8 AN
// - -10 AN
// - -12 AN
//
// A bare AN size must NEVER become
// an angle.
//

const angleMatch =
    search.match(
        /\b(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i
    );


if (
    angleMatch
) {

    intent.angle =
        angleMatch[1];

}


// ==================================
// ANGLE SYMBOL
// ==================================

if (
    !intent.angle
) {

    const angleSymbolMatch =
        search.match(
            /\b(30|45|60|90|120|135|150|180)\s*?/i
        );


    if (
        angleSymbolMatch
    ) {

        intent.angle =
            angleSymbolMatch[1];

    }

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
    search.includes("hoseend") ||
    search.includes("hose tail")
) {

    intent.fittingType = "hose_end";

}
else if (
    search.includes("bulkhead")
) {

    intent.fittingType = "bulkhead";

}
else if (
    search.includes("tee")
) {

    intent.fittingType = "tee";

}
else if (
    search.includes("elbow")
) {

    intent.fittingType = "elbow";

}
else if (
    search.includes("adapter") ||
    search.includes("adaptor")
) {

    intent.fittingType = "adapter";

}
else if (
    search.includes("union")
) {

    intent.fittingType = "union";

}
else if (
    search.includes("reducer")
) {

    const hasSilicone =
        search.includes("silicone");

    const hasAN =
        /-\d+\s*an\b/i.test(search);

    const hasNPT =
        /\bnpt\b/i.test(search);

    if (
        hasAN ||
        hasNPT
    ) {

        intent.fittingType =
            "reducer";

    }

    else if (
        hasSilicone
    ) {

        intent.fittingType =
            null;

    }

}
else if (
    search.includes("fitting") ||
    search.includes("fittings")
) {

    intent.fittingType =
        "fitting";

}


    console.log(
        "V6 INTENT:",
        intent
    );

    return intent;

}


// ======================================

// ======================================
// SSRACETECH CONVERSATION INTELLIGENCE
// ======================================
//
// This layer stores the customer's current
// build conversation separately from V6 intent.
//
// V6 remains responsible for product/query
// intelligence. This layer understands the
// customer's overall build.
//

let ssrConversation = {

    history: [],

    project: null,

    vehicle: null,

    engine: null,

    system: null,

    requirements: {},

    known: {},

    missing: []

};


// ======================================
// RESET CONVERSATION
// ======================================

function ssrResetConversation() {

    ssrConversation = {

        history: [],

        project: null,

        vehicle: null,

        engine: null,

        system: null,

        requirements: {},

        known: {},

        missing: []

    };

}


// ======================================
// UPDATE CONVERSATION
// ======================================

function ssrUpdateConversation(message) {

    const text =
        String(message || "")
            .trim();

    if (!text) {

        return ssrConversation;

    }


    // Store conversation history

    ssrConversation.history.push({

        role: "customer",

        message: text

    });


    // Analyse the current message
    // using the existing V6 intelligence.

    const intent =
        ssrAnalyseQueryV6(text);


    // ==================================
    // ENGINE
    // ==================================

    if (intent.engine) {

        ssrConversation.engine =
            intent.engine;

        ssrConversation.known.engine =
            intent.engine;

    }


    // ==================================
    
// ==================================
// BUILD / PROJECT INTELLIGENCE
// ==================================

const conversationSearch =
    text.toLowerCase();


// ==================================
// FUEL SYSTEM
// ==================================

if (
    conversationSearch.includes("fuel system") ||
    conversationSearch.includes("fuel setup") ||
    conversationSearch.includes("fuel line") ||
    conversationSearch.includes("fuel lines") ||
    conversationSearch.includes("fuel plumbing")
) {

    ssrConversation.project =
        "fuel_system";

    ssrConversation.system =
        "fuel";

    ssrConversation.known.project =
        "fuel_system";

    ssrConversation.known.system =
        "fuel";

}


// ==================================
// OIL SYSTEM
// ==================================

else if (
    conversationSearch.includes("oil system") ||
    conversationSearch.includes("oil setup") ||
    conversationSearch.includes("oil line") ||
    conversationSearch.includes("oil lines") ||
    conversationSearch.includes("oil plumbing")
) {

    ssrConversation.project =
        "oil_system";

    ssrConversation.system =
        "oil";

    ssrConversation.known.project =
        "oil_system";

    ssrConversation.known.system =
        "oil";

}


// ==================================
// COOLING SYSTEM
// ==================================

else if (
    conversationSearch.includes("cooling system") ||
    conversationSearch.includes("cooling setup") ||
    conversationSearch.includes("cooling lines")
) {

    ssrConversation.project =
        "cooling_system";

    ssrConversation.system =
        "cooling";

    ssrConversation.known.project =
        "cooling_system";

    ssrConversation.known.system =
        "cooling";

}


// ==================================
// BRAKE SYSTEM
// ==================================

else if (
    conversationSearch.includes("brake system") ||
    conversationSearch.includes("brake setup") ||
    conversationSearch.includes("brake line") ||
    conversationSearch.includes("brake lines")
) {

    ssrConversation.project =
        "brake_system";

    ssrConversation.system =
        "brakes";

    ssrConversation.known.project =
        "brake_system";

    ssrConversation.known.system =
        "brakes";

}


// ==================================
// POWER STEERING
// ==================================

else if (
    conversationSearch.includes("power steering") ||
    conversationSearch.includes("power steering system") ||
    conversationSearch.includes("power steering line") ||
    conversationSearch.includes("power steering lines")
) {

    ssrConversation.project =
        "power_steering";

    ssrConversation.system =
        "power_steering";

    ssrConversation.known.project =
        "power_steering";

    ssrConversation.known.system =
        "power_steering";

}


// PRODUCT / SYSTEM CATEGORY
    // ==================================

    if (intent.category) {

        ssrConversation.known.category =
            intent.category;

    }


    // ==================================
    // SIZE
    // ==================================

    if (intent.size) {

        ssrConversation.known.size =
            intent.size;

    }


    // ==================================
    // NPT SIZE
    // ==================================

    if (intent.nptSize) {

        ssrConversation.known.nptSize =
            intent.nptSize;

    }


    // ==================================
    // ANGLE
    // ==================================

    if (intent.angle) {

        ssrConversation.known.angle =
            intent.angle;

    }


    // ==================================
    // FITTING TYPE
    // ==================================

    if (intent.fittingType) {

        ssrConversation.known.fittingType =
            intent.fittingType;

    }


    // ==================================
    // BRAND
    // ==================================

    if (intent.brand) {

        ssrConversation.known.brand =
            intent.brand;

    }


    // ==================================
    // CONNECTION DIRECTION
    // ==================================

    if (intent.connectionDirection) {

        ssrConversation.known.connectionDirection =
            intent.connectionDirection;

    }
    // ==================================
// ADDITIONAL INTENT INTELLIGENCE
// ==================================

if (intent.productFamily) {

    ssrConversation.known.productFamily =
        intent.productFamily;

}


if (intent.siliconeSize) {

    ssrConversation.known.siliconeSize =
        intent.siliconeSize;

}


if (intent.siliconeType) {

    ssrConversation.known.siliconeType =
        intent.siliconeType;

}


if (intent.material) {

    ssrConversation.known.material =
        intent.material;

}


if (intent.angleDegrees) {

    ssrConversation.known.angleDegrees =
        intent.angleDegrees;

}


if (intent.diameter) {

    ssrConversation.known.diameter =
        intent.diameter;

}
    // ==================================
    // BUILD REQUIREMENTS
    // ==================================
    //
    // Convert customer conversation into
    // structured build requirements.
    //
    // V6 remains responsible for finding
    // the actual products.
    //

    // ==================================
    // HOSE REQUIREMENT
    // ==================================

    if (
        intent.size &&
        (
            intent.siliconeType === "hose" ||
            conversationSearch.includes("hose")
        )
    ) {

        ssrConversation.requirements.hose = {

            size:
                intent.size,

            type:
                intent.anType || "an"

        };

    }


    // ==================================
    // COMPONENT CONNECTION REQUIREMENT
    // ==================================

    if (
        conversationSearch.includes("connect") &&
        conversationSearch.includes("fuel rail") &&
        conversationSearch.includes("hose")
    ) {

        if (
            !ssrConversation.requirements.connections
        ) {

            ssrConversation.requirements.connections = [];

        }


        const existingConnection =
            ssrConversation.requirements.connections.find(
                connection =>
                    connection.from === "fuel_rail" &&
                    connection.to === "hose"
            );


        if (!existingConnection) {

            ssrConversation.requirements.connections.push({

                from:
                    "fuel_rail",

                to:
                    "hose",

                hoseSize:
                    ssrConversation.requirements.hose
                        ? ssrConversation.requirements.hose.size
                        : null,

                status:
                    "incomplete"

            });

        }

    }
    // ==================================
    // ANSWER CURRENT MISSING QUESTION
    // ==================================
    //
    // If the previous conversation state is
    // waiting for a fuel rail connection,
    // interpret a bare AN/NPT answer as the
    // customer's answer to that question.
    //

    const previousMissing =
        Array.isArray(ssrConversation.missing)
            ? [...ssrConversation.missing]
            : [];


    // ==================================
    // FUEL RAIL CONNECTION ANSWER
    // ==================================

    if (
        previousMissing.includes(
            "fuel_rail_connection"
        )
    ) {

        // AN CONNECTION
        const railAnMatch =
            conversationSearch.match(
                /-(\d+)\s*an\b/i
            );


        // NPT CONNECTION
        const railNptMatch =
            conversationSearch.match(
                /\b(1\/8|1\/4|3\/8|1\/2|3\/4|1)\s*(?:npt)\b/i
            );


        // ==================================
        // AN ANSWER
        // ==================================

        if (railAnMatch) {

            const railSize =
                "-" +
                railAnMatch[1];


            const connection =
                ssrConversation.requirements.connections
                    ? ssrConversation.requirements.connections.find(
                        item =>
                            item.from === "fuel_rail" &&
                            item.to === "hose"
                    )
                    : null;


            if (connection) {

                connection.fromSize =
    railSize;

connection.fromType =
    "an";

connection.status =
    "complete";

connection.fromGender = intent.anGender || null;

            }

        }


        // ==================================
        // NPT ANSWER
        // ==================================

        else if (railNptMatch) {

            const railNptSize =
                railNptMatch[1];


            const connection =
                ssrConversation.requirements.connections
                    ? ssrConversation.requirements.connections.find(
                        item =>
                            item.from === "fuel_rail" &&
                            item.to === "hose"
                    )
                    : null;


            if (connection) {

                connection.fromSize =
                    railNptSize;

                connection.fromType =
                    "npt";

                connection.status =
                    "complete";

            }

        }

    }
    // ==================================
    // FUEL RAIL GENDER ANSWER
    // ==================================
    //
    // If we are waiting for the fuel rail
    // connection gender, interpret a simple
    // male/female reply as the answer.
    //

    if (
        previousMissing.includes(
            "fuel_rail_connection_gender"
        )
    ) {

        const connection =
            ssrConversation.requirements.connections
                ? ssrConversation.requirements.connections.find(
                    item =>
                        item.from === "fuel_rail" &&
                        item.to === "hose"
                )
                : null;


        // ==================================
        // FEMALE
        // ==================================

        if (
            connection &&
            /\bfemale\b/i.test(conversationSearch)
        ) {

            connection.fromGender =
                "female";

        }


        // ==================================
        // MALE
        // ==================================

        else if (
            connection &&
            /\bmale\b/i.test(conversationSearch)
        ) {

            connection.fromGender =
                "male";

        }

    }
    // ==================================
    // ==================================
    // GENERIC PRODUCT FAMILY ANSWER
    // ==================================
    //
    // Interpret the customer's answer in
    // the context of the product-family
    // clarification question.
    //

    if (
        previousMissing.includes(
            "product_family"
        )
    ) {

        // SILICONE BEND
        if (
            /\bsilicone\b/i.test(
                conversationSearch
            )
        ) {

            intent.material =
                "silicone";

            intent.productFamily =
                "silicone_bend";

        }

        // ALUMINIUM BEND
        else if (
            /\baluminium\b|\baluminum\b/i.test(
                conversationSearch
            )
        ) {

            intent.material =
                "aluminium";

            intent.productFamily =
                "aluminium_bend";

        }

        // STAINLESS BEND
        else if (
            /\bstainless\b/i.test(
                conversationSearch
            )
        ) {

            intent.material =
                "stainless";

            intent.productFamily =
                "stainless_bend";

        }

        // AN FITTING
        else if (
            /\ban\b/i.test(
                conversationSearch
            ) &&
            /\bfitting\b/i.test(
                conversationSearch
            )
        ) {

            intent.category =
                "fitting";

            intent.fittingType =
                "fitting";

            intent.productFamily =
                "an_fitting";

        }

    }
    // MISSING INFORMATION
    // ==================================

    // ==================================
    // ==================================
    // GENERIC PRODUCT FAMILY ANSWER
    // ==================================
    //
    // Interpret the customer's answer in
    // the context of the product-family
    // clarification question.
    //

    if (
        previousMissing.includes(
            "product_family"
        )
    ) {

        // SILICONE BEND
        if (
            /\bsilicone\b/i.test(
                conversationSearch
            )
        ) {

            intent.material =
                "silicone";

            intent.productFamily =
                "silicone_bend";

        }

        // ALUMINIUM BEND
        else if (
            /\baluminium\b|\baluminum\b/i.test(
                conversationSearch
            )
        ) {

            intent.material =
                "aluminium";

            intent.productFamily =
                "aluminium_bend";

        }

        // STAINLESS BEND
        else if (
            /\bstainless\b/i.test(
                conversationSearch
            )
        ) {

            intent.material =
                "stainless";

            intent.productFamily =
                "stainless_bend";

        }

        // AN FITTING
        else if (
            /\ban\b/i.test(
                conversationSearch
            ) &&
            /\bfitting\b/i.test(
                conversationSearch
            )
        ) {

            intent.category =
                "fitting";

            intent.fittingType =
                "fitting";

            intent.productFamily =
                "an_fitting";

        }

    }
    // MISSING INFORMATION
    // ==================================

    ssrConversation.missing = [];

    // ==================================
    // FUEL RAIL CONNECTION
    // ==================================

    const fuelRailConnection =
        ssrConversation.requirements.connections &&
        ssrConversation.requirements.connections.find(
            connection =>
                connection.from === "fuel_rail" &&
                connection.to === "hose"
        );

    if (
        fuelRailConnection &&
        fuelRailConnection.fromSize &&
        fuelRailConnection.fromType &&
        !fuelRailConnection.fromGender
    ) {

        ssrConversation.missing.push(
            "fuel_rail_connection_gender"
        );

    }

    const fuelRailConnectionNeeded =
        ssrConversation.requirements.connections &&
        ssrConversation.requirements.connections.some(
            connection =>
                connection.from === "fuel_rail" &&
                connection.to === "hose" &&
                connection.status === "incomplete"
        );

    if (fuelRailConnectionNeeded) {

        ssrConversation.missing.push(
            "fuel_rail_connection"
        );

    }

    // ==================================
    // GENERIC AN HOSE END
    // ==================================

    if (
        intent.fittingType === "hose_end" &&
        !intent.size
    ) {

        ssrConversation.missing.push(
            "an_size"
        );

    }

    // ==================================
    // GENERIC PRODUCT FAMILY
    // ==================================
    //
    // A generic bend is ambiguous.
    //
    // Examples:
    // "I need a 90 degree bend"
    // "I need a bend"
    //
    // Do not ask this when the customer
    // has already specified the material.
    //

    if (
        intent.productFamily === "bend" &&
        /\bbend\b/i.test(intent.raw || "") &&
        !intent.material
    ) {

        ssrConversation.missing.push(
            "product_family"
        );

    }

    // ==================================
    // SILICONE BEND SIZE
    // ==================================
    //
    // Once the customer has selected
    // silicone, we still need the physical
    // tube/bend diameter before searching.
    //
    if (
        intent.productFamily === "silicone_bend" &&
        !intent.siliconeSize &&
        !intent.diameter
    ) {

        ssrConversation.missing.push(
            "silicone_size"
        );

    }

    // STORE MERGED INTENT
// ==================================
//
// Each customer message may only provide
// part of the information.
//
// Example:
//
// "I need a hose end"
//     fittingType = hose_end
//
// "-6AN"
//     size = -6
//
// Do NOT replace the previous intent.
// Merge the new information into it.
//

const previousIntent =
    ssrConversation.known.intent || {};

const mergedIntent = {
    ...previousIntent
};

Object.keys(intent).forEach(key => {

    const value = intent[key];

    if (
        value !== null &&
        value !== undefined &&
        value !== ""
    ) {

        mergedIntent[key] = value;

    }

});

ssrConversation.known.intent =
    mergedIntent;


    return ssrConversation;

}


// ======================================
// CONVERSATION QUESTION ENGINE
// ======================================
//
// Determines the next useful question
// based on missing build information.
//
// Conversation Intelligence decides
// what information is missing.
//
// V6 remains responsible for product
// matching.
//

function ssrGetNextQuestion() {
    // ==================================
    // GENERIC PRODUCT FAMILY
    // ==================================
    //
    // A generic bend needs clarification
    // before catalogue matching.
    //

    if (
        ssrConversation.missing.includes(
            "product_family"
        )
    ) {

        return (
            "What type of bend do you need? " +
            "For example: silicone hose bend, " +
            "aluminium tube bend, stainless tube bend, " +
            "AN/NPT fitting, or something else."
        );

    }


    // ==================================
    // ==================================
    // SILICONE BEND SIZE
    // ==================================
    //
    // Once the customer has selected
    // silicone, determine the physical
    // bend diameter before searching.
    //

    if (
        ssrConversation.missing.includes(
            "silicone_size"
        )
    ) {

        return (
            "What size silicone bend do you need? " +
            "For example: 1.5 inch, 2 inch, " +
            "2.5 inch, or 3 inch."
        );

    }

    // FUEL RAIL CONNECTION
    // ==================================
    //
    // First determine what connection/thread
    // is actually on the customer's fuel rail.
    //

    if (
        ssrConversation.missing.includes(
            "fuel_rail_connection"
        )
    ) {

        return (
            "What connection or thread is on your fuel rail? " +
            "For example: -8AN, -6AN, or 3/8 NPT."
        );

    }


    // ==================================
    // FUEL RAIL CONNECTION GENDER
    // ==================================
    //
    // Once we know the rail size/type,
    // determine whether the rail connection
    // is male or female.
    //

    if (
        ssrConversation.missing.includes(
            "fuel_rail_connection_gender"
        )
    ) {

        const connection =
            ssrConversation.requirements.connections
                ? ssrConversation.requirements.connections.find(
                    item =>
                        item.from === "fuel_rail" &&
                        item.to === "hose"
                )
                : null;


        if (
            connection &&
            connection.fromSize &&
            connection.fromType === "an"
        ) {

            return (
                "Is the " +
                connection.fromSize +
                "AN connection on your fuel rail male or female?"
            );

        }


        return (
            "Is the connection on your fuel rail male or female?"
        );

    }


    // ==================================
    // GENERIC AN SIZE
    // ==================================

    if (
        ssrConversation.missing.includes(
            "an_size"
        )
    ) {

        return (
            "What AN size do you need? " +
            "For example: -3AN, -6AN, -8AN, or -10AN."
        );

    }

    // ==================================
    // NO QUESTION REQUIRED
    // ==================================

    return null;

}


window.ssrGetNextQuestion =
    ssrGetNextQuestion;

// ======================================
// GET CONVERSATION STATE
// ======================================

function ssrGetConversation() {

    return ssrConversation;

}



// ======================================
// CONVERSATION PUBLIC API
// ======================================

window.ssrUpdateConversation =
    ssrUpdateConversation;

window.ssrGetConversation =
    ssrGetConversation;

window.ssrResetConversation =
    ssrResetConversation;

// V6 SCORING ENGINE
// ======================================

function ssrScoreProductV6(product, intent) {

    let score = 0;

    const title =
        String(
            product["Title"] || ""
        ).toLowerCase();


    if (!title) {

        return -999999;

    }


    // ==================================
    // BASIC WORD MATCH
    // ==================================

    intent.raw
        .split(/\s+/)
        .forEach(word => {

            if (
                word.length > 2 &&
                title.includes(word)
            ) {

                score += 100;

            }

        });


    // ==================================
    // PRODUCT DATA
    // ==================================


    const productType =
        String(
            product["Type"] || ""
        ).toLowerCase();


    const productTags =
        String(
            product["Tags"] || ""
        ).toLowerCase();


    const productBody =
        String(
            product["Body (HTML)"] || ""
        ).toLowerCase();

// ==================================

  // ==================================
  // HOLLEY SMALL PARTS INTELLIGENCE
  // ==================================

  if (
      intent.category === "holley_small_parts"
  ) {

      const isHolleySmallParts =
          productType.includes(
              "holley small parts centre"
          );

      if (
          isHolleySmallParts
      ) {

          score += 500000;

      }
      else {

          score -= 400000;

      }


      // ==================================
      // SPECIFIC HOLLEY PART INTELLIGENCE
      // ==================================

      const holleyTerms = [

          ["main jet", [
              "main jet"
          ]],

          ["power valve", [
              "power valve"
          ]],

          ["needle and seat", [
              "needle and seat",
              "inlet needle"
          ]],

          ["accelerator pump", [
              "accelerator pump",
              "accelerator pump cam"
          ]],

          ["discharge nozzle", [
              "discharge nozzle"
          ]],

          ["float", [
              "float"
          ]],

          ["diaphragm", [
              "diaphragm"
          ]],

          ["metering block", [
              "metering block"
          ]],

          ["fuel bowl", [
              "fuel bowl"
          ]],

          ["rebuild kit", [
              "rebuild kit"
          ]],

          ["fast idle cam", [
              "fast idle cam"
          ]],

          ["choke", [
              "choke"
          ]],

          ["throttle stud", [
              "throttle stud"
          ]],

          ["throttle lever", [
              "throttle lever"
          ]]

      ];


      holleyTerms.forEach(
          ([queryTerm, productTerms]) => {

              if (
                  intent.raw.includes(queryTerm)
              ) {

                  const matches =
                      productTerms.some(
                          term =>
                              title.includes(term)
                      );

                  if (
                      matches
                  ) {

                      score += 250000;

                  }
                  else {

                      score -= 150000;

                  }

              }

          }
      );


      // ==================================
      // PREVENT GENERIC "VALVE" MATCHES
      // ==================================

      if (
          intent.raw.includes("power valve") &&
          !title.includes("power valve")
      ) {

          score -= 300000;

      }

      // STRICT POWER VALVE PRECISION
      // Do not allow unrelated Holley valve products
      // to compete with an explicit power-valve query.

      if (
    intent.raw.includes("power valve") &&
    !title.includes("power valve")
) {

    return -999999;

}


      // ==================================
      // HOLLEY BRAND LOCK
      // ==================================

      if (
          !title.includes("holley") &&
          !productType.includes("holley")
      ) {

          score -= 250000;

      }

  }
// GENERIC SPEC INTELLIGENCE
// ==================================

const productText =
    (
        title +
        " " +
        productType +
        " " +
        productTags +
        " " +
        productBody
    ).toLowerCase();


// ==================================
// TITLE SPECIFICATION TEXT
// ==================================

const titleText =
    title;


// ==================================
// MATERIAL INTELLIGENCE
// ==================================

if (
    intent.material
) {

    const material =
        intent.material;

    const hasMaterial =
        titleText.includes(material) ||
        (
            material === "aluminium" &&
            titleText.includes("aluminum")
        );

    if (
        hasMaterial
    ) {

        score += 120000;

    }
    else {

        score -= 120000;

    }

}


// ==================================
// DIAMETER INTELLIGENCE
// ==================================

if (
    intent.diameter
) {

    const diameter =
        Number(
            intent.diameter
        );


    const diameterPattern =
        new RegExp(
            "(^|\\s|\\(|\\|)" +
            diameter +
            "\\s*(?:inch|in\\b|\")",
            "i"
        );


    const diameterMatch =
        diameterPattern.test(
            titleText
        );


    if (
        diameterMatch
    ) {

        score += 150000;

    }
    else {

        score -= 100000;

    }

}


// ==================================
// ANGLE INTELLIGENCE
// ==================================

if (
    intent.angleDegrees
) {

    const angle =
        Number(
            intent.angleDegrees
        );


    const anglePattern =
    new RegExp(
        "(^|\\s|\\()" +
        angle +
        "\\s*(?:degree|degrees|deg)?",
        "i"
    );


    const angleMatch =
        anglePattern.test(
            titleText
        );


    if (
        angleMatch
    ) {

        score += 150000;

    }
    else {

        score -= 100000;

    }

}


// ==================================
// PRODUCT FAMILY INTELLIGENCE
// ==================================

if (
    intent.productFamily
) {

    const family =
        intent.productFamily;


    // ==================================
    // SILICONE BEND
    // ==================================

    if (
        family === "silicone_bend"
    ) {

        const isSilicone =
            titleText.includes("silicone");

        const isBend =
            titleText.includes("bend") ||
            titleText.includes("elbow") ||
            titleText.includes("coupler");


        if (
            isSilicone &&
            isBend
        ) {

            score += 120000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // ALUMINIUM BEND
    // ==================================

    if (
        family === "aluminium_bend"
    ) {

        const isAluminium =
            titleText.includes("aluminium") ||
            titleText.includes("aluminum");

        const isBend =
            titleText.includes("bend") ||
            titleText.includes("elbow");


        if (
            isAluminium &&
            isBend
        ) {

            score += 120000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // STAINLESS BEND
    // ==================================

    if (
        family === "stainless_bend"
    ) {

        const isStainless =
            titleText.includes("stainless");

        const isBend =
            titleText.includes("bend") ||
            titleText.includes("elbow");


        if (
            isStainless &&
            isBend
        ) {

            score += 120000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // PIE CUT
    // ==================================

    if (
        family === "pie_cut"
    ) {

        const isPieCut =
            titleText.includes("pie cut") ||
            titleText.includes("piecut");


        if (
            isPieCut
        ) {

            score += 150000;

        }
        else {

            score -= 150000;

        }

    }


    // ==================================
    // WATER NECK
    // ==================================

    if (
        family === "water_neck"
    ) {

        const isWaterNeck =
            titleText.includes("water neck") ||
            titleText.includes("waterneck");


        if (
            isWaterNeck
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // THERMOSTAT
    // ==================================

    if (
        family === "thermostat"
    ) {

        const isThermostat =
            titleText.includes("thermostat");


        if (
            isThermostat
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // AIR FILTER
    // ==================================

    if (
        family === "air_filter"
    ) {

        const isAirFilter =
            titleText.includes("air filter") ||
            titleText.includes("pod air filter") ||
            titleText.includes("filter assembly") ||
            titleText.includes("filter element");


        if (
            isAirFilter
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // OIL FILTER
    // ==================================

    if (
        family === "oil_filter"
    ) {

        const isOilFilter =
            titleText.includes("oil filter");


        if (
            isOilFilter
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // OIL COOLER
    // ==================================

    if (
        family === "oil_cooler"
    ) {

        const isOilCooler =
            titleText.includes("oil cooler");


        if (
            isOilCooler
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // INTAKE MANIFOLD
    // ==================================

    if (
        family === "intake_manifold"
    ) {

        const isIntakeManifold =
            titleText.includes("intake manifold");


        if (
            isIntakeManifold
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // DIPSTICK
    // ==================================

    if (
        family === "dipstick"
    ) {

        const isDipstick =
            titleText.includes("dipstick") ||
            titleText.includes("dip stick");


        if (
            isDipstick
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // STARTER
    // ==================================

    if (
        family === "starter"
    ) {

        const isStarter =
            titleText.includes("starter");


        if (
            isStarter
        ) {

            score += 180000;

        }
        else {

            score -= 100000;

        }

    }

}

    // ==================================
    // BRAND DETECTION
    // ==================================

    const isSpeedflow =
        title.includes("speedflow") ||
        productType.includes("speedflow") ||
        productTags.includes("speedflow") ||
        productBody.includes("speedflow");


    const isProflow =
        title.includes("proflow") ||
        productType.includes("proflow") ||
        productTags.includes("proflow") ||
        productBody.includes("proflow");


    // ==================================
    // BRAND INTELLIGENCE
    // ==================================

    if (
        intent.brand === "speedflow"
    ) {

        score +=
            isSpeedflow
                ? 30000
                : -30000;

    }


    if (
        intent.brand === "proflow"
    ) {

        score +=
            isProflow
                ? 30000
                : -30000;

    }
    // ==================================
    // STARTER APPLICATION INTELLIGENCE
    // ==================================

    if (
        intent.category === "starter"
    ) {

        // ==================================
// STARTER CATEGORY HARD LOCK
// ==================================

const isStarterProduct =
    title.includes("starter motor") ||
    title.includes("starter");


if (
    isStarterProduct
) {

    score += 50000;

}
else {

    score -= 500000;

}


// ==================================
// HARD REJECT NON-STARTER PRODUCTS
// ==================================

if (
    title.includes("lead set") ||
    title.includes("lifters") ||
    title.includes("valve cover") ||
    title.includes("freeze plug") ||
    title.includes("camshaft") ||
    title.includes("bearing") ||
    title.includes("dipstick") ||
    title.includes("water neck") ||
    title.includes("distributor") ||
    title.includes("gasket") ||
    title.includes("alternator") ||
    title.includes("water pump") ||
    title.includes("pulley") ||
    title.includes("bracket") ||
    title.includes("sensor") ||
    title.includes("bolt") ||
    title.includes("stud")
) {

    score -= 300000;

}


// ==================================
// LS STARTER LOCK
// ==================================


        // ==================================
        // LS1
        // ==================================

        if (
            intent.engine === "ls1"
        ) {

            if (
                title.includes("ls1")
            ) {

                score += 100000;

            }

            if (
                title.includes("ls2")
            ) {

                score += 70000;

            }

            if (
                title.includes("chevrolet") ||
                title.includes("chevy") ||
                title.includes("gm")
            ) {

                score += 30000;

            }


            // Wrong Ford family

            if (
                title.includes("ford") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score -= 120000;

            }


            // Wrong Holden family

            if (
                title.includes("253") ||
                title.includes("308") ||
                title.includes("304") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score -= 120000;

            }

        }


        // ==================================
        // LS2
        // ==================================

        if (
            intent.engine === "ls2"
        ) {

            if (
                title.includes("ls2")
            ) {

                score += 100000;

            }

            if (
                title.includes("ls1")
            ) {

                score += 70000;

            }

            if (
                title.includes("chevrolet") ||
                title.includes("chevy") ||
                title.includes("gm")
            ) {

                score += 30000;

            }


            if (
                title.includes("ford") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score -= 120000;

            }


            if (
                title.includes("253") ||
                title.includes("308") ||
                title.includes("304") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score -= 120000;

            }

        }


        // ==================================
        // LS3 / L92
        // ==================================

        if (
            intent.engine === "ls3"
        ) {

            if (
                title.includes("ls3") ||
                title.includes("l92")
            ) {

                score += 100000;

            }


            if (
                title.includes("ls1") ||
                title.includes("ls2")
            ) {

                score -= 50000;

            }


            if (
                title.includes("ford") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score -= 120000;

            }


            if (
                title.includes("253") ||
                title.includes("308") ||
                title.includes("304") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score -= 120000;

            }

        }


        // ==================================
        // HOLDEN 308
        // ==================================

        if (
            intent.engine === "holden_308"
        ) {

            if (
                title.includes("308") ||
                title.includes("holden") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score += 100000;

            }


            if (
                title.includes("253") ||
                title.includes("304")
            ) {

                score += 70000;

            }


            if (
                title.includes("ford") ||
                title.includes("falcon") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score -= 120000;

            }

        }


        // ==================================
        // HOLDEN 253
        // ==================================

        if (
            intent.engine === "holden_253"
        ) {

            if (
                title.includes("253") ||
                title.includes("holden") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score += 100000;

            }


            if (
                title.includes("308") ||
                title.includes("304")
            ) {

                score += 70000;

            }


            if (
                title.includes("ford") ||
                title.includes("falcon") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score -= 120000;

            }

        }


        // ==================================
        // HOLDEN 304
        // ==================================

        if (
            intent.engine === "holden_304"
        ) {

            if (
                title.includes("304") ||
                title.includes("holden") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score += 100000;

            }


            if (
                title.includes("253") ||
                title.includes("308")
            ) {

                score += 70000;

            }


            if (
                title.includes("ford") ||
                title.includes("falcon") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score -= 120000;

            }

        }


        // ==================================
        // FORD 289 / 302 / 351
        // ==================================

        if (
            intent.engine === "ford_289" ||
            intent.engine === "ford_302" ||
            intent.engine === "ford_351"
        ) {

            if (
                title.includes("ford") ||
                title.includes("falcon") ||
                title.includes("windsor") ||
                title.includes("cleveland") ||
                title.includes("289") ||
                title.includes("302") ||
                title.includes("351")
            ) {

                score += 100000;

            }


            if (
                title.includes("holden") ||
                title.includes("commodore") ||
                title.includes("torana") ||
                title.includes("253") ||
                title.includes("304") ||
                title.includes("308")
            ) {

                score -= 120000;

            }


            if (
                intent.engine === "ford_289" &&
                title.includes("289")
            ) {

                score += 50000;

            }


            if (
                intent.engine === "ford_302" &&
                title.includes("302")
            ) {

                score += 50000;

            }


            if (
                intent.engine === "ford_351" &&
                title.includes("351")
            ) {

                score += 50000;

            }

        }


        // ==================================
        // GENERIC FORD
        // ==================================

        if (
            intent.engine === "ford"
        ) {

            if (
                title.includes("ford") ||
                title.includes("falcon") ||
                title.includes("windsor") ||
                title.includes("cleveland")
            ) {

                score += 100000;

            }


            if (
                title.includes("holden") ||
                title.includes("commodore") ||
                title.includes("torana")
            ) {

                score -= 100000;

            }

        }


        // ==================================
        // GENERIC HOLDEN
        // ==================================

        if (
            intent.engine === "holden"
        ) {

            if (
                title.includes("holden") ||
                title.includes("commodore") ||
                title.includes("torana") ||
                title.includes("253") ||
                title.includes("304") ||
                title.includes("308")
            ) {

                score += 100000;

            }


            if (
                title.includes("ford") ||
                title.includes("falcon") ||
                title.includes("windsor") ||
                title.includes("cleveland")
            ) {

                score -= 100000;

            }

        }

    }

    // ==================================
    // TEE
    // ==================================

    if (
        intent.category === "tee"
    ) {

        const isTee =
            title.includes("tee fitting") ||
            title.includes("flare tee") ||
            title.includes("bulkhead tee") ||
            title.includes("tee swivel") ||
            title.includes("male tee") ||
            title.includes("female tee") ||
            title.endsWith(" tee");


        if (isTee) {

            score += 100000;

        }
        else {

            score -= 300000;

        }


        // Reject other fitting families

        if (
            title.includes("hose end") ||
            title.includes("hoseend") ||
            title.includes("elbow") ||
            title.includes("union") ||
            title.includes("adapter") ||
            title.includes("adaptor")
        ) {

            score -= 300000;

        }


        // ==================================
        // TEE SIZE
        // ==================================

        if (
            intent.size
        ) {

            const requested =
                intent.size.replace(
                    "-",
                    ""
                );


            const exact =
                new RegExp(
                    "(?:^|\\s|-)" +
                    requested +
                    "\\s*(?:an|male|female)?\\b",
                    "i"
                );


            const productSize =
                title.match(
                    /-(\d+)\s*(?:an|male|female)?\b/i
                );


            if (
                exact.test(title)
            ) {

                score += 100000;

            }
            else if (
                productSize
            ) {

                score -= 200000;

            }


        }


        // ==================================
                // ==================================
        // TEE GENDER INTELLIGENCE
        // ==================================
        //
        // IMPORTANT:
        //
        // Tee gender must be determined from
        // actual parsed product connections.
        //
        // Do NOT inspect the product title.
        //
        // Example:
        //
        // Product:
        // -8 female
        // -8 female
        // -8 male
        //
        // Query:
        // -8AN male tee
        //
        // VALID.
        //
        // Query:
        // -8AN female tee
        //
        // VALID.
        //
        // ==================================

        const requestedTeeGender =
            /\bfemale\b/i.test(intent.raw)
                ? "female"
                : /\bmale\b/i.test(intent.raw)
                    ? "male"
                    : null;


        if (
            requestedTeeGender &&
            intent.size
        ) {

            const productConnections =
                v6GetProductConnections(
                    product
                );


            const hasRequestedGender =
                productConnections.some(
                    connection =>
                        connection?.type === "an" &&
                        connection?.size === intent.size &&
                        connection?.gender === requestedTeeGender
                );


            if (
                hasRequestedGender
            ) {

                score += 150000;

            }
            else {

                score -= 300000;

            }

        }

// TEE ANGLE INTELLIGENCE
        // ==================================

        if (
            intent.angle &&
            intent.angle !== "0"
        ) {

            const requestedAngle =
                intent.angle;


            const productAngleMatch =
                title.match(
                    /\b(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/i
                );


            const productAngle =
                productAngleMatch
                    ? productAngleMatch[1]
                    : null;


            // EXACT ANGLE

            if (
                productAngle === requestedAngle
            ) {

                score += 100000;

            }


            // WRONG EXPLICIT ANGLE

            else if (
                productAngle &&
                productAngle !== requestedAngle
            ) {

                score -= 150000;

            }

        }


    }
    // ==================================
    // UNION INTELLIGENCE
    // ==================================

    if (
        intent.category === "union"
    ) {

        const isUnion =
            title.includes("union") &&
            !title.includes("tee") &&
            !title.includes("adapter") &&
            !title.includes("adaptor");


        // ==================================
        // HARD UNION FAMILY FILTER
        // ==================================

        if (
            isUnion
        ) {

            score += 100000;

        }
        else {

            score -= 300000;

        }


        // ==================================
        // UNION CONNECTION VALIDITY
        // ==================================

        if (
            intent.connectionDirection ===
            "an_to_an"
        ) {

            const productConnections =
                v6ParseProductConnections(
                    title
                );


            const requestedFirst = {

                type:
                    "an",

                size:
                    intent.size,

                gender:
                    intent.anGender ||
                    null

            };


            const requestedSecond = {

                type:
                    "an",

                size:
                    intent.toSize,

                gender:
                    intent.toAnGender ||
                    null

            };


            const normal =
                productConnections.some(
                    first =>
                        v6ConnectionMatches(
                            first,
                            requestedFirst
                        ) &&
                        productConnections.some(
                            second =>
                                second !== first &&
                                v6ConnectionMatches(
                                    second,
                                    requestedSecond
                                )
                        )
                );


            const reverse =
                productConnections.some(
                    first =>
                        v6ConnectionMatches(
                            first,
                            requestedSecond
                        ) &&
                        productConnections.some(
                            second =>
                                second !== first &&
                                v6ConnectionMatches(
                                    second,
                                    requestedFirst
                                )
                        )
                );


            if (
    normal ||
    reverse
) {

    score += 200000;

}
else if (
    intent.conversationBridge &&
    (
        title.includes("hose end") ||
        title.includes("hose-end") ||
        title.includes("hoseend") ||
        title.includes("hose tail") ||
        title.includes("hose-tail")
    )
) {

    // Conversation bridge hose ends are
    // intentionally single-connection products.
    // Do not apply the normal two-ended AN penalty.

}
else {

    score -= 300000;

}

        }


        // ==================================
        // UNION SIZE
        // ==================================

        if (
            intent.size
        ) {

            const requested =
                intent.size.replace(
                    "-",
                    ""
                );


            const exact =
                new RegExp(
                    "(?:^|\\s|-)" +
                    requested +
                    "\\s*(?:an|male|female)?\\b",
                    "i"
                );


            if (
                exact.test(title)
            ) {

                score += 100000;

            }
            else {

                score -= 200000;

            }

        }


        // ==================================
        // UNION GENDER
        // ==================================

        const requestedUnionGender =
            intent.anGender ||
            null;


        if (
            requestedUnionGender
        ) {

            const hasMale =
                /\bmale\b/i.test(
                    title
                );

            const hasFemale =
                /\bfemale\b/i.test(
                    title
                );


            if (
                requestedUnionGender ===
                "male"
            ) {

                if (
                    hasMale
                ) {

                    score += 100000;

                }
                else if (
                    hasFemale &&
                    !hasMale
                ) {

                    score -= 200000;

                }

            }


            if (
                requestedUnionGender ===
                "female"
            ) {

                if (
                    hasFemale
                ) {

                    score += 100000;

                }
                else if (
                    hasMale &&
                    !hasFemale
                ) {

                    score -= 200000;

                }

            }

        }


    }
// ==================================
// REDUCER INTELLIGENCE
// ==================================

if (
    intent.fittingType === "reducer"
) {

    // ==================================
    // REAL REDUCER DETECTION
    // ==================================

    const isReducer =
        title.includes("reducer") ||
        title.includes("reducing") ||
        title.includes("reduction");


    if (
        isReducer
    ) {

        score += 150000;

    }
    else {

        score -= 1000000;

    }


    // ==================================
    // HARD REJECT OTHER FITTING FAMILIES
    // ==================================

    if (
        title.includes("hose end") ||
        title.includes("hoseend") ||
        title.includes("tee") ||
        title.includes("union") ||
        title.includes("elbow") ||
        title.includes("bulkhead") ||
        title.includes("weld bung") ||
        title.includes("weld boss") ||
        title.includes("hose barb") ||
        title.includes("hose tail") ||
        title.includes("coupler") ||
        title.includes("silicone")
    ) {

        score -= 1000000;

    }


    // ==================================
    // FIRST AN SIZE
    // ==================================

    if (
        intent.size
    ) {

        const requestedSize =
            String(
                intent.size
            ).replace(
                "-",
                ""
            );


        const exactSize =
            new RegExp(
                "(?:^|\\s)-" +
                requestedSize +
                "\\s*(?:an|male|female|flare)?\\b",
                "i"
            );


        if (
            exactSize.test(title)
        ) {

            score += 500000;

        }
        else {

            score -= 1500000;

        }

    }


    // ==================================
    // SECOND AN SIZE
    // ==================================
    //
    // Only applies when query explicitly
    // specifies both sizes.
    //
    // ==================================

    if (
        intent.toSize
    ) {

        const requestedToSize =
            String(
                intent.toSize
            ).replace(
                "-",
                ""
            );


        const exactToSize =
            new RegExp(
                "(?:^|\\s)-" +
                requestedToSize +
                "\\s*(?:an|male|female|flare)?\\b",
                "i"
            );


        if (
            exactToSize.test(title)
        ) {

            score += 500000;

        }
        else {

            score -= 1500000;

        }

    }

}
// ==================================
// ELBOW INTELLIGENCE
// ==================================

if (
    intent.category === "elbow"
) {

    // ==================================
    // REAL ELBOW DETECTION
    // ==================================

    const isExplicitElbow =
        title.includes("elbow");

    const hasAngle =
        /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/i.test(
            title
        );

    const isANConnection =
        /(?:^|\s)-\d+\s*(?:an|male|female|flare)\b/i.test(
            title
        );

    const isNPT =
        /\bnpt\b/i.test(
            title
        );

    const isElbow =
        isExplicitElbow ||
        (
            isANConnection &&
            hasAngle &&
            !isNPT
        );


    // ==================================
    // HARD ELBOW LOCK
    // ==================================

    if (
        !isElbow
    ) {

        score -= 1000000;

    }
    else {

        score += 100000;

    }


    // ==================================
    // HARD REJECT OTHER FITTING FAMILIES
    // ==================================

    if (
        title.includes("hose end") ||
        title.includes("hoseend") ||
        title.includes("union") ||
        title.includes("tee") ||
        title.includes("bulkhead") ||
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("hose barb") ||
        title.includes("hose tail") ||
        title.includes("weld bung") ||
        title.includes("weld boss") ||
        title.includes("rod end") ||
        title.includes("heim") ||
        title.includes("uniball") ||
        title.includes("coupler") ||
        title.includes("silicone")
    ) {

        score -= 1000000;

    }


        // ==================================
    // AN / NPT TYPE LOCK
    // ==================================
    //
    // ELBOW SIZE MUST MATCH EXACTLY
    //
    // If query asks:
    // -6AN elbow
    //
    // Accept:
    // -6
    // -6AN
    // -6 male
    // -6 female
    // -6 flare
    //
    // Reject:
    // -4
    // -8
    // -10
    // -16
    // NPT
    //
    // ==================================

    if (
        intent.size
    ) {

        const requestedAN =
            String(
                intent.size
            )
                .replace(
                    "-",
                    ""
                )
                .trim();


        // ==================================
        // NPT = HARD REJECT
        // ==================================

        if (
            isNPT
        ) {

            score -= 2000000;

        }


        // ==================================
        // EXACT REQUESTED AN SIZE
        // ==================================

        const exactAN =
            new RegExp(
                "(?:^|\\s)-" +
                requestedAN +
                "\\s*(?:an|male|female|flare)?\\b",
                "i"
            );


        // ==================================
        // ANY OTHER AN SIZE
        // ==================================

        const anyAN =
            /(?:^|\s)-\d+\s*(?:an|male|female|flare)?\b/i;


        // ==================================
        // EXACT SIZE MATCH
        // ==================================

        if (
            exactAN.test(title)
        ) {

            score += 500000;

        }


        // ==================================
        // WRONG AN SIZE = HARD PENALTY
        // ==================================

        else if (
            anyAN.test(title)
        ) {

            score -= 2000000;

        }


        // ==================================
        // NO AN SIZE
        // ==================================

        else {

            score -= 2000000;

        }

    }


    // ==================================
    // ELBOW ANGLE INTELLIGENCE
    // ==================================

    if (
        intent.angle &&
        intent.angle !== "0"
    ) {

        const requestedAngle =
            String(
                intent.angle
            );


        const exactAngle =
            new RegExp(
                "\\b" +
                requestedAngle +
                "\\s*(?:degree|degrees|deg)\\b",
                "i"
            );


        const productAngle =
            /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/i;


        // ==================================
        // EXACT ANGLE
        // ==================================

        if (
            exactAngle.test(title)
        ) {

            score += 500000;

        }


        // ==================================
        // WRONG EXPLICIT ANGLE
        // ==================================

        else if (
            productAngle.test(title)
        ) {

            score -= 1500000;

        }


        // ==================================
        // NO PRODUCT ANGLE
        // ==================================

        else {

            score -= 1000000;

        }

    }
       
    // ==================================
// ELBOW GENDER INTELLIGENCE
// ==================================
//
// IMPORTANT:
//
// For a simple query:
//
// -6AN female elbow
//
// the requested gender refers to the
// connection being requested.
//
// A product such as:
//
// -6 female to male 90 degree
//
// DOES contain a female connection and
// is therefore a valid female elbow.
//
// Likewise:
//
// -6 male to female 90 degree
//
// contains a male connection.
//
// However, we must NOT treat every
// occurrence of "female" or "male" as
// a simple gender match.
//
// ==================================


const wantsFemaleToMale =
    /\bfemale\s+to\s+male\b/i.test(
        intent.raw
    );


const wantsMaleToFemale =
    /\bmale\s+to\s+female\b/i.test(
        intent.raw
    );


const wantsFemaleOnly =
    intent.anGender === "female" &&
    !wantsFemaleToMale &&
    !wantsMaleToFemale;


const wantsMaleOnly =
    intent.anGender === "male" &&
    !wantsFemaleToMale &&
    !wantsMaleToFemale;


// ==================================
// PRODUCT GENDER CONFIGURATION
// ==================================

// ==================================
// PRODUCT GENDER CONFIGURATION
// ==================================
//
// Use V6 product connection intelligence.
// Do NOT rely on title wording.
//
// The product body/specification parser is
// authoritative when available.
// ==================================

const productConnections =
    v6GetProductConnections(
        product
    );


const requestedANConnections =
    productConnections.filter(
        connection =>
            connection?.type === "an" &&
            (
                !intent.size ||
                connection?.size === intent.size
            )
    );


const productHasFemale =
    requestedANConnections.some(
        connection =>
            connection?.gender === "female"
    );


const productHasMale =
    requestedANConnections.some(
        connection =>
            connection?.gender === "male"
    );


const orderedANConnections =
    requestedANConnections
        .filter(
            connection =>
                connection &&
                Number.isFinite(connection.index)
        )
        .sort(
            (a, b) =>
                a.index - b.index
        );

const firstANConnection =
    orderedANConnections[0];

const secondANConnection =
    orderedANConnections[1];

const productFemaleToMale =
    firstANConnection?.gender === "female" &&
    secondANConnection?.gender === "male";

const productMaleToFemale =
    firstANConnection?.gender === "male" &&
    secondANConnection?.gender === "female";


const productFemale =
    productHasFemale;


const productMale =
    productHasMale;


// ==================================
// EXPLICIT DIRECTIONAL QUERY
// ==================================

if (
    wantsFemaleToMale
) {

    if (
        productFemaleToMale
    ) {

        score += 700000;

    }
    else {

        score -= 3000000;

    }

}


else if (
    wantsMaleToFemale
) {

    if (
        productMaleToFemale
    ) {

        score += 700000;

    }
    else {

        score -= 3000000;

    }

}


// ==================================
// FEMALE CONNECTION REQUEST
// ==================================

else if (
    wantsFemaleOnly
) {

    if (
        productFemale
    ) {

        score += 500000;

    }
    else {

        score -= 1500000;

    }

}


// ==================================
// MALE CONNECTION REQUEST
// ==================================

else if (
    wantsMaleOnly
) {

    if (
        productMale
    ) {

        score += 500000;

    }
    else {

        score -= 1500000;

    }

}


// ==================================
// END ELBOW GENDER INTELLIGENCE
// ==================================

}


// ==================================
// AN / NPT REDUCER INTELLIGENCE
// ==================================
//
// Handles fitting reducers.
//
// Examples:
//
// -8AN female to -6AN male reducer
// -10AN to -6AN reducer
// 1/2 NPT male to -6AN male reducer
// -6AN female to 1/4 NPT male reducer
//
// This is FITTING reducer intelligence.
// Silicone reducers are handled separately.
//
// ==================================

if (
    intent.category === "reducer"
) {

    // ==================================
    // REAL REDUCER DETECTION
    // ==================================

    const isReducer =
        title.includes("reducer") ||
        title.includes("reducing");


    if (
        isReducer
    ) {

        score += 200000;

    }
    else {

        score -= 1000000;

    }


    // ==================================
    // HARD REJECT SILICONE REDUCERS
    // ==================================

    if (
        title.includes("silicone")
    ) {

        score -= 1500000;

    }


    // ==================================
    // HARD REJECT OTHER FITTING FAMILIES
    // ==================================

    if (
        title.includes("tee") ||
        title.includes("union") ||
        title.includes("elbow") ||
        title.includes("hose end") ||
        title.includes("hoseend") ||
        title.includes("bulkhead") ||
        title.includes("weld bung") ||
        title.includes("weld boss")
    ) {

        score -= 1000000;

    }


    // ==================================
    // AN SIZE INTELLIGENCE
    // ==================================

    if (
        intent.size
    ) {

        const requestedSize =
            String(
                intent.size
            )
            .replace(
                "-",
                ""
            );


        const exactAN =
            new RegExp(
                "\\-" +
                requestedSize +
                "\\b",
                "i"
            );


        if (
            exactAN.test(title)
        ) {

            score += 400000;

        }
        else {

            score -= 1000000;

        }

    }


    // ==================================
    // AN -> AN REDUCER
    // ==================================

    if (
        intent.connectionDirection ===
        "an_to_an"
    ) {

        const requestedToAN =
            String(
                intent.toSize ||
                ""
            )
            .replace(
                "-",
                ""
            );


        if (
            requestedToAN
        ) {

            const exactToAN =
                new RegExp(
                    "\\-" +
                    requestedToAN +
                    "\\b",
                    "i"
                );


            if (
                exactToAN.test(title)
            ) {

                score += 400000;

            }
            else {

                score -= 1000000;

            }

        }

    }


    // ==================================
    // AN -> NPT REDUCER
    // ==================================

    if (
        intent.connectionDirection ===
        "an_to_npt"
    ) {

        // ==================================
        // AN SIDE
        // ==================================

        if (
            intent.size
        ) {

            const requestedAN =
                String(
                    intent.size
                )
                .replace(
                    "-",
                    ""
                );


            const hasRequestedAN =
                new RegExp(
                    "\\-" +
                    requestedAN +
                    "\\b",
                    "i"
                )
                .test(
                    title
                );


            if (
                hasRequestedAN
            ) {

                score += 400000;

            }
            else {

                score -= 1000000;

            }

        }


        // ==================================
        // NPT SIDE
        // ==================================

        if (
            intent.nptSize
        ) {

            const requestedNPT =
                String(
                    intent.nptSize
                );


            const nptPattern =
                requestedNPT
                    .replace(
                        "/",
                        "\\/"
                    );


            const hasRequestedNPT =
                new RegExp(
                    "\\b" +
                    nptPattern +
                    "\\s*(?:npt)?\\b",
                    "i"
                )
                .test(
                    title
                );


            if (
                hasRequestedNPT
            ) {

                score += 400000;

            }
            else {

                score -= 1000000;

            }

        }

    }


    // ==================================
    // NPT -> AN REDUCER
    // ==================================

    if (
        intent.connectionDirection ===
        "npt_to_an"
    ) {

        // ==================================
        // NPT SIDE
        // ==================================

        if (
            intent.nptSize
        ) {

            const requestedNPT =
                String(
                    intent.nptSize
                );


            const nptPattern =
                requestedNPT
                    .replace(
                        "/",
                        "\\/"
                    );


            const hasRequestedNPT =
                new RegExp(
                    "\\b" +
                    nptPattern +
                    "\\s*(?:npt)?\\b",
                    "i"
                )
                .test(
                    title
                );


            if (
                hasRequestedNPT
            ) {

                score += 400000;

            }
            else {

                score -= 1000000;

            }

        }


        // ==================================
        // AN SIDE
        // ==================================

        if (
            intent.size
        ) {

            const requestedAN =
                String(
                    intent.size
                )
                .replace(
                    "-",
                    ""
                );


            const hasRequestedAN =
                new RegExp(
                    "\\-" +
                    requestedAN +
                    "\\b",
                    "i"
                )
                .test(
                    title
                );


            if (
                hasRequestedAN
            ) {

                score += 400000;

            }
            else {

                score -= 1000000;

            }

        }

    }


    // ==================================
    // REDUCER GENDER INTELLIGENCE
    // ==================================

    if (
        intent.anGender
    ) {

        const requestedGender =
            intent.anGender;


        const hasRequestedGender =
            new RegExp(
                "\\b" +
                requestedGender +
                "\\b",
                "i"
            )
            .test(
                title
            );


        if (
            hasRequestedGender
        ) {

            score += 150000;

        }

    }


    // ==================================
    // REDUCER ANGLE INTELLIGENCE
    // ==================================

    if (
        intent.angle &&
        intent.angle !== "0"
    ) {

        const requestedAngle =
            String(
                intent.angle
            );


        const exactAngle =
            new RegExp(
                "\\b" +
                requestedAngle +
                "\\s*(?:degree|degrees|deg)?\\b",
                "i"
            );


        if (
            exactAngle.test(title)
        ) {

            score += 150000;

        }

    }

}


// ==================================
// HOSE END INTELLIGENCE
// ==================================

    if (
        intent.fittingType === "hose_end"
    ) {

        // ==================================
        // REAL HOSE END DETECTION
        // ==================================

        const isHoseEnd =
    title.includes("hose end") ||
    title.includes("hoseend") ||
    title.includes("hose tail");


        if (
            isHoseEnd
        ) {

            score += 150000;

        }
        else {

            score -= 800000;

        }


        // ==================================
        // HARD REJECT NON-HOSE-END PRODUCTS
        // ==================================

        if (
            title.includes("tee") ||
            title.includes("union") ||
            title.includes("elbow") ||
            title.includes("adapter") ||
            title.includes("adaptor") ||
            title.includes("bulkhead") ||
            title.includes("weld bung") ||
            title.includes("weld boss") ||
            title.includes("rod end") ||
            title.includes("heim") ||
            title.includes("uniball") ||
            title.includes("clamp") ||
            title.includes("firesleeve") ||
            title.includes("fire sleeve") ||
            title.includes("heat sleeve") ||
            title.includes("hose kit") ||
            title.includes("fuel pump") ||
            title.includes("filter") ||
            title.includes("gauge")
        ) {

            score -= 800000;

        }


        // ==================================
        // HOSE END SIZE INTELLIGENCE
        // ==================================

        if (
            intent.size
        ) {

            const requested =
                intent.size.replace(
                    "-",
                    ""
                );


            const exactSize =
                new RegExp(
                    "(?:^|\\s|-)" +
                    requested +
                    "\\s*(?:an|male|female)?\\b",
                    "i"
                );


            const productSize =
                title.match(
                    /-(\d+)\s*(?:an|male|female)?\b/i
                );


            if (
                exactSize.test(title)
            ) {

                score += 250000;

            }
            else if (
                productSize
            ) {

                score -= 400000;

            }

        }


        // ==================================
        // HOSE END ANGLE INTELLIGENCE
        // ==================================

        if (
            intent.angle
        ) {

            // ==================================
            // STRAIGHT
            // ==================================

            if (
                intent.angle === "0"
            ) {

                if (
                    title.includes("straight")
                ) {

                    score += 200000;

                }
                else if (
                    /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/i.test(
                        title
                    )
                ) {

                    score -= 400000;

                }

            }

            // ==================================
            // ANGLED
            // ==================================

            else {

                const exactAngle =
                    new RegExp(
                        "\\b" +
                        intent.angle +
                        "\\s*(?:degree|degrees|deg)\\b",
                        "i"
                    );


                if (
                    exactAngle.test(title)
                ) {

                    score += 250000;

                }
                else {

                    const differentAngle =
                        /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/i.test(
                            title
                        );


                    if (
                        differentAngle
                    ) {

                        score -= 400000;

                    }

                }

            }

        }


        // ==================================
        // HOSE END GENDER INTELLIGENCE
        // ==================================

        const wantsFemale =
            /\bfemale\b/i.test(
                intent.raw
            );


        const wantsMale =
            /\bmale\b/i.test(
                intent.raw
            );


        const productFemale =
            /\bfemale\b/i.test(
                title
            );


        const productMale =
            /\bmale\b/i.test(
                title
            );


        if (
            wantsFemale
        ) {

            if (
                productFemale
            ) {

                score += 150000;

            }
            else if (
                productMale
            ) {

                score -= 300000;

            }

        }


        if (
            wantsMale
        ) {

            if (
                productMale
            ) {

                score += 150000;

            }
            else if (
                productFemale
            ) {

                score -= 300000;

            }

        }

    }


  // ==================================
// ADAPTER INTELLIGENCE
// ==================================

if (
    intent.category === "adapter"
) {

    // ==================================
    // REAL ADAPTER DETECTION
    // ==================================

    const isRealAdapter =
        title.includes("adapter") ||
        title.includes("adaptor") ||
        title.includes("male to") ||
        title.includes("female to") ||
        title.includes("flare to") ||
        title.includes("an to") ||
        title.includes("to an") ||
        title.includes("flare reducer");


    // ==================================
    // HARD REJECT NON-ADAPTER PRODUCTS
    // ==================================

    if (!isRealAdapter) {

        score -= 800000;

    }
    else {

        score += 100000;

    }


    // ==================================
    // HARD REJECT OTHER FITTING FAMILIES
    // ==================================

    if (
        title.includes("hose end") ||
        title.includes("hoseend") ||
        title.includes("hose tail") ||
        title.includes("hose barb") ||
        title.includes("union") ||
        title.includes("tee") ||
        title.includes("elbow") ||
        title.includes("bulkhead") ||
        title.includes("weld bung") ||
        title.includes("weld boss") ||
        title.includes("bump tube") ||
        title.includes("tube adapter") ||
        title.includes("rod end") ||
        title.includes("heim") ||
        title.includes("uniball") ||
        title.includes("spacer") ||
        title.includes("washer") ||
        title.includes("silicone") ||
        title.includes("fuel pump") ||
        title.includes("filter") ||
        title.includes("gauge")
    ) {

        score -= 800000;

    }


    // ==================================
    // AN SIZE
    // ==================================

    if (
        intent.size
    ) {

        const requestedAN =
            intent.size.replace(
                "-",
                ""
            );


        const anPattern =
            new RegExp(
                "(?:^|\\s|-)" +
                requestedAN +
                "\\s*(?:an|male|female|flare)?\\b",
                "i"
            );


        if (
            anPattern.test(title)
        ) {

            score += 100000;

        }
        else {

            score -= 250000;

        }

    }
// ==================================
// AN GENDER INTELLIGENCE
// ==================================

if (
    intent.anGender &&
    intent.size
) {

    const productConnections =
        v6GetProductConnections(
            product
        );


    const requestedSize =
        Number(
            intent.size
                .replace(
                    "-",
                    ""
                )
        );


    const requestedGender =
        intent.anGender;


    const matchingConnections =
        productConnections.filter(
            connection =>
                connection.type === "an" &&
                Number(connection.size) ===
                    requestedSize &&
                connection.gender ===
                    requestedGender
        );


    if (
        matchingConnections.length
    ) {

        // ==================================
        // PRIMARY CONNECTION BONUS
        // ==================================
        //
        // The first AN connection is the
        // primary/requested connection.
        //
        // Secondary matches remain valid,
        // but primary matches rank higher.
        // ==================================

        const hasPrimaryMatch =
            matchingConnections.some(
                connection =>
                    connection.index ===
                    Math.min(
                        ...productConnections
                            .filter(
                                item =>
                                    item.type === "an"
                            )
                            .map(
                                item =>
                                    item.index
                            )
                    )
            );


        if (
            hasPrimaryMatch
        ) {

            score += 400000;

        }
        else {

            score += 100000;

        }

    }
    else {

        score -= 50000;

    }

}

    // ==================================
    // NPT SIZE
    // ==================================

    if (
        intent.nptSize
    ) {

        const escapedNPT =
            String(
                intent.nptSize
            ).replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        const nptPattern =
            new RegExp(
                escapedNPT +
                "\\s*\"?\\s*npt\\b",
                "i"
            );


        if (
            nptPattern.test(title)
        ) {

            score += 150000;

        }
        else {

            score -= 300000;

        }

    }
// ==================================
// NPT GENDER INTELLIGENCE
// ==================================

if (
    intent.nptGender &&
    intent.nptSize
) {

    const productConnections =
        v6GetProductConnections(
            product
        );


    const requestedNPT = {

        type:
            "npt",

        size:
            intent.nptSize,

        gender:
            intent.nptGender

    };


    // ==================================
    // EXACT NPT SIZE + GENDER MATCH
    // ==================================

    const exactGenderMatch =
        productConnections.some(
            connection =>
                v6ConnectionMatches(
                    connection,
                    requestedNPT
                )
        );


    if (
        exactGenderMatch
    ) {

        score += 250000;

    }
    else {

        // ==================================
        // WRONG GENDER ? SAME NPT SIZE
        // ==================================

        const sameSizeWrongGender =
            productConnections.some(
                connection =>
                    connection.type ===
                        "npt" &&

                    connection.size ===
                        intent.nptSize &&

                    connection.gender &&

                    connection.gender !==
                        intent.nptGender
            );


        if (
            sameSizeWrongGender
        ) {

            score -= 300000;

        }
        else {

            // Gender may be omitted from
            // the product information.
            score -= 50000;

        }

    }

}

            // ==================================
    // AN + NPT CONNECTION INTELLIGENCE
    // ==================================
    //
    // Physical adapter is valid in BOTH
    // directions:
    //
    // -6 AN to 3/8 NPT
    // 3/8 NPT to -6 AN
    //
    // Product title order does NOT determine
    // whether the adapter is a valid match.
    //
    // ==================================

    if (
        intent.size &&
        intent.nptSize
    ) {

        const requestedAN =
            intent.size.replace(
                "-",
                ""
            );


        const escapedNPT =
            String(
                intent.nptSize
            ).replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        // ==================================
        // REQUESTED AN
        // ==================================

        const anMatch =
            title.match(
                new RegExp(
                    "-" +
                    requestedAN +
                    "\\s*(?:an\\b)?\\s*(?:male|female)?\\b",
                    "i"
                )
            );


        // ==================================
        // REQUESTED NPT
        // ==================================

        const nptMatch =
            title.match(
                new RegExp(
                    escapedNPT +
                    "\\s*\"?\\s*npt\\b",
                    "i"
                )
            );


        // ==================================
        // BOTH CONNECTIONS EXIST
        // ==================================

        if (
            anMatch &&
            nptMatch
        ) {

            // ==================================
            // STRONG PHYSICAL CONNECTION MATCH
            // ==================================

            score += 500000;


            // ==================================
            // DO NOT PENALISE REVERSE DIRECTION
            // ==================================
            //
            // The physical product:
            //
            // -6 AN to 3/8 NPT
            //
            // is equally valid for:
            //
            // 3/8 NPT to -6 AN
            //
            // ==================================

            if (
                intent.connectionDirection ===
                "an_to_npt"
            ) {

                score += 50000;

            }


            if (
                intent.connectionDirection ===
                "npt_to_an"
            ) {

                score += 50000;

            }

        }


        // ==================================
        // AN ONLY
        // ==================================

        else if (
            anMatch &&
            !nptMatch
        ) {

            score -= 150000;

        }


        // ==================================
        // NPT ONLY
        // ==================================

        else if (
            !anMatch &&
            nptMatch
        ) {

            score -= 300000;

        }


        // ==================================
        // NEITHER
        // ==================================

        else {

            score -= 100000;

        }

    }

    // ==================================
// ANGLE INTELLIGENCE
// ==================================

const productAngleMatch =
    title.match(
        /\b(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i
    ) ||
    title.match(
        /\b(30|45|60|90|120|135|150|180)?/i
    );


// ==================================
// PRODUCT ANGLE
// ==================================

let productAngle =
    productAngleMatch
        ? productAngleMatch[1]
        : null;


// ==================================
// STRAIGHT DETECTION
// ==================================

if (
    !productAngle &&
    /\bstraight\b/i.test(title)
) {

    productAngle = "0";

}


// ==================================
// PRODUCT HAS ANGLE
// ==================================

const productHasAngle =
    !!productAngle;


// ==================================
// STRICT ANGLE INTELLIGENCE
// ==================================

if (
    intent.angle &&
    intent.fittingType !== "union"
) {

    // ==================================
    // STRAIGHT / 0 DEGREE
    // ==================================

    if (
        intent.angle === "0"
    ) {

        if (
            productAngle === "0"
        ) {

            score += 300000;

        }
        else if (
            productAngle
        ) {

            score -= 300000;

        }
        else {

            score -= 100000;

        }

    }


    // ==================================
    // ANGLED PRODUCT
    // ==================================

    else {

        // ==================================
        // EXACT ANGLE
        // ==================================

        if (
            productAngle === intent.angle
        ) {

            score += 300000;

        }


        // ==================================
        // WRONG EXPLICIT ANGLE
        // ==================================

        else if (
            productAngle &&
            productAngle !== intent.angle
        ) {

            score -= 300000;

        }


        // ==================================
        // NO ANGLE INFORMATION
        // ==================================

        else if (
            !productHasAngle
        ) {

            // ----------------------------------
            // Adapter connection fallback
            // ----------------------------------

            if (
                intent.fittingType === "adapter" &&
                intent.size &&
                intent.nptSize
            ) {

                const requestedAN =
                    intent.size.replace(
                        "-",
                        ""
                    );


                const escapedNPT =
                    String(
                        intent.nptSize
                    ).replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    );


                const hasRequestedAN =
                    new RegExp(
                        "(?:^|\\s|-)" +
                        requestedAN +
                        "\\s*(?:an|male|female|flare)?\\b",
                        "i"
                    ).test(
                        title
                    );


                const hasRequestedNPT =
                    new RegExp(
                        escapedNPT +
                        "\\s*\"?\\s*npt\\b",
                        "i"
                    ).test(
                        title
                    );


                if (
                    hasRequestedAN &&
                    hasRequestedNPT
                ) {

                    // Exact connection match
                    // can beat missing angle data.

                    score += 100000;

                }
                else {

                    score -= 100000;

                }

            }
            else {

                // Unknown angle information
                // is weaker than an exact angle.

                score -= 100000;

            }

        }

    }

}


// ==================================
// CLOSE ADAPTER INTELLIGENCE
// ==================================

}


// ==================================
// ==================================
// NO ANGLE REQUESTED
// ==================================
//
// If the customer does not specify an
// angle, prefer straight fittings.
//
// Angled fittings remain valid.
// They are simply ranked lower.
//
// ==================================

if (
    !intent.angle &&
    (
        intent.connectionDirection === "an_to_an" ||
        intent.connectionDirection === "an_to_npt" ||
        intent.connectionDirection === "npt_to_an"
    )
) {

    const titleText =
        title.toLowerCase();

    const hasExplicitAngle =
        /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i.test(
            titleText
        ) ||
        /\b(?:30|45|60|90|120|135|150|180)\s*?/i.test(
            titleText
        );

    if (
        hasExplicitAngle
    ) {

        score -= 50000;

    }
    else {

        score += 50000;

    }

}


// GENDER INTELLIGENCE
// ==================================

const queryWantsMale =
    /\bmale\b/i.test(
        intent.raw
    );


const queryWantsFemale =
    /\bfemale\b/i.test(
        intent.raw
    );


const productHasMale =
    /\bmale\b/i.test(
        title
    );


const productHasFemale =
    /\bfemale\b/i.test(
        title
    );


// ==================================
// MALE REQUEST
// ==================================

if (
    queryWantsMale
) {

    if (
        productHasMale
    ) {

        score += 150000;

    }
    else if (
        productHasFemale
    ) {

        score -= 250000;

    }

}


// ==================================
// FEMALE REQUEST
// ==================================

if (
    queryWantsFemale
) {

    if (
        productHasFemale
    ) {

        score += 150000;

    }
    else if (
        productHasMale
    ) {

        score -= 250000;

    }

}


// ==================================
// END ANGLE + GENDER INTELLIGENCE
// ==================================




// ==================================
// HOSE END INTELLIGENCE
// ==================================

if (
    intent.fittingType === "hose_end" ||
    intent.conversationBridge
) {

    // ==================================
    // REAL HOSE END DETECTION
    // ==================================

    const isRealHoseEnd =
        title.includes("hose end") ||
        title.includes("hose-end") ||
        title.includes("hoseend") ||
        title.includes("hose tail");



    // ==================================
    // HARD REJECT NON-HOSE-END PRODUCTS
    // ==================================

    if (
        !isRealHoseEnd
    ) {

        score -= 300000;

    }
    else {

        score += 50000;

    }



    // ==================================
    // HOSE END SIZE INTELLIGENCE
    // ==================================

    if (
        intent.size
    ) {

        const requestedSize =
            intent.size
                .replace("-", "")
                .trim();

        const productSizeMatch =
            title.match(
                /-(\d+)\s*(?:an)?\b/i
            );

        const productSize =
            productSizeMatch
                ? productSizeMatch[1]
                : null;


        if (
            productSize ===
            requestedSize
        ) {

            score += 80000;

        }
        else if (
            productSize
        ) {

            score -= 200000;

        }

    }



    // ==================================
    // HOSE END ANGLE INTELLIGENCE
    // ==================================

    if (
        intent.angle
    ) {

        const requestedAngle =
            String(
                intent.angle
            )
                .replace(
                    /degree|degrees/gi,
                    ""
                )
                .trim();


        const productAngleMatch =
            title.match(
                /(\d+)\s*(?:degree|degrees)?/i
            );


        const productAngle =
            productAngleMatch
                ? productAngleMatch[1]
                : null;


        if (
            productAngle ===
            requestedAngle
        ) {

            score += 100000;

        }
        else if (
            productAngle
        ) {

            score -= 150000;

        }

    }

}


// ==================================
// ==================================
// HOSE END GENDER INTELLIGENCE
// ==================================

if (
    intent.fittingType === "hose_end" &&
    intent.anGender
) {

    const productFemale =
        /\bfemale\b/i.test(
            title
        );


    // ==================================
    // MALE HOSE END
    // ==================================
    //
    // Normal AN hose ends in this catalogue
    // are treated as the default male configuration.
    //

    if (
        intent.anGender === "male"
    ) {

        if (
            productFemale
        ) {

            score -= 500000;

        }

    }


    // ==================================
    // FEMALE HOSE END
    // ==================================
    //
    // Female hose ends must explicitly identify
    // themselves as female.
    //

    if (
        intent.anGender === "female"
    ) {

        if (
            productFemale
        ) {

            score += 100000;

        }
        else {

            score -= 500000;

        }

    }

}

// BRAND BONUS
// ==================================

    if (
        isSpeedflow &&
        intent.fittingType
    ) {

        score += 5000;

    }


    if (
        isProflow &&
        intent.fittingType
    ) {

        score += 5000;

    }


// ======================================
// V6 SILICONE / AIR INTAKE INTELLIGENCE
// ======================================

if (
    intent.category === "silicone"
) {

    // ==================================
    // SILICONE MATERIAL LOCK
    // ==================================

    if (
        title.includes("silicone")
    ) {

        score += 50000;

    }
    else {

        score -= 150000;

    }
// ==================================
// SILICONE QUERY = SILICONE PRODUCT LOCK
// ==================================

if (
    intent.category === "silicone" &&
    !title.includes("silicone")
) {

    score -= 300000;

}

    // ==================================
    // REMOVE WRONG MATERIALS
    // ==================================

    if (
        title.includes("aluminium") ||
        title.includes("aluminum") ||
        title.includes("al6061") ||
        title.includes("billet")
    ) {

        score -= 75000;

    }


    // ==================================
// SILICONE SIZE INTELLIGENCE
// ==================================

if (
    intent.siliconeSize
) {

    const requestedSiliconeSize =
        parseFloat(
            intent.siliconeSize
        );


    const productSizeMatches =
        [
            ...title.matchAll(
                /\b(\d+(?:\.\d+)?)\s*(?:inch|in|")\b/gi
            )
        ];


    let exactSizeMatch =
        false;


    for (
        const match of productSizeMatches
    ) {

        const productSiliconeSize =
            parseFloat(
                match[1]
            );


        if (
            productSiliconeSize ===
            requestedSiliconeSize
        ) {

            exactSizeMatch = true;

            break;

        }

    }


    // ==================================
    // EXACT SILICONE SIZE REQUIRED
    // ==================================

    if (
        intent.productFamily ===
            "silicone_bend" &&
        !exactSizeMatch
    ) {

        score -= 2000000;

    }
    else if (
        exactSizeMatch
    ) {

        score += 100000;

    }
    else {

        score -= 50000;

    }

}
    

        // ==================================
    // SILICONE BEND / ELBOW
    // ==================================

    if (
        intent.siliconeType === "bend"
    ) {

        const isBend =
            title.includes("bend") ||
            title.includes("elbow");


        const isCoupler =
            title.includes("coupler");


        const isReducer =
            title.includes("reducer");


        const isStraight =
            title.includes("straight");


        if (
            isBend &&
            !isCoupler &&
            !isReducer &&
            !isStraight
        ) {

            score += 75000;

        }
        else if (
            isBend
        ) {

            score += 30000;

        }
        else {

            score -= 75000;

        }


        if (
            isCoupler
        ) {

            score -= 60000;

        }


        if (
            isReducer
        ) {

            score -= 60000;

        }


        if (
            isStraight
        ) {

            score -= 60000;

        }

    }


    // ==================================
// SILICONE REDUCER
// ==================================

if (
    intent.siliconeType === "reducer"
) {

    const isReducer =
        title.includes("reducer");

    const isStraight =
        title.includes("straight");

    const isBend =
        title.includes("bend") ||
        title.includes("elbow");


    // ==================================
    // REDUCER TYPE LOCK
    // ==================================

    if (
        isReducer
    ) {

        score += 150000;

    }
    else {

        score -= 300000;

    }


    // ==================================
    // EXACT TWO-SIZE REDUCER
    // ==================================

    if (
        intent.siliconeFromSize &&
        intent.siliconeToSize
    ) {

        const fromSize =
            parseFloat(
                intent.siliconeFromSize
            );


        const toSize =
            parseFloat(
                intent.siliconeToSize
            );


        const reducerSizeMatches =
            [
                ...title.matchAll(
                    /(\d+(?:\.\d+)?)\s*(?:inch|in|")/gi
                )
            ];


        const productSizes =
            reducerSizeMatches.map(
                match =>
                    parseFloat(match[1])
            );


        const exactFrom =
            productSizes.includes(
                fromSize
            );


        const exactTo =
            productSizes.includes(
                toSize
            );


        if (
            exactFrom &&
            exactTo &&
            isReducer
        ) {

            score += 350000;

        }
        else {

            score -= 250000;

        }

    }


    // ==================================
    // STRAIGHT REDUCER
    // ==================================

    if (
        intent.raw.includes("straight")
    ) {

        if (
            isStraight &&
            isReducer
        ) {

            score += 150000;

        }
        else if (
            isBend
        ) {

            score -= 150000;

        }

    }

}


    // ==================================
// SILICONE COUPLER
// ==================================

if (
    intent.siliconeType === "coupler"
) {

    const isSilicone =
        title.includes("silicone");

    const isCoupler =
        title.includes("coupler");

    const isReducer =
        title.includes("reducer");

    const isBend =
        title.includes("bend") ||
        title.includes("elbow");

    const isStraight =
        title.includes("straight");


    // ==================================
    // SILICONE COUPLER MATERIAL LOCK
    // ==================================

    if (
        isSilicone &&
        isCoupler
    ) {

        score += 150000;

    }
    else {

        score -= 500000;

    }


        // ==================================
    // HARD WRONG PRODUCT TYPES
    // ==================================

    // REDUCER IS WRONG FOR COUPLER QUERY

    if (
        isReducer
    ) {

        score -= 800000;

    }


    // NON-SILICONE IS WRONG

    if (
        !isSilicone
    ) {

        score -= 500000;

    }


    // ==================================
    // EXACT COUPLER SIZE
    // ==================================

    if (
        intent.siliconeSize
    ) {

        const requestedSize =
            parseFloat(
                intent.siliconeSize
            );


        const productSizeMatches =
            [
                ...title.matchAll(
                    /(\d+(?:\.\d+)?)\s*(?:inch|in|")/gi
                )
            ];


        let exactSizeMatch =
            false;


        for (
            const match of productSizeMatches
        ) {

            const productSize =
                parseFloat(
                    match[1]
                );


            if (
                productSize ===
                requestedSize
            ) {

                exactSizeMatch = true;

                break;

            }

        }


        // ==================================
        // EXACT SIZE LOCK
        // ==================================

        if (
            exactSizeMatch
        ) {

            score += 500000;

        }
        else {

            score -= 500000;

        }

    }


    // ==================================
// STRAIGHT COUPLER
// ==================================
//
// Explicit "straight" request OR
// no angle requested = straight preferred.
//

const wantsStraight =
    intent.raw.includes("straight");


// ==================================
// EXPLICIT STRAIGHT REQUEST
// ==================================

if (
    wantsStraight
) {

    if (
        isStraight &&
        isCoupler &&
        isSilicone &&
        !isBend &&
        !isReducer
    ) {

        score += 400000;

    }
    else {

        score -= 400000;

    }


    // ==================================
    // BEND / ELBOW WRONG
    // ==================================

    if (
        isBend
    ) {

        score -= 500000;

    }


    // ==================================
    // REDUCER WRONG
    // ==================================

    if (
        isReducer
    ) {

        score -= 500000;

    }

}


// ==================================
// NO ANGLE + NO EXPLICIT STRAIGHT
// ==================================

else if (
    !intent.angle
) {

    if (
        isStraight &&
        isCoupler &&
        isSilicone &&
        !isBend &&
        !isReducer
    ) {

        score += 350000;

    }


    if (
        isBend &&
        isCoupler
    ) {

        score -= 350000;

    }


    if (
        isReducer
    ) {

        score -= 350000;

    }

}


// ==================================
// ANGLE REQUESTED
// ==================================

    if (
        intent.angle
    ) {

        const requestedAngle =
            parseInt(
                intent.angle
            );


        const angleMatch =
            title.match(
                /\b(30|45|60|90|120|150|180)\s*(?:degree|degrees)\b/i
            );


        // ==================================
        // EXACT ANGLE LOCK
        // ==================================

        if (
            angleMatch
        ) {

            const productAngle =
                parseInt(
                    angleMatch[1]
                );


            if (
                productAngle ===
                requestedAngle
            ) {

                score += 500000;

            }
            else {

                score -= 500000;

            }

        }
        else {

            score -= 500000;

        }


        // ==================================
        // ANGLED COUPLER REQUIRED
        // ==================================

        if (
            isBend &&
            isCoupler &&
            isSilicone
        ) {

            score += 200000;

        }


        // ==================================
        // STRAIGHT COUPLER WRONG
        // ==================================

        if (
            isStraight &&
            isCoupler
        ) {

            score -= 600000;

        }


        // ==================================
        // REDUCER WRONG
        // ==================================

        if (
            isReducer &&
            !isCoupler
        ) {

            score -= 500000;

        }

    }

}


// ==================================
// SILICONE HOSE
// ==================================

    if (
    intent.siliconeType === "hose" &&
    intent.category === "silicone"
) {

        if (
            title.includes("silicone hose")
        ) {

            score += 50000;

        }
        else {

            score -= 30000;

        }

    }


    // ==================================
// ANGLE INTELLIGENCE
// ==================================

if (
    intent.angle
) {

    const requestedAngle =
        String(
            intent.angle
        );


    const exactAngle =
        new RegExp(
            "\\b" +
            requestedAngle +
            "\\s*(?:degree|degrees|deg)\\b",
            "i"
        );


    const symbolAngle =
        new RegExp(
            "(?:^|\\s)" +
            requestedAngle +
            "(?:\\s|$)",
            "i"
        );


    if (
        exactAngle.test(title) ||
        symbolAngle.test(title)
    ) {

        score += 100000;

    }
    else if (
        /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i.test(title) ||
        /(?:^|\s)(?:30|45|60|90|120|135|150|180)?(?:\s|$)/i.test(title)
    ) {

        score -= 75000;

    }

}


    // ==================================
// REMOVE WRONG PRODUCT TYPES
// ==================================

    if (
        title.includes("gasket") ||
        title.includes("valve") ||
        title.includes("clamp") ||
        (
            title.includes("fitting") &&
            intent.category !== "fitting"
        ) ||
        (
            title.includes("hose end") &&
            intent.category !== "hose_end"
        ) ||
        (
            (
                title.includes("adapter") ||
                title.includes("adaptor")
            ) &&
            intent.category !== "adapter"
        )
    ) {

        score -= 75000;

    }


// ======================================
// CLOSE SILICONE INTELLIGENCE
// ======================================
// ======================================

}

// ======================================
// FINAL SCORE RETURN
// ======================================

    // ======================================
    // CENTRAL PRODUCT INTELLIGENCE
    // ======================================
    //
    // Structured product facts from
    // data/product-intelligence.json.
    //
    // This layer deliberately stays OUT of
    // fitting queries so existing V6 fitting
    // intelligence remains authoritative.
    // ======================================

    if (
        !intent.fittingType &&
        product.ssrIntelligence &&
        intent.category
    ) {

        const intel =
            product.ssrIntelligence;


                // ==================================
        // STARTER INTELLIGENCE
        // ==================================

        if (
            intent.category === "starter"
        ) {

            if (
                intel.family === "starter"
            ) {

                score += 500000;

            }
            else {

                // Central intelligence is authoritative
                // for direct starter queries.
                //
                // Prevent title word matches such as
                // "Nut-Starter Radius" from allowing
                // fasteners and unrelated products
                // into starter results.

                score -= 1000000;

            }


            // STARTER SUBTYPE

            if (
                intel.subtype === "starter_motor"
            ) {

                score += 200000;

            }
            else if (
                intel.family === "starter"
            ) {

                score -= 200000;

            }


            const engines =
                Array.isArray(
                    intel.attributes?.engine
                )
                    ? intel.attributes.engine
                    : [];


            const vehicles =
                Array.isArray(
                    intel.attributes?.vehicle
                )
                    ? intel.attributes.vehicle
                    : [];


            // LS1
            if (
                intent.engine === "ls1"
            ) {

                if (
                    engines.includes("LS1")
                ) {

                    score += 150000;

                }
                else if (
                    engines.includes("LS2")
                ) {

                    score += 100000;

                }


                if (
                    vehicles.includes("Chevrolet") ||
                    vehicles.includes("Chev")
                ) {

                    score += 50000;

                }

            }


            // LS2
            if (
                intent.engine === "ls2"
            ) {

                if (
                    engines.includes("LS2")
                ) {

                    score += 150000;

                }
                else if (
                    engines.includes("LS1")
                ) {

                    score += 100000;

                }


                if (
                    vehicles.includes("Chevrolet") ||
                    vehicles.includes("Chev")
                ) {

                    score += 50000;

                }

            }

        }


        // ==================================
        // ALTERNATOR INTELLIGENCE
        // ==================================

        if (
            intent.category === "alternator"
        ) {

            if (
                intel.family === "alternator"
            ) {

                score += 500000;

            }
            else {

                score -= 500000;

            }


            const engines =
                Array.isArray(
                    intel.attributes?.engine
                )
                    ? intel.attributes.engine
                    : [];


            const vehicles =
                Array.isArray(
                    intel.attributes?.vehicle
                )
                    ? intel.attributes.vehicle
                    : [];


            const models =
                Array.isArray(
                    intel.attributes?.model
                )
                    ? intel.attributes.model
                    : [];


            // OUTPUT
            // SUBTYPE
            //
            // The alternator family also contains
            // brackets, bracket kits and pulleys.
            //
            // A direct alternator query wants the
            // actual complete alternator.

            if (
                intel.subtype === "complete_alternator"
            ) {

                score += 200000;

            }
            else if (
                intel.subtype === "alternator_bracket_kit" ||
                intel.subtype === "alternator_bracket" ||
                intel.subtype === "alternator_pulley"
            ) {

                score -= 300000;

            }


            if (
                /\b140\s*amp\b/i.test(
                    intent.raw
                )
            ) {

                if (
                    intel.attributes?.output === "140A"
                ) {

                    score += 150000;

                }
                else if (
                    intel.attributes?.output
                ) {

                    score -= 100000;

                }

            }


            // HOLDEN COMMODORE
            if (
                intent.raw.includes("commodore")
            ) {

                if (
                    vehicles.includes("Holden Commodore")
                ) {

                    score += 100000;

                }
                else if (
                    vehicles.includes("Holden")
                ) {

                    score += 50000;

                }

            }


            // VE
            if (
                /\bve\b/i.test(
                    intent.raw
                )
            ) {

                if (
                    models.includes("VE")
                ) {

                    score += 100000;

                }
                else if (
                    models.length
                ) {

                    score -= 75000;

                }

            }


            // VF
            if (
                /\bvf\b/i.test(
                    intent.raw
                )
            ) {

                if (
                    models.includes("VF")
                ) {

                    score += 100000;

                }
                else if (
                    models.length
                ) {

                    score -= 75000;

                }

            }


            // LS
            if (
                engines.includes("LS")
            ) {

                score += 50000;

            }

        }


        // ==================================
        // INTAKE INTELLIGENCE
        // ==================================

        if (
            intent.category === "intake"
        ) {

            // FAMILY

            if (
                intel.family === "intake"
            ) {

                score += 500000;

            }
            else {

                // Central intelligence is authoritative
                // for direct intake queries.
                //
                // Prevent products such as gaskets,
                // fasteners and brackets from surviving
                // because they contain "intake manifold".

                score -= 1000000;

            }


            // SUBTYPE

            if (
                intel.subtype === "intake_manifold"
            ) {

                score += 200000;

            }


            // ENGINE INTELLIGENCE

            const engines =
                Array.isArray(
                    intel.attributes?.engine
                )
                    ? intel.attributes.engine
                    : [];


            // LS1
            if (
                intent.engine === "ls1"
            ) {

                if (
                    engines.includes("LS1")
                ) {

                    score += 150000;

                }
                else if (
                    engines.includes("LS2")
                ) {

                    score += 100000;

                }
                else if (
                    engines.includes("LS3")
                ) {

                    score += 50000;

                }

            }


            // LS2
            if (
                intent.engine === "ls2"
            ) {

                if (
                    engines.includes("LS2")
                ) {

                    score += 150000;

                }
                else if (
                    engines.includes("LS1")
                ) {

                    score += 100000;

                }
                else if (
                    engines.includes("LS3")
                ) {

                    score += 50000;

                }

            }


            // LS3
            if (
                intent.engine === "ls3"
            ) {

                if (
                    engines.includes("LS3")
                ) {

                    score += 150000;

                }
                else if (
                    engines.includes("LS2")
                ) {

                    score += 100000;

                }

            }


            // GENERIC LS

            if (
                intent.engine === "ls"
            ) {

                if (
                    engines.includes("LS")
                ) {

                    score += 100000;

                }

            }


            // ==================================
// LS INTAKE MANIFOLD PRECISION
// ==================================

if (
    intent.engine === "ls" &&
    intel.subtype === "intake_manifold"
) {

    if (
        engines.includes("LS1") ||
        engines.includes("LS2") ||
        engines.includes("LS3") ||
        engines.includes("LS")
    ) {

        score += 350000;

    }
    else {

        score = -999999;

    }

}


// ==================================
// INTAKE MANIFOLD HARD LOCK
// ==================================

                        if (
                intent.raw.includes("intake manifold")
            ) {

                if (
                    intel.subtype !== "intake_manifold"
                ) {

                    score = -999999;

                }

            }

        }

        // ==================================
        // COOLING INTELLIGENCE
        // ==================================

        if (
            intent.category === "cooling"
        ) {

            // ==================================
            // FAMILY
            // ==================================

            if (
                intel.family === "cooling"
            ) {

                score += 500000;

            }
            else {

                // Central intelligence is authoritative
                // for direct cooling queries.

                score -= 1000000;

            }


            // ==================================
            // SUBTYPE
            // ==================================

            if (
                intent.coolingType
            ) {

                if (
                    intel.subtype ===
                    intent.coolingType
                ) {

                    score += 250000;

                }
                else {

                    score -= 1000000;

                }

            }


            // ==================================
            // WATER PUMP
            // ==================================

            if (
                intent.coolingType ===
                "water_pump"
            ) {

                if (
                    intel.subtype ===
                    "water_pump"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // RADIATOR
            // ==================================

            if (
                intent.coolingType ===
                "radiator"
            ) {

                if (
                    intel.subtype ===
                    "radiator"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // RADIATOR CAP
            // ==================================

            if (
                intent.coolingType ===
                "radiator_cap"
            ) {

                if (
                    intel.subtype ===
                    "radiator_cap"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // TRANSMISSION COOLER
            // ==================================

            if (
                intent.coolingType ===
                "transmission_cooler"
            ) {

                if (
                    intel.subtype ===
                    "transmission_cooler"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // OIL COOLER
            // ==================================

            if (
                intent.coolingType ===
                "oil_cooler"
            ) {

                if (
                    intel.subtype ===
                    "oil_cooler"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // WATER NECK
            // ==================================

            if (
                intent.coolingType ===
                "water_neck"
            ) {

                if (
                    intel.subtype ===
                    "water_neck"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // THERMOSTAT HOUSING
            // ==================================

            if (
                intent.coolingType ===
                "thermostat_housing"
            ) {

                if (
                    intel.subtype ===
                    "thermostat_housing"
                ) {

                    score += 150000;

                }

            }


            // ==================================
            // OVERFLOW TANK
            // ==================================

            if (
                intent.coolingType ===
                "overflow_tank"
            ) {

                if (
                    intel.subtype ===
                    "overflow_tank"
                ) {

                    score += 150000;

                }

            }

        }

    }


// ======================================
// SUSPENSION CENTRAL INTELLIGENCE
// ======================================

if (
    intent.category ===
    "suspension"
) {

    const intel =
        product.ssrIntelligence || {};

    // FAMILY
    if (
        intel.family ===
        "suspension"
    ) {

        score += 500000;

    }
    else {

        score -= 1000000;

    }


    // SUBTYPE
    if (
        intent.suspensionType
    ) {

        if (
            intel.subtype ===
            intent.suspensionType
        ) {

            score += 250000;

        }
        else {

            score -= 1000000;

        }

    }


    // ==================================
    // ROD END
    // ==================================

    if (
        intent.suspensionType ===
        "rod_end"
    ) {

        if (
            intel.subtype ===
            "rod_end"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // UNIBALL
    // ==================================

    if (
        intent.suspensionType ===
        "uniball"
    ) {

        if (
            intel.subtype ===
            "uniball"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // UNIBALL CUP
    // ==================================

    if (
        intent.suspensionType ===
        "uniball_cup"
    ) {

        if (
            intel.subtype ===
            "uniball_cup"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // MISALIGNMENT SPACER
    // ==================================

    if (
        intent.suspensionType ===
        "misalignment_spacer"
    ) {

        if (
            intel.subtype ===
            "misalignment_spacer"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // ROD END ACCESSORY
    // ==================================

    if (
        intent.suspensionType ===
        "rod_end_accessory"
    ) {

        if (
            intel.subtype ===
            "rod_end_accessory"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // LIMITING STRAP
    // ==================================

    if (
        intent.suspensionType ===
        "suspension_limiting_strap"
    ) {

        if (
            intel.subtype ===
            "suspension_limiting_strap"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // LIMITING STRAP ACCESSORY
    // ==================================

    if (
        intent.suspensionType ===
        "limiting_strap_accessory"
    ) {

        if (
            intel.subtype ===
            "limiting_strap_accessory"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // SUSPENSION BUNG
    // ==================================

    if (
        intent.suspensionType ===
        "suspension_bung"
    ) {

        if (
            intel.subtype ===
            "suspension_bung"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // SUSPENSION BUSHING
    // ==================================

    if (
        intent.suspensionType ===
        "suspension_bushing"
    ) {

        if (
            intel.subtype ===
            "suspension_bushing"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // SHOCK
    // ==================================

    if (
        intent.suspensionType ===
        "shock"
    ) {

        if (
            intel.subtype ===
            "shock"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // SHOCK REBUILD KIT
    // ==================================

    if (
        intent.suspensionType ===
        "shock_rebuild_kit"
    ) {

        if (
            intel.subtype ===
            "shock_rebuild_kit"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // SPRING
    // ==================================

    if (
        intent.suspensionType ===
        "spring"
    ) {

        if (
            intel.subtype ===
            "spring"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // SPINDLE SNOUT
    // ==================================

    if (
        intent.suspensionType ===
        "spindle_snout"
    ) {

        if (
            intel.subtype ===
            "spindle_snout"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // PIVOT HOUSING
    // ==================================

    if (
        intent.suspensionType ===
        "pivot_housing"
    ) {

        if (
            intel.subtype ===
            "pivot_housing"
        ) {

            score += 150000;

        }

    }


    // ==================================
    // CABLE ROD END
    // ==================================

    if (
        intent.suspensionType ===
        "cable_rod_end"
    ) {

        if (
            intel.subtype ===
            "cable_rod_end"
        ) {

            score += 150000;

        }

    }

}

return score;

}


// ======================================
// V6 GENERIC CONNECTION ENGINE
// ======================================
//
// These functions MUST remain at top level.
//
// They are used by:
// - ssrSearchV6()
// - browser console debugging
// - future connection intelligence
//
// ======================================


// ======================================
// PRODUCT CONNECTION PARSER
// ======================================


/*
======================================
V6 PRODUCT CONNECTION INTELLIGENCE
======================================

Uses product Body HTML when it explicitly
describes connection genders/counts.

Example:

"Two -8AN female swivel ports on the run,
one -8AN male port on the branch"

becomes:

-8 female
-8 female
-8 male

Falls back to the existing title parser
when no explicit Body connection data exists.
======================================
*/

function v6GetProductConnections(product) {

    const title =
        String(
            product?.Title ||
            ""
        );

    const body =
        String(
            product?.["Body (HTML)"] ||
            ""
        );

    const explicit = [];

    /*
    ==================================
    V6 BODY CONNECTION INTELLIGENCE
    ==================================

    Priority:

    1. Explicit female-to-female
    2. Explicit male-to-male / male both ends
    3. Explicit two connections
    4. Explicit one connection
    5. AN flare port intelligence
    6. Title fallback

    ==================================
    */


    /*
    ==================================
    AN FEMALE-TO-FEMALE
    ==================================

    Example:

    "-6AN female-to-female union fitting"

    Means:

    -6 female
    -6 female

    ==================================
    */

    const femaleToFemaleRegex =
        /-(\d+)\s*AN\s+female\s*-\s*to\s*-\s*female\b/gi;

    let match;

    while (
        (match =
            femaleToFemaleRegex.exec(body))
        !== null
    ) {

        explicit.push(
            {
                type:
                    "an",

                size:
                    "-" +
                    match[1],

                gender:
                    "female"
            },

            {
                type:
                    "an",

                size:
                    "-" +
                    match[1],

                gender:
                    "female"
            }
        );

    }


    /*
    ==================================
    AN MALE-TO-MALE
    ==================================

    Example:

    "-6 AN male-to-male union"

    Means:

    -6 male
    -6 male

    ==================================
    */

    const maleToMaleRegex =
        /-(\d+)\s*AN\s+male\s*-\s*to\s*-\s*male\b/gi;

    while (
        (match =
            maleToMaleRegex.exec(body))
        !== null
    ) {

        explicit.push(
            {
                type:
                    "an",

                size:
                    "-" +
                    match[1],

                gender:
                    "male"
            },

            {
                type:
                    "an",

                size:
                    "-" +
                    match[1],

                gender:
                    "male"
            }
        );

    }


    /*
    ==================================
    AN MALE BOTH ENDS
    ==================================

    Example:

    "-6 AN male flare both ends"

    Means:

    -6 male
    -6 male

    ==================================
    */

    const maleBothEndsRegex =
        /-(\d+)\s*AN\s+male\b[^<]{0,80}\bboth\s+ends\b/gi;

    while (
        (match =
            maleBothEndsRegex.exec(body)
        )
        !== null
    ) {

        explicit.push(
            {
                type:
                    "an",

                size:
                    "-" +
                    match[1],

                gender:
                    "male"
            },

            {
                type:
                    "an",

                size:
                    "-" +
                    match[1],

                gender:
                    "male"
            }
        );

        return explicit;

    }


    /*
    ==================================
    TWO / 2 CONNECTIONS
    ==================================
    */


    /*
    ==================================
    EXPLICIT PRODUCT CONNECTION FOUND
    ==================================

    Do not interpret mating-component
    descriptions as product connections.

    Example:

    Connect two -6 AN female hose ends

    describes what the product connects to,
    not the physical connections on the product.

    ==================================
    */

    if (
        explicit.length
    ) {

        return explicit;

    }

    const twoConnectionRegex =
        /\b(?:two|2)\s+(-\d+)\s*an\s+(male|female)\b/gi;

    while (
        (match =
            twoConnectionRegex.exec(body))
        !== null
    ) {

        explicit.push(
            {
                type:
                    "an",

                size:
                    match[1],

                gender:
                    match[2].toLowerCase()
            },

            {
                type:
                    "an",

                size:
                    match[1],

                gender:
                    match[2].toLowerCase()
            }
        );

    }


    /*
    ==================================
    ONE / 1 CONNECTION
    ==================================
    */

    const oneConnectionRegex =
        /\b(?:one|1)\s+(-\d+)\s*an\s+(male|female)\b/gi;

    while (
        (match =
            oneConnectionRegex.exec(body))
        !== null
    ) {

        explicit.push(
            {
                type:
                    "an",

                size:
                    match[1],

                gender:
                    match[2].toLowerCase()
            }
        );

    }


    /*
    ==================================
    AN FLARE PORT BODY INTELLIGENCE
    ==================================

    Example:

    "-6 AN flare ports ? mates with
    standard -6 AN female hose ends"

    Means the product has MALE -6 AN
    ports because they accept female
    AN hose ends.

    ==================================
    */

    const flarePortMatch =
        body.match(
            /-(\d+)\s*AN\s+flare\s+ports?/i
        );

    if (
        flarePortMatch &&
        /\bmates\s+with\s+standard\s+-\d+\s*AN\s+female\b/i.test(
            body
        )
    ) {

        const flareSize =
            "-" +
            flarePortMatch[1];

        const isTeeProduct =
            /\btee\b/i.test(
                title
            ) ||
            /\btee\b/i.test(
                body
            );

        if (
            isTeeProduct &&
            !explicit.length
        ) {

            explicit.push(
                {
                    type:
                        "an",

                    size:
                        flareSize,

                    gender:
                        "male"
                },

                {
                    type:
                        "an",

                    size:
                        flareSize,

                    gender:
                        "male"
                },

                {
                    type:
                        "an",

                    size:
                        flareSize,

                    gender:
                        "male"
                }
            );

        }

    }


    /*
    ==================================
    EXPLICIT BODY DATA FOUND
    ==================================
    */

    /*
    ==================================
    BODY END SPECIFICATION INTELLIGENCE
    ==================================

    Product Body specifications are authoritative.

    Example:

    AN End: -6 AN Female Flare
    NPT End: 3/8" NPT Male

    ==================================
    */

    const bodyConnectionText =
        body
            .replace(
                /<[^>]*>/g,
                " "
            )
            .replace(
                /&quot;/gi,
                '"'
            )
            .replace(
                /&amp;/gi,
                "&"
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    const bodyANEndMatch =
        bodyConnectionText.match(
            /AN\s+End\s*:\s*(-\d+)\s*AN\b[^:]{0,80}?\b(female|male)\b/i
        );


    const bodyNPTEndMatch =
        bodyConnectionText.match(
            /NPT\s+End\s*:\s*(\d+\/\d+|\d+(?:\.\d+)?)\s*["']?\s*NPT\b[^:]{0,80}?\b(female|male)\b/i
        );


    if (
        bodyANEndMatch &&
        bodyNPTEndMatch
    ) {

        explicit.push(

            {
                type:
                    "an",

                size:
                    bodyANEndMatch[1],

                gender:
                    bodyANEndMatch[2].toLowerCase()
            },

            {
                type:
                    "npt",

                size:
                    bodyNPTEndMatch[1],

                gender:
                    bodyNPTEndMatch[2].toLowerCase()
            }

        );

    }


    if (
        explicit.length
    ) {

        return explicit;

    }


    /*
    ==================================
    FALLBACK
    ==================================
    */

    return v6ParseProductConnections(
        title
    );

}


function v6ParseProductConnections(title) {

    const connections = [];

    console.log(
        "V6 PARSER INPUT:",
        title
    );


    const text =
    String(
        title || ""
    )
        .toLowerCase()
        .replace(
            /_/g,
            " "
        );


    // ==================================
    // AN / FLARE CONNECTIONS
    // ==================================

    // ======================================
// AN CONNECTION REGEX
// ======================================

const anRegex =
    /(?:^|\s)-\s*(\d+)(?!\s*\.\d)(?=\s*(?:an\b|male\b|female\b|mal\b|fem\b|flare\b|port\b|to\b|reducer\b|adapter\b|adaptor\b|tee\b|elbow\b|hose\b|union\b|bulkhead\b|(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\s*(?:flare\b|bulkhead\b|elbow\b|hose\b|$)|$))/gi;


    let match;


    while (
        (
            match =
                anRegex.exec(
                    text
                )
        ) !== null
    ) {

        const size =
            "-" +
            match[1];


        const start =
            match.index;


        const end =
            match.index +
            match[0].length;


        // ==================================
        // NEARBY TEXT
        // ==================================

        const nearby =
            text.substring(
                start,
                Math.min(
                    text.length,
                    end + 20
                )
            );


        // ==================================
        // GENDER
        // ==================================

        let gender = null;

// ==================================
// DIRECT AN GENDER
// ==================================
//
// Only read gender immediately after
// THIS AN size.
//
// Do NOT look ahead through "to Male"
// because that belongs to another end.
//
// Examples:
// -6 Female to M10      -> female
// -6 Male to M10        -> male
// -6 Fem to Male        -> female
// -6 to Male            -> null
//

const afterAN =
    text.substring(
        end,
        Math.min(
            text.length,
            end + 12
        )
    );

if (
    /^\s*(?:AN\s*)?(?:female|fem)\b/i.test(
        afterAN
    )
) {

    gender = "female";

}
else if (
    /^\s*(?:AN\s*)?(?:male|mal)\b/i.test(
        afterAN
    )
) {

    gender = "male";

}


        connections.push({

            type:
                "an",

            size:
                size,

            gender:
                gender,

            index:
                start,

            end:
                end

        });

    }
        // ==================================
    // O-RING PORT CONNECTIONS
    // ==================================
    //
    // Handles products such as:
    //
    // -8 male to -6 o-ring port
    // -6 male to -8 o-ring port
    //
    // The o-ring port is NOT an AN connection.
    // It is a distinct port connection.
    //
    // ==================================

    const oringPortRegex =
        /(?:^|\s)-\s*(\d+)\s*(?:o[\s-]*ring|o[\s-]*ring)\s+port\b/gi;


    while (
        (
            match =
                oringPortRegex.exec(
                    text
                )
        ) !== null
    ) {

        const size =
            "-" +
            match[1];


        const start =
            match.index;


        const end =
            match.index +
            match[0].length;


        // ==================================
        // PREVENT DUPLICATE AN CONNECTION
        // ==================================

        const existingAN =
            connections.some(
                connection =>

                    connection.type ===
                    "an" &&

                    connection.size ===
                    size &&

                    Math.abs(
                        connection.index -
                        start
                    ) < 10
            );


        if (
            existingAN
        ) {

            continue;

        }


        connections.push({

            type:
                "oring_port",

            size:
                size,

            gender:
                null,

            index:
                start,

            end:
                end

        });

    }
    // ==================================
    // INHERITED AN GENDER
    // ==================================
    //
    // Handles products where the second AN
    // gender is written without repeating
    // the AN size.
    //
    // Example:
    //
    // -6 female to male
    //
    // becomes:
    //
    // -6 female
    // -6 male
    //
    // Also handles:
    //
    // -6 male to female
    //
    // BUT does NOT interfere with:
    //
    // -6 female to -8 male
    //
    // because the second AN connection is
    // already detected by anRegex.
    //
    // ==================================

    connections
        .filter(
            connection =>
                connection.type ===
                "an"
        )
        .forEach(
            firstConnection => {

                const afterFirst =
                    text.substring(
                        firstConnection.end,
                        Math.min(
                            text.length,
                            firstConnection.end + 40
                        )
                    );


                const inheritedGenderMatch =
                    afterFirst.match(
                        /\bto\s+(male|female)\b/i
                    );


                if (
                    !inheritedGenderMatch
                ) {

                    return;

                }


                // ==================================
                // CHECK WHETHER ANOTHER AN CONNECTION
                // ALREADY EXISTS AFTER THIS ONE
                // ==================================

                const hasSecondAN =
                    connections.some(
                        connection =>

                            connection.type ===
                            "an" &&

                            connection.index >
                            firstConnection.end
                    );


                if (
                    hasSecondAN
                ) {

                    return;

                }


                connections.push({

                    type:
                        "an",

                    size:
                        firstConnection.size,

                    gender:
                        inheritedGenderMatch[1]
                            .toLowerCase(),

                    index:
                        firstConnection.end +
                        inheritedGenderMatch.index,

                    end:
                        firstConnection.end +
                        inheritedGenderMatch.index +
                        inheritedGenderMatch[0].length

                });

            }
        );

    // ==================================
    // NPT CONNECTIONS
    // ==================================

    const nptRegex =
        /\b(\d+\/\d+|\d+(?:\.\d+)?)\s*["']?\s*npt\b/gi;


    while (
        (
            match =
                nptRegex.exec(
                    text
                )
        ) !== null
    ) {

        connections.push({

            type:
                "npt",

            size:
                match[1],

            gender:
                null,

            index:
                match.index,

            end:
                match.index +
                match[0].length

        });

    }


    // ==================================
    // NPT GENDER
    // ==================================

    connections.forEach(
        connection => {

            if (
                connection.type !==
                "npt"
            ) {

                return;

            }


            const nearby =
                text.substring(
                    Math.max(
                        0,
                        connection.index - 20
                    ),
                    Math.min(
                        text.length,
                        connection.end + 20
                    )
                );


            if (
                /\bfemale\b/i.test(
                    nearby
                )
            ) {

                connection.gender =
                    "female";

            }
            else if (
                /\bmale\b/i.test(
                    nearby
                )
            ) {

                connection.gender =
                    "male";

            }

        }
    );


    // ==================================
    // DEBUG PARSER OUTPUT
    // ==================================

    console.log(
        "V6 PARSER OUTPUT:",
        JSON.stringify(
            connections,
            null,
            2
        )
    );


    // ==================================
    // SORT BY TITLE POSITION
    // ==================================

    connections.sort(
        (
            a,
            b
        ) =>
            a.index -
            b.index
    );


    console.log(
        "V6 PARSER SORTED OUTPUT:",
        JSON.stringify(
            connections,
            null,
            2
        )
    );


    return connections;

}


// ======================================
// QUERY CONNECTION MATCHER
// ======================================

function v6ConnectionMatches(
    productConnection,
    requestedConnection
) {

    if (
        !productConnection ||
        !requestedConnection
    ) {

        return false;

    }


    // ==================================
    // CONNECTION TYPE
    // ==================================

    if (
        productConnection.type !==
        requestedConnection.type
    ) {

        return false;

    }


    // ==================================
    // CONNECTION SIZE
    // ==================================

    if (
        productConnection.size !==
        requestedConnection.size
    ) {

        return false;

    }


    // ==================================
    // GENDER
    // ==================================

    if (
        requestedConnection.gender &&
        productConnection.gender !==
        requestedConnection.gender
    ) {

        return false;

    }


    return true;

}


// ======================================
// V6 SEARCH
// ======================================

function ssrSearchV6(query) {

    // Keep conversation state synchronized
    // with the current customer query.
    if (typeof ssrUpdateConversation === "function") {
        ssrUpdateConversation(query);
    }


    // ======================================
    // CONVERSATION-AWARE INTENT
    // ======================================

    const conversationIntent =
        ssrConversation &&
        ssrConversation.known &&
        ssrConversation.known.intent
            ? ssrConversation.known.intent
            : null;


    const analysedIntent =
        ssrAnalyseQueryV6(
            query
        );


    const intent =
        conversationIntent
            ? {
                ...conversationIntent
            }
            : {};


    // Add only useful information from
    // the current search query.

    Object.keys(analysedIntent).forEach(key => {

        const value =
            analysedIntent[key];

        if (
            value !== null &&
            value !== undefined &&
            value !== ""
        ) {

            intent[key] = value;

        }

    });


    // ======================================
    // ======================================
    // CLARIFICATION GATE
    // ======================================
    //
    // Ask for required information before
    // searching the product catalogue.
    //
    // ======================================

    if (
        ssrConversation &&
        Array.isArray(ssrConversation.missing) &&
        ssrConversation.missing.length > 0 &&
        typeof ssrGetNextQuestion === "function"
    ) {

        const nextQuestion =
            ssrGetNextQuestion();

        if (nextQuestion) {
            return [];
        }

    }


    // CONVERSATION -> V6 BRIDGE
    // ======================================
    //
    // When the customer has completed a
    // component connection requirement,
    // convert the physical requirement into
    // a normal V6 connection query.
    //
    // Example:
    //
    // Existing component:
    // -8AN female fuel rail
    //
    // Hose:
    // -6AN
    //
    // Required fitting:
    // -8AN male to -6AN
    //
    // V6 remains responsible for product
    // scoring and physical connection validity.
    //
    // ======================================

    const conversationConnections =
        ssrConversation &&
        ssrConversation.requirements &&
        Array.isArray(
            ssrConversation.requirements.connections
        )
            ? ssrConversation.requirements.connections
            : [];


    const completedConnection =
        conversationConnections.find(
            connection =>
                connection.from === "fuel_rail" &&
                connection.to === "hose" &&
                connection.status === "complete" &&
                connection.fromSize &&
                connection.fromType &&
                connection.hoseSize
        );


    if (
        completedConnection
    ) {

        // ==================================
        // FUEL RAIL -> HOSE
        // ==================================

        if (
            completedConnection.fromType === "an" &&
            completedConnection.fromGender
        ) {

            const fittingSideGender =
                completedConnection.fromGender === "female"
                    ? "male"
                    : "female";


            const bridgeQuery =
                completedConnection.fromSize +
                "AN " +
                fittingSideGender +
                " to " +
                completedConnection.hoseSize +
                "AN";


            console.log(
                "V6 CONVERSATION BRIDGE:",
                {
                    originalQuery:
                        query,

                    bridgeQuery:
                        bridgeQuery
                }
            );


            const bridgeIntent =
                ssrAnalyseQueryV6(
                    bridgeQuery
                );


            Object.assign(
                intent,
                bridgeIntent
            );

            intent.conversationBridge = true;


            intent.raw =
                query;


            console.log(
                "V6 CONVERSATION INTENT:",
                intent
            );

        }

    }


    if (
        typeof ssrV5Products === "undefined" ||
        !Array.isArray(ssrV5Products)
    ) {

        console.error(
            "V6 PRODUCT DATABASE NOT AVAILABLE"
        );

        return [];

    }


        // ======================================
    // EXACT SKU FAST PATH
    // ======================================
    //
    // SKU queries must bypass normal fitting
    // intelligence and hard validity filters.
    //
    // Supports:
    //
    // 823-06-06-BLK
    // SF823-06-06-BLK
    // Speedflow 823-06-06-BLK
    //
    // ======================================

    const normalizedQuery =
        String(query || "")
            .trim()
            .toLowerCase();


    // ======================================
    // NORMALIZE SKU
    // ======================================

    function normalizeSku(value) {

        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(
                /^sf/,
                ""
            );

    }


        // ======================================
    // EXTRACT SKU-LIKE TOKEN FROM QUERY
    // ======================================
    //
    // Supports:
    //
    // 823-06-06-BLK
    // SF823-06-06-BLK
    // Speedflow 823-06-06-BLK
    // 823 06 06 BLK
    //
    // ======================================

    const catalogueSkuMatch =
        ssrV5Products.find(
            product => {
                const sku =
                    normalizeSku(
                        product["Variant SKU"]
                    )
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-");

                const normalizedCatalogueSku =
                    sku;

                const normalizedQuerySku =
                    normalizedQuery
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-");

                return (
                    normalizedCatalogueSku &&
                    normalizedCatalogueSku ===
                        normalizedQuerySku
                );
            }
        );

    const querySkuMatch =
        catalogueSkuMatch
            ? [normalizedQuery]
            : normalizedQuery.match(
                /\b(?:sf)?\d{3}[-\s]\d{2}[-\s]\d{2}[-\s][a-z0-9]+\b/i
            );


    let querySku =
        querySkuMatch
            ? querySkuMatch[0]
            : normalizedQuery;


    // ======================================
    // NORMALIZE SKU FORMAT
    // ======================================

    querySku =
        normalizeSku(
            querySku
        )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );

    // ======================================
// EXACT SKU MATCH
// ======================================

const exactSkuResults =
    querySkuMatch
        ? ssrV5Products.filter(
            product => {

                    const sku =
                        normalizeSku(
                            product[
                                "Variant SKU"
                            ]
                        );


                    const title =
                        String(
                            product.Title || ""
                        )
                            .trim()
                            .toLowerCase();


                    // ----------------------------------
                    // MATCH VARIANT SKU
                    // ----------------------------------

                    if (
                        sku &&
                        sku === querySku
                    ) {

                        return true;

                    }


                    // ----------------------------------
                    // MATCH PRODUCT NUMBER IN TITLE
                    // ----------------------------------
                    //
                    // Example:
                    //
                    // Query:
                    // 823-06-06-BLK
                    //
                    // Title:
                    // 823-06-06-BLK -6 AN to 3/8" NPT...
                    //
                    // ----------------------------------

                    if (
                        !catalogueSkuMatch &&
                        title.includes(
                            querySku
                        )
                    ) {

                        return true;

                    }


                    return false;

                }
            )
            : [];


    if (
        exactSkuResults.length
    ) {

        console.log(
            "V6 EXACT SKU MATCH:",
            exactSkuResults
        );


        return exactSkuResults
            .map(
                product => ({

                    product: product,

                    score: 999999999

                })
            )
            .slice(
                0,
                5
            );

    }


    // ======================================
    // V6 SEARCH RESULTS
    // ======================================


const results =
    ssrV5Products
        .filter(
            product => {

                const title =
                    String(
                        product.Title || ""
                    ).toLowerCase();


                // ==================================
                // REMOVE BLANK PRODUCTS
                // ==================================

                if (
                    !title
                ) {

                    return false;

                }


                // ==================================
                // COUPLER QUERY = NO REDUCERS
                // ==================================

                if (
                    intent.siliconeType === "coupler" &&
                    title.includes("reducer")
                ) {

                    return false;

                }


                return true;

            }
        )
        .map(
            product => ({

                product: product,

                score:
                    ssrScoreProductV6(
                        product,
                        intent
                    )

            })
        );


results.sort(
    (a, b) =>
        b.score - a.score
);



// V6 HARD VALIDITY FILTER
// ======================================
//
// Prevent obviously invalid products from
// appearing in the final customer results.
//
// For AN ? AN adapters, a valid ordered
// connection must exist.
// ======================================
// ======================================

let finalResults =
    results;

console.log(
    "V6 RESULTS BEFORE HARD FILTER:",
    results.length
);

// ======================================
// EXPORT CONNECTION MATCHER
// ======================================

window.v6ConnectionMatches =
    v6ConnectionMatches;


// ======================================
// GENERIC CONNECTION VALIDITY
// ======================================
//
// Enforces requested connection sizes,
// genders and connection direction.
//
// IMPORTANT:
// This validates the ACTUAL parsed product
// connections.
//
// Direction is treated as physical compatibility,
// NOT title-order compatibility.
//
// Therefore:
//
// Query:
// -6AN male to -8AN female
//
// Product:
// -8 female to -6 male
//
// VALID.
//
// Query:
// -8AN female to -6AN male
//
// Product:
// -8 female to -6 male
//
// ALSO VALID.
//
// ======================================

if (
    intent.connectionDirection === "an_to_an" ||
    intent.connectionDirection === "an_to_npt" ||
    intent.connectionDirection === "npt_to_an"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title ||
                        ""
                    );


                const productConnections =
                    v6GetProductConnections(item.product);


                // ==================================
                // DEBUG
                // ==================================

                console.log(
                    "V6 CONNECTION VALIDITY:",
                    {
                        title:
                            title,

                        direction:
                            intent.connectionDirection,

                        productConnections:
                            productConnections
                    }
                );


                // ==================================
                // AN -> AN
                // ==================================
                //
                // Query:
                //
                // -6 male to -8 female
                //
                // Product:
                //
                // -8 female to -6 male
                //
                // VALID.
                //
                // Direction is therefore checked
                // BOTH ways.
                //
                // ==================================

                                if (
    intent.connectionDirection ===
    "an_to_an"
) {

    // ==================================
    // AN -> AN FITTING FAMILY VALIDITY
    // ==================================
    //
    // Explicit AN -> AN queries must
    // describe a genuine two-ended
    // AN connection fitting.
    //
    // Reducers / expanders ARE allowed.
    //
    // ==================================

    const titleText =
        title.toLowerCase();


    const forbiddenFamily =
        titleText.includes(" tee") ||
        titleText.includes("tee ") ||
        titleText.includes("tee-") ||
        titleText.includes("t-piece") ||
        titleText.includes("t piece") ||
        titleText.includes(" elbow") ||
        titleText.includes("elbow ") ||
        (
            !intent.conversationBridge &&
            (
                titleText.includes("hose end") ||
                titleText.includes("hoseend") ||
                titleText.includes("hose tail") ||
                titleText.includes("hose-tail")
            )
        ) ||
        titleText.includes("bulkhead") ||
        titleText.includes(" union") ||
        titleText.includes("union ") ||
        titleText.includes(" npt") ||
        titleText.includes("npt ") ||
        titleText.includes(" port weld bung") ||
        titleText.includes("weld bung");


    if (
        forbiddenFamily
    ) {

        console.log(
            "V6 AN->AN FAMILY REJECT:",
            {
                title:
                    title,

                reason:
                    "forbidden fitting family"
            }
        );

        return false;

    }


    // ==================================
    // PRODUCT MUST HAVE TWO AN CONNECTIONS
    // ==================================

    const anConnections =
        productConnections.filter(
            connection =>
                connection.type ===
                "an" || (intent.conversationBridge && connection.type === "oring_port")
        );


    const bridgeHoseEnd =
    intent.conversationBridge &&
    (
        titleText.includes("hose end") ||
        titleText.includes("hoseend") ||
        titleText.includes("hose tail") ||
        titleText.includes("hose-tail")
    );

if (
    anConnections.length < 2 &&
    !bridgeHoseEnd
) {
    return false;
}


    // ==================================
    // REQUESTED FIRST CONNECTION
    // ==================================

    const requestedFirst = {

        type:
            "an",

        size:
            intent.size,

        gender:
            intent.anGender ||
            null

    };


    // ==================================
    // REQUESTED SECOND CONNECTION
    // ==================================

    const requestedSecond = {

        type:
            "an",

        size:
            intent.toSize,

        gender:
            intent.toAnGender ||
            null

    };


    // ==================================
    // ANGLE PRECISION
    // ==================================

    if (
        intent.angle
    ) {

        const anglePattern =
            new RegExp(
                "\\b" +
                intent.angle +
                "\\s*(?:degree|degrees|deg)?\\b",
                "i"
            );


        if (
            !anglePattern.test(
                titleText
            )
        ) {

            console.log(
                "V6 AN->AN ANGLE REJECT:",
                {
                    title:
                        title,

                    requestedAngle:
                        intent.angle
                }
            );

            return false;

        }

    }


    // ==================================
    // NORMAL ORDER
    // ==================================

    const normal =
        anConnections.some(
            first =>

                v6ConnectionMatches(
                    first,
                    requestedFirst
                ) &&

                anConnections.some(
                    second =>

                        second !==
                        first &&

                        v6ConnectionMatches(
                            second,
                            requestedSecond
                        )
                )
        );


    // ==================================
    // REVERSE ORDER
    // ==================================

    const reverse =
        anConnections.some(
            first =>

                v6ConnectionMatches(
                    first,
                    requestedSecond
                ) &&

                anConnections.some(
                    second =>

                        second !==
                        first &&

                        v6ConnectionMatches(
                            second,
                            requestedFirst
                        )
                )
        );


    console.log(
        "V6 AN->AN RESULT:",
        {
            title:
                title,

            requestedFirst:
                requestedFirst,

            requestedSecond:
                requestedSecond,

            normal:
                normal,
            conversationBridge:
                intent.conversationBridge,

            reverse:
                reverse
        }
    );

    return (
    intent.conversationBridge
        ? (
            anConnections.some(
                connection =>
                    (
                        v6ConnectionMatches(
                            connection,
                            requestedFirst
                        )
                        ||
                        (
                            connection.type === "an" &&
                            connection.size === requestedFirst.size &&
                            !connection.gender
                        )
                    )
            )
        )
        : (normal || reverse)
);
}
// Query:
//
// -6AN male to 3/8 NPT male
//
// Product:
//
// 3/8 NPT male to -6AN male
//
// VALID.
//
// Physical connection is bidirectional.
// Title order does NOT matter.
//
// ==================================

if (
    intent.connectionDirection ===
    "an_to_npt"
) {

    const requestedAN = {

        type:
            "an",

        size:
            intent.size,

        gender:
            intent.anGender ||
            null

    };


    const requestedNPT = {

        type:
            "npt",

        size:
            intent.nptSize,

        gender:
            intent.nptGender ||
            null

    };


        // ==================================
    // AN -> NPT VALIDITY
    // ==================================
    //
    // Physical adapter validity does NOT
    // depend on title direction.
    //
    // Example:
    //
    // Query:
    // -3 AN male to 1/8 NPT female
    //
    // Product:
    // -3 AN male to 1/8 NPT female
    //
    // VALID
    //
    // Product:
    // 1/8 NPT female to -3 AN male
    //
    // ALSO VALID
    //
    // We therefore only require that
    // BOTH requested connections exist.
    // ==================================

    const hasAN =
        productConnections.some(
            connection =>
                v6ConnectionMatches(
                    connection,
                    requestedAN
                )
        );


    const hasNPT =
        productConnections.some(
            connection =>
                v6ConnectionMatches(
                    connection,
                    requestedNPT
                )
        );


    console.log(
        "V6 AN->NPT RESULT:",
        {
            title:
                title,

            requestedAN:
                requestedAN,

            requestedNPT:
                requestedNPT,

            productConnections:
                productConnections,

            hasAN:
                hasAN,

            hasNPT:
                hasNPT,

            valid:
                hasAN &&
                hasNPT
        }
    );


    return (
        hasAN &&
        hasNPT
    );

}


                // ==================================
                // NPT -> AN
                // ==================================
                //
                // Query:
                //
                // 1/8 NPT male to -3AN male
                //
                // Product must contain:
                //
                // 1/8 NPT male
                //
                // AND
                //
                // -3 AN male
                //
                // ==================================

                if (
                    intent.connectionDirection ===
                    "npt_to_an"
                ) {

                    const requestedNPT = {

                        type:
                            "npt",

                        size:
                            intent.nptSize,

                        gender:
                            intent.nptGender ||
                            null

                    };


                    const requestedAN = {

                        type:
                            "an",

                        size:
                            intent.size,

                        gender:
                            intent.anGender ||
                            null

                    };


                    const hasNPT =
                        productConnections.some(
                            connection =>
                                v6ConnectionMatches(
                                    connection,
                                    requestedNPT
                                )
                        );


                    const hasAN =
                        productConnections.some(
                            connection =>
                                v6ConnectionMatches(
                                    connection,
                                    requestedAN
                                )
                        );


                    console.log(
                        "V6 NPT->AN RESULT:",
                        {
                            title:
                                title,

                            requestedNPT:
                                requestedNPT,

                            requestedAN:
                                requestedAN,

                            hasNPT:
                                hasNPT,

                            hasAN:
                                hasAN
                        }
                    );


                    return (
                        hasNPT &&
                        hasAN
                    );

                }

                // ==================================
                // NO CONNECTION TYPE
                // ==================================

                return true;

            }
        );

}


// ======================================
// CONNECTION ANGLE HARD VALIDITY
// ======================================
//
// Connection queries that request an
// angle must contain that angle.
//
// ======================================

if (
    intent.angle
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title ||
                        ""
                    ).toLowerCase();


                const requestedAngle =
                    String(
                        intent.angle
                    );


                const exactAngle =
                    new RegExp(
                        "\\b" +
                        requestedAngle +
                        "\\s*(?:degree|degrees|deg)?\\b",
                        "i"
                    );


                const hasAngle =
                    exactAngle.test(
                        title
                    );


                console.log(
                    "V6 CONNECTION ANGLE:",
                    {
                        title:
                            title,

                        requestedAngle:
                            requestedAngle,

                        hasAngle:
                            hasAngle
                    }
                );


                return hasAngle;

            }
        );

}

// ======================================
// FINAL RESULT SORT
// ======================================

// ======================================
// INVALID CATALOGUE SKU GUARD
// ======================================

const invalidCatalogueSkuQuery =
    !catalogueSkuMatch &&
    (
        /^(?:[a-z]{2,}\d+[a-z0-9]*-\d+[a-z0-9-]*)$/i.test(
            normalizedQuery
        ) ||
        /\b(?:sf)?\d{3}[-\s]\d{2}[-\s]\d{2}[-\s][a-z0-9]+\b/i.test(
            normalizedQuery
        )
    );

if (invalidCatalogueSkuQuery) {

    console.log(
        "V6 INVALID CATALOGUE SKU:",
        normalizedQuery
    );

    finalResults = [];

}


// ======================================

finalResults.sort(
    (a, b) =>
        b.score - a.score
);



// ======================================\r\n
// ======================================

// ======================================
// HOSE END SIZE HARD VALIDITY
// ======================================
//
// If the customer specifies an AN size,
// only hose ends of that size are allowed.
//
// ======================================

if (
    intent.fittingType === "hose_end" &&
    intent.size
) {
    finalResults =
        finalResults.filter(
            item => {
                const title =
                    String(
                        item.product?.Title || ""
                    ).toLowerCase();

                const isHoseEnd =
                    title.includes("hose end") ||
                    title.includes("hose-end") ||
                    title.includes("hoseend") ||
                    title.includes("hose tail") ||
                    title.includes("hose-tail");

                const hasRequestedSize =
                    v6HasANSize(
                        title,
                        intent.size
                    );

                return (
                    isHoseEnd &&
                    hasRequestedSize
                );
            }
        );
}

// REDUCER HARD VALIDITY
// ======================================
//
// Reducer queries must return actual
// reducing fittings.
//
// ======================================

if (
    intent.fittingType === "reducer"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title ||
                        ""
                    ).toLowerCase();


                // ==================================
                // MUST BE A REAL REDUCER
                // ==================================

                const isReducer =
                    title.includes("reducer") ||
                    title.includes("reducing") ||
                    title.includes("reduction");


                if (
                    !isReducer
                ) {

                    return false;

                }


                // ==================================
                // PRODUCT CONNECTIONS
                // ==================================

                const productConnections =
                    v6ParseProductConnections(
                        title
                    );


                // ==================================
                // TWO-SIZE AN -> AN REDUCER
                // ==================================

                if (
                    intent.connectionDirection ===
                    "an_to_an" &&
                    intent.toSize
                ) {

                    const requestedFirst = {

                        type:
                            "an",

                        size:
                            intent.size,

                        gender:
                            intent.anGender ||
                            null

                    };


                    const requestedSecond = {

                        type:
                            "an",

                        size:
                            intent.toSize,

                        gender:
                            intent.toAnGender ||
                            null

                    };


                    const normal =
                        productConnections.some(
                            first =>

                                v6ConnectionMatches(
                                    first,
                                    requestedFirst
                                ) &&

                                productConnections.some(
                                    second =>

                                        second !==
                                        first &&

                                        v6ConnectionMatches(
                                            second,
                                            requestedSecond
                                        )
                                )
                        );


                    const reverse =
                        productConnections.some(
                            first =>

                                v6ConnectionMatches(
                                    first,
                                    requestedSecond
                                ) &&

                                productConnections.some(
                                    second =>

                                        second !==
                                        first &&

                                        v6ConnectionMatches(
                                            second,
                                            requestedFirst
                                        )
                                )
                        );


                    return (
                        normal ||
                        reverse
                    );

                }


                // ==================================
                // SINGLE-SIZE AN REDUCER
                // ==================================
                //
                // Example:
                //
                // Query:
                // -8AN reducer
                //
                // Valid:
                // -10 female to -8 male reducer
                // -8 female to -6 male reducer
                //
                // Invalid:
                // -8 AN to 1/8 NPT reducer
                // -8 AN adapter
                //
                // ==================================

                if (
                    intent.size
                ) {

                    const requested = {

                        type:
                            "an",

                        size:
                            intent.size,

                        gender:
                            intent.anGender ||
                            null

                    };


                    const hasRequestedAN =
                        productConnections.some(
                            connection =>

                                connection.type ===
                                "an" &&

                                v6ConnectionMatches(
                                    connection,
                                    requested
                                )
                        );


                    const anConnections =
                        productConnections.filter(
                            connection =>
                                connection.type ===
                                "an"
                        );


                    // ==================================
                    // MUST HAVE REQUESTED AN
                    // AND ANOTHER AN CONNECTION
                    // ==================================

                    if (
                        !hasRequestedAN ||
                        anConnections.length < 2
                    ) {

                        return false;

                    }


                    // ==================================
                    // TRUE TWO-END AN REDUCER
                    // ==================================

                    return true;

                }


                return true;

            }
        );

}

// TEE HARD VALIDITY
// ======================================
//
// A tee query MUST return an actual tee.
//
// Connection intelligence is used for:
// - AN size
// - AN gender
//
// ======================================

if (
    intent.fittingType === "tee"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title ||
                        ""
                    ).toLowerCase();


                // ==================================
                // MUST BE A REAL TEE
                // ==================================

                const isTee =
                    title.includes(" tee") ||
                    title.includes("tee ") ||
                    title.includes("tee-") ||
                    title.includes("t-piece") ||
                    title.includes("t piece");


                if (
                    !isTee
                ) {

                    return false;

                }


                // ==================================
                // PRODUCT CONNECTIONS
                // ==================================

                const productConnections =
                    v6GetProductConnections(
                        item.product
                    );


                // ==================================
                // REQUESTED AN SIZE
                // ==================================

                if (
                    intent.size
                ) {

                    const hasRequestedSize =
                        productConnections.some(
                            connection =>
                                connection.type === "an" &&
                                Number(connection.size) === Number(intent.size)
                        );


                    if (
                        !hasRequestedSize
                    ) {

                        return false;

                    }

                }


                // ==================================
                // REQUESTED AN GENDER
                // ==================================

                if (
                    intent.anGender === "male" ||
                    intent.anGender === "female"
                ) {

                    const hasRequestedGender =
    productConnections.some(
        connection =>
            connection.type === "an" &&
            Number(connection.size) ===
                Number(intent.size) &&
            connection.gender ===
                intent.anGender
    );


                    if (
                        !hasRequestedGender
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );

}


// ======================================
// ======================================
// BULKHEAD HARD VALIDITY
// ======================================
//
// A bulkhead query MUST return an actual
// bulkhead fitting of the requested AN size.
//
// Reject:
// - bulkhead nuts
// - bulkhead tees
// - wrong AN sizes
//
// ======================================

if (
    intent.fittingType === "bulkhead"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title ||
                        ""
                    ).toLowerCase();

                // ==================================
                // MUST BE A REAL BULKHEAD
                // ==================================

                const isBulkhead =
                    title.includes("bulkhead");

                if (!isBulkhead) {
                    return false;
                }

                // ==================================
                // REJECT BULKHEAD NUTS
                // ==================================

                if (
                    title.includes("bulkhead nut")
                ) {
                    return false;
                }

                // ==================================
                // REJECT BULKHEAD TEES
                // ==================================

                if (
                    title.includes("bulkhead tee")
                ) {
                    return false;
                }

                // ==================================
                // PRODUCT CONNECTIONS
                // ==================================

                const productConnections =
                    v6GetProductConnections(
                        item.product
                    );

                // ==================================
                // REQUESTED AN SIZE
                // ==================================

                if (intent.size) {

                    const hasRequestedSize =
                        productConnections.some(
                            connection =>
                                connection.type === "an" &&
                                Number(connection.size) === Number(intent.size)
                        );

                    if (!hasRequestedSize) {
                        return false;
                    }

                }

                return true;

            }
        );

}


// HOSE END FEMALE HARD VALIDITY
// ======================================
// ======================================
//
// Female hose-end request MUST be:
// 1. Explicitly female
// 2. Explicitly a hose end
//
// ======================================

if (
    intent.fittingType === "hose_end" &&
    intent.anGender === "female"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title || ""
                    ).toLowerCase();


                const isFemale =
                    /\bfemale\b/i.test(
                        title
                    );


                const isHoseEnd =
                    title.includes("hose end") ||
                    title.includes("hose-end") ||
                    title.includes("hoseend") ||
                    title.includes("hose tail") ||
                    title.includes("hose-tail");


                const hasRequestedSize =
                    !intent.size ||
                    v6HasANSize(
                        title,
                        intent.size
                    );


                return (
                    isFemale &&
                    isHoseEnd &&
                    hasRequestedSize
                );

            }
        );

}
// ======================================
// ELBOW HARD VALIDITY
// ======================================
//
// An elbow query MUST return an actual elbow.
//
// Valid examples:
//
// -6 female to male 90 degree
// -6AN 90 degree elbow
// -6 flare 45 degree elbow
//
// Reject:
//
// hose ends
// bulkheads
// tees
// unions
// adapters
// couplers
// NPT fittings
//
// ======================================

if (
    intent.fittingType === "elbow"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title || ""
                    ).toLowerCase();


                // ==================================
                // EXPLICIT WRONG FITTING FAMILIES
                // ==================================

                if (
    title.includes("hose end") ||
    title.includes("hose-end") ||
    title.includes("hoseend") ||
    title.includes("hose tail") ||
    title.includes("hose barb") ||
    title.includes("bulkhead") ||
    title.includes("port") ||
    title.includes("tee") ||
    title.includes("t-piece") ||
    title.includes("t piece") ||
    title.includes("union") ||
    title.includes("adapter") ||
    title.includes("adaptor") ||
    title.includes("coupler") ||
    title.includes("joiner") ||
    title.includes("npt")
) {

    return false;

}


                // ==================================
                // ELBOW DETECTION
                // ==================================
                //
                // Accept an explicit elbow.
                //
                // Also accept AN / flare angled
                // fittings where the title does not
                // explicitly contain "elbow".
                //
                // ==================================

                const isExplicitElbow =
                    title.includes("elbow");


                const hasAngle =
                    /\b(?:30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/i.test(
                        title
                    );


                const isANConnection =
                    /(?:^|\s)-\s*\d+\s*(?:an|male|female|flare)\b/i.test(
                        title
                    );


                const isElbow =
                    isExplicitElbow ||
                    (
                        isANConnection &&
                        hasAngle
                    );


                if (
                    !isElbow
                ) {

                    return false;

                }


                // ==================================
                // REQUESTED AN SIZE
                // ==================================

                if (
                    intent.size
                ) {

                    const requestedAN =
                        String(
                            intent.size
                        )
                            .replace(
                                "-",
                                ""
                            )
                            .trim();


                    const exactAN =
                        new RegExp(
                            "(?:^|\\s)-\\s*" +
                            requestedAN +
                            "\\s*(?:an\\b|male\\b|female\\b|flare\\b)",
                            "i"
                        );


                    if (
                        !exactAN.test(
                            title
                        )
                    ) {

                        return false;

                    }

                }


                // ==================================
                // REQUESTED ANGLE
                // ==================================

                if (
                    intent.angle
                ) {

                    const requestedAngle =
                        String(
                            intent.angle
                        );


                    const exactAngle =
                        new RegExp(
                            "\\b" +
                            requestedAngle +
                            "\\s*(?:degree|degrees|deg)?\\b",
                            "i"
                        );


                    if (
                        !exactAngle.test(
                            title
                        )
                    ) {

                        return false;

                    }

                }


                return true;

            }
        );

}
// ======================================
// CONNECTION VALIDITY INTELLIGENCE
// ======================================
//
// Enforces requested connection sizes,
// genders and connection direction.
//
// IMPORTANT:
// This block validates connection structure
// AFTER scoring. It does NOT alter scoring.
//
// Handles database title variations such as:
//
// -6 female to -4 male
// -6 female to - 4 male
// -6AN Female to -4 Male
// -8AN Female to 3/8" NPT
//
// ======================================


// ======================================
// AN SIZE HELPER
// ======================================
//
// Allows:
//
// -6
// - 6
// -6AN
// - 6 AN
//
// ======================================

function v6HasANSize(
    title,
    size
) {

    if (!size) {
        return false;
    }

    const n =
        String(size)
            .replace("-", "")
            .trim();

    const padded =
        n.length === 1
            ? "0" + n
            : n;

    const pattern =
        new RegExp(
            "(?:^|[^0-9])-?\\s*(?:" +
            n +
            "|" +
            padded +
            ")\\s*(?:an|male|female|flare)\\b",
            "i"
        );

    return pattern.test(title);

}

// ======================================
// FINAL RESULT SORT
// ======================================

// ======================================
// ======================================
// GENERIC FITTING HARD VALIDITY
// ======================================
//
// Generic fitting queries mean:
//
// "I need a -6AN fitting"
//
// Require the requested AN size.
//
// Allow genuine fitting products even when
// the title does not literally contain
// "fitting".
//
// Reject specialised product families.
//
console.log(
    "V6 BEFORE GENERIC FITTING FILTER:",
    finalResults.length
);

console.table(
    finalResults.slice(0, 30).map(
        item => ({
            title:
                item.product?.Title,

            type:
                item.product?.Type,

            connections:
                JSON.stringify(
                    v6GetProductConnections(
                        item.product
                    )
                )
        })
    )
);
if (
    intent.category === "fitting" &&
    intent.fittingType === "fitting"
) {

    finalResults =
        finalResults.filter(
            item => {

                const title =
                    String(
                        item.product?.Title ||
                        ""
                    ).toLowerCase();


                const productType =
                    String(
                        item.product?.Type ||
                        ""
                    ).toLowerCase();

                // ==================================
                // EXPLICIT Y-BLOCK QUERY
                // ==================================

                if (
                    intent.raw.includes("y block") ||
                    intent.raw.includes("y-block")
                ) {

                    const isYBlock =
                        title.includes("y block") ||
                        title.includes("y-block");

                    if (!isYBlock) {
                        return false;
                    }

                }



                // ==================================
// REQUESTED AN SIZE
// ==================================
//
// Product connection intelligence is
// authoritative for AN size.
//
// Checks both:
// - product title
// - Body (HTML) connection specs
//
// ==================================

if (intent.size) {

    const productConnections =
        v6GetProductConnections(
            item.product
        );

    const hasRequestedSize =
        productConnections.some(
            connection =>
                connection.type === "an" &&
                Number(connection.size) ===
                    Number(intent.size)
        );

    if (!hasRequestedSize) {

        return false;

    }

}

// ==================================
// REQUESTED AN GENDER
// ==================================
//
// Generic fitting query:
//
// -6AN female fitting
//
// MUST contain an actual -6 female
// AN connection.
//
// Do NOT infer gender from:
// "to male"
// "mates with female"
// or other nearby wording.
//
// ==================================

if (
    intent.anGender === "male" ||
    intent.anGender === "female"
) {

    const productConnections =
        v6GetProductConnections(
            item.product
        );


    const hasRequestedGender =
        productConnections.some(
            connection =>
                connection.type === "an" &&
                Number(connection.size) === Number(intent.size) &&
                connection.gender ===
                    intent.anGender
        );


    if (
        !hasRequestedGender
    ) {

        return false;

    }

}

                // ==================================
                // REJECT SPECIALISED FAMILIES
                // ==================================

                        // ==================================
// REJECT SPECIALISED FAMILIES
// ==================================
//
// Generic fitting queries should reject
// clearly specialised fitting families.
//
// Hose ends / hose tails are allowed here
// when they have already passed the exact
// requested AN size + gender checks above.
//
// This keeps generic fitting searches
// useful without weakening the other
// family protections.
//
// ==================================

if (
    title.includes("tee") ||
    title.includes("t-piece") ||
    title.includes("t piece") ||
    title.includes("union") ||
    (
        title.includes("y-block") ||
        title.includes("y block")
    ) &&
    !(
        intent.raw.includes("y block") ||
        intent.raw.includes("y-block")
    ) ||
    title.includes("adapter") ||
    title.includes("adaptor") ||
    title.includes("elbow") ||
    title.includes("bulkhead") ||
    title.includes("reducer") ||
    title.includes("expander") ||
    title.includes("cap") ||
    title.includes("plug") ||
    title.includes("blanking") ||
    title.includes("weld bung") ||
    title.includes("weld-on bung") ||
    title.includes("valve") ||
    title.includes("clamp") ||
    title.includes("firesleeve") ||
    title.includes("heat sleeve") ||
    (
        title.includes("degree") &&
        !intent.angle
    ) ||
    title.includes("port")
) {

    return false;

}


                // ==================================
// MUST BE A FITTING PRODUCT
// ==================================
//
// Genuine fitting products in this
// catalogue are normally classified
// as SPEEDFLOW FITTINGS.
//
// Product Type is the strongest signal.
//
// Title terminology is only used as a
// secondary fallback.
//
// ==================================

const isFittingProduct =
    productType.includes("fitting") ||
    title.includes("fitting") ||
    title.includes("flare fitting") ||
    title.includes("male to") ||
    title.includes("female to") ||
    title.includes("y-block") ||
    title.includes("y block");


if (
    !isFittingProduct
) {

    return false;

}


return true;

            }
        );

}

    // ======================================
    // V6 FINAL RESULTS
    // ======================================

console.log(
    "V6 FINAL RESULTS:",
    finalResults.slice(
        0,
        5
    )
);


console.table(
    finalResults.slice(
        0,
        10
    ).map(
        item => ({
            sku:
                item.product?.["Variant SKU"],

            title:
                item.product?.Title,

            score:
                item.score
        })
    )
);

return finalResults
    .filter(
        result =>
            result.score > -999999
    )
    .slice(
        0,
        5
    );

}


// ======================================
// BROWSER EXPORTS
// ======================================

window.ssrAnalyseQueryV6 =
    ssrAnalyseQueryV6;


window.ssrScoreProductV6 =
    ssrScoreProductV6;


window.ssrSearchV6 =
    ssrSearchV6;

console.log(
    "SSRACETECH V6 READY"
);


// ======================================
// V6 PARTS FINDER UI
// ======================================


// ======================================
// V6 CHAT CONVERSATION STATE
// ======================================

let v6ConversationQuery = "";


function sendMessage() {

    const input =
        document.getElementById(
            "userInput"
        );

    const messages =
        document.getElementById(
            "messages"
        );

    if (
        !input ||
        !messages
    ) {
        return;
    }


    const query =
        input.value.trim();

    if (
        !query
    ) {
        return;
    }


        // ==================================
    // V6 CONVERSATIONAL FOLLOW-UP
    // ==================================

    let searchQuery =
        query;


    // ==================================
    // ANGLE FOLLOW-UP
    // ==================================

    const angleFollowUp =
        /^(?:make it|change it to|change to|make that|set it to)\s+(?:a\s+)?(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?$/i
            .test(
                query
            );


    // ==================================
    // GENDER FOLLOW-UP
    // ==================================

    const genderFollowUp =
        /^(?:make it|change it to|change to|make that|set it to)\s+(male|female)$/i
            .test(
                query
            );


    // ==================================
    // AN SIZE FOLLOW-UP
    // ==================================

    const sizeFollowUp =
        /^(?:make it|change it to|change to|make that|set it to)\s+(-\d+)\s*(?:an)?$/i
            .test(
                query
            );


    // ==================================
    // FITTING TYPE FOLLOW-UP
    // ==================================

    const fittingTypeFollowUp =
        /^(?:make it|change it to|change to|make that|set it to)\s+(?:a\s+)?(?:90|45|30|60|120|135|150|180)\s*(?:degree|degrees|deg)?\s+(?:hose end|hose tail|fitting)$/i
            .test(
                query
            );


    // ==================================
    // APPLY FOLLOW-UP
    // ==================================

    if (
        v6ConversationQuery &&
        (
            angleFollowUp ||
            genderFollowUp ||
            sizeFollowUp ||
            fittingTypeFollowUp
        )
    ) {

        // ----------------------------------
        // ANGLE
        // ----------------------------------

        if (
            angleFollowUp
        ) {

            searchQuery =
                v6ConversationQuery
                    .replace(
                        /\b(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)?\b/gi,
                        ""
                    )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim() +
                " " +
                query;

        }


                // ----------------------------------
        // GENDER
        // ----------------------------------

        else if (
    genderFollowUp
) {

    const requestedGender =
        query.match(
            /\b(male|female)\b/i
        );

    if (
        requestedGender
    ) {

        searchQuery =
            v6ConversationQuery
                .replace(
                    /\b(?:male|female)\b/gi,
                    ""
                )
                .replace(
                    /\s+/g,
                    " "
                )
                .replace(
                    /\bfitting\b/i,
                    requestedGender[1] + " fitting"
                )
                .trim();

    }

}


        // ----------------------------------
        // AN SIZE
        // ----------------------------------

        else if (
    sizeFollowUp
) {

    const requestedSize =
        query.match(
            /(-\d+)\s*(?:an)?/i
        );

    if (
        requestedSize
    ) {

        searchQuery =
            v6ConversationQuery
                .replace(
                    /-\d+\s*(?:an)?\b/gi,
                    requestedSize[1] + "AN"
                );

    }

}


        // ----------------------------------
        // FITTING TYPE
        // ----------------------------------

        else if (
            fittingTypeFollowUp
        ) {

            searchQuery =
                v6ConversationQuery +
                " " +
                query;

        }

    }


    // ==================================
    // SHOW USER MESSAGE
    // ==================================


        // ==================================
    // SHOW USER MESSAGE
    // ==================================

    const userMessage =
        document.createElement(
            "div"
        );

    userMessage.className =
        "user";

    userMessage.textContent =
        query;

    messages.appendChild(
        userMessage
    );


    // ==================================
    // CLEAR INPUT
    // ==================================

    input.value = "";


    // ==================================
    // CREATE AI RESPONSE
    // ==================================

    const resultsBox =
        document.createElement(
            "div"
        );

    resultsBox.className =
        "bot";


    // ==================================
    // V6 CONVERSATION UPDATE
    // ==================================

    ssrUpdateConversation(query);

    const nextQuestion =
        ssrGetNextQuestion();

    if (nextQuestion) {

        resultsBox.innerHTML =
            "<div class=\"ai-summary\">" +
            "<strong>SS RACETECH AI</strong>" +
            "<p>" +
            nextQuestion +
            "</p>" +
            "</div>";

        messages.appendChild(
            resultsBox
        );

        messages.scrollTop =
            messages.scrollHeight;

        return;

    }


    // ==================================
// V6 CONVERSATION BRIDGE
// ==================================

const uiConnection =
    ssrConversation &&
    ssrConversation.requirements &&
    Array.isArray(ssrConversation.requirements.connections)
        ? ssrConversation.requirements.connections.find(
            connection =>
                connection.from === "fuel_rail" &&
                connection.to === "hose" &&
                connection.status === "complete" &&
                connection.fromSize &&
                connection.fromType &&
                connection.hoseSize
        )
        : null;

if (
    uiConnection &&
    uiConnection.fromType === "an" &&
    uiConnection.fromGender
) {

    const fittingSideGender =
        uiConnection.fromGender === "female"
            ? "male"
            : "female";

    searchQuery =
        uiConnection.fromSize +
        "AN " +
        fittingSideGender +
        " to " +
        uiConnection.hoseSize +
        "AN";

    console.log(
        "V6 UI CONVERSATION BRIDGE:",
        searchQuery
    );
}

// ==================================
// V6 INTELLIGENCE
// ==================================

console.log(
    "V6 CHAT SEARCH QUERY:",
    searchQuery
);

const intent =
    ssrAnalyseQueryV6(
        searchQuery
    );

const bridgeAngleMatch =
    String(searchQuery || "").match(
        /\b(30|45|60|90|120|135|150|180)\s*(?:degree|degrees|deg)\b/i
    );

const bridgeRequestedAngle =
    bridgeAngleMatch
        ? Number(bridgeAngleMatch[1])
        : null;

const results =
      (
          uiConnection &&
          typeof ssrSimpleBridgeSearch === "function"
      )
          ? ssrSimpleBridgeSearch(
                uiConnection.hoseSize,
                uiConnection.fromGender === "female"
                    ? "male"
                    : "female",
                bridgeRequestedAngle,
                20
            )
          : ssrSearchV6(
              searchQuery
          );


    // ==================================
    // REMEMBER LAST SUCCESSFUL REQUEST
    // ==================================

    if (
        results &&
        results.length
    ) {

        v6ConversationQuery =
            searchQuery;

    }


        // ==================================
    // NO RESULTS
    // ==================================

    if (
        !results ||
        !results.length
    ) {

        const clarificationQuestion =
            typeof ssrGetNextQuestion === "function"
                ? ssrGetNextQuestion()
                : null;

        if (clarificationQuestion) {

            resultsBox.innerHTML =
                "<div class=\"ai-summary\">" +

                "<strong>SS RACETECH AI</strong>" +

                "<p>" +
                clarificationQuestion +
                "</p>" +

                "</div>";

            messages.appendChild(
                resultsBox
            );

            messages.scrollTop =
                messages.scrollHeight;

            return;

        }

        resultsBox.innerHTML =
            "<div class=\"ai-summary\">" +

            "<strong>SS RACETECH AI</strong>" +

            "<p>" +
            "I couldn't find a matching part for " +
            "<span class=\"highlight\">" +
            searchQuery.replace(
                /</g,
                "&lt;"
            ) +
            "</span>." +
            "</p>" +

            "<p>" +
            "Try giving me an AN size, connection type, " +
            "angle, NPT size, fitting type, or vehicle/engine." +
            "</p>" +

            "</div>";

        messages.appendChild(
            resultsBox
        );

        messages.scrollTop =
            messages.scrollHeight;

        return;

    }


    // ==================================
    // AI SUMMARY
    // ==================================

    let summary =
        "<div class=\"ai-summary\">" +

        "<strong>SS RACETECH AI</strong>";


    // ==================================
    // CONNECTION REQUEST
    // ==================================

    if (
        intent.connectionDirection
    ) {

        summary +=
            "<p>" +
            "Yep ? I found " +
            "<span class=\"highlight\">" +
            results.length +
            "</span> matching connection" +
            (
                results.length === 1
                    ? ""
                    : "s"
            ) +
            " for you.</p>";

    }


    // ==================================
    // FITTING REQUEST
    // ==================================

    else if (
        intent.fittingType
    ) {

        const fittingName =
            intent.fittingType
                .replace(
                    /_/g,
                    " "
                );

        summary +=
            "<p>" +
            "Yep ? I found " +
            "<span class=\"highlight\">" +
            results.length +
            "</span> matching " +
            fittingName +
            (
                results.length === 1
                    ? ""
                    : "s"
            ) +
            ".</p>";

    }


    // ==================================
    // GENERAL REQUEST
    // ==================================

    else {

        summary +=
            "<p>" +
            "I found " +
            "<span class=\"highlight\">" +
            results.length +
            "</span> matching part" +
            (
                results.length === 1
                    ? ""
                    : "s"
            ) +
            ".</p>";

    }


    // ==================================
    // REQUEST DETAILS
    // ==================================

    let requestDetails =
        "";


    if (
        intent.size
    ) {

        requestDetails +=
            "<span class=\"highlight\">" +
            intent.size +
            "AN" +
            "</span>";

    }


    if (
        intent.anGender
    ) {

        requestDetails +=
            " " +
            intent.anGender;

    }


    if (
        intent.connectionDirection ===
        "an_to_an" &&
        intent.toSize
    ) {

        requestDetails +=
            " ? " +
            "<span class=\"highlight\">" +
            intent.toSize +
            "AN" +
            "</span>";

        if (
            intent.toAnGender
        ) {

            requestDetails +=
                " " +
                intent.toAnGender;

        }

    }


    if (
        intent.connectionDirection ===
        "an_to_npt"
    ) {

        if (
            intent.nptSize
        ) {

            requestDetails +=
                " ? " +
                "<span class=\"highlight\">" +
                intent.nptSize +
                " NPT";

            if (
                intent.nptGender
            ) {

                requestDetails +=
                    " " +
                    intent.nptGender;

            }

            requestDetails +=
                "</span>";

        }

    }


    if (
        intent.connectionDirection ===
        "npt_to_an"
    ) {

        if (
            intent.nptSize
        ) {

            requestDetails =
                "<span class=\"highlight\">" +
                intent.nptSize +
                " NPT";

            if (
                intent.nptGender
            ) {

                requestDetails +=
                    " " +
                    intent.nptGender;

            }

            requestDetails +=
                "</span>" +
                " ? " +
                "<span class=\"highlight\">" +
                intent.size +
                "AN";

            if (
                intent.anGender
            ) {

                requestDetails +=
                    " " +
                    intent.anGender;

            }

            requestDetails +=
                "</span>";

        }

    }


    if (
        intent.angle
    ) {

        requestDetails +=
            " ? " +
            "<span class=\"highlight\">" +
            intent.angle +
            "?" +
            "</span>";

    }


    if (
        requestDetails
    ) {

        summary +=
            "<p>Request: " +
            requestDetails +
            "</p>";

    }


    summary +=
        "<p>" +
        "Here are the closest matches from SS Racetech:" +
        "</p>" +

        "</div>";


    resultsBox.innerHTML =
        summary;


    // ==================================
    // PRODUCT CARDS
    // ==================================

    results.forEach(
        (result, index) => {

            const product =
                result.product || {};


            const title =
                product["Title"] ||
                "Unknown Product";


            const handle =
                product["Handle"] ||
                "";


            const price =
                product["Variant Price"] ||
                product["Price"] ||
                "";


            const sku =
                product["Variant SKU"] ||
                product["SKU"] ||
                "";


            const image =
                product["Image Src"] ||
                product["Image"] ||
                "";


            const productBox =
                document.createElement(
                    "div"
                );

            productBox.className =
                "product-card";


            let html =
                "";


            // ==================================
            // BEST MATCH LABEL
            // ==================================

            if (
                index === 0
            ) {

                html +=
                    "<div class=\"best-match\">" +
                    "?? BEST MATCH" +
                    "</div>";

            }


            // ==================================
            // PRODUCT IMAGE
            // ==================================

            if (
                image
            ) {

                html +=
                    "<img src=\"" +
                    image +
                    "\" alt=\"" +
                    title.replace(
                        /"/g,
                        "&quot;"
                    ) +
                    "\">";

            }


            // ==================================
            // PRODUCT TITLE
            // ==================================

            html +=
                "<strong>" +
                title +
                "</strong>";


            // ==================================
            // SKU
            // ==================================

            if (
                sku
            ) {

                html +=
                    "<br><small>SKU: " +
                    sku +
                    "</small>";

            }


            // ==================================
            // PRICE
            // ==================================

            if (
                price
            ) {

                html +=
                    "<br><br><strong>$" +
                    price +
                    "</strong>";

            }


            // ==================================
            // PRODUCT LINK
            // ==================================

            if (
                handle
            ) {

                html +=
                    "<br><br>" +
                    "<a class=\"product-button\" href=\"/products/" +
                    handle +
                    "\" target=\"_blank\">" +
                    "View Product ?" +
                    "</a>";

            }


            productBox.innerHTML =
                html;


            resultsBox.appendChild(
                productBox
            );

        }
    );


    // ==================================
    // APPEND RESPONSE
    // ==================================

    messages.appendChild(
        resultsBox
    );


    // ==================================
    // SCROLL
    // ==================================

    messages.scrollTop =
        messages.scrollHeight;

}
window.sendMessage =
    sendMessage;


























































// ============================================================
// SS RACETECH SIMPLE BRIDGE SEARCH
// ============================================================

function ssrSimpleBridgeSearch(
    anSize,
    requiredGender = null,
    requestedAngle = null,
    limit = 20
) {

    const requested =
        String(anSize || "")
            .replace(/[^0-9]/g, "");

    if (!requested) return [];

    const sizePattern =
        new RegExp(
            "(^|\\s|-)\\-" + requested + "(?:AN)?\\b",
            "i"
        );

    const candidates =
        ssrV5Products
            .filter(p => {

                const title =
                    String(
                        p.Title ||
                        p.title ||
                        ""
                    );

                const lower =
                    title.toLowerCase();

                const isHoseEnd =
                    lower.includes("hose end") ||
                    lower.includes("hose-end") ||
                    lower.includes("hoseend") ||
                    lower.includes("hose tail") ||
                    lower.includes("hose-tail");

                if (
                    !isHoseEnd ||
                    !sizePattern.test(title)
                ) {
                    return false;
                }

                if (!requiredGender) {
                    return true;
                }

                const connections =
                    v6GetProductConnections(p);

                const matchingAN =
                    connections.filter(
                        connection =>
                            connection.type === "an" &&
                            connection.size === "-" + requested
                    );

                if (!matchingAN.length) {
                    return false;
                }

                return matchingAN.some(
                    connection =>
                        connection.gender === requiredGender ||
                        !connection.gender
                );
            });

    if (requestedAngle) {

        const angle =
            Number(
                requestedAngle
            );

        if (angle) {

            const anglePattern =
                new RegExp(
                    "(^|\\s|\\()" +
                    angle +
                    "\\s*(?:degree|degrees|deg)?",
                    "i"
                );

            candidates.sort(
                (a, b) => {

                    const aTitle =
                        String(
                            a.Title ||
                            a.title ||
                            ""
                        );

                    const bTitle =
                        String(
                            b.Title ||
                            b.title ||
                            ""
                        );

                    const aMatch =
                        anglePattern.test(
                            aTitle
                        );

                    const bMatch =
                        anglePattern.test(
                            bTitle
                        );

                    if (
                        aMatch &&
                        !bMatch
                    ) {
                        return -1;
                    }

                    if (
                        !aMatch &&
                        bMatch
                    ) {
                        return 1;
                    }

                    return 0;
                }
            );
        }
    }

    return candidates.slice(0, limit);
}



















