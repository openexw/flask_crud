
function getData(data) {
    let xData = [];
    let value = [];
    for(let i=0; i<data.length; i++) {
        xData.push(data[i]['date'])
        value.push(data[i]['total_data'])
    }
    return {'x_data': xData, 'value': value};
}

/**
 * 折线图
 * @param data
 */
function lineChat(data) {
    let res = getData(data)
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
}


function getPieData(data) {
    let xData = [];
    let value = [];
    for(let i=0; i<data.length; i++) {
        let pip = data[i];
        if (pip['is_quarter'] == 1) {
            pip['date'] = getQuarterDate(pip)['text'];
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
}

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
 * 根据年月获取是第几季度
 * @param data
 * @returns {Array}
 */
function getQuarterDate(data) {
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
}

/**
 * 饼状图
 * @param data
 */
function pieChat(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    myChart.clear();
    let city = $('input[name="city"]').val();
    let res = getPieData(data);
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
}

function bar(data) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    myChart.clear();

    let res = getData(data);
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
}

/**
 * 散点图
 * @param data
 */
function scatter(data) {
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
}


function  getEonomicData(callback) {
    let city = $('input[name="city"]').val();
    $.get('/economic?city='+city+'&type=1&sub_type=1&date=2015', function (data) {
        if (data.length == 0) {
            $('#main').text('暂无数据');
        } else {
            callback(data)
        }
    })
}