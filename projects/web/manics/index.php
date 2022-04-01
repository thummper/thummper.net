<!DOCTYPE html>
<html>

<head>
    <title> Manic Street Preachers</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/style.css" />
    <script src="https://unpkg.com/masonry-layout@4.2.2/dist/masonry.pkgd.min.js"></script>
</head>

<body>
    <div class="splash">
        <div class="splashTitle">
            <div class="splashText"> MANIC STREET PREACHERS</div>
            <div class="splashBG"></div>

        </div>

    </div>
    <nav>
        <div class="navWrapper">
            <a href="#"> NEWS </a>
            <a href="#"> MUSIC </a>
            <a href="#"> PHOTOS </a>
            <a href="#"> VIDEOS </a>
            <a href="#"> TOURS </a>
            <a href="javascript:void(0);" class="icon" onclick="navCollapse(this)">
                <i class="fa fa-bars"></i>
            </a>
        </div>
    </nav>
    <main>

        <div class="section" id="music">
            <div class="sectionTitle">
                <div class="text"> MUSIC </div>
                <div class="line"></div>
            </div>

            <div class="musicGrid">
                <div class="musicItem">
                    <div class="musicBackground"></div>
                    <div class="musicHover">
                        A DESIGN FOR LIFE (CD1)
                        <br>
                        1996
                    </div>
                </div>

                <div class="musicItem">
                    <div class="musicBackground"></div>
                    <div class="musicHover">
                        EVERYTHING MUST GO
                        <br>
                        1996
                    </div>
                </div>
                <div class="musicItem">
                    <div class="musicBackground"></div>
                    <div class="musicHover">
                        FOREVER DELAYED
                        <br>
                        2002
                    </div>
                </div>
                <div class="musicItem">
                    <div class="musicBackground"></div>
                    <div class="musicHover">
                        GENERATION TERRORISTS
                        <br>
                        1992
                    </div>
                </div>
                <div class="musicItem">
                    <div class="musicBackground"></div>
                    <div class="musicHover">
                        SEND AWAY THE TIGERS
                        <br>
                        2007
                    </div>
                </div>
                <div class="musicItem">
                    <div class="musicBackground"></div>
                    <div class="musicHover">
                        THIS IS MY TRUTH TELL ME YOURS
                        <br>
                        1998
                    </div>
                </div>
            </div>
        </div>

        <div class="section" id="music">
            <div class="sectionTitle">
                <div class="text"> NEWS </div>
                <div class="line"></div>
            </div>
            <div class="newsGrid">


                <a class="news" href="#">
                    <div class="newsImage" style="background-image: url('./assets/image/MSP_3_2_sns.webp')">

                    </div>
                    <div class="newsText">
                        <div class="newsTextInfo">
                            <div class="date">May 9th 2019</div>
                            <div class="title">MANIC STREET PREACHERS ANNOUNCE TWO TOKYO GIGS</div>
                            <div class="desc">The Manics will play two Japanese shows in September, at Zepp DiverCity
                                Tokyo on the 26th and Toyosu Pit on the 27th.</div>
                        </div>
                        <div class="newsTextBG"></div>
                    </div>
                </a>

                <a class="news" href="#">
                    <div class="newsImage" style="background-image: url('./assets/image/Splendour-2019.webp')">

                    </div>
                    <div class="newsText">
                        <div class="newsTextInfo">
                            <div class="date">January 25th 2019</div>
                            <div class="title">MANIC STREET PREACHERS TO HEADLINE SPLENDOUR FESTIVAL</div>
                            <div class="desc">Manic Street Preachers play Nottingham’s Nottingham Splendour Festival on Saturday July 20th.</div>
                        </div>
                        <div class="newsTextBG"></div>
                    </div>
                </a>


                <a class="news" href="#">
                    <div class="newsImage" style="background-image: url('./assets/image/tandm.webp')">

                    </div>
                    <div class="newsText">
                        <div class="newsTextInfo">
                            <div class="date">January 18th 2019</div>
                            <div class="title">WATCH TRUTH & MEMORY</div>
                            <div class="desc">For anyone who missed the premiere, watch Kieran Evans’ new Manic Street Preachers documentary ‘Truth & Memory’ in full on YouTube. </div>
                        </div>
                        <div class="newsTextBG"></div>
                    </div>
                </a>


                <a class="news" href="#">
                    <div class="newsImage" style="background-image: url('./assets/image/ttmt.jpg')">

                    </div>
                    <div class="newsText">
                        <div class="newsTextInfo">
                            <div class="date">December 12th 2018</div>
                            <div class="title">SHARE YOUR TRUTHS</div>
                            <div class="desc">Share your truths about the Manics’ No. 1 album ‘This Is My Truth Tell Me Yours’. thisismytruth.manicstreetpreachers.com.</div>
                        </div>
                        <div class="newsTextBG"></div>
                    </div>
                </a>




            </div>
        </div>
        <footer></footer>




    </main>
    <footer></footer>
</body>

<script>
    function navCollapse(button) {
        let nav = button.parentElement;
        console.log("Nav: ", nav);
        if (nav.className === "responsive") {
            nav.className = "";
        } else {
            nav.className = "responsive";
        }
    }




    /*  TEMPORARY - GIVE GRID ITEMS RANDOM BACKGROUND IMAGES */


    let images = [
        "assets/image/albumart/designforlife.jpg",
        "assets/image/albumart/everythingmustgo.jpg",
        "assets/image/albumart/foreverdelayed.jpg",
        "assets/image/albumart/generationterror.jpg",
        "assets/image/albumart/sendawaythe.jpg",
        "assets/image/albumart/thisismytruth.jpg"
    ];
    let musicItems = document.getElementsByClassName("musicItem");
    for (let item of musicItems) {
        if (images.length > 0) {
            let image = images[0];
            let src = "url('" + image + "')";
            console.log("SOURCE: ", src);
            let bg = item.getElementsByClassName("musicBackground")[0];
            bg.style.backgroundImage = src;
            images.splice(0, 1);
        }

    }



    let musicGrid = document.getElementsByClassName("musicGrid")[0];
    let musicMasonry = new Masonry(musicGrid, {
  
        itemSelector: '.musicItem',
        gutter: 8,
        fitWidth: true
    });


    let newsGrid = document.getElementsByClassName("newsGrid")[0];
    let newsMasonmy = new Masonry(newsGrid, {
        columnWidth: '.news',
        itemSelector: '.news',
        gutter: 20,
        fitWidth: true,
        horizontalOrder: true
    });
</script>

</html>