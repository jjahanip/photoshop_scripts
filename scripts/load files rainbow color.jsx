// enable double clicking from the Macintosh Finder or the Windows Explorer
// #target photoshop

// in case we double clicked the file
// app.bringToFront();

#target photoshop

if (app.documents.length > 0) {
    var myDocument = app.activeDocument;
    myDocument.suspendHistory("operation", "main(myDocument)");
} else {
    var myDocument = app.documents.add();
    myDocument.suspendHistory("operation", "main(myDocument)");
}
;

//////////////////////////////////// 
function main() {

    $.evalFile("/d/jahandar/code/photoshop/load_files_into_stack.jsx");
    
    // change mode to 8bit
    app.activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT
    
    // change mode to RGB
	myDocument.changeMode(ChangeMode.RGB);
    // change_mode_rgb();
    
    // hue layers
    hue_layers_rainbow();
    
//~     var saveFile =  File.openDialog("Selection prompt", "Large Document Format: *.psb, All Files: *.*");
//~     saveDocument(saveFile)

};


function saveDocument(saveFile){
    var idsave = charIDToTypeID( "save" );
    var desc16 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
    var desc17 = new ActionDescriptor();
    var idmaximizeCompatibility = stringIDToTypeID( "maximizeCompatibility" );
    desc17.putBoolean( idmaximizeCompatibility, true );
    var idPhteight = charIDToTypeID( "Pht8" );
    desc16.putObject( idAs, idPhteight, desc17 );
    var idIn = charIDToTypeID( "In  " );
    desc16.putPath( idIn, saveFile );
    var idDocI = charIDToTypeID( "DocI" );
    desc16.putInteger( idDocI, 219 );
    var idsaveStage = stringIDToTypeID( "saveStage" );
    var idsaveStageType = stringIDToTypeID( "saveStageType" );
    var idsaveBegin = stringIDToTypeID( "saveBegin" );
    desc16.putEnumerated( idsaveStage, idsaveStageType, idsaveBegin );
    executeAction( idsave, desc16, DialogModes.NO );
    
}
function hue_layers_rainbow() {
    
    var myDocument = app.activeDocument;
    
    var allLayers = [];
    var allLayers = collectAllLayers(myDocument, allLayers);

    var numLayers = allLayers.length
    var hue = 0

    for (var p = 0; p < allLayers.length; p++) {
        var layer = allLayers[p].name;
        myDocument.activeLayer = allLayers[p];

		alterHue(hue)

		hue = hue + parseInt (360/ numLayers)
    }
}


function selectLayerByIndex(index, add) {
    add = undefined ? add = false : add
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), index);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref);
    if (add) desc.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
    desc.putBoolean(charIDToTypeID("MkVs"), false);
    try {
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    } catch (e) {
        alert(e.message);
    }
};

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

function change_mode_rgb() {
    var idCnvM = charIDToTypeID("CnvM");
    var desc9 = new ActionDescriptor();
    var idT = charIDToTypeID("T   ");
    var idRGBM = charIDToTypeID("RGBM");
    desc9.putClass(idT, idRGBM);
    var idMrge = charIDToTypeID("Mrge");
    desc9.putBoolean(idMrge, false);
    var idRstr = charIDToTypeID("Rstr");
    desc9.putBoolean(idRstr, false);
    executeAction(idCnvM, desc9, DialogModes.NO);
};

function alterHue(hue) {
var idHStr = charIDToTypeID( "HStr" );
    var desc8 = new ActionDescriptor();
    var idpresetKind = stringIDToTypeID( "presetKind" );
    var idpresetKindType = stringIDToTypeID( "presetKindType" );
    var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
    desc8.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
    var idClrz = charIDToTypeID( "Clrz" );
    desc8.putBoolean( idClrz, true );
    var idAdjs = charIDToTypeID( "Adjs" );
        var list2 = new ActionList();
            var desc9 = new ActionDescriptor();
            var idH = charIDToTypeID( "H   " );
            desc9.putInteger( idH, hue );
            var idStrt = charIDToTypeID( "Strt" );
            desc9.putInteger( idStrt, 100 );
            var idLght = charIDToTypeID( "Lght" );
            desc9.putInteger( idLght, 0 );
        var idHsttwo = charIDToTypeID( "Hst2" );
        list2.putObject( idHsttwo, desc9 );
    desc8.putList( idAdjs, list2 );
executeAction( idHStr, desc8, DialogModes.NO );
}