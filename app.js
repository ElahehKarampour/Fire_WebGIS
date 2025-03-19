
// const map = new ol.Map({
//     target:"map",
//     view: new ol.View({
//         center: ol.proj.fromLonLat([51,32]),
//         zoom:5
//     }),
//     layers:[
//         new ol.layer.Tile({
//             source:new ol.source.OSM()
//         }),
//     ]
// });

//add Tile WMS layers
// const firelayer = [
//     new ol.layer.Tile({
//          name:'provinces',
//          source: new ol.source.TileWMS({
//             url:'http://localhost:8080/geoserver/wms',
//             params: {'LAYERS':'cite:fire_output2' , 'TILED':true},
//             servertype: 'geoserver',
//         }),
//    }),

//    new ol.layer.Tile({
//     name:'county',
//     source: new ol.source.TileWMS({
//        url:'http://localhost:8080/geoserver/wms',
//        params: {'LAYERS':'cite:Shahrestan' , 'TILED':true},
//        servertype: 'geoserver',

//         }),
//     })

// ];  


// const firelayer = [
//     new ol.layer.Tile({
//          name:'provinces',
//          source: new ol.source.TileWMS({
//             url:'http://localhost:8080/geoserver/wms',
//             params: {'LAYERS':'cite:fire_output2' , 'TILED':true},
//             serverType: 'geoserver',
//         }),
//    }),

//    new ol.layer.Tile({
//     name:'county',
//     source: new ol.source.TileWMS({
//        url:'http://localhost:8080/geoserver/wms',
//        params: {'LAYERS':'cite:Shahrestan' , 'TILED':true},
//        serverType: 'geoserver',

//         }),
//     })

// ]; 

// self.map.olMap.addLayer(firelayer);

// const wmsLayers = [];
// fetch('http://localhost:8000/wmslayers/')
//     .then(resp => resp.json())
//     .then(json => {
//         json.forEach((layer) => {
//             const olWmsLayer = new ol.layer.Tile({
//                 name: layer.alias,
//                 source: new ol.source.TileWMS({
//                     url: layer.url,
//                     params: { 'LAYERS': layer.name, 'TILED': true },
//                     serverType: 'geoserver',
//                 }),
              
//             });
//             wmsLayers.push(olWmsLayer);
//             map.addLayer(olWmsLayer);
//             console.log(`Layer added: ${olWmsLayer.name}`);

//             // Console log to show the name of the layer
//             console.log(`Layer added: ${layer.alias}`);
//         });
//         addLayerSwitcher();
//         addIdentify();
//     });

//  firelayer.forEach(
//     function(lyr){
//        map.addLayer(lyr);
//     }
//  );
const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: false, 
    title: 'OSM'
});

const maptilerSatelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=fPIIjcVSG9VhwxEtRNB6',
    }),
    visible: true,
    title: 'MapTiler Satellite'
});

const map = new ol.Map({
    target: "map",
    view: new ol.View({
        center: ol.proj.fromLonLat([51, 32]), 
        zoom: 5
    }),
    layers: [osmLayer, maptilerSatelliteLayer] 
});

const firelayer = [
    new ol.layer.Tile({
        name: 'سطح سوخته',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: { 'LAYERS': 'fire_proj:fire_output2', 'TILED': true , cql_filter:'acq_date BETWEEN 2023-11-21 AND 2024-11-21'},
            serverType: 'geoserver',
        }),
    }),
    new ol.layer.Tile({
        name: 'شهرستان',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: { 'LAYERS': 'fire_proj:shahrestan', 'TILED': true },
            serverType: 'geoserver',
        }),
    }),

    new ol.layer.Tile({
        name:'نقشه ریسک',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'fire_proj:final_clip', 'TILED': true},
            serverType: 'geoserver',

        }),
    }),

    new ol.layer.Tile({
        name:'استانها',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'fire_proj:irn_admbnda_adm1_unhcr_20190514', 'TILED': true},
            serverType: 'geoserver',

        }),
    })
];

firelayer.forEach(layer => map.addLayer(layer));


