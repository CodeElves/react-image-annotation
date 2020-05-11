import React from 'react'
import LineTo from 'react-lineto'
import styled from 'styled-components'

const PolygonLineTo = {
  boxShadow: '0px 1px 1px 0 white',
  boxSizing: 'border-box',
  transition: 'box-shadow 0.21s ease-in-out',
  zIndex: '-1',
}

const PolygonLineToActive = {
  boxShadow: '0px 1px 1px 0 yellow',
  boxSizing: 'border-box',
  transition: 'box-shadow 0.21s ease-in-out',
  zIndex: '-1',
}

const PointDot = styled.div`
  background: white;
  border-radius: 1px;
  width: 2px;
  height: 2px;
  margin-left: -1px;
  margin-top: -1px;
  position: absolute;
`

function edgesFromPoints(points) {
  if (!points || points.length < 3) return [];

  const edges = []
  for (let i = 0; i < points.length; ++i) {
    if (i + 1 === points.length) {
      edges.push(Math.hypot(points[0].x-points[i].x, points[0].y-points[i].y))
    } else {
      edges.push(Math.hypot(points[i + 1].x-points[i].x, points[i + 1].y-points[i].y))
    }
  }

  return edges;
}

function Polygon (props) {
  const { geometry } = props.annotation
  if (!geometry || !geometry.points || geometry.points.length === 0) return null

  return (
    <div
      className={`linesContainer ${props.className}`}
      style={{
        width: '100%',
        height: '100%',
        ...props.style
      }}
    >
      {(geometry.points.length >= 3) && geometry.points.map((item,i) => { // Iterate over points to create the edge lines
        let prevItem
        if (i === 0) { // First point (links from last to first)
          prevItem = geometry.points[geometry.points.length - 1]
        } else {
          prevItem = geometry.points[i - 1]
        }
        return (
          // Note that each LineTo element must have a unique key (unique relative to the connected points)
          <LineTo
            key={i + "_" + item.x + "_" + item.y + "_" + prevItem.x + "_" + prevItem.y}
            from="linesContainer"
            fromAnchor={item.x + "% " + item.y + "%"}
            to="linesContainer"
            toAnchor={prevItem.x + "% " + prevItem.y + "%"}
            borderColor={'white'}
            borderStyle={'dashed'}
            borderWidth={2}
            style={(!props.active) ? PolygonLineTo : PolygonLineToActive}
          />
        )
      })}
      {geometry.points.map((item,i) => { // Iterate over points to points
        return (
          // Note that each LineTo element must have a unique key (unique relative to the point)
          <PointDot
            key={i + "_" + item.x + "_" + item.y}
            style={{
              left: item.x + "% ",
              top: item.y + "%"
            }}
          />
        )
      })}
    </div>
  )
}

Polygon.defaultProps = {
  className: '',
  style: {}
}

export default Polygon
