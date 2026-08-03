// ================================
// SSRACETECH PRODUCT DISPLAY V1
// ================================


function ssrCreateProductCard(product, score){


    const title = product["Title"] || "Product";

    const sku = product["Variant SKU"] || "N/A";

    const price = product["Variant Price"]
        ? "$" + product["Variant Price"]
        : "Contact us";


    const image = product["Image Src"]
        ? product["Image Src"]
        : "";


    const handle = product["Handle"] || "";


    const url = handle
        ? "https://racereadygear.com.au/products/" + handle
        : "#";



    return `

<div class="product-card">


${image ? `
<img 
src="${image}" 
class="product-image"
>
` : ""}



<h3>
${title}
</h3>


<p>
<strong>SKU:</strong> ${sku}
</p>


<p>
<strong>PRICE:</strong> ${price}
</p>


<p>
<strong>MATCH:</strong><br>
⭐⭐⭐⭐⭐ Excellent Match
</p>


<a 
href="${url}"
target="_blank"
class="product-button"
>
VIEW PRODUCT
</a>


</div>


`;

}



window.ssrCreateProductCard = ssrCreateProductCard;