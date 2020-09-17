import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.less']
})
export class ChartContainerComponent implements OnInit {

  private nodeData: any[];
  links: any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getComponentList();
    // this.initCharts();
  }

  private getComponentList(): void{
    this.http.get('../../assets/relationship.json').subscribe((res: any[]) => {
      this.nodeData = res;
      this.calculateLinks(res);
      this.initCharts();
    });
  }

  initCharts(): void {
    const ec = echarts as any;
    const lineChart = ec.init(document.getElementById('lineChart'));

    const option = {
      title: {
          text: 'Graph 简单示例'
      },
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
          {
              type: 'graph',
              layout: 'force',
              force: {
                repulsion: [300, 450], // 相距距离
                edgeLength: [150, 200],
                layoutAnimation: true
            },
              symbolSize: 50,
              roam: true,
              label: {
                  show: true
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                  fontSize: 20
              },
              data: this.nodeData,
              links: this.links,
              lineStyle: {
                  opacity: 0.9,
                  width: 2,
                  curveness: 0
              }
          }
      ]
  };
    lineChart.setOption(option);

  }

  calculateLinks(relationShips: any[]) {
    relationShips.forEach(relationShip => {
        let source = relationShip.componentId;
        relationShip.downstreamComponentIds.forEach(downStream => {
            this.links.push({'source': source, 'target': downStream});
        });
    });
    console.log(this.links);
  }
  
}
