var inputFrom;
var inputTo;
var listQuantities;
var selectQuantity;
var selectFrom;
var selectTo;
var precision;
var quantity;
var metaTagDescription;
var divSettings;
var divWhatsNew;
var divDisclaimer;
var divTips;
var currencies;

var defaultQuantityIndex = 9;
var quantities = [
  {
    name: "Bits & Bytes",
    description: "Convert bits, bytes, kilobytes, gigabytes.",
    path: "bits.htm",
    defaultUnitIndex: 5,
    units: [
      ["bits", "", 0.125],
      ["bytes", "", 1],
      ["kilobits", "Kb", 128],
      ["kilobytes", "KB", 1024],
      ["megabits", "Mb", 131072],
      ["megabytes", "MB", 1048576],
      ["gigabits", "Gb", 134217728],
      ["gigabytes", "GB", 1073741824],
      ["terabits", "Tb", 137438953472],
      ["terabytes", "TB", 1099511627776],
      ["petabits", "Pb", 140737488355328],
      ["petabytes", "PB", 1125899906842624],
      ["exabits", "Eb", 144115188075855872],
      ["exabytes", "EB", 1152921504606846976]
    ]
  },
  {
    name: "Fuel Consumption",
    description:
      "Convert fuel consumption measurements like kilometers/liter, liters/100km, miles/gallon.",
    path: "fuel_consumption.htm",
    defaultUnitIndex: 5,
    units: [
      ["gallons (UK)/100 miles", "", 2.8248093633182215859381213711925e-5],
      ["gallons (US)/100 miles", "", 2.3521458333333333333333333333333e-5],
      ["kilowatt hours/100 miles", "kWh/100 mi", 6.979661226508e-7],
      ["kilowatt hours/kilometer", "kWh/km", 0.00011232675916913290752],
      ["kilometer/liter", "km/l", "0.001 / value", "0.001 / value"],
      ["liters/100 kilometer", "", 0.00001],
      ["liters/meter", "l/m", 1],
      [
        "miles/gallon (UK)",
        "mpg",
        "2.8248093633182215859381213711925e-3 / value",
        "2.8248093633182215859381213711925e-3 / value"
      ],
      [
        "miles/gallon (US)",
        "mpg",
        "2.3521458333333333333333333333333e-3 / value",
        "2.3521458333333333333333333333333e-3 / value"
      ],
      [
        "miles/liter",
        "mi/l",
        "6.2137119223733396961743418436332e-4 / value",
        "6.2137119223733396961743418436332e-4 / value"
      ],
      ["car (2016 Nissan Leaf)", "", 0.00002063285818713],
      ["car (2016 Tesla Model S - 90D)", "", 0.00002556680253623],
      ["car (2016 Honda Accord)", "", 0.00009408583333333],
      ["car (2015 US Average)", "", 0.0000926041666666666666]
    ]
  },
  {
    name: "Length",
    description:
      "Convert length measurements like meter, inches, feet or light years.",
    path: "length.htm",
    defaultUnitIndex: 18,
    units: [
      ["Ã¥ngstrÃ¶ms", "Ã…", 1e-10],
      ["astronomical units", "au", 149598550000],
      ["barleycorns", "", 0.008467],
      ["cables", "", 182.88],
      ["centimeters", "cm", 0.01],
      ["chains (surveyors')", "", 20.116840233680467360934721869444],
      ["decimeters", "dm", 0.1],
      ["ells (UK)", "", 0.875],
      ["ems (pica)", "", 0.0042333],
      ["fathoms", "", 1.8288],
      ["feet (UK & US)", "", 0.3048],
      ["feet (US survey)", "", 0.30480060960121920243840487680975],
      ["furlongs", "", 201.168],
      ["hands", "", 0.1016],
      ["hectometers", "hm", 100],
      ["inches", "in", 0.0254],
      ["kilometers", "km", 1000],
      ["light years", "", 9.460528405e15],
      ["meters", "m", 1],
      ["micrometers", "Âµm", 1e-6],
      ["mil", "", 0.0000254],
      ["miles (UK & US)", "", 1609.344],
      ["miles (nautical, international)", "", 1852],
      ["miles (nautical, UK)", "", 1853.184],
      ["millimeters", "mm", 0.001],
      ["nanometers", "nm", 1e-9],
      ["parsecs", "", 3.0856776e16],
      ["picometers", "pm", 1e-12],
      ["Scandinavian mile", "", 10000],
      ["thou", "", 0.0000254],
      ["yards", "", 0.9144]
    ]
  }
];