function updateLayer() {
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    let daynightValue = document.getElementById("daynight").value; 
    let satellitevalue = document.getElementById('satellite').value;
    let provinceValue = document.getElementById("adm1_en").value;
    // let countyValue = document.getElementById("county").value;

    if (!startDate || !endDate) {
        alert("لطفاً بازه زمانی را انتخاب کنید.");
        return;
    }

    // تاریخ‌ها را مستقیماً از input بگیریم بدون تغییر
    let formattedStartDate = startDate;
    let formattedEndDate = endDate;

    // ساخت CQL فیلتر برای تاریخ
    let filters = [`acq_date BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`];

    // اگر مقدار روز/شب انتخاب شده باشد، به فیلتر اضافه شود
    if (daynightValue) {
        filters.push(`daynight='${daynightValue}'`);
    }

    if (satellitevalue) {
        filters.push(`satellite = '${satellitevalue}'`);
    }

    if (provinceValue) {
        filters.push( `adm1_en ILIKE'${provinceValue}'`);
    }

    // if (countyValue) {
    //     filters.push(`county ILIKE'${countyValue}'`);
    // }

    let cqlFilter = filters.join(" AND ");
    console.log("🔍 CQL Filter:", cqlFilter);

    let selectedLayer = firelayer[0];

    if (selectedLayer && selectedLayer.getSource) {
        selectedLayer.getSource().updateParams({
            'CQL_FILTER': cqlFilter
        });
    } 
}


document.getElementById('basemapWMS').addEventListener('click', function () {
    osmLayer.setVisible(false); // مخفی کردن نقشه OSM
    maptilerSatelliteLayer.setVisible(true); // نمایش نقشه ماهواره‌ای
});

// // اضافه کردن رویداد برای دکمه "نقشه OSM"
document.getElementById('basemapOSM').addEventListener('click', function () {
    osmLayer.setVisible(true); // نمایش نقشه OSM
    maptilerSatelliteLayer.setVisible(false); // مخفی کردن نقشه ماهواره‌ای
});

// document.getElementById('basemapSelector').addEventListener('change', function(event) {
//     const selectedLayer = event.target.value;

//     osmLayer.setVisible(selectedLayer === 'OSM');
//     maptilerSatelliteLayer.setVisible(selectedLayer === 'WMS');
// });

//add layer switcher
const layerSwitcherIcon = document.querySelector('.icon.layer-switcher');
const layerSwitcherContent = document.getElementById('l');
const backgroundSelector = document.querySelector('.background'); // گرفتن المان انتخاب نقشه
let layerSwitcherIsOpen = false;
let layersLoaded = false;

// جلوگیری از بسته شدن هنگام کلیک داخل محتوای منو
layerSwitcherContent.addEventListener("click", (e) => e.stopPropagation());
backgroundSelector.addEventListener("click", (e) => e.stopPropagation());

layerSwitcherIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // جلوگیری از بسته شدن ناخواسته

    if (layerSwitcherIsOpen) {
        layerSwitcherContent.style.display = 'none';
        backgroundSelector.style.display = 'none'; // مخفی کردن انتخاب نقشه
    } else {
        if (!layersLoaded) {
            firelayer.forEach(lyr => {
                const lyrName = lyr.get('name');

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.id = lyrName;
                input.checked = true;

                input.addEventListener("click", function (e) {
                    e.stopPropagation();
                    const layer = map.getLayers().getArray().find(l => l.get('name') === lyrName);
                    if (layer) layer.setVisible(e.target.checked);
                });

                const label = document.createElement('label');
                label.setAttribute('for', lyrName);
                label.innerText = lyrName;
                const br = document.createElement('br');

                const inputSlider = document.createElement('input');
                inputSlider.type = 'range';
                inputSlider.min = '0';
                inputSlider.max = '1';
                inputSlider.step = '0.1';
                inputSlider.value = '1';

                inputSlider.addEventListener("input", function (e) {
                    e.stopPropagation();
                    const layer = map.getLayers().getArray().find(l => l.get('name') === lyrName);
                    if (layer) {
                        console.log('Setting opacity:', e.target.value);
                        layer.setOpacity(parseFloat(e.target.value));
                    }
                });

                layerSwitcherContent.appendChild(input);
                layerSwitcherContent.appendChild(label);
                layerSwitcherContent.appendChild(inputSlider);
                layerSwitcherContent.appendChild(br);
            });

            layersLoaded = true;
        }

        layerSwitcherContent.style.display = 'block';
        backgroundSelector.style.display = 'block'; // نمایش انتخاب نقشه
    }

    layerSwitcherIsOpen = !layerSwitcherIsOpen;
});




//add drawing intractions
const drawToggler = document.querySelector('.drawing-control__icon--toggler');
const drawButtons = document.querySelectorAll('.drawing-control__icon:not(.drawing-control__icon--toggler)');

let drawIsOpen = false;

function toggleDraw(){
    drawToggler.style.backgroundColor = drawIsOpen?'white':'white';
    drawButtons.forEach(function(btn){
        btn.style.display = drawIsOpen?'block':'none';
    });
    console.log('Draw toggled. Draw is open:', drawIsOpen); // Debugging
    drawIsOpen =! drawIsOpen;
}
drawToggler.onclick = toggleDraw;



