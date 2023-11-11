function _1(md){return(
md`# HW2 Strong baseline (2pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _cCounts(){return(
[]
)}

function _cList(){return(
["牡羊座","金牛座","雙子座","巨蟹座","獅子座","室女座","天秤座","天蠍座","射手座","摩羯座","水瓶座","雙魚座"]
)}

function _constellations(data){return(
data.map(item => item.Constellation)
)}

function _6(cCounts,cList,data)
{
  cCounts.length = 0; //將cCounts清空
  var minC = 0; //牡羊座
  var maxC = 11; //雙魚座
  for (var y=minC; y<=maxC; y++) { 
    //所有星座都建立兩個Object，一個存放男性資料，一個存放女性資料
    cCounts.push({conNum:y,Constellation:cList[y], gender:"male", count:0}); 
    //Object包含：1. 星座，2.男性，3.人數(設為0)
    cCounts.push({conNum:y,Constellation:cList[y], gender:"female", count:0}); 
    //Object包含：1. 星座，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Constellation-minC)*2 + (x.Gender== "男" ? 0 : 1); 
    cCounts[i].count++;
    //讀取data array，加總每個星座的人
  })
  return cCounts
}


function _7(Plot,cList,cCounts){return(
Plot.plot({
  grid: true,
  y: {label: "count"},
  x:{domain:cList},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(cCounts, {x: "Constellation", y: "count", tip: true , fill:"gender"}),
  ]
})
)}

function _8(Plot,data,cList){return(
Plot.plot({
  grid: true,
  y: {grid: true, label: "count"},
	marks: [    
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Constellation", interval:1, fill:"Gender", tip: true,title: (d,i)=> `Constellation:${cList[d.Constellation]}\nGender:${d.Gender}\nCount:`})),  
    Plot.axisX({tickFormat:(d)=>cList[d], interval:1}),
		Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 }),
	 ],

})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("cCounts")).define("cCounts", _cCounts);
  main.variable(observer("cList")).define("cList", _cList);
  main.variable(observer("constellations")).define("constellations", ["data"], _constellations);
  main.variable(observer()).define(["cCounts","cList","data"], _6);
  main.variable(observer()).define(["Plot","cList","cCounts"], _7);
  main.variable(observer()).define(["Plot","data","cList"], _8);
  return main;
}