function findQuantityIndexFromPathname(aPathname) {
  for (var i = 0; i < quantities.length; i++) {
    if (aPathname == quantities[i].path) return i;
  }
}

function onDOMLoaded() {
  inputFrom = document.getElementById("inputFrom");
  inputTo = document.getElementById("inputTo");
  selectQuantity = document.getElementById("selectQuantity");
  listQuantities = document.getElementById("listQuantities");
  selectFrom = document.getElementById("selectFrom");
  selectTo = document.getElementById("selectTo");
  divSettings = document.getElementById("settings");
  divWhatsNew = document.getElementById("whatsNew");
  divDisclaimer = document.getElementById("disclaimer");
  divTips = document.getElementById("tips");
  precision = loadData("precision", 6);

  var i;
  // Update description meta tag
  var lMetaTags = document.getElementsByTagName("meta");
  for (i = 0; i < lMetaTags.length; i++) {
    if (lMetaTags[i].getAttribute("name") == "description") {
      metaTagDescription = lMetaTags[i];
      break;
    }
  }

  var lListItems = "";
  for (i = 0; i < quantities.length; i++) {
    addSelectOption(selectQuantity, quantities[i].name, "");
    lListItems +=
      '<li id="list-item' +
      i +
      '"><a class="list-a" href="' +
      quantities[i].path +
      '">' +
      quantities[i].name +
      "</a></li>";
  }
  listQuantities.innerHTML = lListItems;

  // Check if url contains a quantity
  var lURLFilename = getURLFilename();
  var lURLIndex;
  if (lURLFilename.length > 1) {
    lURLIndex = findQuantityIndexFromPathname(lURLFilename);
  }
  selectQuantity.selectedIndex =
    lURLIndex != undefined
      ? lURLIndex
      : loadData("lastQuantityIndex", defaultQuantityIndex);
  loadQuantity(selectQuantity.selectedIndex);
}

function getURLFilename() {
  var lPath = window.location.pathname.substr(1).split("/");
  return lPath[1];
}

document.onclick = function () {
  closeSettings();
};

window.onkeydown = function (event) {
  if (event.keyCode == 27) closeSettings();
};

window.onpopstate = function () {
  var lPath = window.location.pathname.substr(1).split("/");
  var lURLIndex;
  if (lPath.length > 1) {
    lURLIndex = findQuantityIndexFromPathname(lPath[1]);
  }
  selectQuantity.selectedIndex =
    lURLIndex != undefined ? lURLIndex : loadData("lastQuantityIndex", 0);
  loadQuantity(selectQuantity.selectedIndex, false);
};

function loadQuantity(aIndex, aPushState) {
  aPushState = aPushState == undefined ? true : aPushState;
  quantity = quantities[aIndex];
  saveData("lastQuantityIndex", aIndex);
  document.title = "Convert " + quantity.name + " - Unit Converter";
  if (aPushState && history.pushState && getURLFilename() != quantity.path) {
    history.pushState(null, document.title, quantity.path);
  }
  var lTitle = "";
  var lSymbol = "";
  removeSelectOptions(selectFrom);
  removeSelectOptions(selectTo);
  var i;
  for (i = 0; i < quantity.units.length; i++) {
    lSymbol = quantity.units[i][1];
    lSymbol = lSymbol.length > 0 ? " [" + lSymbol + "]" : "";
    lTitle = quantity.units[i][0] + lSymbol;
    addSelectOption(selectFrom, lTitle, "");
    addSelectOption(selectTo, lTitle, "");
  }
  document.getElementById("quantity-title").innerHTML =
    "Convert " + quantity.name;
  metaTagDescription.content = quantity.description;
  inputFrom.value = loadData("input" + quantity.name, 1);
  loadUnits();
  selectQuantity.selectedIndex = aIndex;
  var lItemID = "";
  for (i = 0; i < quantities.length; i++) {
    lItemID = "list-item" + i;
    if (i == aIndex)
      document.getElementById(lItemID).className = "selectedItem";
    else document.getElementById(lItemID).className = "";
  }

  convert();
}

if (document.addEventListener) {
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      onDOMLoaded();
    },
    false
  );
  // IE8 and older do not support DOMContentLoaded
} else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") {
      onDOMLoaded();
    }
  });
}

