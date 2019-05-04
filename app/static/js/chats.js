
/**
 * 根据时间字符串获取年月
 * @param date
 * @returns {{mouth: number, year: number}}
 */
function getDate(date) {
    let dateO = new Date(date);
    let m = dateO.getMonth()+1;
    let y = dateO.getFullYear();
    return {'year': y, 'mouth': m}
}

/**
 * 图表
 * @type {{init: Chart.init, bar: Chart.bar, pieChat: Chart.pieChat, getPieData: (function(*): {value: Array, x_data: Array}), getQuarterDate: (function(*): Array), scatter: Chart.scatter, event: Chart.event, lineChat: Chart.lineChat, getData: (function(*): {value: Array, x_data: Array})}}
 */
let Chart = {
    getData: function(data) {
        let xData = [];
        let value = [];
        for(let i=0; i<data.length; i++) {
            xData.push(data[i]['date'])
            value.push(data[i]['total_data'])
        }
        return {'x_data': xData, 'value': value};
    },
    getQuarterDate: function (data) {
        let date = getDate(data['date']);
        let dataD = [];
        let dateStr = date['year']+'/'+(date['mouth']-2) + '-' +data['date'];
        switch (date.mouth) {
            case 3:
                dataD['text'] = '第一季度';
                break;
            case 6:
                dataD['text'] = '第二季度';
                break;
            case 9:
                dataD['text'] = '第三季度';
                break;
            case 12:
                dataD['text'] = '第四季度';
                break;
        }
        dataD['date'] = dateStr;
        return dataD;
    },
    getPieData: function (data) {
        let xData = [];
        let value = [];
        for(let i=0; i<data.length; i++) {
            let pip = data[i];
            if (pip['is_quarter'] == 1) {
                pip['date'] = this.getQuarterDate(pip)['text'];
            }
            xData.push(pip['date']);
            // 对数据进行拆分
            let item = {
                'name': pip['date'],
                'value': pip['total_data']
            };
            value.push(item)
        }
        return {'x_data': xData, 'value': value};
    },
    lineChat: function (data) {
        let res = this.getData(data)
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();
        // 指定图表的配置项和数据
        var option = {
            xAxis: {
                type: 'category',
                data: res.x_data
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: res.value,
                type: 'line',
                smooth: true
            }]
            };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    bar: function (data) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();

        let res = this.getData(data);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['GDP:亿元']
            },
            xAxis: {
                data: res.x_data
            },
            yAxis: {},
            series: [{
                name: 'GDP:亿元',
                type: 'bar',
                 data: res.value
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    scatter: function (data) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();

        // 指定图表的配置项和数据
        var option = {
            xAxis: {},
            yAxis: {},
            series: [{
                symbolSize: 20,
                data: [
                    [1, 8.04],
                    [2, 6.95],
                    [3, 7.58],
                    [4, 8.81],
                    [5, 8.33],
                    [6, 9.96],
                    [7, 7.24],
                    [8, 4.26],
                    [9, 10.84],
                    [10, 4.82]
                ],
                type: 'scatter'
            }]
        };


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    pieChat: function (data) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        myChart.clear();
        let city = $('input[name="city"]').val();
        let res = this.getPieData(data);
        // console.log(res)
        // 指定图表的配置项和数据
        var option = {
            title : {
                text: city,
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: res.x_data
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: res.value,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    event: function () {

        $('#chart').change(function (e) {
            let that = this;
            getEonomicData(function (data)  {
                let val = $(that).val();
                console.log(val)
                switch (val) {
                    case 'line':
                        Chart.lineChat(data)
                        break;
                    case 'bar':
                        Chart.bar(data);
                        break;
                    case 'pie':
                        Chart.pieChat(data)
                        break;
                    case 'scatter':
                        Chart.scatter(data);
                        break;
                }
            })
        })
    },
    init: function () {
        this.event();
    }
};
function  getEonomicData(callback) {
    let city = $('input[name="city"]').val();
    let type = $('input[name="type"]').val();
    let sub_type = $('input[name="sub_type"]').val();
    type = type ? 1 : type;
    sub_type = sub_type ? 1 : sub_type;
    $.get('/economic?city='+city+'&type='+type+'&sub_type='+sub_type+'&date=2015', function (data) {
        if (data.length == 0) {
            $('#main').text('暂无数据');
        } else {
            callback(data)
        }
    })
}


// 分类
let Cate = {
    data: [
        {
            'name': '地区生产总值',
            'type': 1,
            'child': [
                {
                    'sub_type': 1,
                    'sub_name': '第一产业'
                },
                {
                    'sub_type': 2,
                    'sub_name': '第二产业'
                },
                {
                    'sub_type': 3,
                    'sub_name': '第三产业'
                },
            ]
        }, {
            'name': '社会消费品总额',
            'type': 2,
            'child': [
                {
                    'sub_type': 4,
                    'sub_name': '城镇'
                },
                {
                    'sub_type': 5,
                    'sub_name': '农村'
                }
            ]
        }, {
            'name': '固定资产投资',
            'type': 2,
            'child': [
                {
                    'sub_type': 6,
                    'sub_name': '第一产业投资'
                },
                {
                    'sub_type': 7,
                    'sub_name': '第二产业投资'
                },
                 {
                    'sub_type': 8,
                    'sub_name': '第三产业投资'
                }
            ]
        }
    ],
    createTheCate: function () {
        let cate = this.data;
        let html = '';
        for (let i =0; i<cate.length; i++) {
            html += '<dl>\n' +
                '        <dt data-type="'+cate[i]['type']+'">'+cate[i]["name"]+'</dt>\n';
            let child = cate[i]['child'];
            for (let j=0; j<child.length; j++) {
                html += '<dd data-sub_type="'+child[j]['sub_type']+'">'+child[j]["sub_name"]+'</dd>\n'
            }
            html += '</dl>'
        }
        $('.economic').html(html);
    },
    event: function () {
        $('.economic dt').click(function (e) {
            let type = $(this).data('type');
            console.log(type)
            $('input[name="type"]').val(type);
        });
        $('.economic dd').click(function (e) {

            let type = $(this).data('sub_type');
            console.log(type)
            $('input[name="sub_type"]').val(type);
        });
    },
    init: function () {
        this.createTheCate();
        this.event();
    }
};

let Map = {
    createMap: function () {
        // map
        map = new BMap.Map("allmap");
        // 创建地图实例
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        // 根据 IP 定位到当前城市
        let city = new BMap.LocalCity();
        city.get(function(e) {
            // 设置导航栏显示
            let city = e.name.substr(0, e.name.length-1)
            $('#location .text').text(city);
            // 设置地图中心为当前城市
            map.setCenter(city);
            $('input[name="city"]').val(city)
            map.addEventListener('click', function(){
                $('.economic').show()
            });
        });

        // map.centerAndZoom('德阳', 15);
        // 创建点坐标
        // var map = new BMap.Map("allmap");  // 创建Map实例
        // map.centerAndZoom("四川",15);      // 初始化地图,用城市名设置地图中心点
    },
    selectCity: function () {
        $('#location .model>.rml-city-btn').click(function(e){
            let city = $(this).text();
            $('input[name="city"]').val(city);
            // 样式变化
            $('#location .model>.rml-city-btn').removeClass('active');
            $(this).addClass('active');
            $('#location .text').text(city);
            $('#location .model').hide();
            // 数据变化
            map.centerAndZoom(city, 15);

        });
    },
    init: function () {
        this.createMap();
        this.selectCity();
    }
};
$(function () {
    Map.init();
    getEonomicData(function (data) {
        Chat.lineChat(data);
    });
    Cate.init();
    Chart.init();
});