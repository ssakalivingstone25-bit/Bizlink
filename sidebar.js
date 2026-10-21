// =====================================
// SIDEBAR COLLAPSE BUTTON
// =====================================


function toggleSidebar(){


    const sidebar =
    document.getElementById("sidebar");


    const main =
    document.getElementById("mainContent");


    if(!sidebar){
        return;
    }


    sidebar.classList.toggle("collapsed");


    if(main){

        main.classList.toggle("expanded");

    }


}







// =====================================
// GLOBAL SIDEBAR DRAG RESIZE
// =====================================


document.addEventListener(
"DOMContentLoaded",
function(){


    const sidebar =
    document.getElementById("sidebar");


    const resizeHandle =
    document.getElementById("sidebarResize");



    const main =
    document.getElementById("mainContent");



    if(!sidebar || !resizeHandle){

        return;

    }





    let isResizing = false;





    resizeHandle.addEventListener(
    "mousedown",
    function(e){


        isResizing = true;


        document.body.classList.add(
            "resizing"
        );


        e.preventDefault();


    });








    document.addEventListener(
    "mousemove",
    function(e){


        if(!isResizing){

            return;

        }



        let newWidth = e.clientX;





        // minimum width

        if(newWidth < 80){

            newWidth = 80;

        }




        // maximum width

        if(newWidth > 350){

            newWidth = 350;

        }





        sidebar.style.width =
        newWidth + "px";





        if(main){

            main.style.marginLeft =
            newWidth + "px";

        }




        resizeHandle.style.left =
        newWidth + "px";



    });








    document.addEventListener(
    "mouseup",
    function(){


        if(isResizing){


            isResizing = false;


            document.body.classList.remove(
                "resizing"
            );


        }


    });







});