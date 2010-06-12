var naicArray = new Array(50);
var naicIndex = 0;
var sicArray = new Array(50);
var sicIndex = 0;
var tickerArray = new Array(50);
var tickerIndex = 0;
var spArray = new Array(50);
var leArray = new Array(50);
var segArray = new Array(50);
var ftArray = new Array(50);
var meshArray = new Array(50);
var meshIndicatorArray = new Array(50);
var meshIndex = 0;
var generateMoreLikeThis = false;
var absoluteDatabaseName = null;
var requestString = null;
var naicsExist = false;
var sicExist = false;
var tickerExist = false;
var tickerName = ' ';
var naicsName = ' ';
var sicName = ' ';
var subjectName = ' ';
var meshName = ' ';
var initialMLTField = "";
var naicsArray = new Array(50);
var dunsArray = new Array(50);
var paperKeywordIndex = 0;
var paperKeywordArray = new Array(50);

function setTickerName(name) {
   tickerName = name;
}

function setNaicsName(name) {
   naicsName = name;
}

function setSicName(name) {
   sicName = name;
}

function setSubjectName(name) {
   subjectName = name;
}

function setMeshName(name) {
    meshName = name;
}

function addMesh(sub, ind) {
  for ( i =0 ; i < meshIndex; i++ ) {
      if ( meshArray[i] == sub )
        return;
  }
  meshArray[meshIndex++] = sub;  
  meshIndicatorArray[meshIndex] = ind;
}

function addPaperKeyword(sub) {
  for ( i =0 ; i < paperKeywordIndex; i++ ) {
      
      if ( paperKeywordArray[i] == sub )
        return;
  }
  paperKeywordArray[paperKeywordIndex++] = sub;
}

function addAdvisor(sub) {
  for ( i =0 ; i < advisorIndex; i++ ) {
      
      if ( advisorArray[i] == sub )
        return;
  }
  advisorArray[advisorIndex++] = sub;
}


function addNaic(sub) {
  //alert('adding naic '+sub+' Index '+naicIndex);
  // Check to see if there is any repetition
  for ( i =0 ; i < naicIndex; i++ ) {
      //alert('ARRAY VALUE ['+naicArray[i]+']  sub value ['+sub+']');
      if ( naicArray[i] == sub )
        return;
  }
  naicArray[naicIndex++] = sub;
}

function addSic(sub) {
  //alert('adding sic '+sub+' Index '+sicIndex);
  for ( i =0 ; i < sicIndex; i++ ) {
      if ( sicArray[i] == sub )
        return;
  }
  sicArray[sicIndex++] = sub;
}

function addTicker(sub) {
  //alert('adding ticker '+sub+' Index '+tickerIndex);
  for (i =0 ; i < tickerIndex; i++ ) {
      if ( tickerArray[i] == sub )
        return;
  }
  tickerArray[tickerIndex++] = sub;
}

