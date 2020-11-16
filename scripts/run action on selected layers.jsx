#target photoshop  
if (app.documents.length > 0) {  
var myDocument = app.activeDocument;  
myDocument.suspendHistory("operation", "main(myDocument)");  
};  
////////////////////////////////////  
function main () {  
var theLayers = getSelectedLayersIdx();  
// do stuff;  
// reselect layers;  
for (var p = 0; p < theLayers.length; p++) {  
  selectLayerByIndex(theLayers[p], false);  
  app.doAction('action_name', 'folder_name'); // replace with the name of the action and the folder  
  };  
};  
//   
function selectLayerByIndex(index,add){  
add = undefined ? add = false:add  
var ref = new ActionReference();  
    ref.putIndex(charIDToTypeID("Lyr "), index);  
    var desc = new ActionDescriptor();  
    desc.putReference(charIDToTypeID("null"), ref );  
       if(add) desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );  
      desc.putBoolean( charIDToTypeID( "MkVs" ), false );  
   try{  
    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );  
}catch(e){  
alert(e.message);  
}  
};  
////// by paul mr;  
function getSelectedLayersIdx(){  
      var selectedLayers = new Array;  
      var ref = new ActionReference();  
      ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );  
      var desc = executeActionGet(ref);  
      if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){  
         desc = desc.getList( stringIDToTypeID( 'targetLayers' ));  
          var c = desc.count  
          var selectedLayers = new Array();  
          for(var i=0;i<c;i++){  
            try{  
               activeDocument.backgroundLayer;  
               selectedLayers.push(  desc.getReference( i ).getIndex() );  
            }catch(e){  
               selectedLayers.push(  desc.getReference( i ).getIndex()+1 );  
            }  
          }  
       }else{  
         var ref = new ActionReference();  
         ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));  
         ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );  
         try{  
            activeDocument.backgroundLayer;  
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);  
         }catch(e){  
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));  
         }  
      }  
      return selectedLayers;  
};  