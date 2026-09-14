// ==========================================
// SSRACETECH V4 SCORING ENGINE
// ==========================================


function ssrScoreProduct(product, query){

    let score = 0;


    const title = (
        product["Title"] || ""
    ).toLowerCase();


    const search = query
        .toLowerCase()
        .trim();



    // BASIC WORD MATCH TEST

    const words = search.split(" ");


    words.forEach(word => {

        if(
            word.length > 2 &&
            title.includes(word)
        ){

            score += 1000;

        }

    });



    // BRAND BOOST

    if(title.includes("speedflow")){

        score += 500;

    }


    if(title.includes("proflow")){

        score += 500;

    }



    return score;

}



window.ssrScoreProduct = ssrScoreProduct;