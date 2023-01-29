let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let req = new XMLHttpRequest();

let data = []

let yScale
let xScale

let width = 1000
let height = 600
let padding = 50

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    xScale = d3.scaleLinear()
               .domain([d3.min(data, (d)=> d['Year']) - 1, d3.max(data, (d)=> d['Year']) + 1])
               .range([padding, width - padding])
    yScale = d3.scaleTime()
               .domain([d3.min(data, (d)=>{
                return new Date(d['Seconds'] * 1000)
               }), d3.max(data, (d)=>{
                return new Date(d['Seconds'] * 1000)
               })])
               .range([padding, height - padding])
}

let drawCircles = () => {

    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('r', 7)
       .attr('data-xvalue', (d)=> d['Year'])
       .attr('data-yvalue', (d)=> {
        return new Date(d['Seconds'] * 1000)
       })
       .attr('cx', (d)=> xScale(d['Year']))
       .attr('cy', (d)=> {
        return yScale(new Date(d['Seconds'] * 1000))
       })
       .attr('fill', (d)=>{
        if(d['Doping'] != ''){
            return 'lightblue'
        } else {
            return 'lightgreen'
        }
       })
       .on('mouseover', (d) => {
        tooltip.transition()
               .style('visibility', 'visible')

        if(d['Doping'] != ''){
            tooltip.text(d['Name'] + ': ' + d['Nationality'] + ', Year: ' + d['Year'] + ', Time: ' + d['Time'] + '\n' + d['Doping'])
        }else{
            tooltip.text('\n' + d['Name'] + ': ' + d['Nationality'] + ', Year: ' + d['Year'] + ', Time: ' + d['Time'])
        }

        tooltip.attr('data-year', d['Year'])
       })
       .on('mouseout', (d)=>{
        tooltip.transition()
               .style('visibility', 'hidden')
       })
}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    
    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0, ' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))
    
    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    drawCanvas()
    generateScales()
    drawCircles()
    generateAxes()
    console.log(data)
}
req.send()