//draw buttons handler
drawButtons.forEach(function(btn){
    btn.onclick = function(){
        let type = btn.classList[1].split('--')[1];
        switch(type){
            case 'point':
                type = 'Point';
                break;
            case 'line':
                type = 'LineString';
                break;
            case 'polygon':
                type = 'Polygon';
                break;
        }
        drawHandler(type);
    };
});

//add source for drawing
var drawSource = new ol.source.Vector();
var drawLayer = new ol.layer.Vector({
    source: drawSource
});
map.addLayer(drawLayer);

//draw function
function drawHandler(type){
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof ol.interaction.Draw){
            map.removeInteraction(interaction);
        }
    });

    if(type==='clear'){
        drawSource.clear();
    }else if(type==='finish'){
        toggleDraw();
    }else{
        const drawInteraction = new ol.interaction.Draw({
            type: type,
            source: drawSource,
        });
        map.addInteraction(drawInteraction);
        console.log('Drawing type:', type);
    }
};


// function addIdentify(){

const selectIdentifyContainer = document.querySelector('.identify__select');
const selectIdentfyElement = document.createElement('select');
firelayer.forEach(function(lyr){
    const layerName = lyr.get('name');
    const opt = document.createElement('option');
    opt.innerText = layerName;
    console.log('333333',opt.innerText);
    selectIdentfyElement.appendChild(opt);
});

selectIdentifyContainer.appendChild(selectIdentfyElement);

//toggle identify
const identifyToggler = document.querySelector('.identify__icon');
const identifyContent = document.querySelector('.identify__content');
let identifyIsActive = false;
identifyToggler.onclick = toggleIndentify;

function toggleIndentify(){
    identifyIsActive?map.un('click',identify):map.on('click',identify);
    identifyToggler.style.backgroundColor = identifyIsActive?'white':'white';
    identifyContent.style.display = identifyIsActive?'none':'block';
    identifyIsActive =! identifyIsActive;
}

function identify(evt) {
    //     console.log('Identify function called'); 

    const viewResolution = map.getView().getResolution();
    const lyrName = document.querySelector('.identify__select>select').value;
    const wmsLayer = map.getLayers().getArray().find(l => l.get('name') === lyrName);
    const url = wmsLayer.getSource().getFeatureInfoUrl(  
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        {'INFO_FORMAT': 'text/html'}
    );
    if (url) {
        fetch(url)
        .then((response) => response.text())
        .then((html)=>{
            document.querySelector('.identify__result').innerHTML = html;
        });
    }
}


//measurement

const measureToggler = document.querySelector('.measurement-control__icon--toggler');
const measureButtons = document.querySelectorAll('.measurement-control__icon:not(.measurement-control__icon--toggler)');
const measureTooltipElement = document.querySelector('.tooltip-bottom');
let measureIsOpen = false;
measureToggler.onclick = toggleMeasure;

var measureSource = new ol.source.Vector();
var measureLayer = new ol.layer.Vector({
    source:measureSource
});
map.addLayer(measureLayer);


function toggleMeasure(){
    measureToggler.style.backgroundColor = measureIsOpen?'white':'white';
    measureTooltipElement.style.display = 'none';
    measureButtons.forEach(function(btn){
        btn.style.display = measureIsOpen?'none':'block';
    });
    map.getInteractions().forEach((interaction)=>{
        if (interaction instanceof ol.interaction.Draw){
          map.removeInteraction(interaction);
        }
    });

    measureSource.clear();
    measureIsOpen =! measureIsOpen;
}


measureButtons.forEach(function(btn){
    btn.onclick = function(){
        let type = btn.classList[1].split('--')[1];
        switch(type){
            case 'distance':
                type = 'LineString';
            break;
            case 'area':
                type = 'Polygon';
            break;
        }
        measureHandler(type)
    }
});

function measureHandler(type){
    map.getInteractions().forEach((interaction)=>{
        if(interaction instanceof ol.interaction.Draw){
            map.removeInteraction(interaction);
        }
    });
    const drawInteraction = new ol.interaction.Draw({
        type:type,
        source:measureSource,
    });

    drawInteraction.on('drawstart', function(evt){
        let sketch = evt.feature;
        sketch.getGeometry().on('change', function(evt){
           const geom = evt.target;
           let output;
           if (geom instanceof ol.geom.Polygon){
            output = formatArea(geom);
           } else if (geom instanceof ol.geom.LineString){
             output = formatLength(geom);
           }
           measureTooltipElement.innerHTML = output;
           measureTooltipElement.style.display = 'block';
        });
      });

    map.addInteraction(drawInteraction);

}


