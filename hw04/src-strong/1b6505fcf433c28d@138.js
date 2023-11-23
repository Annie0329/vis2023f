function _1(md){return(
md`# HW04 Strong`
)}

function _artist(__query,FileAttachment,invalidation){return(
__query(FileAttachment("artist.csv"),{from:{table:"artist"},sort:[],slice:{to:null,from:null},filter:[],select:{columns:null}},invalidation)
)}

function _sdgKey(artist){return(
Object.keys(artist[0])[4]
)}

function _tKey(artist){return(
Object.keys(artist[0])[9]
)}

function _sdgColumn(artist,sdgKey){return(
artist.map(row => row[sdgKey])
)}

function _tColumn(artist,tKey){return(
artist.map(row => row[tKey])
)}

function _values(sdgColumn){return(
[...new Set(sdgColumn)].sort()
)}

function _sdgCounts(values,sdgColumn){return(
values.map(val => ({
  value: val,
  count: sdgColumn.filter(v => v === val).length
}))
)}

function _tCounts(values,tColumn){return(
values.map(val => ({
  value: val,
  count: tColumn.filter(v => v === val).length
}))
)}

function _data(sdgCounts,tCounts){return(
sdgCounts.flatMap((item, index) => ([
  {
    value: item.value,
    count: item.count,
    series: '聯合國永續發展目標（SDGs）'
  },
  {
    value: item.value,
    count: tCounts[index].count,
    series: '台灣 2050 淨零排放'
  }
]))
)}

function _11(md){return(
md`# 您對於聯合國永續發展目標（SDGs）/台灣 2050 淨零排放的瞭解在那個相對位置？`
)}

function _selectedSeries(Inputs){return(
Inputs.checkbox(["聯合國永續發展目標（SDGs）", "台灣 2050 淨零排放"], {label: "選擇資料集", value: ["聯合國永續發展目標（SDGs）", "台灣 2050 淨零排放"]})
)}

function _chart1(data,selectedSeries,d3)
{
  // 定義邊界大小，以及圖形的寬度和高度
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // 取得所有的系列名稱（無重複）
  const keys = Array.from(new Set(data.map(d => d.series)));
  
  // 根據選擇的系列過濾數據
  const filteredData = data.filter(d => selectedSeries.includes(d.series));

  // 對過濾後的數據進行分組處理
  let grouped = Array.from(d3.group(filteredData, d => d.value), ([key, value]) => {
    return {value: key, ...Object.fromEntries(value.map(obj => [obj.series, obj.count]))};
  });

  // 定義堆疊方式並計算
  const stack = d3.stack().keys(keys);
  const series = stack(grouped);
  
  // 定義x軸的比例尺
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.value))
    .range([0, width])
    .padding(0.1);

  // 定義y軸的比例尺
  const yMax = d3.max(series, serie => d3.max(serie, d => d[1]));
  const yScale = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([height, 0]);

  // 定義顏色的比例尺
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#00A47E','#FFB000','#0000BB']);

  // 創建SVG元素
  const svg = d3.create("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // 在SVG中添加一個包含所有內容的g元素(對它進行一個平移變換，以便為接下來的元素提供一個留白的區域)
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 繪製每一個系列的柱子
  series.forEach((serie) => {
      let bars = g.append("g")
          .attr("fill", colorScale(serie.key))
          .selectAll("rect")
          .data(serie);
  
      bars.enter().append("rect")
          .attr("x", d => xScale(d.data.value))
          .attr("y", height)
          .attr("width", xScale.bandwidth())
          .attr("height", 0)
        //新增以下兩行可新增出過渡效果
          .transition() 
          .duration(500) //改為0可以呈現無過度效果
        //新增到這兩行可新增出過渡效果
          .attr("y", d => yScale(d[1]))
          .attr("height", d => yScale(d[0]) - yScale(d[1]));
  });

  // 繪製x軸
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  // 繪製y軸
  g.append("g")
    .call(d3.axisLeft(yScale));

  return svg.node();
}


function _14(htl){return(
htl.html`<h2>結論</h2>
<h3>
  <ol>
    <li>大部分的受訪者對於「聯合國永續發展目標」的了解程度在中間</li>
    <li>大部分的受訪者不太了解「台灣 2050淨零排放」</li>
    <li>大部分的受訪者對於此兩項事務的了解程度在中間</li>
  </ol>
</h3> `
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artist.csv", {url: new URL("./artist.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artist")).define("artist", ["__query","FileAttachment","invalidation"], _artist);
  main.variable(observer("sdgKey")).define("sdgKey", ["artist"], _sdgKey);
  main.variable(observer("tKey")).define("tKey", ["artist"], _tKey);
  main.variable(observer("sdgColumn")).define("sdgColumn", ["artist","sdgKey"], _sdgColumn);
  main.variable(observer("tColumn")).define("tColumn", ["artist","tKey"], _tColumn);
  main.variable(observer("values")).define("values", ["sdgColumn"], _values);
  main.variable(observer("sdgCounts")).define("sdgCounts", ["values","sdgColumn"], _sdgCounts);
  main.variable(observer("tCounts")).define("tCounts", ["values","tColumn"], _tCounts);
  main.variable(observer("data")).define("data", ["sdgCounts","tCounts"], _data);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("viewof selectedSeries")).define("viewof selectedSeries", ["Inputs"], _selectedSeries);
  main.variable(observer("selectedSeries")).define("selectedSeries", ["Generators", "viewof selectedSeries"], (G, _) => G.input(_));
  main.variable(observer("chart1")).define("chart1", ["data","selectedSeries","d3"], _chart1);
  main.variable(observer()).define(["htl"], _14);
  return main;
}
