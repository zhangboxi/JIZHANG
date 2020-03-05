export function pie1(data) {
  let legenddata = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum = sum + data[i].value;
    legenddata.push(data[i].name);
  }

  let colorList = [
    "#f6d54a",
    "#f69846",
    "#44aff0",
    "#45dbf7",
    "#f845f1",
    "#ad46f3",
    "#5045f6",
    "#4777f5"
  ];
  let option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}度 ({d}%)"
    },
    title: {
      text: "总支出：" + sum,
      left: "70%"
    },
    legend: {
      orient: "vertical",
      textStyle: {
        color: "#FF0000",
        fontSize: 26
      },
      top: "center",
      left: "70%",
      data: legenddata
    },
    series: [
      {
        center: ["35%", "50%"],
        type: "pie",
        radius: ["30%", "45%"],
        // roseType: 'radius',
        clockwise: false,
        z: 10,
        itemStyle: {
          normal: {
            color: function(params) {
              // build a color map as your need.
              return colorList[params.dataIndex];
            },
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.3)"
          }
        },
        label: {
          normal: {
            formatter: "{d|{b}{c}元}\n{hr|}\n{d|({d}%)}",
            // formatter: '{b|{b}}\n{hr|}\n{d|{c}  ({d}%)}',
            rich: {
              b: {
                fontSize: 16,
                color: "#fff",
                align: "left",
                padding: 4
              },
              hr: {
                borderColor: "#12EABE",
                width: "100%",
                borderWidth: 2,
                height: 0
              },
              d: {
                fontSize: 16,
                color: "#FF0000",
                align: "left",
                padding: 4
              },
              c: {
                fontSize: 16,
                color: "#FF0000",
                align: "center",
                padding: 4
              }
            }
          }
        },
        /*  label: {
                normal: {
                    formatter: function(params){
                         return params.name+':'+params.value+'件';
                    },
                    // backgroundColor: '#eee',
                }
            },*/

        labelLine: {
          normal: {
            length: 50,
            length2: 0,
            lineStyle: {
              width: 2
            }
          }
        },
        data: data
      }
    ]
  };
  return option;
}
