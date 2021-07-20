﻿#target photoshop;

#include "ui.jsx"
#include "table.jsx"


app.bringToFront();
main();

function main(){
    
    // get script and save paths (from ui.jsx)
    paths = promptMultipleDatasets();
//~     paths = new Array();
//~     paths[0] = decodeURI("D:\\Multiplex_IHC\\Nath_Avi\\CV19-002\\script.csv");
//~     paths[1] = decodeURI("D:\\Multiplex_IHC\\Nath_Avi\\CV19-002");
//~     paths[2] = decodeURI("registered");
    
    var scriptFname = new File(paths[0]);
    var inputFolderFname = new Folder(paths[1]);
    var subFolderFname = paths[2];
    
    // read table from the provided script (from table.jsx)
    table_contents = read_table(scriptFname);
    var table = table_contents[0];
    var columns = table_contents[1];
    var groups = table_contents[2];
   
    var folders = new Array();
    folders = findFolders(inputFolderFname, subFolderFname, folders);
    
    for(var f in folders){
        
        var folder = folders[f];
        var saveFname = File( decodeURI(inputFolderFname) + "/" + decodeURI(folder.name) + ".psb");  // save them in the parent folder

        // if there was a subfolder
        if (subFolderFname !== "") {folder = folder + "/" + subFolderFname};

        var fileList =folder.getFiles(/\.(jpg|png|tiff|tif|tga)$/i);
        
        if(fileList.length < 1) continue;
        
        // load all files to the photoshop
        stackFiles(fileList);
        
        // select the active document as my document
        myDocument = app.activeDocument;

        // change mode to 8bit
        myDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
        
        // change mode to RGB
        myDocument.changeMode(ChangeMode.RGB);

        // create subfolders
        create_groups(myDocument, groups);

        // rename layer, hue layer, move to group
        correct_layers(myDocument, table);

        // remove layers not in folder (in root)
        removeArtLayers(myDocument);

        // save document
        saveDocument(saveFname)
        
        // close the document
        myDocument.close(SaveOptions.DONOTSAVECHANGES);
        }
};


function findFolders( topFolder, subFolder, folders) {
    
    var foldersArray = Folder(topFolder).getFiles();
    
    for (var i=0; i < foldersArray.length; i++) {
        folder = foldersArray[i];
        if (folder instanceof Folder) {folders.push(Folder(folder))};
    }
    return folders;
};


function stackFiles(files){
    try{
        var loadLayersFromScript = true;
        $.evalFile(app.path + "/" +  localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/Load Files into Stack.jsx");
        loadLayers.intoStack(files);
    }
    catch(e){
        $.writeln(e + "\n" + e.line);
    }
};



function create_groups(doc, groups) {

    // reverse the order of group to create them from bottom to top
    groups = groups.reverse();

    // create array for layersets (group)
    myLayerSets = new Array()

    for (i = 0; i < groups.length; i++) {
        // add and rename each layerset
        myLayerSets[i] = doc.layerSets.add();
        myLayerSets[i].name = groups[i];
    }
}


function collectAllLayers(doc, allLayers) {
    for (var m = 0; m < doc.layers.length; m++) {
        var theLayer = doc.layers[m];
        if (theLayer.typename === "ArtLayer") {
            allLayers.push(theLayer);
        } else {
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}


function alterHue(hue) {
    var idHStr = charIDToTypeID("HStr");
    var desc8 = new ActionDescriptor();
    var idpresetKind = stringIDToTypeID("presetKind");
    var idpresetKindType = stringIDToTypeID("presetKindType");
    var idpresetKindCustom = stringIDToTypeID("presetKindCustom");
    desc8.putEnumerated(idpresetKind, idpresetKindType, idpresetKindCustom);
    var idClrz = charIDToTypeID("Clrz");
    desc8.putBoolean(idClrz, true);
    var idAdjs = charIDToTypeID("Adjs");
    var list2 = new ActionList();
    var desc9 = new ActionDescriptor();
    var idH = charIDToTypeID("H   ");
    desc9.putInteger(idH, hue);
    var idStrt = charIDToTypeID("Strt");
    desc9.putInteger(idStrt, 100);
    var idLght = charIDToTypeID("Lght");
    desc9.putInteger(idLght, 0);
    var idHsttwo = charIDToTypeID("Hst2");
    list2.putObject(idHsttwo, desc9);
    desc8.putList(idAdjs, list2);
    executeAction(idHStr, desc8, DialogModes.NO);
}


function correct_layers(doc, table) {

    table = table.reverse();

    var allLayers = [];
    var allLayers = collectAllLayers(doc, allLayers).reverse();


    for (var p = 0; p < table.length; p++) {

        // $.writeln(table[p][0]);

        var channel = table[p];

        // check if file (in table) exist in document
        if (doesLayerExist(allLayers, channel[0])) {
            
            // get layer object
            var layer = doc.layers.getByName(channel[0]);

            // get layerset (group) object
            var layerSet = doc.layerSets.getByName(channel[3]);

            // set this layer as active layer
            doc.activeLayer = layer;

            // change layer name (to biomarker name)
            if (channel[1] !== "") {
                layer.name = channel[1];
            }
            
            // change layer color
            if (channel[2] !== "") {
                alterHue(channel[2]);
            }

            // move the layer inside the LayerSet
            if (channel[3] !== "") {
                layer.move(layerSet, ElementPlacement.INSIDE); 
            }
        }
    }
} // end funcion


function doesLayerExist(layers, name) {

    for (i = 0; i < layers.length; i++) {
        if (layers[i].name == name) return true;
    }
    return false;

}


function removeArtLayers(doc) {
    // artLayer is layer not in LayerSet (in root)
    // for each artLayer -> remove the artLayer
    var lenOfArtLayers = doc.artLayers.length
    for (var m = 0; m < lenOfArtLayers; m++) {
        doc.activeLayer = doc.artLayers[0];
        doc.activeLayer.remove();
    }
}


function saveDocument(saveFile) {
    var idsave = charIDToTypeID("save");
    var desc16 = new ActionDescriptor();
    var idAs = charIDToTypeID("As  ");
    var desc17 = new ActionDescriptor();
    var idmaximizeCompatibility = stringIDToTypeID("maximizeCompatibility");
    desc17.putBoolean(idmaximizeCompatibility, true);
    var idPhteight = charIDToTypeID("Pht8");
    desc16.putObject(idAs, idPhteight, desc17);
    var idIn = charIDToTypeID("In  ");
    desc16.putPath(idIn, saveFile);
    var idDocI = charIDToTypeID("DocI");
    desc16.putInteger(idDocI, 219);
    var idsaveStage = stringIDToTypeID("saveStage");
    var idsaveStageType = stringIDToTypeID("saveStageType");
    var idsaveBegin = stringIDToTypeID("saveBegin");
    desc16.putEnumerated(idsaveStage, idsaveStageType, idsaveBegin);
    executeAction(idsave, desc16, DialogModes.NO);
}
