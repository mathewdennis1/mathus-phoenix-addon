
define(function (require, exports, module) {
    
     var    ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
             EventDispatcher = brackets.getModule("utils/EventDispatcher");
    
 //initialize variables
let R, r, G, g, B, b;
   
// get rgb convert it to arry then to hex
function rgb_to_hex_converter(rgb ){
   // alert(rgb);//works this much
   var splited= rgb_split(rgb) ;
   var rgb_in_hex = rgbToHex (splited[0], splited[1], splited[2]);
      //  alert(rgb_in_hex);
    return (rgb_in_hex);
}
    //split rgb css string  and return an object with r,g,b components.
function rgb_split(rgb) {
  rgb = rgb.substring(4, rgb.length-1)
         .replace(/ /g, '')
         .split(',');
    var  r= rgb[0];
    var g= rgb[1];
    var b= rgb[2];
   // alert ('rgb split'); alert (r); alert (g); alert (b);
    return (rgb);
}

// takes rgb values as input and 
//convert rgb to hex and return hex

function rgbToHex(r, g, b) {
   // alert (r);
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
    
function componentToHex(c) {
  //alert(c);
  let numb = Number(c);
  let hex = numb.toString(16);
  //alert(hex);
  return hex.length === 1 ? "0" + hex : hex;
}


//------------------------
    
// conver rgb object to a css readable property 
// and does color transforms (optional)
  function   rgb_gen(r,g,b, transform_to ) {
        if(transform_to === 'primary'){
            //do that part 
            R = r + (0.15 * (255 - r)); G = g + (0.15 * (255 - g)); B = b + (0.15 * (255 - b));
        }
        else if (transform_to === 'secondry'){
            R = r + (0.75 * (255 - r)); G = g + (0.75 * (255 - g)); B = b + (0.75 * (255 - b));
        }
        else if (transform_to === 'sidebar_bg'){
            R= r/4 ;G=g/4; B=g/4 ;
        }
        else{ r=R; g=G ; b=B;
        }
        //alert('we are at rgb gen'); alert(r); alert(g);alert(b);
        R=Math.round(R)   ;    G=Math.round(G)  ;   B=Math.round(B)  ;
        return "rgb( "+ R +" "+ G +" " + B +" )";

    }
  //--------------------------------  
    
   // rgb to hsl 
    // there is an error in s value
   function RGBToHSLObject(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s? l === r? (g - b) / s : l === g? 2 + (b - r) / s: 4 + (r - g) / s: 0;
  return [
     Math.round(   60 * h < 0 ? 60 * h + 360 : 60 * h    ),
     Math.round(   100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)  ),
     Math.round(  (100 * (2 * l - s)) / 2                 )
  ];
}

    EventDispatcher.makeEventDispatcher(exports);

    exports.rgb_to_hex_converter       = rgb_to_hex_converter;
    exports.rgb_split                  = rgb_split;
    exports.rgb_gen                    = rgb_gen;
    exports.RGBToHSLObject             = RGBToHSLObject;
});