/**
 *
 * LineChart
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { cloneDeep } from 'lodash'
import Select from 'react-select';


/* eslint-disable react/prefer-stateless-function */
class LineChart extends React.Component {

  state = {
    chartData: [],
    legendValue: {}
  }

  componentDidUpdate() {
    let chartData = this.props.chartData
    this.trendingChartHandler(chartData)
  }

  componentDidMount() {
    let chartData = this.props.chartData
    this.trendingChartHandler(chartData)
  }

  componentWillUnmount() {
    am4core.disposeAllCharts();
  }

  trendingChartHandler = (data) => {

    let _self = this

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create(`chartdiv${this.props.id}`, am4charts.XYChart);

    // Add data
    chart.data = data
    chart.dateFormatter.dateFormat = "yyyy-MM-dd";
    chart.cursor = new am4charts.XYCursor();

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.cursorTooltipEnabled = false;


    chart.cursor.events.on("cursorpositionchanged", function (ev) {
      chart.series.each(function (series) {
        var dataItem = dateAxis.getSeriesDataItem(
          series,
          dateAxis.toAxisPosition(chart.cursor.xPosition),
          true
        );
        var legendValue = dataItem ? dataItem.dataContext : ""
        _self.props.legendValueHandler(legendValue)
      });
    });

    chart.events.on("ready", function (ev) {
      var legendValue = ""
      _self.props.legendValueHandler(legendValue)
    });

    chart.cursor.events.on("hidden", function (ev) {
      var legendValue = ""
      _self.props.legendValueHandler(legendValue)
    });


    // Create Axis and Series
    function createSeries(val, opposite) {

      if (val.display) {

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // if (chart.yAxes.indexOf(valueAxis) != 0) {
        //   valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
        // }

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = am4core.color(val.axisColor ? val.axisColor : val.fill);
        valueAxis.renderer.labels.template.fill = am4core.color(val.axisColor ? val.axisColor : val.fill);
        valueAxis.renderer.opposite = opposite;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.min = val.min;
        valueAxis.max = val.max;

        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.paddingLeft = 10;
        valueAxis.paddingRight = 10;
        valueAxis.layout = "absolute";

        // Set up valueAxis title
        valueAxis.title.text = val.displayName;
        valueAxis.title.fill = am4core.color(val.axisColor ? val.axisColor : val.fill);
        valueAxis.title.rotation = 0;
        valueAxis.title.align = "center";
        valueAxis.title.valign = "top";
        valueAxis.title.dy = -40;
        valueAxis.title.fontWeight = 600;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = val.name;
        series.dataFields.dateX = 'date';
        series.strokeWidth = 2;
        series.yAxis = valueAxis;
        series.name = val.displayName;
        series.stroke = am4core.color(val.fill);

        let attr = ['gf', 'current']

        if (attr.includes(val.name)) {

          var bullet = series.bullets.push(new am4charts.Bullet());
          var image = bullet.createChild(am4core.Image);
          let hoverState = bullet.states.create("hover");
          hoverState.properties.scale = 1.7;

          image.adapter.add("href", function (href, target) {
            if (target.dataItem && target.dataItem.dataContext && (target.dataItem.dataContext.alarmingAttr === val.name)) {
              return target.dataItem.dataContext.alarmIconUrl;
            }
          })
          image.width = 15;
          image.height = 15;
          image.horizontalCenter = "middle";
          image.verticalCenter = "middle";
          image.events.on('hit', (ev) => {
            _self.props.highlightedAlarmHandler(ev.target.dataItem.dataContext.date)
            image.width = 15;
            image.height = 15;
          });
        }
        return series;
      }
    }

    // Create Axis and Series
    function createSubSeries(val, opposite) {

      let selectedOption = cloneDeep(_self.props.selectedOption)
      let selectedOptionArray = selectedOption.map(val => val.value)
      let subfilterArray = val.info.map(val => val.name)

      let compairingArray = subfilterArray.map(val => selectedOptionArray.includes(val))
      if (compairingArray.includes(true)) {
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // if (chart.yAxes.indexOf(valueAxis) != 0) {
        //   valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
        // }

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = am4core.color(val.axisColor ? val.axisColor : val.fill);
        valueAxis.renderer.labels.template.fill = am4core.color(val.axisColor ? val.axisColor : val.fill);
        valueAxis.renderer.opposite = opposite;
        valueAxis.min = val.min;
        valueAxis.max = val.max;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.min = val.min;
        valueAxis.max = val.max;

        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.paddingLeft = 10;
        valueAxis.paddingRight = 10;
        valueAxis.layout = "absolute";

        // Set up valueAxis title
        valueAxis.title.text = 'Temperature';
        valueAxis.title.fill = am4core.color(val.axisColor ? val.axisColor : val.fill);
        valueAxis.title.rotation = 0;
        valueAxis.title.align = "center";
        valueAxis.title.valign = "top";
        valueAxis.title.dy = -40;
        valueAxis.title.fontWeight = 600;
      }

      if (val.info) {
        val.info.map(value => {

          if (value.display) {

            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = value.name;
            series.dataFields.dateX = 'date';
            series.strokeWidth = 2;
            series.yAxis = valueAxis;
            series.name = value.displayName;
            series.stroke = am4core.color(value.fill);

            let attr = ['sensorTemp1']

            if (attr.includes(value.name)) {

              // Add simple bullet
              var bullet = series.bullets.push(new am4charts.Bullet());
              var image = bullet.createChild(am4core.Image);

              let hoverState = bullet.states.create("hover");
              hoverState.properties.scale = 1.7;

              image.adapter.add("href", function (href, target) {
                if (target.dataItem && target.dataItem.dataContext && target.dataItem.dataContext.alarmingAttr === value.name) {
                  return target.dataItem.dataContext.alarmIconUrl;
                }
              })

              image.width = 15;
              image.height = 15;
              image.horizontalCenter = "middle";
              image.verticalCenter = "middle";
              image.events.on('hit', (ev) => {
                _self.props.highlightedAlarmHandler(ev.target.dataItem.dataContext.date)
                image.width = 15;
                image.height = 15;
              });
            }

            return series;
          }
        });
      }
    }

    let filteredLegend = cloneDeep(this.props.legend)
    filteredLegend.map((val, index) => {
      if (val.info) {
        createSubSeries(val, index % 2 != 0)
      }
      else {
        createSeries(val, index % 2 != 0)
      }
    })

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.marginBottom = 50;

    let label = chart.createChild(am4core.Label);
    label.text = 'TIMESTAMP';
    label.fontSize = 15;
    label.align = 'center';
  };

  render() {
    return (
      <React.Fragment>
        <div className="line-chart" id={`chartdiv${this.props.id}`}></div>
      </React.Fragment>
    );
  }
}

LineChart.propTypes = {};

export default LineChart;
