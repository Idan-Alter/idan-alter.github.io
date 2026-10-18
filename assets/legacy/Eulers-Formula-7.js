
let slider=document['getElementById']('x_range');let output=document['getElementById']('output');output['innerHTML']='<code>\x201\x20+\x20'+slider['value']+'i<code>';slider['oninput']=function(){output['innerHTML']='<code>\x201\x20+\x20'+this['value']+'i<code>';};