const formatLength = function (line){
    const length = ol.sphere.getLength(line);
    let output;
    if(length> 100){
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};

const formatArea = function(polygon){
    const area = ol.sphere.getArea(polygon);
    let output;
    if (area > 10000){
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};


//add search box

const searchResultSource = new ol.source.Vector();

const styleSearchResult = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5 , 46],
        anchorXUnits:'fraction',
        anchorYUnits:'pixels',
        src:'./assets/imgs/location.png',
    })
});

const searchResultLayer = new ol.layer.Vector({
    style:styleSearchResult,
    source:searchResultSource
});

map.addLayer(searchResultLayer);

const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
searchBtn.onclick = search;

function search(){
    const text = searchInput.value;
    fetch(`https://nominatim.openstreetmap.org/search?q=${text}&format=geojson&limit=1`)
    .then(
        function(resp){
            return resp.json()
        }
    ).then(function(geojson){
        searchResultSource.clear();
        const resultFeatures = new ol.format.GeoJSON().readFeatures(geojson,{dataProjection:'EPSG:4326',featureProjection:'EPSG:3857'});
        const feature = resultFeatures[0];
        var ext = feature.getGeometry().getExtent();
        var center = ol.extent.getCenter(ext);
        map.setView(
            new ol.View({
                projection: map.getView().getProjection(),
                center: [center[0] , center[1]],
                zoom: 12
            })
        );
        searchResultSource.addFeatures(resultFeatures);
    });
};

 //sidebar
 document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");

    // کلیک روی دکمه برای باز و بسته کردن سایدبار
    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });

    // کلیک خارج از سایدبار برای بستن آن
document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove("open");
        }
    });
});

document.getElementById("fireIcon").addEventListener("click", function() {
    let filterContainer = document.getElementById("filterContainer");
    // نمایش/مخفی کردن فیلتر
    if (filterContainer.style.display === "none" || filterContainer.style.display === "") {
        filterContainer.style.display = "block";
    } else {
        filterContainer.style.display = "none";
    }
});

document.getElementById("fireIcon").addEventListener("click", function () {
    var fireText = document.getElementById("fireText");
    if (fireText.style.display === "none" || fireText.style.display === "") {
        fireText.style.display = "block";
    } else {
        fireText.style.display = "none";
    }
});

document.getElementById("fireIcon").addEventListener("click", function () {
    var fireText2 = document.getElementById("fireText2");
    if (fireText2.style.display === "none" || fireText2.style.display === "") {
        fireText2.style.display = "block";
    } else {
        fireText2.style.display = "none";
    }
});


document.getElementById("riskIcon").addEventListener("click", function () {
    var risktest = document.getElementById("risktest");
    if (risktest.style.display === "none" || risktest.style.display === "") {
        risktest.style.display = "block";
    } else {
        risktest.style.display = "none";
    }
});

document.getElementById("riskIcon").addEventListener("click", function () {
    var risktest2 = document.getElementById("risktest2");
    if (risktest2.style.display === "none" || risktest2.style.display === "") {
        risktest2.style.display = "block";
    } else {
        risktest2.style.display = "none";
    }
});

document.getElementById("surfIcon").addEventListener("click", function () {
    var surf = document.getElementById("surf");
    if (surf.style.display === "none" || surf.style.display === "") {
        surf.style.display = "block";
    } else {
        surf.style.display = "none";
    }
});

document.getElementById("surfIcon").addEventListener("click", function () {
    var surf2 = document.getElementById("surf2");
    if (surf2.style.display === "none" || surf2.style.display === "") {
        surf2.style.display = "block";
    } else {
        surf2.style.display = "none";
    }
});

document.getElementById("layers").addEventListener("click", function () {
    var layer = document.getElementById("layer");
    if (layer.style.display === "none" || layer.style.display === "") {
        layer.style.display = "block";
    } else {
        layer.style.display = "none";
    }
});

document.getElementById("riskIcon").addEventListener("click", function () {
    var customDate = document.getElementById("customDate");
    if (customDate.style.display === "none" || customDate.style.display === "") {
        customDate.style.display = "block";
    } else {
        customDate.style.display = "none";
    }
});

document.getElementById("riskIcon").addEventListener("click", function () {
    var label_date = document.getElementById("label_date");
    if (label_date.style.display === "none" || label_date.style.display === "") {
        label_date.style.display = "block";
    } else {
        label_date.style.display = "none";
    }
});