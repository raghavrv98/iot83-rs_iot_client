/**
 *
 * SkeletonLoader
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class SkeletonLoader extends React.PureComponent {
  render() {
    return (
      <div className="skeleton-outer">
        {this.props.type === 'lineChart' ? (
          <div className="chart-outer">
            <div className="y-labels">
              {[...Array(5).keys()].map((temp, i) => (
                <span className="skeleton-content" key={temp} />
              ))}
            </div>
            <div className="chart-inner" />
            <div className="x-labels">
              {[...Array(7).keys()].map((temp, i) => (
                <span className="skeleton-content" key={temp} />
              ))}
            </div>
          </div>
        ) : this.props.type === 'detailView' ? (
          <div>
            <div className="skeleton-device-detail-outer">
              <div className="skeleton-device-detail-card skeleton-content">
                <div className="card active">
                  <div className="card-header">
                    <h6 className="skeleton-content">
                     
                    </h6>
                  </div>
                  <div className="card-body">
                    <ul className="detail-card-body list-style-none">
                      {[...Array(7).keys()].map((temp, i) => (
                        <li key={temp} className="flex">
                          <div className="skeleton-content mr-r-10" />
                          <div className="skeleton-content" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="fx-b80">
                <div className="alarm-filter-outer">
                  {[...Array(5).keys()].map((temp, i) => (
                    <div key={temp} className="fx-b20 pd-r-15 pd-l-15">
                      <div className="filter-view">
                        <div className="skeleton-content" />
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="list-view list-style-none">
                  {[...Array(3).keys()].map((temp, i) => (
                    <li key={temp}>
                      <div className="list-logo">
                        <div className="skeleton-content" />
                      </div>
                      {[...Array(4).keys()].map((temp, i) => (
                        <div key={temp} className="list-detail">
                          <h6 className="skeleton-content" />
                          <p className="skeleton-content" />
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="skeleton-device-parameter-box">
              <div className="skeleton-attribute-filter-wrapper">
                <div className="fx-b85 pd-r-10">
                  <label className="skeleton-content"></label>
                  <div className="skeleton-content"></div>
                </div>
                <div className="fx-b15 pd-l-10">
                  <label className="skeleton-content"></label>
                  <div className="skeleton-content"></div>
                </div>
              </div>
              <ul className="skeleton-attribute-filter-list">
                {[...Array(7).keys()].map((temp, i) => (
                  <li key={temp} className="skeleton-content"></li>
                ))}
              </ul>
              {[...Array(2).keys()].map((temp, i) => (
                <div className="skeleton-trends-chart-wrapper">
                  {/* <div className="skeleton-device-tag"><h6 className="skeleton-content"></h6></div> */}

                  <div className="chart-outer fx-b100">
                    <div className="y-labels">
                      {[...Array(5).keys()].map((temp, i) => (
                        <span className="skeleton-content" key={temp} />
                      ))}
                    </div>
                    <div className="chart-inner" />
                    <div className="x-labels">
                      {[...Array(7).keys()].map((temp, i) => (
                        <span className="skeleton-content" key={temp} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {/* <div className="flex mr-b-20">
              <div className="fx-b85 pd-r-10">
                <div className="flex">
                  <div className="fx-b20 pd-r-10">
                    <div className="skeleton-attribute">
                      <h3>
                        <span className="skeleton-content" />
                      </h3>
                      <ul>
                        {[...Array(6).keys()].map((temp, i) => (
                          <li key={temp}>
                            <h6 className="skeleton-content" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="fx-b80 pd-l-10">
                    <div className="chart-outer">
                      <div className="y-labels">
                        {[...Array(5).keys()].map((temp, i) => (
                          <span className="skeleton-content" key={temp} />
                        ))}
                      </div>
                      <div className="chart-inner" />
                      <div className="x-labels">
                        {[...Array(7).keys()].map((temp, i) => (
                          <span className="skeleton-content" key={temp} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fx-b15 pd-l-10">
                <div className="detail-card-outer">
                  <div className="card detail-card-skeleton active">
                    <div className="card-header">
                      <div className="skeleton-content" />
                      <h6>
                        <span className="skeleton-content" />
                      </h6>
                    </div>
                    <div className="card-body">
                      <ul className="detail-card-body list-style-none">
                        {[...Array(7).keys()].map((temp, i) => (
                          <li key={temp} className="flex">
                            <span className="skeleton-content mr-r-10" />
                            <span className="skeleton-content" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        ) : this.props.type === 'landingView' ? (
          <div>
            <div className="brand-skeleton">
              <div className="flex align-items-center justify-content-between mr-b-20">
                <div className="brand-logo-skeleton">
                  <span className="skeleton-content" />
                </div>
                <div className="brand-content-skeleton">
                  <span className="skeleton-content" />
                </div>
                <div className="brand-logo-skeleton">
                  <span className="skeleton-content" />
                </div>
              </div>
              <div className="brand-content-body">
                <div>
                  <h6 className="skeleton-content mr-b-5" />
                  <h6 className="skeleton-content" />
                </div>
                <button className="skeleton-content" />
              </div>
            </div>
            <div className="flex">
              <div className="fx-b70 pd-r-10">
                <div className="link-card-outer">
                  {[...Array(4).keys()].map((temp, i) => (
                    <div className="fx-b33" key={temp}>
                      <div className="quick-link-card">
                        <div className="mr-b-20">
                          <span className="skeleton-content" />
                        </div>
                        <h6>
                          <span className="skeleton-content" />
                        </h6>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fx-b30 pd-l-10">
                <div className="pie-chart-skeleton">
                  <h6>
                    <span className="skeleton-content" />
                  </h6>
                  <div className="text-center mr-b-20">
                    <span className="skeleton-content" />
                  </div>
                  <div className="pie-chart-legends text-center">
                    <span className="skeleton-content mr-r-10" />
                    <span className="skeleton-content" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : this.props.type === 'deviceView' ? (
          <ul className="device-list-skeleton list-style-none">
            {[...Array(49).keys()].map((temp, i) => (
              <li key={temp}>
                <div className="card device-skeleton">
                  <div className="card-header">
                    <div>
                      <span className="skeleton-content" />
                    </div>
                    <h6>
                      <span className="skeleton-content" />
                    </h6>
                  </div>
                  <div className="card-body">
                    <ul className="detail-card-body list-style-none">
                      {[...Array(9).keys()].map((temp, i) => (
                        <li key={temp} className="flex align-items-center">
                          <span className="skeleton-content mr-r-10" />
                          <span className="skeleton-content" />
                          
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : this.props.type === 'alarmView' ? (
          <div>
            <div className="alarm-filter-outer">
              {[...Array(5).keys()].map((temp, i) => (
                <div key={temp} className="fx-b20 pd-r-15 pd-l-15">
                  <div className="filter-view">
                    <div className="skeleton-content" />
                  </div>
                </div>
              ))}
            </div>
            <ul className="list-view">
              {[...Array(7).keys()].map((temp, i) => (
                <li key={temp}>
                  <div className="list-logo">
                    <div className="skeleton-content" />
                  </div>
                  {[...Array(5).keys()].map((temp, i) => (
                    <div key={temp} className="list-detail">
                      <h6 className="skeleton-content" />
                      <p className="skeleton-content" />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ) : this.props.type === 'trendsView' ? (
          <div className="skeleton-device-parameter-box">
            <div className="skeleton-attribute-filter-wrapper">
              <div className="fx-b85 pd-r-10">
                <label className="skeleton-content"></label>
                <div className="skeleton-content"></div>
              </div>
              <div className="fx-b15 pd-l-10">
                <label className="skeleton-content"></label>
                <div className="skeleton-content"></div>
              </div>

              {/* <div className="fx-b30 pd-r-20">
              <div className="skeletonAttribute">
                <h3>
                  <span className="skeleton-content" />
                </h3>
                <ul>
                  {[...Array(4).keys()].map((temp, i) => (
                    <li key={temp}>
                      <h6 className="skeleton-content" />
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            </div>
            <ul className="skeleton-attribute-filter-list">
              {[...Array(7).keys()].map((temp, i) => (
                <li key={temp} className="skeleton-content"></li>
              ))}
            </ul>
            {[...Array(2).keys()].map((temp, i) => (
              <div className="skeleton-trends-chart-wrapper">
                <div className="skeleton-device-tag"><h6 className="skeleton-content"></h6></div>

                <div className="chart-outer">
                  <div className="y-labels">
                    {[...Array(5).keys()].map((temp, i) => (
                      <span className="skeleton-content" key={temp} />
                    ))}
                  </div>
                  <div className="chart-inner" />
                  <div className="x-labels">
                    {[...Array(7).keys()].map((temp, i) => (
                      <span className="skeleton-content" key={temp} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : null}
      </div>
    );
  }
}

SkeletonLoader.propTypes = {};

export default SkeletonLoader;
