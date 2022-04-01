//Want to add border to bottom of navbar when scroll

window.addEventListener("load", function () {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 10) {
            document.getElementsByTagName("nav")[0].classList.add("scrolling");
        } else {
            document.getElementsByTagName("nav")[0].classList.remove("scrolling");
        }

    });
    
    
    


});
