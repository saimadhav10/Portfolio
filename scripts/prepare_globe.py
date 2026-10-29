"""Prepare a small dotted globe from Natural Earth's 110m land geometry.

Usage: python scripts/prepare_globe.py path/to/ne_110m_land.geojson
Source: https://github.com/nvkelso/natural-earth-vector
"""
import json
import math
import sys
from pathlib import Path

source = json.loads(Path(sys.argv[1]).read_text())
polygons = []
for feature in source['features']:
    geometry = feature['geometry']
    shapes = [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']
    for rings in shapes:
        outer = rings[0]
        bounds = (min(p[0] for p in outer), min(p[1] for p in outer), max(p[0] for p in outer), max(p[1] for p in outer))
        polygons.append((bounds, rings))

def inside(x, y, ring):
    result = False
    previous = ring[-1]
    for current in ring:
        x1, y1 = previous[:2]
        x2, y2 = current[:2]
        if (y1 > y) != (y2 > y) and x < (x2-x1)*(y-y1)/(y2-y1)+x1:
            result = not result
        previous = current
    return result

points = []
count = 28000
golden = math.pi * (3-math.sqrt(5))
for i in range(count):
    vertical = 1-2*(i+.5)/count
    latitude = math.degrees(math.asin(vertical))
    longitude = math.degrees((i*golden) % (2*math.pi))-180
    land = any(left <= longitude <= right and bottom <= latitude <= top and inside(longitude,latitude,rings[0]) and not any(inside(longitude,latitude,hole) for hole in rings[1:]) for (left,bottom,right,top),rings in polygons)
    grid = abs((latitude+7.5)%15-7.5)<.28 or abs((longitude+15)%30-15)<.28
    if not land and not grid and i%4:
        continue
    angle = math.radians(longitude)
    radius = math.sqrt(1-vertical*vertical)
    points.extend([round(radius*math.sin(angle),5),round(vertical,5),round(radius*math.cos(angle),5),.85 if land else (.24 if grid else .065)])

output = Path(__file__).resolve().parents[1]/'public/globe-points.json'
output.write_text(json.dumps(points,separators=(',',':')))
print(f'{len(points)//4} globe particles written ({output.stat().st_size} bytes).')
