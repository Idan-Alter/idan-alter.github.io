function makeGrid(p,origin, v0, v1, myColor) {
    p.push();
    p.stroke(myColor);
    p.strokeWeight(0.5)
    
    let up = origin.copy();
    let down = origin.copy();
    
    let v1mega = v1.copy().setMag(10 ** 4 * p.max(p.width, p.height));
    
    for (let k = 0; k <= 10; k++) {
      
      let upv1 = p5.Vector.add(up, v1mega);
      let downv1 = p5.Vector.sub(up, v1mega);
      p.line(upv1.x, upv1.y, downv1.x, downv1.y);
        // I should calculate here the intersection of the line with the canvas, but taking a huge step up and down the line will usually cover the entire visible area. it's a hack, but it works.
      
      up.add(v0);
  
      upv1 = p5.Vector.add(down, v1mega);
      downv1 = p5.Vector.sub(down, v1mega);
      p.line(upv1.x, upv1.y, downv1.x, downv1.y);
      down.sub(v0);
    }
    p.pop();
  }