function generateMLT(label, mnemonic, termArray) {
    var str = ' ';
    var temp = '';
    if(termArray.length == 0) {
      return "";
    }
    if (typeof termArray[0] == "undefined") {
    	return "";
    }
    
    /* need to determine which field is visible by default */
    if(initialMLTField == "") {
        if(subArray.length > 0) {
            initialMLTField = "SUB";
        } else if(ifArray.length > 0) {
            initialMLTField = "IF";
            }
          else if(geoArray.length > 0) {
            initialMLTField = "GEO";
            }
          else if(perArray.length > 0) {
            initialMLTField = "PER";
            }
          else if(coArray.length > 0) {
            initialMLTField = "CO";
            }
          else if(prodArray.length > 0) {
            initialMLTField = "PROD";
            }
          else if(spArray.length > 0) {
            initialMLTField = "SP";
            }
          else if(leArray.length > 0) {
            initialMLTField = "LECTURE";
            }
          else if(nysubArray.length > 0) {
            initialMLTField = "NYSUB";
            } 
          else if(nygeoArray.length > 0) {
            initialMLTField = "NYGEO";
            } 
          else if(nyperArray.length > 0) {
            initialMLTField = "NYPER";
            } 
          else if(nycoArray.length > 0) {
            initialMLTField = "NYCO";
            }             
      }
      //alert("the initial field will be [" + initialMLTField + "]");
    
       var additionalClass = '';
       var checked = ''; // only going to check default field
       if(mnemonic != initialMLTField && initialMLTField != "") {
           additionalClass = 'more';
       } 
       
   
       str = str + '<div id="' + mnemonic + 'MLTLabelDiv" class="textMedium heading '+additionalClass+'">' + label + '</div>';
       str = str + '<div id="' + mnemonic + 'MLTValueDiv" class="textMedium value '+additionalClass+'">';
       for (i = 0 ; i < termArray.length ; i++ ) {
          temp = termArray[i];
          temp =stringReplace(temp,'&lt;hHl&gt;','<span class="hHl">');
          temp =stringReplace(temp,'&lt;/hHl&gt;','</span>');
          temp =stringReplace(temp,'<hHl>','<span class="hHl">');
          temp =stringReplace(temp,'</hHl>','</span>');
          if(mnemonic == "CC") {
           //alert("going to parse [" + temp + "]");
             var match = /(\d+)/.exec(temp);
             searchValue = match[1];
           //alert("parsed [" + searchValue + "]");              
          } else {          
             searchValue = temp;
          }
           searchValue =stringReplace(searchValue,'&lt;hHl&gt;','');
           searchValue =stringReplace(searchValue,'&lt;/hHl&gt;','');
           searchValue =stringReplace(searchValue,'<hHl>','');
           searchValue =stringReplace(searchValue,'</hHl>','');
           searchValue =stringReplace(searchValue,'<span class="hHl">','');
           searchValue =stringReplace(searchValue,'</span>','');
           
          var boxName = mnemonic + "MLTCheckBox" + i;
          // allow long strings to wrap
		  temp = wrapString(temp);
          
          if(mnemonic == "SP") {
              mnemonic = "SPK";  // sp needs to be mapped to au mnemonic
          }
                       
          str = str + '<div class="check"><input type="checkbox" name="moreLikeThis" value=" ' + mnemonic + '('+searchValue+') " ' + checked +' id="' + boxName + '" />';
          str = str + ' \n <label for="' + boxName + '">'+temp+'</label> \n</div>';
        }
     str = str + '</div>' ;

//alert(str);
  return str;
}

function hideMLTMore() {
    showElement("ShowMoreMLT");
    hideElement("CloseMoreMLT");
    hideMLTField("SUB");
    hideMLTField("NYSUB");
    hideMLTField("CC");
    hideMLTField("GEO");
    hideMLTField("NYGEO");
    hideMLTField("PER");
    hideMLTField("NYPER");
    hideMLTField("AU");
    hideMLTField("SP");
    hideMLTField("LECTURE");
    hideMLTField("SEG");
    hideMLTField("MESH");
    hideMLTField("CO");
    hideMLTField("NYCO");
    hideMLTField("NAICS");
    hideMLTField("DUNS");
    hideMLTField("TICKER");
    hideMLTField("SIC");
    hideMLTField("RELCO");
    hideMLTField("PROD");
    hideMLTField("FILETYPE");
    hideMLTField("AT");
    hideMLTField("LA");
    hideMLTField("SC");
    hideMLTField("AD");
    hideMLTField("DEGDT");
    hideMLTField("IF");
    hideMLTField("SO");
    hideMLTField("CRICOLL");
    hideMLTField("CLC");
    hideMLTField("DEP");
    hideMLTField("CMT");
}

function showMLTMore() {
    showElement("CloseMoreMLT");
    hideElement("ShowMoreMLT");
    showMLTField("SUB");
    showMLTField("NYSUB");
    showMLTField("CC");
    showMLTField("GEO");
    showMLTField("NYGEO");
    showMLTField("PER");
    showMLTField("NYPER");
    showMLTField("SP");
    showMLTField("LECTURE");
    showMLTField("AU");
    showMLTField("SEG");
    showMLTField("MESH");
    showMLTField("CO");
    showMLTField("NYCO");
    showMLTField("NAICS");
    showMLTField("DUNS");
    showMLTField("TICKER");
    showMLTField("SIC");    
    showMLTField("RELCO");
    showMLTField("PROD");
    showMLTField("FILETYPE");
    showMLTField("AT");
    showMLTField("LA");  
    showMLTField("AD");
    showMLTField("CMT");
    showMLTField("DEGDT");
    showMLTField("SC");
    showMLTField("DEP");
    showMLTField("IF");
    showMLTField("SO");
    showMLTField("CRICOLL");
    showMLTField("CLC");
}

function showElement(elemId)
{
    elem = document.getElementById(elemId);
    if(elem) {
      elem.style.visibility="visible";
      elem.style.display="block";
    }
}

