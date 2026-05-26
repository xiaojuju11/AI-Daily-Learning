import { useEffect, useRef } from 'react'
import './weather.css'
import AMapLoader from '@amap/amap-jsapi-loader';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入折线图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent } from 'echarts/components';

echarts.use([LineChart, CanvasRenderer, GridComponent]);

export default function Weather() {
    const lineChartRef = useRef(null);

    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    };


    let map = null;

    useEffect(() => {
        window._AMapSecurityConfig = {
            securityJsCode: "fa9a5d1fb69bfdcae515afdaeb920fac",
        };
        AMapLoader.load({
            key: "49f15ec9e0715f806bde758e1203ca55", // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        })
            .then((AMap) => {
                map = new AMap.Map("container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                    center: [116.397428, 39.90923], // 初始化地图中心点位置
                });
                return AMap;
            })
            .then((AMap) => {
                //加载天气查询插件
                AMap.plugin("AMap.Weather", function () {
                    //创建天气查询实例
                    var weather = new AMap.Weather();
                    //执行实时天气信息查询
                    weather.getForecast("南昌市", function (err, data) {
                        console.log(err, data);
                        //err 正确时返回 null
                        //data 返回天气预报数据，返回数据见下表
                    });
                });

            })

        return () => {
            map?.destroy();
        };
    }, []);

    useEffect(() => {
        const myChart = echarts.init(lineChartRef.current);
        myChart.setOption(option);//设置图表配置和数据显示
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <div className="container" id="container"></div>
            <div className="lineChart" id="lineChart" ref={lineChartRef}></div>
        </div>
    )
}
