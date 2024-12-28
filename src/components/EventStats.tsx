import { Calendar, Users, CheckCircle } from "lucide-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface EventStatsProps {
  totalEvents: number;
  totalRSVPs: number;
  publishedEvents: number;
}

export function EventStats({ totalEvents, totalRSVPs, publishedEvents }: EventStatsProps) {
  const d3Container = useRef(null);

  // D3.js visualization
  useEffect(() => {
    if (d3Container.current) {
      // Clear previous visualization
      d3.select(d3Container.current).selectAll("*").remove();

      const width = 200;
      const height = 200;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(d3Container.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const data = [
        { label: "Published", value: publishedEvents },
        { label: "Unpublished", value: totalEvents - publishedEvents }
      ];

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(["#4CAF50", "#FFA726"]);

      const pie = d3.pie()
        .value(d => d.value);

      const arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius);

      const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g");

      arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label));

      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.value)
        .style("fill", "#fff")
        .style("font-size", "12px");
    }
  }, [totalEvents, publishedEvents]);

  // Highcharts configuration
  const chartOptions = {
    chart: {
      type: 'area',
      height: 200
    },
    title: {
      text: 'RSVPs Over Time',
      style: { fontSize: '14px' }
    },
    xAxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      labels: { style: { fontSize: '10px' } }
    },
    yAxis: {
      title: { text: null },
      labels: { style: { fontSize: '10px' } }
    },
    series: [{
      name: 'RSVPs',
      data: [Math.round(totalRSVPs * 0.2), Math.round(totalRSVPs * 0.4), 
             Math.round(totalRSVPs * 0.7), totalRSVPs],
      color: '#60A5FA'
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <h3 className="text-2xl font-bold mt-1">{totalEvents}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total RSVPs</p>
              <h3 className="text-2xl font-bold mt-1">{totalRSVPs}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Published Events</p>
              <h3 className="text-2xl font-bold mt-1">{publishedEvents}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-4">Event Status Distribution</h4>
          <div ref={d3Container} className="flex justify-center" />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}