function hideElement(elemId) {
    elem = document.getElementById(elemId);
    if(elem) {
      elem.style.visibility="hidden";
      elem.style.display="none";
    }
}

function showMLTField(name) {
    showElement(name + "MLTLabelDiv");
    showElement(name + "MLTValueDiv");
}

function hideMLTField(name) {
    if(name != initialMLTField) { // since we never want to hide the one we start with
      hideElement(name + "MLTLabelDiv");
      hideElement(name + "MLTValueDiv");
      clearMLTBoxes(name + "MLTCheckBox");
    }
}

function clearMLTBoxes(elemId)
{
  for(i = 0; i < 20; i++) {
      var elementId = elemId + i + "";
      elem = document.getElementById(elementId);
      if(elem) {
          elem.checked=false;
      }
  }
}

function generateSubjectMLT() {
    var str = ' ';
    if ( subjectIndex > 0 )  {
       str = str + '<tr>';	
       str = str + '<td valign="top" class="textMedium" nowrap="nowrap">' + subjectName + '</td>';
       str = str + '<td valign="top" class="textMedium">';
       for (i = 0 ; i < subjectIndex ; i++ ) {
          str = str + '<input id="sub'+i+'" type="checkbox" name="moreLikeThis" value=" SUB('+subjectArray[i]+') " />';
          str = str + '<label for="sub'+i+'">'+subjectArray[i] + '</label>';
		  if (i != subjectIndex) {
			  str = str + '&nbsp;';
		  }
       }
       str = str + '</td></tr>' ;
     }  // end Subject

  //alert(str);
  document.write(str);
}

function generateMeshMLT() {
    var str = ' ';
    var temp = '';
    if ( meshIndex > 0 )  {
       str = str + '<tr>';
       str = str + '<td valign="top" class="textMedium" nowrap="nowrap">' + meshName + '</td>';
       str = str + '<td valign="top" class="textMedium">';
       for (i = 0 ; i < meshIndex ; i++ ) {
          temp = meshArray[i];
          temp =stringReplace(temp,'&lt;hHl&gt;','<font color=red><b>');
          temp =stringReplace(temp,'&lt;/hHl&gt;','</b></font>');
          temp =stringReplace(temp,'<hHl>','<font color=red><b>');
          temp =stringReplace(temp,'</hHl>','</b></font>');
          //alert('After ='+temp);
          str = str + '<input id="mesh'+i+'" type="checkbox" name="moreLikeThis" value=" MESH('+meshArray[i]+') " />';
          str = str + '<label for="mesh'+i+'">' + temp + '</label>';
                  if (i != meshIndex) {
                          str = str + '&nbsp;';
                  }
       }
       str = str + '</td></tr>' ;
     }  // end Mesh
  document.write(str);
}

function generateMeshTerms() {
    var str = ' ';
    if ( meshIndex > 0 )  {
       for (i = 0 ; i < meshIndex ; i++ ) {
          temp = meshArray[i];
          while(temp.indexOf('<hHl>') >= 0 || temp.indexOf('</hHl>') >= 0 || temp.indexOf('&lt;hHl&gt;') >= 0 || temp.indexOf('&lt;/hHl&gt;') >= 0 )
          {
              temp =stringReplace(temp,'&lt;hHl&gt;','<font color=red><b>');
              temp =stringReplace(temp,'&lt;/hHl&gt;','</b></font>');
              temp =stringReplace(temp,'<hHl>','<font color=red><b>');
              temp =stringReplace(temp,'</hHl>','</b></font>');
          }
          //alert('After ='+temp);
          
          str = str + '<a href="javascript:searchSideWays(';
          str = str + "'MESH', &quot;"+ meshArray[i] + "&quot;)";
          str = str + '">' + temp +'</a>';
          if(meshIndicatorArray[i+1] == true) {
              str = str + " " + majorIndicatorString;
          }          
                  if (i != (meshIndex -1)) {
                          str = str + ',&nbsp;&nbsp;';
                  }
       }
     }  // end Mesh
  
  while(str.indexOf('<hHl>') >= 0 || str.indexOf('</hHl>') >= 0)
  {
      str = stringReplace(str, '<hHl>','');
      str = stringReplace(str, '</hHl>','');
  }

  document.write(str);
}

