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
    this.getStatus();
  }

  private getComponentList(): void {
    this.http.get('../../assets/relationship.json').subscribe((res: any[]) => {
      res.forEach(item => {
        item.name = item.componentId;
        item.symbol = item.type === 'alerts' ? 'circle' : 'rect';
        item.category = item.type === 'alerts' ? 0 : 1;
      });
      this.nodeData = res;
      this.calculateLinks(res);
      this.initCharts();
    });
  }

  private getRectColor(params): string {
    if (params.data.type && params.data.type === 'alerts') {
      return '#006270';
    } else {
      return '#00e0c7';
    }
  }

  private getStatus(): void {
    this.http.get('../../assets/status.json').subscribe(res => {
      this.status = res;
    });
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
      color: [
        '#006270',
        '#00e0c7'
      ],
      legend: {
        show: true,
        x: 'right',
        y: 'top',
        orient: 'vertical',
        padding: 10,
        itemGap: 20,
        inactiveColor: '#ccc',
        data: [{
          name: 'Alerts',
          icon: 'circle',
          textStyle: {
            color: '#006270'
          }
        },
        {
          name: 'Others',
          icon: 'rect',
          textStyle: {
            color: '#00e0c7'
          }
        }]
      },
      animationDurationUpdate: 1500,
      backgroundColor: '#2a394f',
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: [700, 800], // 相距距离
            edgeLength: 200,
            layoutAnimation: true,
            initLayout: 'circular'
          },
          symbolSize: [120, 60],
          roam: true,
          draggable: true,
          focusNodeAdjacency: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [2, 10],
          edgeLabel: {
            fontSize: 20
          },
          categories: [
            {
              name: 'Alerts',
              symbol: 'circle'
            }, {
              name: 'Others',
              symbol: 'rect'
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
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 2 ,
              borderType: 'solid' ,
              label: {
                show: true,
                position: 'inside',
                fontFamily: 'sans-serif',
                formatter: (val) => {
                  return this.formatLabel(val);
                },
                rich: {
                  color1: {
                    color: '#fff',
                    fontSize: 16,
                    align: 'center'
                  },
                  color2: {
                    color: '#2a394f',
                    fontSize: 16,
                    align: 'center'
                  }
                },
              },
              opacity: 1,
              color: (params) => { return this.getRectColor(params); }
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
        this.links.push({ 'source': source, 'target': downStream });
      });
    });
  }

  private formatLabel(val) {
    const newVal = val.name.replace(' ', '\n');
    if (val.data.type && val.data.type === 'alerts') {
      return '{color1|' + newVal + '}';
    } else {
      return '{color2|' + newVal + '}';
    }
  }

}
