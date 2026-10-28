(function () {
    "use strict";

    function parseCSV(text) {
        text = text.replace(/^\uFEFF/, "");

        const rows = [];
        let row = [];
        let value = "";
        let quoted = false;

        for (let i = 0; i < text.length; i++) {
            const ch = text[i];

            if (ch === '"') {
                if (quoted && text[i + 1] === '"') {
                    value += '"';
                    i++;
                } else {
                    quoted = !quoted;
                }
            } else if (ch === "," && !quoted) {
                row.push(value);
                value = "";
            } else if ((ch === "\n" || ch === "\r") && !quoted) {
                if (ch === "\r" && text[i + 1] === "\n") i++;
                row.push(value);
                if (row.some(cell => cell !== "")) rows.push(row);
                row = [];
                value = "";
            } else {
                value += ch;
            }
        }

        if (value !== "" || row.length) {
            row.push(value);
            if (row.some(cell => cell !== "")) rows.push(row);
        }

        if (!rows.length) return [];

        const headers = rows[0].map(h => h.trim());

        return rows.slice(1).map(cells => {
            const record = {};
            headers.forEach((header, i) => {
                record[header] = cells[i] || "";
            });
            return record;
        });
    }

    async function loadV7Products() {
        const response = await fetch("products_export_1.csv");

        if (!response.ok) {
            throw new Error("Could not load products_export_1.csv (" +
                response.status + ")");
        }

        const csv = await response.text();
        const rows = parseCSV(csv);
        const productsByHandle = new Map();

        for (const row of rows) {
            const handle = (row.Handle || "").trim();
            if (!handle) continue;

            let product = productsByHandle.get(handle);

            if (!product) {
                if (!(row.Title || "").trim()) continue;

                product = {
                    handle,
                    title: row.Title.trim(),
                    description: row["Body (HTML)"] || "",
                    vendor: row.Vendor || "",
                    type: row.Type || "",
                    category: row["Product Category"] || "",
                    tags: row.Tags || "",
                    status: row.Status || "",
                    published: row.Published || "",
                    images: [],
                    variants: []
                };

                productsByHandle.set(handle, product);
            }

            const image = (row["Image Src"] || "").trim();

            if (image && !product.images.includes(image)) {
                product.images.push(image);
            }

            const sku = (row["Variant SKU"] || "").trim();
            const price = (row["Variant Price"] || "").trim();
            const option1 = (row["Option1 Value"] || "").trim();
            const option2 = (row["Option2 Value"] || "").trim();
            const option3 = (row["Option3 Value"] || "").trim();

            // Shopify may use additional rows for images.
            // Only add a variant when the row contains variant data.
            if (sku || price || option1 || option2 || option3) {
                const signature = [sku, price, option1, option2, option3].join("|");

                if (!product.variants.some(v => v.signature === signature)) {
                    product.variants.push({
                        signature,
                        sku,
                        price,
                        option1Name: row["Option1 Name"] || "",
                        option1,
                        option2Name: row["Option2 Name"] || "",
                        option2,
                        option3Name: row["Option3 Name"] || "",
                        option3,
                        image: (row["Variant Image"] || "").trim() || image,
                        barcode: row["Variant Barcode"] || "",
                        inventory: row["Variant Inventory Qty"] || ""
                    });
                }
            }
        }

        const products = Array.from(productsByHandle.values());

        // Attach structured intelligence to the existing live catalogue.
        // The Shopify CSV remains usable if this optional file is unavailable.
        let intelligenceMatched = 0;

        try {
            const intelligenceResponse = await fetch("data/product-intelligence.json");

            if (!intelligenceResponse.ok) {
                throw new Error(
                    "Could not load product-intelligence.json (" +
                    intelligenceResponse.status + ")"
                );
            }

            const intelligenceRecords = await intelligenceResponse.json();

            if (!Array.isArray(intelligenceRecords)) {
                throw new Error("Intelligence JSON is not an array.");
            }

            const intelligenceByHandle = new Map(
                intelligenceRecords
                    .filter(record => record && record.handle)
                    .map(record => [
                        String(record.handle).trim(),
                        record
                    ])
            );

            for (const product of products) {
                const record = intelligenceByHandle.get(product.handle);

                if (!record) continue;

                product.attributes = record.attributes || {};
                product.searchText = record.searchText || "";
                product.family = record.family || "";
                product.subtype = record.subtype || "";
                product.brand = record.brand || "";

                intelligenceMatched++;
            }

            console.log("V7 PRODUCT INTELLIGENCE LINKED", {
                intelligenceRecords: intelligenceRecords.length,
                catalogueProducts: products.length,
                matchedProducts: intelligenceMatched
            });
        } catch (error) {
            console.warn(
                "V7 intelligence unavailable; continuing with CSV catalogue:",
                error.message
            );
        }

        // Load the public Shopify collection directory separately.
        // This is optional and must never block product search.
        window.ssrV7Collections = [];

        try {
            const collectionsResponse = await fetch("data/collections.json");

            if (collectionsResponse.ok) {
                const collections = await collectionsResponse.json();

                if (Array.isArray(collections)) {
                    window.ssrV7Collections = collections.filter(collection =>
                        collection &&
                        typeof collection.title === "string" &&
                        typeof collection.url === "string" &&
                        /^https:\/\/racereadygear\.com\.au\/collections\/[a-z0-9-]+\/?$/i.test(collection.url)
                    );
                }
            }

            console.log("V7 COLLECTION DIRECTORY READY", {
                collections: window.ssrV7Collections.length
            });
        } catch (error) {
            console.warn("V7 collection directory unavailable:", error.message);
        }

        window.ssrV7Products = products;

        console.log("SS RACETECH V7 CATALOGUE READY", {
            csvRows: rows.length,
            uniqueProducts: products.length,
            variants: products.reduce((sum, p) => sum + p.variants.length, 0)
        });

        document.dispatchEvent(new Event("ssr-v7-catalogue-ready"));

        return products;
    }

    window.ssrV7Ready = loadV7Products().catch(error => {
        console.error("V7 catalogue load failed:", error);
        document.dispatchEvent(new CustomEvent("ssr-v7-catalogue-error", {
            detail: error.message
        }));
        throw error;
    });
})();