function generatePaperKeywords() {
    var str = ' ';
    if ( paperKeywordIndex > 0 )  {
       for (i = 0 ; i < paperKeywordIndex ; i++ ) {
          temp = paperKeywordArray[i];
          //alert('Before ='+temp);
          while(temp.indexOf('<hHl>') >= 0 || temp.indexOf('</hHl>') >= 0 || temp.indexOf('&lt;hHl&gt;') >= 0 || temp.indexOf('&lt;/hHl&gt;') >= 0 )
          {
              temp =stringReplace(temp,'&lt;hHl&gt;','<font color=red><b>');
              temp =stringReplace(temp,'&lt;/hHl&gt;','</b></font>');
              temp =stringReplace(temp,'<hHl>','<font color=red><b>');
              temp =stringReplace(temp,'</hHl>','</b></font>');
          }
          //alert('After ='+temp);
          
          str = str + '<a href="javascript:searchSideWays(';
          str = str + "'IF', &quot;"+ paperKeywordArray[i] + "&quot;)";
          str = str + '">' + temp +'</a>';
                  if (i != (paperKeywordIndex -1)) {
                          str = str + ',&nbsp;&nbsp;';
                  }
       }
     }  // end Subject
  
  while(str.indexOf('<hHl>') >= 0 || str.indexOf('</hHl>') >= 0)
  {
      str = stringReplace(str, '<hHl>','');
      str = stringReplace(str, '</hHl>','');
  }

  //alert(str);
  document.write(str);
}

function generatePaperKeywordsPrint() {
//alert('here');
    var str = ' ';
    if ( paperKeywordIndex > 0 )  {
    //alert('here');
       for (i = 0 ; i < paperKeywordIndex ; i++ ) {
           //alert('here1');
          temp = paperKeywordArray[i];
          //alert('Before ='+temp);
          temp =stringReplace(temp,'&lt;hHl&gt;','<font color=red><b>');
          temp =stringReplace(temp,'&lt;/hHl&gt;','</b></font>');
          temp =stringReplace(temp,'<hHl>','<font color=red><b>');
          temp =stringReplace(temp,'</hHl>','</b></font>');
          //alert('After ='+temp);
          str = str +temp;
             // alert('here2');
                  if (i != (paperKeywordIndex - 1)) {
                          str = str + ',&nbsp;&nbsp;';
                  }
       }
     }  // end Subject

  //alert(str);
  document.write(str);
}

function generateNSTMLT() {
	var str = ' ';
	if ( tickerIndex > 0 )  {
       str = str + '<tr>';	
       str = str + '<td valign="top" class="textMedium" nowrap="nowrap">' + tickerName + '</td>';
       str = str + '<td valign="top" class="textMedium">';
       for (i = 0 ; i < tickerIndex ; i++ ) {
          str = str + '<input id="NSTtick'+i+'" type="checkbox" name="moreLikeThis" value=" TS('+tickerArray[i]+') " />';
          str = str + '<label for="NSTtick'+i+'">' + tickerArray[i] + '</label>';
		  if (i != tickerIndex) {
			  str = str + '&nbsp;';
		  }
       }
       str = str + '</td></tr>' ;
     }  // end ticker 
	if ( naicIndex > 0 )  {
       str = str + '<tr>';	
       str = str + '<td valign="top" class="textMedium" nowrap="nowrap">' + naicsName + '</td>';
       str = str + '<td valign="top" class="textMedium">';
       for (i = 0 ; i < naicIndex ; i++ ) {
          str = str + '<input id="NSTnaic'+i+'" type="checkbox" name="moreLikeThis" value=" NAICS('+naicArray[i]+') " />';
          str = str + '<label for="NSTnaic'+i+'">' + naicArray[i] + '</label>';
		  if (i != tickerIndex) {
			  str = str + '&nbsp;';
		  }
       }
       str = str + '</td></tr>' ;
     }  // end NAICS 
	if ( sicIndex > 0 )  {
       str = str + '<tr>';	
       str = str + '<td valign="top" class="textMedium" nowrap="nowrap">' + sicName + '</td>';
       str = str + '<td valign="top" class="textMedium">';
       for (i = 0 ; i < sicIndex ; i++ ) {
          str = str + '<input id="NSTsic'+i+'" type="checkbox" name="moreLikeThis" value=" SIC('+sicArray[i]+') " />';
          str = str + '<label for="NSTsic'+i+'">' + sicArray[i] + '</label>';
		  if (i != tickerIndex) {
			  str = str + '&nbsp;';
		  }
       }
       str = str + '</td></tr>' ;
     }  // end SIC

  //alert(str);
  document.write(str);
}


var ns6=document.getElementById&&!document.all?1:0

var head="display:''"
var folder=''

