import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ChartContainerComponent implements OnInit {
  private nodeData: any[];
  private links: any[] = [];
  displayInfo: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getComponentList();
  }

  private getComponentList(): void{
    this.http.get('../../assets/relationship.json').subscribe((res: any[]) => {
      res.forEach(item => {
        item.name = item.componentId
      });
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
              backgroundColor: 'rgba(128, 128, 128, 0.5)',
              force: {
                repulsion: [300, 450], // 相距距离
                edgeLength: [150, 200],
                layoutAnimation: true
            },
              symbolSize: [100, 60],
              roam: true,
              draggable: true,
              focusNodeAdjacency: true,
              symbol: 'rect',
              label: {
                  show: true,
                  position: 'insideTop'
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

    lineChart.on('click', (param) => {
        console.log('param---->', param);  // 打印出param, 可以看到里边有很多参数可以使用
        // 获取节点点击的数组序号
        let arrayIndex = param.dataIndex;
        console.log('arrayIndex---->', arrayIndex);
        console.log('name---->', param.name);
        if (param.dataType === 'node') {
            alert("clicked node" + param.name);
            this.displayInfo = true;
        } else {
            alert("clicked arrow" + param.value);
        }
    });

  }

  private calculateLinks(relationShips: any[]) {
    relationShips.forEach(relationShip => {
        let source = relationShip.componentId;
        relationShip.downstreamComponentIds.forEach(downStream => {
            this.links.push({'source': source, 'target': downStream});
        });
    });
  }

}
