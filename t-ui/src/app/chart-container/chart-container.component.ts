import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ChartContainerComponent implements OnInit {
  private nodeData: any[];
  private links: any[] = [];
  private status: any;
  displayInfo: boolean = false;
  componentName: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getComponentList();
  }

  private getComponentList(): void{
    this.http.get('../../assets/relationship.json').subscribe((res: any[]) => {
      res.forEach(item => {
        item.name = item.componentId;
      });
      this.nodeData = res;
      this.calculateLinks(res);
      this.initCharts();
    });
  }

  private getStatus(): void {
    this.http.get('../../assets/status.json').subscribe(res => {
      this.status = res;
    })
  }

  private getRandomColor(): string {
    const random = Math.ceil(Math.random() * 4);
    switch (random) {
      case 1:
        return '#4bb6f4';
      case 2:
        return '#1f9ce4';
      case 3:
        return '#3e60c1';
      case 4:
        return '#5983fc';
    }
  }

  initCharts(): void {
    const ec = echarts as any;
    const lineChart = ec.init(document.getElementById('lineChart'));

    const option = {
      title: {
          text: 'Who Touched My Service?',
          textStyle: {
            color: '#eee'
          }
      },
      tooltip: {},
      legend: {
        show: true,
        data: [{
          name: 'Type 1',
          icon: 'rect'
        },
        {
          name: 'Type 1',
          icon: 'rect'
        }, {
          name: 'Type 1',
          icon: 'rect'
        }, {
          name: 'Type 1',
          icon: 'rect'
        }
        ]
      },
      animationDurationUpdate: 1500,
      backgroundColor: '#2a394f',
      animationEasingUpdate: 'quinticInOut',
      series: [
          {
              type: 'graph',
              layout: 'force',
              force: {
                repulsion: [600, 700], // 相距距离
                edgeLength: 200,
                layoutAnimation: true,
                initLayout: 'circular'
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
              edgeSymbolSize: [2, 10],
              edgeLabel: {
                  fontSize: 20
              },
              categories: [
                {
                    name: 'normal',
                    symbol: 'diamond'
                }, {
                    name: 'posting',
                    symbol: 'rect'
                }, {
                    name: 'alerts',
                    symbol: 'roundRect'
                }, {
                    name: 'ui',
                    symbol: 'circle'
                }
            ],
              data: this.nodeData,
              links: this.links,
              lineStyle: {
                normal: {
                  color: '#fff',
                  opacity: 0.7,
                  width: 1,
                  curveness: 0.2
                },
                emphasis: {
                  color: '#fff',
                  opacity: 1,
                  width: 2,
                  curveness: 0.2,
                }
              },
              itemStyle : {
                normal: {
                  label: {
                    show: true,
                    position: 'insideTop'
                  },
                  opacity: 1,
                  color: (params) => { return this.getRandomColor(); }
                },
                emphasis: {
                  label: {
                    show: true
                  },
                  opacity: 1
                }
            }
          }
      ]
  };
    lineChart.setOption(option);

    lineChart.on('click', (param) => {
        if (param.dataType === 'node') {
            this.displayInfo = true;
            this.componentName = param.name;
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