function expandit(curobj){
folder=ns6?curobj.nextSibling.nextSibling.style:document.all[curobj.sourceIndex+1].style
if (folder.display=="none")
folder.display=""
else
folder.display="none"
}


function ltrim ( s )
{
	return s.replace( /^\s*/, "" );
}

function rtrim ( s )
{
	return s.replace( /\s*$/, "" );
}

function trim ( s )
{
	return rtrim(ltrim(s));
}

function setRequestString(str) {
   requestString = str;
}


function searchMoreLikeThis() {
	var isFirst = true;
	var qString = ' ';
	if ( document.article.moreLikeThis.length ) {
    for ( i =0 ; i <document.article.moreLikeThis.length  ; i++ )
    {
        if (document.article.moreLikeThis[i].checked)
        {
            if (!isFirst)
            {
                qString = qString + ' AND ';
            }
            isFirst = false;
            qString = qString + stripStrings(document.article.moreLikeThis[i].value, false); 
        }
    }
    } else {
       // only one in the list
       if ( document.article.moreLikeThis.checked ) {
              isFirst = false;
            qString = qString + stripStrings(document.article.moreLikeThis.value, false); 
       }
    }

    if ( isFirst)
    { 
        alert("Please select a term to search.");
        return;
    }
    // escape not needed
	document.article.SQ.value = qString;
	document.article.submit();
    return;
}

function resetMoreLikeThis() {
	if ( document.article.moreLikeThis.length ) {
	    for ( i =0 ; i <document.article.moreLikeThis.length  ; i++ )
        {
            document.article.moreLikeThis[i].checked = false;
        }
	} else {
         document.article.moreLikeThis.checked = false;
	}
}

function stripStrings(str, isO) {

   //alert("Entered stripStrings:  " + str);
  
   
   if ( isO) {
       str = stringReplace(str, "(", " ");
       str = stringReplace(str, ")", " ");
   }
     
   if ( !isO) {
      //tempString = 'NA(abcded(def))';
      // check for double 
      index = str.indexOf('(');
      if ( index != -1 ) {
          substr = str.substring(index+1, str.length);
          subindex = substr.indexOf('(');
          if ( subindex != -1) {
             // We have multiple paranthesis
             temp1 = str.substring(0, subindex+index+1);
             // NEW ADDITION... STRIP OFF EVERYTHING in paranthesis
             //temp2 = str.substring(subindex+index+2, str.length);
             // str = temp1 + temp2;
             str = temp1 + ')';
             //endIndex = str.indexOf(')');
             //if ( endIndex != -1 ) {
               // str = str.substring(0, endIndex) + str.substring(endIndex+1, str.length);
             //}
          }
      }
//      alert("stripStrings exiting:  " + str);
   }
   
   str = stringReplace(str, '[', ' ');
   str = stringReplace(str, ']', ' ');
   str = stringReplace(str, '{', ' ');
   str = stringReplace(str, '}', ' ');
   str = stringReplace(str, ';', ' ');
   
   while(str.indexOf('<hHl>') >= 0 || str.indexOf('</hHl>') >= 0)
   {
      str = stringReplace(str, '<hHl>','');
      str = stringReplace(str, '</hHl>','');
   }
   str = stringReplace(str, '<', ' ');
   str = stringReplace(str, '>', ' ');
   str = stringReplace(str, 'hHl', '  ');
   str = stringReplace(str, '/hHl', '');
   str = stringReplace(str, ',,', ',');
   str = stringReplace(str, ', ,', ',');
   str = stringReplace(str, '  ', ' ');
   // Do it twice just so that if we have "  ,"
   str = stringReplace(str, ' ,',',');
   str = stringReplace(str, ' ,',',');
   //alert("returning from stripstrings: " + str);
   return str;
}


function searchSideWays(sf, str) {
   //alert("ssw entered: " + str);
   str = stripStrings(str, true);
   //alert("after stripStrings:  " + str);
   document.article.SQ.value = sf + '(' + str + ')';
   //alert("SearchSideWays sq.value: " + document.article.SQ.value);
   document.article.submit();
   return false;
}

function searchSideWaysNYTI(str) {
   //alert("ssw entered: " + str);
    str = stripStringsNYTI(str);
   //alert("after stripStrings:  " + str);
   document.article.SQ.value = str;
   //alert("SearchSideWays sq.value: " + document.article.SQ.value);
   document.article.submit();
   return false;
}

