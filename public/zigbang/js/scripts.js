/**
 * Created by son on 2017-02-07.
 */

window.onload = function(){
    var container = document.getElementById('map');
    var map_x_pos = 126.987150296;
    var map_y_pos = 37.5686328309;
    var options = {
        center: new daum.maps.LatLng(map_y_pos,map_x_pos ),
        level: 3,
        draggable : true,
        scrollwheel : true
    };
    var map = new daum.maps.Map(container, options);
    var content = '<div style="width:53px;height:53px;border-radius:27px;background-color:#f3ad79;opacity:0.8"></div>';
    var marker = new daum.maps.CustomOverlay({
        position: new daum.maps.LatLng(map_y_pos,map_x_pos ),
        content : content
    });

    marker.setMap(map);

    var btn_view_map = document.getElementById("btn_view_map");
    var btn_view_road = document.getElementById("btn_view_road");

    attachEvent(btn_view_map,"click",function(e){
        e.preventDefault();
        window.open("http://map.daum.net/link/map/"+map_y_pos+","+map_x_pos);
    });

    attachEvent(btn_view_road,"click",function(e){
        e.preventDefault();
        window.open("http://map.daum.net/link/roadview/"+map_y_pos+","+map_x_pos);
    });

    var imgList02 = imagesSlider(document.getElementById("thumbList02"));
    var imgList = imagesSlider(document.getElementById("thumbList") ,{
        onClick : function(items, currentIdx){
            popup();
            imgList02.resize();
            imgList02.moveStep(currentIdx);
        }
    });

    var popAnimFlag = false;
    var btn_pop_close = document.getElementById("btn_pop_close");
    attachEvent(btn_pop_close,"click",function(e){
        e.preventDefault();
        popup();
    });

    appendData();

    function appendData(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText).datas.building;
                var building_data = document.getElementById("building_data");
                var image = new Image();
                image.src = data.img;
                image.width = 120;
                image.height = 120;
                image.alt = data.name;
                building_data.querySelector("#b_img").appendChild(image);
                building_data.querySelector("#b_name").innerHTML = data.name;
                building_data.querySelector("#b_address").innerHTML = data.address1 + data.address2 + data.address3;
                building_data.querySelector("#b_floor").innerHTML = data.floor;
                building_data.querySelector("#b_rooms").innerHTML = data.rooms;
                building_data.querySelector("#b_eatablish").innerHTML = data.established;
            }
        };
        xhttp.open("GET", "/zigbang_json", true);
        xhttp.send();
    }

    function popup(){
        if(popAnimFlag) return;
        popAnimFlag = true;
        var pop  = document.getElementById("pop");
        if(pop.className == "pop open"){
            pop.className = "pop";
            setTimeout(function(){
                pop.className = "pop close";
                popAnimFlag = false;
            },400);
        }else{
            pop.className = "pop";
            setTimeout(function(){
                pop.className = "pop open";
                popAnimFlag = false;
            },400);
        }
    }
}

function attachEvent(element, event, callbackFunction) {
    if (element.addEventListener) {
        element.addEventListener(event, callbackFunction, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, callbackFunction);
    }
}
