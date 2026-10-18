
let e=2.718281828459045;let roots_of_e=[e];kth_sq_root=e;for(let k=0x1;k<=0x4;k++){kth_sq_root=Math['sqrt'](kth_sq_root);roots_of_e['push'](kth_sq_root);}let x=[];let ex=[];let current=0x1;for(let k=0x1;k<=0x3*0x10;k++){x['push'](k/0x10);ex['push'](current);current=current*kth_sq_root;}var trace={'x':x,'y':ex,'mode':'markers','type':'scatter'};Plotly['newPlot']('x_ex_scatterplot',[trace]);