function stripStringsNYTI(str) {

   //alert("Entered stripStrings:  " + str);
  
       
   str = stringReplace(str, '[', ' ');
   str = stringReplace(str, ']', ' ');
   str = stringReplace(str, '{', ' ');
   str = stringReplace(str, '}', ' ');
   str = stringReplace(str, ';', ' ');
   
   while(str.indexOf('<hHl>') >= 0 || str.indexOf('</hHl>') >= 0)
   {
      str = stringReplace(str, '<hHl>','');
      str = stringReplace(str, '</hHl>','');
   }
   str = stringReplace(str, '<', ' ');
   str = stringReplace(str, '>', ' ');
   str = stringReplace(str, 'hHl', '  ');
   str = stringReplace(str, '/hHl', '');
   str = stringReplace(str, ',,', ',');
   str = stringReplace(str, ', ,', ',');
   str = stringReplace(str, '  ', ' ');
   // Do it twice just so that if we have "  ,"
   str = stringReplace(str, ' ,',',');
   str = stringReplace(str, ' ,',',');
   //alert("returning from stripstrings: " + str);
   return str;
}


function stringReplace(str1, str2, str3) { 

 //alert("Entered stringReplace:  " + str1 + "|"+ str2 + "|" + str3); 
 if(str2 == "(" || str2 == ")" || str2 == "[" || str2 == "]")
 {
  str1 = str1.split(str2).join(str3);  //<-- SLOW
 // This doesn't work in netscape
    while(str1.indexOf(str2) != -1) {
      //alert("replacing: " + str2);
      str1 = str1.replace(str2, str3);
    } 
 }
 else 
 {
     while(str1.indexOf(str2) != -1) {
       str1 = str1.replace(str2, str3);
      }
 }
 //str1 = str1.split(str2).join(str3);  //<-- SLOW
 // This doesn't work in netscape
 //while(str1.indexOf(str2) != -1) {
 //  str1 = str1.replace(str2, str3);
 //} 
 //alert("Returning from stringReplace: " + str1);
 return str1;     
} 

function doTranslation(baseLocation)
{
    var translationLang = document.article.translang.options[document.article.translang.selectedIndex].value;
    if(translationLang == "#")
    {
        return;
    }    
    var transLocation = baseLocation + "&tw=1";
    transLocation = transLocation + "&arttran=" + translationLang;
  
    document.location = transLocation;
}

function doTranslationLink(baseLocation, langPair)
{    
    var transLocation = baseLocation + "&tw=1";
    transLocation = transLocation + "&arttran=" + langPair;
    document.location = transLocation;
}

function fixURL(sID, oldURL) {

	var oSpan = document.getElementById(sID);
	if (oSpan) {
		var newURL = wrapString(oldURL);
		oSpan.innerHTML = newURL;
	}
}

function wrapString(wstring)
{
	var magicBreak = "<wbr>";	// obscure tag that tells browser to wrap if it needs to
	// I really dislike using specific browser sniffing, but in 
	// this case there is no choice. Safari doesn't support <wbr>.
	if (typeof navigator.vendor != "undefined")
		if (navigator.vendor.indexOf("Apple") != -1)
			magicBreak = "&shy;";
	
	var newString = "";
	
	newString = wstring.replace(/&/g, magicBreak+"&");
	newString = newString.replace(/\?/g, magicBreak+"?");
	newString = newString.replace(/\./g, magicBreak+".");
	newString = newString.replace(/\-/g, magicBreak+"-");
	var bHasSpan = (wstring.indexOf('class="hHl"') == -1) ? false : true;
	if (newString == wstring) { // nothing was changed
			
		if (bHasSpan) {
       		wstring = stringReplace(wstring,'<span class="hHl">',String.fromCharCode(1));
       		wstring = stringReplace(wstring,'</span>',String.fromCharCode(2));
       }
		
		// allow a break every 10 characters
		newString = "";
		var iStart = 0;
		var insertEvery = 10;
		var tenChars = "";
		while (iStart < wstring.length) {
			tenChars = wstring.substr(iStart, insertEvery);
			// if there is a space in this chunk, don't add a <wbr>
			newString += tenChars;
			if (tenChars.indexOf(' ') == -1)
				newString += magicBreak;
			
			iStart += insertEvery;
		}
		
		if (bHasSpan) {
	       newString = stringReplace(newString,String.fromCharCode(1),'<span class="hHl">');
    	   newString = stringReplace(newString,String.fromCharCode(2),'</span>');
    	}
	}
	return newString;
}
