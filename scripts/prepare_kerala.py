"""Generate Kerala particles and an SVG fallback from state GeoJSON.

Usage: python scripts/prepare_kerala.py india_state.geojson
Boundary source: https://github.com/geohacker/india (GADM-derived).
"""
import json
import math
import random
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = json.loads(Path(sys.argv[1]).read_text())
feature = next(f for f in source['features'] if f['properties'].get('NAME_1') == 'Kerala')
geometry = feature['geometry']
polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]

def area(ring):
    return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(ring,ring[1:])))

def simplify(points, tolerance=.0012):
    if len(points)<3: return points
    a,b=points[0],points[-1]
    dx,dy=b[0]-a[0],b[1]-a[1]
    length=math.hypot(dx,dy)
    distances=[abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/length if length else math.dist(p,a) for p in points[1:-1]]
    largest=max(distances,default=0)
    if largest<=tolerance: return [a,b]
    index=distances.index(largest)+1
    return simplify(points[:index+1],tolerance)[:-1]+simplify(points[index:],tolerance)

# Keep the mainland outline; very small offshore fragments are below particle resolution.
ring=simplify(max(polygons,key=lambda p:area(p[0]))[0])
projection=math.cos(math.radians(10.5))
ring=[(x*projection,y) for x,y,*_ in ring]
left,right=min(p[0] for p in ring),max(p[0] for p in ring)
bottom,top=min(p[1] for p in ring),max(p[1] for p in ring)
scale=4.05/(top-bottom)
ring=[((x-(left+right)/2)*scale,(y-(top+bottom)/2)*scale) for x,y in ring]

def inside(x,y):
    result=False
    previous=ring[-1]
    for point in ring:
        x1,y1=previous;x2,y2=point
        if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1)+x1:result=not result
        previous=point
    return result

random.seed(29)
points=[]
width=(right-left)*scale
step=.023
for iy in range(int(4.05/step)+1):
    y=-2.025+iy*step
    for ix in range(int(width/step)+1):
        x=-width/2+ix*step
        px=x+random.uniform(-step*.4,step*.4);py=y+random.uniform(-step*.4,step*.4)
        if inside(px,py): points.extend([round(px,5),round(py,5),round(random.uniform(-.025,.025),5),round(random.uniform(.25,.65),3)])
for a,b in zip(ring,ring[1:]):
    segments=max(1,int(math.dist(a,b)/.012))
    for i in range(segments):
        t=i/segments
        points.extend([round(a[0]+(b[0]-a[0])*t,5),round(a[1]+(b[1]-a[1])*t,5),0,.9])
(root/'public/kerala-points.json').write_text(json.dumps(points,separators=(',',':')))
path='M '+' L '.join(f'{200+x*120:.2f} {300-y*120:.2f}' for x,y in ring)+' Z'
(root/'src/lib/kerala-outline.ts').write_text('// Simplified Kerala mainland boundary; see README for source attribution.\nexport const keralaOutline = '+json.dumps(path)+';\n')
print(f'Prepared {len(points)//4} Kerala map particles and {len(ring)} outline vertices.')
