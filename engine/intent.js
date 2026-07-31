// ======================================
// SSRACETECH INTENT ENGINE
// ======================================

function detectIntent(search) {

    const q = search.toLowerCase().trim();

    return {

        starter:
            q.includes("starter"),

        alternator:
            q.includes("alternator"),

        intake:
            q.includes("intake") ||
            q.includes("manifold"),

        transmission:
            q.includes("transmission") ||
            q.includes("4l60") ||
            q.includes("4l80") ||
            q.includes("700r4"),

        speedflow:
            q.includes("speedflow"),

        proflow:
            q.includes("proflow"),

        arp:
            q.includes("arp"),

        silicone:
            q.includes("silicone"),

        hose:
            q.includes("hose"),

        bend:
            q.includes("bend"),

        reducer:
            q.includes("reducer"),

        joiner:
            q.includes("joiner"),

        ford:
            q.includes("ford") ||
            q.includes("289") ||
            q.includes("302") ||
            q.includes("351") ||
            q.includes("429") ||
            q.includes("460"),

        holden:
            q.includes("holden") ||
            q.includes("commodore") ||
            q.includes("253") ||
            q.includes("304") ||
            q.includes("308"),

        ls:
            q.includes("ls") ||
            q.includes("ls1") ||
            q.includes("ls2") ||
            q.includes("ls3") ||
            q.includes("ls6") ||
            q.includes("lsx"),

        chevrolet:
            q.includes("chevrolet") ||
            q.includes("chevy") ||
            q.includes("gm")

    };

}