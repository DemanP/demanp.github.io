function zero_lead(number, length=2) {
    return number.toLocaleString('en-US', {minimumIntegerDigits: length, useGrouping: false});
}

function canvas_reader() {
    // constants
    const canvas = document.getElementById("chapter_viewer");
    const ctx = canvas.getContext("2d");

    // var canvas_width = window.innerWidth*0.8;
    var canvas_width = window.screen.width;
    var canvas_height = canvas_width*0.69232856884385742717568301067487;

    canvas.width = canvas_width;
    canvas.height = canvas_height;

    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;

    var chapter_path = "chapter01/";
    var chapter_pages = 30;
    var current_page_count = 0;

    function update_pages(page_change=0) {
        // TODO: make a check for page being valid

        current_page_count += page_change;
        current_page_count = Math.max(0, current_page_count);
        current_page_count = Math.min(chapter_pages, current_page_count);
        
        let formated_right = current_page_count.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        let page_right = formated_right+".png";

        let formated_left = (current_page_count+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
        let page_left = formated_left+".png";

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (current_page_count != 0) {
            draw_page(page_right, true);
        }
        draw_page(page_left);
        
        update_UI();

        console.log(current_page_count);
    }
    function update_UI() {
        let page_number_element = document.getElementById("page_number");
        page_number_element.innerHTML = String(current_page_count)+"-"+String(current_page_count+1);
    }
    function draw_page(page_path, right=false) {
        if(page_path=="") {return;}
        let position_x = ((right) ? canvas_width/2 : 0);

        let img = new Image();
        img.onload = function(){
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, position_x, 0, canvas_width/2, canvas_height);
        };
        img.src = chapter_path+page_path;
    }

    canvas.addEventListener('mousedown', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let page_change;
        if (x < canvas.scrollWidth*0.25) {
            page_change = 2;
        } else if (x > canvas.scrollWidth*0.75) {
            page_change = -2;
        } else {return;}
        update_pages(page_change);
    })

    update_pages()
}

function img_reader() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chapter = zero_lead(Number(urlParams.get('chapter')));
    const chapter_pages = 30;

    const img_page_left = document.getElementById("page_left");
    const img_page_right = document.getElementById("page_right");

    const chapter_path = `chapter${chapter}/`;


    {
        let chapter_label = document.getElementById("chapter_label");
        chapter_label.innerHTML = "Chapter " + chapter;
    }
    
    var current_page_count = 0;

    function update_pages(page_change=0) {
        img_page_right.style.opacity = 0;
        img_page_left.style.opacity = 0;

        current_page_count += page_change;
        current_page_count = Math.max(0, current_page_count);
        current_page_count = Math.min(chapter_pages, current_page_count);
        
        let formated_right = zero_lead(current_page_count);
        let page_right = formated_right+".png";

        let formated_left = zero_lead(current_page_count+1);
        let page_left = formated_left+".png";

        if (current_page_count != 0) {
            img_page_right.src = chapter_path+page_right;
            img_page_right.style.opacity = 100;
        }
        // else {}
        img_page_left.src = chapter_path+page_left;
        img_page_left.style.opacity = 100;
        
        update_UI();

        console.log(current_page_count);
    }
    function update_UI() {
        let page_number_element = document.getElementById("page_number");
        page_number_element.innerHTML = String(current_page_count+1)+"-"+String(current_page_count);
    }

    function page_clicked(e, pg, side) {
        const rect = pg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        // const y = e.clientY - rect.top;

        let page_change = 2*side;
        // if (x < pg.scrollWidth*0.5) {
        //     page_change = 2;
        // } else if (x > pg.scrollWidth*0.5) {
        //     page_change = -2;
        // } else {return;}
        if (((x*2)-pg.scrollWidth)*side<0) update_pages(page_change);
    }

    img_page_left.addEventListener('mousedown', function(e) {
        page_clicked(e, img_page_left, 1);
    })
    img_page_right.addEventListener('mousedown', function(e) {
        page_clicked(e, img_page_right, -1);
    })

    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowLeft") {update_pages(2);}
        else if (e.key == "ArrowRight") {update_pages(-2);}
    })

    update_pages()
}

img_reader()