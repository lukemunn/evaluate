// Depends on heatmap.js, included

let heatmap = undefined;


function countTheories() {
    let vals = [];
    let eco = 0, emp = 0, str = 0, nud = 0;
    for (let i = 0; i < selectedIndicators.length; i++) {
        let indicator = selectedIndicators[i];
        let a = Math.random() * Math.PI * 2.0;
        if (indicator.theory.indexOf('ecological') > -1)
            eco++
        if (indicator.theory.indexOf('empowerment') > -1)
            emp++;
        if (indicator.theory.indexOf('strain') > -1)
            str++;
        if (indicator.theory.indexOf('nudging') > -1)
            nud++;
    }
    console.log(eco, emp, str, nud);
}


function generateHeatmap() {
    let hmDiv = document.querySelector('.heatmap');
    const offset = 10;
    // Random dots - replace with indicator data
    const dotCount = 100;
    const distance = 50;
    const expM = 2;
    const rad = 150;
    const fh = 24;
    const spacing = 6;
    const lh = fh + spacing;

    let vals = [];
    let eco = 0, emp = 0, str = 0, nud = 0;
    for (let i = 0; i < selectedIndicators.length; i++) {
        let indicator = selectedIndicators[i];
        if (indicator.theory.indexOf('ecological') > -1) {
            eco++
        }
        if (indicator.theory.indexOf('empowerment') > -1) {
            emp++;
        }
        if (indicator.theory.indexOf('strain') > -1) {
            str++;
        }
        if (indicator.theory.indexOf('nudging') > -1) {
            nud++;
        }
    }
    let total = 2 + eco + emp + str + nud;
    let gravity = 60 / Math.log(total), weight = 6;
    if (eco > 0)
        vals.push({x:300, y: 300 - (eco * gravity), value: eco, radius: rad});
    if (emp > 0)
        vals.push({x:300 - (emp * gravity), y: 300, value: emp, radius: rad});
    if (str > 0)
        vals.push({x:300 + (str * gravity), y: 300, value: str, radius: rad});
    if (nud > 0)
        vals.push({x:300, y: 300 + (nud * gravity), value: nud, radius: rad});

    // Add some pseudo-random values
    for (let i = 0; i < selectedIndicators.length; i++) {
        let indicator = selectedIndicators[i];
        // let a = Math.random() * Math.PI * 2.0;
        let a = i / 20 * Math.PI * 2.0;
        // let d = (Math.pow(Math.E, Math.random() * expM) - 1.0) * distance;
        let d = distance;
        let x = Math.cos(a) * d;
        let y = Math.sin(a) * d;
        //vals.push({x:300+Math.round(x), y: 300+Math.round(y), value: Math.floor(Math.random() * 10)});
        // vals.push({x:300+Math.round(x), y: 300+Math.round(y), value: 1});
        if (indicator.theory.indexOf('ecological') > -1) {
            vals.push({x:300 + x, y: 300 - (eco * gravity) + y, value: 1, radius: rad});
        }
        if (indicator.theory.indexOf('empowerment') > -1) {
            vals.push({x:300 - (emp * gravity) + x, y: 300 + y, value: 1, radius: rad});
        }
        if (indicator.theory.indexOf('strain') > -1) {
            vals.push({x:300 + (str * gravity) + x, y: 300 + y, value: 1, radius: rad});
        }
        if (indicator.theory.indexOf('nudging') > -1) {
            vals.push({x:300 + x, y: 300 + (nud * gravity) + y, value: 1, radius: rad});
        }
    }
    
    
    
        

    if (heatmap === undefined) {
        heatmap = h337.create({
            container: document.querySelector('.heatmap')
        });
    }

    var nuConfig = {
        radius: rad,
        maxOpacity: .85,
        minOpacity: 0.05,
        blur: .5 + 0.5 * (total / 20)
      };
    heatmap.configure(nuConfig);
    
    heatmap.setData({
        max: weight,
        data: vals
    });
    heatmap.repaint();

    let canvas = heatmap._renderer.canvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.moveTo(10, 10);
    ctx.lineTo(100, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offset, offset);
    ctx.lineTo(width - offset, height - offset);
    ctx.moveTo(width - offset, offset);
    ctx.lineTo(offset, height - offset);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'green';
    ctx.font = fh + 'px serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText('Macro', width / 2, offset + lh * 0);
    ctx.fillText('(ecological systems)', width / 2, offset + lh * 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText('Meso', offset, height / 2 -  lh * 0.5);
    ctx.fillText('(empowerment)', offset, height / 2 +  lh * 0.5);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText('Meso', width - offset, height / 2 -  lh * 0.5);
    ctx.fillText('(strain)', width - offset, height / 2 +  lh * 0.5);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText('Micro', width / 2, height - offset - lh * 1 );
    ctx.fillText('(behaviour)', width / 2, height - offset - lh * 0);

    // ctx.translate(width / 2, height / 2);
    /*
    ctx.moveTo(0, 0);
    ctx.fillStyle = `rgba(255, 0, 0, 1)`;
    for (let i = 0; i < vals.length; i++) {
        let inst = vals[i];
        let x = inst.x;
        let y = inst.y;
        let v = inst.value;
        ctx.moveTo(x, y);
        ctx.ellipse(x, y, rad, rad, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    */
}
