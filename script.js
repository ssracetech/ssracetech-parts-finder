const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let products = [];


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



    products = rows.slice(1).map(row => {


        let product = {};


        headers.forEach((header,index)=>{

            product[header] = row[index] || "";

        });


        return product;


    });



    console.log("Products loaded:", products.length);



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

    const results = products

        .map(product => {

            const title = (product.Title || "").toLowerCase();
            const sku = (product["Variant SKU"] || "").toLowerCase();

            let score = 0;

            // Count matching words
            const matches = words.filter(word =>
                title.includes(word) || sku.includes(word)
            );

            // No matches = ignore product
            if (matches.length === 0) {
                return null;
            }

            // Base score
            score += matches.length * 100;

            // Huge bonus if every search word matches
            if (matches.length === words.length) {
                score += 500;
            }

            // Exact phrase bonus
            if (title.includes(search)) {
                score += 300;
            }

            // SKU exact bonus
            if (sku === search) {
                score += 1000;
            }

            // Brand bonuses
            if (search.includes("speedflow") && title.includes("speedflow")) {
                score += 200;
            }

            if (search.includes("proflow") && title.includes("proflow")) {
                score += 200;
            }

            // LS bonus
            if (search.includes("ls1") && title.includes("ls1")) {
                score += 200;
            }

            // Starter bonus
            if (search.includes("starter") && title.includes("starter")) {
                score += 300;
            }

            // Hose end bonus
            if (search.includes("hose end") && title.includes("hose end")) {
                score += 200;
            }

            // AN size bonus
            const anMatch = search.match(/-\d+/);

            if (anMatch && title.includes(anMatch[0])) {
                score += 250;
            }

            return {
                product,
                score
            };

        })

        .filter(item => item !== null)

        .sort((a, b) => b.score - a.score)

        .slice(0, 3);

    if (results.length === 0) {
        return null;
    }

    let reply = "🏁 <strong>Here’s what I found:</strong><br><br>";

    results.forEach(item => {

        const product = item.product;

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

    <a href="https://racereadygear.com.au/products/${product.Handle}" target="_blank">
        🛒 View Product
    </a>

</div>

<br>

`;

    });

    return reply;

}



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