var lTempDiv = document.createElement("div");
lTempDiv.innerHTML = "<!--[if lt IE 10]><i></i><![endif]-->";
var isIE9AndLower = lTempDiv.getElementsByTagName("i").length == 1;

// Works in IE8: IE8 does not work with innerHTML or adding <option> html elements.
function addSelectOption(aSelect, aName, aValue) {
  aSelect.options[aSelect.options.length] = new Option(aName, aValue);
}

// Shim: IE8 does not support Date.now
if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

function removeSelectOptions(aSelect) {
  for (var i = aSelect.options.length - 1; i >= 0; i--) aSelect.remove(i);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function callServer(aURL, aCallback, aAsync) {
  if (aAsync === undefined) {
    aAsync = true;
  }

  var lXMLHttp = new XMLHttpRequest();
  lXMLHttp.onreadystatechange = function () {
    if (lXMLHttp.readyState == 4 && lXMLHttp.status == 200)
      aCallback(lXMLHttp.responseText);
  };

  // Note: Use POST to prevent IE from caching the AJAX request
  lXMLHttp.open("GET", aURL, aAsync);
  lXMLHttp.send();
}

function getCurrencyRate(aFrom, aTo) {
  // Load currency data from server
  if (
    currencies == undefined ||
    Date.now() - getCurrencyRate.cache_timestamp > 1000 * 60 * 1
  ) {
    var lURL = "currencies.php";
    callServer(
      lURL,
      function (aResponse) {
        currencies = JSON.parse(aResponse);
        getCurrencyRate.cache_timestamp = Date.now();
      },
      false
    );
  }

  var lFromRate = aFrom == "USD" ? 1 : currencies.rates[aFrom];
  var lToRate = aTo == "USD" ? 1 : currencies.rates[aTo];

  return lToRate / lFromRate;
}

function setConversionInfo(aText) {
  var lDiv = document.getElementById("conversionInfo");
  if (aText == "") {
    lDiv.innerHTML = "";
    lDiv.display = "none";
  } else {
    lDiv.innerHTML = aText;
    lDiv.display = "block";
  }
}

function refreshCurrency() {
  convert(true);
}

function ConvertInternal(aFromUnitIndex, value, aToUnitIndex, aAnimate) {
  aAnimate = aAnimate || false;
  setConversionInfo("");
  var lUnit = quantities[selectQuantity.selectedIndex];
  var lUnitFromFactor = lUnit.units[aFromUnitIndex][2];
  var lUnitToFactor = lUnit.units[aToUnitIndex][2];

  if (quantity.name == "Currency") {
    var lRate = getCurrencyRate(lUnitFromFactor, lUnitToFactor);
    value = value * lRate;
    var lDate = new Date(currencies.timestamp * 1000);
    setConversionInfo(
      lUnitFromFactor +
        "/" +
        lUnitToFactor +
        " exchange rate: " +
        lRate.toFixed(4) +
        " at " +
        lDate.toLocaleString() +
        '<img id="imageRefresh" src="images/refresh.png" onclick="refreshCurrency();"><img id="imageRefreshProgress" src="images/progress_refresh.gif">'
    );
    if (aAnimate) {
      var lImgRefresh = document.getElementById("imageRefresh");
      var lImgProgress = document.getElementById("imageRefreshProgress");

      lImgRefresh.style.display = "none";
      lImgProgress.style.display = "inline";

      setTimeout(function () {
        lImgRefresh.style.display = "inline";
        lImgProgress.style.display = "none";
      }, 1000);
    }
  } else {
    if (isNumber(lUnitFromFactor)) {
      value = value * lUnitFromFactor;
    } else {
      value = eval(lUnitFromFactor);
    }

    if (isNumber(lUnitToFactor)) {
      value = value / lUnitToFactor;
    } else {
      value = eval(lUnit.units[aToUnitIndex][3]);
    }
  }
  return value;
}

function ie9minusConvert() {
  // oninput does not work in IE8- and is buggy in IE9. So we use the onkeyup even for ie9- not ideal (eg paste does not work),
  // but that is how the old converter worked.
  if (isIE9AndLower) convert();
}

function ie9minusConvertBack() {
  if (isIE9AndLower) convertBack();
}

function switchUnits() {
  var lToIndex = selectFrom.selectedIndex;
  selectFrom.selectedIndex = selectTo.selectedIndex;
  selectTo.selectedIndex = lToIndex;
  saveUnits();
  convert();
}

function loadUnits() {
  function findIndexByText(aText) {
    for (var i = 0; i < quantity.units.length; i++) {
      if (quantity.units[i][0] == aText) return i;
    }
    return -1;
  }

  selectFrom.selectedIndex = findIndexByText(
    loadData("from" + quantity.name, "")
  );
  // Index backup for backward compatibility
  if (selectFrom.selectedIndex == -1)
    selectFrom.selectedIndex = loadData(
      "fromIndex" + quantity.name,
      quantity.defaultUnitIndex
    );

  selectTo.selectedIndex = findIndexByText(loadData("to" + quantity.name, ""));
  if (selectTo.selectedIndex == -1)
    selectTo.selectedIndex = loadData(
      "toIndex" + quantity.name,
      quantity.defaultUnitIndex
    );
}

function saveUnits() {
  saveData("from" + quantity.name, quantity.units[selectFrom.selectedIndex][0]);
  saveData("to" + quantity.name, quantity.units[selectTo.selectedIndex][0]);
}

function onChangeUnit() {
  saveUnits();
  convert();
}

function formatFloat(aFloat) {
  // http://stackoverflow.com/questions/7312468/javascript-round-to-a-number-of-decimal-places-but-strip-extra-zeros
  return parseFloat(aFloat.toFixed(precision));
}

function convert(aAnimate) {
  var lFromValue = parseFloat(inputFrom.value);
  if (isNaN(lFromValue)) {
    inputTo.value = "";
  } else {
    var lUnitFromIndex = selectFrom.selectedIndex;
    var lUnitToIndex = selectTo.selectedIndex;

    var lResult = ConvertInternal(
      lUnitFromIndex,
      lFromValue,
      lUnitToIndex,
      aAnimate
    );
    inputTo.value = formatFloat(lResult);
    saveData("input" + quantity.name, lFromValue);
  }
}

function convertBack() {
  var lFromValue = parseFloat(inputTo.value);

  if (isNaN(lFromValue)) {
    inputFrom.value = "";
  } else {
    var lUnitFromIndex = selectTo.selectedIndex;
    var lUnitToIndex = selectFrom.selectedIndex;

    var lResult = ConvertInternal(lUnitFromIndex, lFromValue, lUnitToIndex);
    inputFrom.value = formatFloat(lResult);
  }
}

function saveData(aName, aValue) {
  try {
    localStorage.setItem(aName, aValue);
  } catch (e) {
    // Do nothing Safari in Private mode can not set localstorage.
  }
}

function loadData(aName, aDefaultValue) {
  var lValue = localStorage.getItem(aName);
  if (lValue != null) return lValue;
  else return aDefaultValue;
}

function stopEventPropagation(aEvent) {
  if (aEvent.stopPropagation) {
    aEvent.stopPropagation();
  } else if (window.event) {
    window.event.cancelBubble = true;
  }
}

function toggleSettings(event) {
  divSettings.style.display =
    divSettings.style.display != "block" ? "block" : "none";
  document.getElementById("inputOptionsDigits").value = precision;
  stopEventPropagation(event);
}

function toggleInfoForm(event, aDiv) {
  if (aDiv.clientHeight < 10) {
    aDiv.style.maxHeight = "0";
    setTimeout(function () {
      aDiv.style.display = "block";
      setTimeout(function () {
        aDiv.style.maxHeight = "450px";
      }, 10);
    }, 10);
  } else {
    aDiv.style.maxHeight = "0";
    setTimeout(function () {
      aDiv.style.display = "none";
    }, 500);
  }
  stopEventPropagation(event);
}

function toggleWhatsNew(event) {
  toggleInfoForm(event, divWhatsNew);
}

function toggleTips(event) {
  toggleInfoForm(event, divTips);
}

function toggleDisclaimer(event) {
  toggleInfoForm(event, divDisclaimer);
}

function closeSettings() {
  divSettings.style.display = "none";
}

function ie9minusSavePrecision() {
  if (isIE9AndLower) savePrecision();
}

function savePrecision() {
  precision = parseInt(document.getElementById("inputOptionsDigits").value);
  if (isNumber(precision)) {
    precision = precision <= 17 ? precision : 17;
    precision = precision >= 2 ? precision : 2;
    saveData("precision", precision);
    convert();
  }
}