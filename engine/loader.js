// ======================================
// SSRACETECH PRODUCT LOADER
// ======================================

function loadProducts() {

    return Promise.all([

        fetch("products_export_1.csv")
            .then(response => response.text()),

        fetch("data/product-intelligence.json")
            .then(response => response.json())

    ])

    .then(([csvData, intelligence]) => {

        function parseCSV(text) {

            const rows = [];
            let row = [];
            let value = "";
            let insideQuotes = false;

            for (let i = 0; i < text.length; i++) {

                const char = text[i];

                if (char === '"') {

                    if (
                        insideQuotes &&
                        text[i + 1] === '"'
                    ) {
                        value += '"';
                        i++;
                    }

                    else {
                        insideQuotes = !insideQuotes;
                    }

                }

                else if (
                    char === "," &&
                    !insideQuotes
                ) {

                    row.push(value);
                    value = "";

                }

                else if (
                    char === "\n" &&
                    !insideQuotes
                ) {

                    row.push(value);
                    rows.push(row);

                    row = [];
                    value = "";

                }

                else {

                    value += char;

                }

            }

            if (
                value ||
                row.length
            ) {

                row.push(value);
                rows.push(row);

            }

            const headers =
                rows[0];

            return rows
                .slice(1)
                .map(row => {

                    const product = {};

                    headers.forEach(
                        (header, index) => {

                            product[header] =
                                row[index] || "";

                        }
                    );

                    return product;

                });

        }


        // ======================================
        // PARSE SHOPIFY CSV
        // ======================================

        const rawProducts =
            parseCSV(csvData);


        // ======================================
        // DEDUPLICATE SHOPIFY PRODUCTS
        // ======================================

        const productMap =
            new Map();


        rawProducts.forEach(
            product => {

                const handle =
                    String(
                        product.Handle || ""
                    ).trim();


                // Ignore rows without
                // a real product handle/title

                if (
                    !handle ||
                    !product.Title
                ) {
                    return;
                }


                // Keep the first complete
                // product record for each handle

                if (
                    !productMap.has(handle)
                ) {

                    productMap.set(
                        handle,
                        product
                    );

                }

            }
        );


        const products =
            Array.from(
                productMap.values()
            );


        // ======================================
        // BUILD INTELLIGENCE LOOKUP
        // ======================================

        const intelligenceMap =
            new Map();


        intelligence.forEach(
            record => {

                const handle =
                    String(
                        record.handle || ""
                    ).trim();


                if (handle) {

                    intelligenceMap.set(
                        handle,
                        record
                    );

                }

            }
        );


        // ======================================
        // LINK INTELLIGENCE TO PRODUCTS
        // ======================================

        let intelligenceMatches = 0;
        let intelligenceMissing = 0;


        products.forEach(
            product => {

                const handle =
                    String(
                        product.Handle || ""
                    ).trim();


                const productIntelligence =
                    intelligenceMap.get(
                        handle
                    );


                if (
                    productIntelligence
                ) {

                    product.ssrIntelligence =
                        productIntelligence;

                    intelligenceMatches++;

                }

                else {

                    product.ssrIntelligence =
                        null;

                    intelligenceMissing++;

                }

            }
        );


        // ======================================
        // DATABASE DEBUG
        // ======================================

        console.log(
            "✅ CSV ROWS:",
            rawProducts.length
        );

        console.log(
            "✅ UNIQUE PRODUCTS:",
            products.length
        );

        console.log(
            "🧠 INTELLIGENCE RECORDS:",
            intelligence.length
        );

        console.log(
            "🧠 INTELLIGENCE MATCHES:",
            intelligenceMatches
        );

        console.log(
            "⚠️ INTELLIGENCE MISSING:",
            intelligenceMissing
        );


        // ======================================
        // EXPOSE INTELLIGENCE DATABASE
        // ======================================

        window.ssrProductIntelligence =
            intelligence;


        return products;

    });

}


// ======================================
// SSRACETECH DATABASE INITIALISATION
// ======================================

loadProducts()

.then(products => {

    window.ssrV5Products =
        products;


    console.log(
        "🏁 SSRACETECH DATABASE READY:",
        ssrV5Products.length,
        "products"
    );

})

.catch(error => {

    console.error(
        "❌ SSRACETECH DATABASE LOAD FAILED:",
        error
    );

});