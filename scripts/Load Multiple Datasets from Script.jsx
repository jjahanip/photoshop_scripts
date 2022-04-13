<javascriptresource>
<name>$$$/JavaScripts/LoadMultipleDatasetsFromScript/Menu=Load Multiple Datasets From Script...</name>
<category>Jahandar</category>
</javascriptresource>

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop;


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
    
    // reverse the order of table and group to create them from bottom to top
    table = table.reverse();
    groups = groups.reverse();
   
    var folders = new Array();
    folders = findFolders(inputFolderFname, subFolderFname, folders);
    
    for(var f in folders){
        
        var folder = folders[f];
        var saveFname = File( decodeURI(inputFolderFname) + "/" + decodeURI(folder.name) + ".psb");  // save them in the parent folder

        // if there was a subfolder
        if (subFolderFname !== "") {folder = Folder(folder + "/" + subFolderFname)};

        var fileList =folder.getFiles(/\.(jpg|png|tiff|tif|tga)$/i);
        
        if(fileList.length < 1) continue;
        
        // load all files to the photoshop
        stackFiles(fileList);
        
        // select the active document as my document
        myDocument = app.activeDocument;
        
        // move all C9 channels due to the optical shift in microscope
        moveC9Layers(myDocument);

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


function findLayersContainingString(layers, string){
    // Find layers containg the string
    
    specific_layers = [];
    
    var regEx = new RegExp(string);

    for (var i = 0; i < layers.length; i++) {
        if (regEx.test(layers[i].name)){
            specific_layers.push(layers[i]);    
        }
    }
    return specific_layers;
}


function MoveLayersBy(layers, X, Y) {
    // Move layers to right by X and to top by Y
    
    for (var i = 0; i < layers.length; i++) {
        layers[i].translate(X, Y);      
    }
}


function moveC9Layers(doc){
    
    var allLayers = [];
    var allLayers = collectAllLayers(doc, allLayers).reverse();
    
    var c9_layers = findLayersContainingString(allLayers, 'C9');
    MoveLayersBy(c9_layers, -1, -3)  
    
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

function promptMultipleDatasets(){
    
    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
    dialog.text = "Load multiple datasets into stack from script"; 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["left","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16;
    
    
    // SCRIPTGROUP
    // ===========
    var scriptGroup = dialog.add("group", undefined, {name: "scriptGroup"}); 
    scriptGroup.orientation = "row"; 
    scriptGroup.alignChildren = ["left","center"]; 
    scriptGroup.spacing = 10; 
    scriptGroup.margins = 0; 

    var scriptTxt = scriptGroup.add("statictext", undefined, undefined, {name: "scriptTxt"}); 
    scriptTxt.text = "Script:"; 
    scriptTxt.preferredSize.width = 60; 

    var scriptInput = scriptGroup.add('edittext {properties: {name: "scriptInput"}}'); 
    scriptInput.preferredSize.width = 500; 

    var scriptBrowse = scriptGroup.add("button", undefined, undefined, {name: "scriptBrowse"}); 
    scriptBrowse.text = "Browse"; 
    scriptBrowse.justify = "right";
    scriptBrowse.onClick = function () {scriptInput.text = File.openDialog ("Select the script file", "Comma-separated values: *.csv, All Files: *.*").fsName};
    
    
    // inputGROUP
    // ===========
    var inputGroup = dialog.add("group", undefined, {name: "inputGroup"}); 
    inputGroup.orientation = "row"; 
    inputGroup.alignChildren = ["left","center"]; 
    inputGroup.spacing = 10; 
    inputGroup.margins = 0; 

    var inputTxt = inputGroup.add("statictext", undefined, undefined, {name: "inputTxt"}); 
    inputTxt.text = "Parent folder:"; 
    inputTxt.preferredSize.width = 60; 

    var inputInput = inputGroup.add('edittext {properties: {name: "inputInput"}}'); 
    inputInput.preferredSize.width = 500; 

    var inputBrowse = inputGroup.add("button", undefined, undefined, {name: "inputBrowse"}); 
    inputBrowse.text = "Browse"; 
    inputBrowse.justify = "right";
    inputBrowse.onClick = function () {inputInput.text =  Folder.selectDialog('Select parent input folder').fsName};


    // SAVEGROUP
    // =========
    var subfolderGroup = dialog.add("group", undefined, {name: "saveGroup"}); 
    subfolderGroup.orientation = "row"; 
    subfolderGroup.alignChildren = ["left","center"]; 
    subfolderGroup.spacing = 10; 
    subfolderGroup.margins = 0; 

    var subfolderTxt = subfolderGroup.add("statictext", undefined, undefined, {name: "saveTxt"}); 
    subfolderTxt.text = "Subfolder:"; 
    subfolderTxt.preferredSize.width = 60; 

    var subfolderInput = subfolderGroup.add('edittext {properties: {name: "subfolderInput"}}'); 
    subfolderInput.preferredSize.width = 500; 
    
    var subfolderBrowse = subfolderGroup.add("button", undefined, undefined, {name: "saveBrowse"}); 
    subfolderBrowse.text = "Browse"; 
    subfolderBrowse.onClick = function (){subfolderInput.text =  Folder.selectDialog('Select subfolder').name};


    // BUTTONSGROUP
    // ============
    var buttonsGroup = dialog.add("group", undefined, {name: "buttonsGroup"}); 
    buttonsGroup.orientation = "row"; 
    buttonsGroup.alignChildren = ["left","bottom"]; 
    buttonsGroup.spacing = 10; 
    buttonsGroup.margins = 0; 
    buttonsGroup.alignment = ["right","top"]; 

    var okButton = buttonsGroup.add("button", undefined, undefined, {name: "ok"}); 
    okButton.text = "OK"; 
    okButton.alignment = ["left","center"];

    var cancelButton = buttonsGroup.add("button", undefined, undefined, {name: "cancel"}); 
    cancelButton.text = "Cancel"; 

    if (dialog.show() == 1){
        return [scriptInput.text, inputInput.text, subfolderInput.text];
       }
}

function unique (_arr) {
    var o = {}, a = [], i, e;
    for (i = 0; e = _arr[i]; i++) {o[e] = 1};
    for (e in o) {a.push (e)};
    return a;
    }

function getCol(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
        column.push(matrix[i][col]);
    }
    return column;
    }

function read_table(txtFile) {

    // set to 'UTF8' or 'UTF-8'
    txtFile.encoding = 'UTF8';

    // start reading
    txtFile.open("r");

    // read column names
    var columns = txtFile.readln().split(',');

    // make sure columns in file are as expected
    expected_columns = ['filename', 'biomarker', 'hue', 'group'];
    if (columns.join(',') !== expected_columns.join(',')) {
        alert('script file must have columns:\n"filename" "biomarker" hue" "group"');
        throw new Error("Script columns don't match!");
    }

    // define variable for table
    var table = new Array();

    // push lines to the table
    while (!txtFile.eof) {
        var line = txtFile.readln().split(',');
        table.push(line);
    }

    // close file
    txtFile.close();

    // take the forth column (groups)
    var groups = getCol(table, 3);
    groups = unique(groups);

    return [table, columns, groups];
}
