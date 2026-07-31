// ======================================
// SSRACETECH PRODUCT LOADER
// ======================================

function loadProducts() {

    return fetch("products_export_1.csv")

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

            if (value || row.length) {

                row.push(value);
                rows.push(row);

            }

            const headers = rows[0];

            return rows.slice(1).map(row => {

                const product = {};

                headers.forEach((header, index) => {

                    product[header] = row[index] || "";

                });

                return product;

            });

        }

        const products = parseCSV(data);

        console.log("✅ Products loaded:", products.length);

        return products;

    });

}