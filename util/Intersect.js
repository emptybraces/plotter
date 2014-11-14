///
/// Intersect Class
///
var Intersect = {};
///
/// intersect plane and ray
///
Intersect.planeAndRay = function planeAndRay(
	out,
	rayFrom, 
	rayTo, 
	plane)
{
	// console.log(plane)
	// plane parameter
	var p = plane.getPosition();
	var pn = plane.getNormal();

	// ray from, ray to
	var a = rayFrom;
	var b = rayTo;

	// pa, pb vector
	// var pa = Adp.Vec3.create( p[0] - a[0], p[1] - a[1], p[2] - a[2] );
	// var pb = Adp.Vec3.create( p[0] - b[0], p[1] - b[1], p[2] - b[2] );
	var pa = Adp.Vec3.create( a[0] - p[0], a[1] - p[1], a[2] - p[2] );
	var pb = Adp.Vec3.create( b[0] - p[0], b[1] - p[1], b[2] - p[2] );

	// pa, pb vector inner product to plane normal vector
	var dot_pa = pa[0] * pn[0] + pa[1] * pn[1] + pa[2] * pn[2];
	var dot_pb = pb[0] * pn[0] + pb[1] * pn[1] + pb[2] * pn[2];

	// intersect detection
	if ( dot_pa * dot_pb <= 0.0 ) {

	} else {
		return false;
	}

	// calculate intersection point
	var ab = Adp.Vec3.create( b[0] - a[0], b[1] - a[1], b[2] - a[2] );
	var hiritu = Math.abs(dot_pa) / ( Math.abs(dot_pa) + Math.abs(dot_pb) );
	out[0] = a[0] + (ab[0] * hiritu);
	out[1] = a[1] + (ab[1] * hiritu);
	out[2] = a[2] + (ab[2] * hiritu);

	return true;
}
///
/// intersect polygon and ray
///
Intersect.polygonAndRay = function polygonAndRay(
	out,
	rayFrom,
	rayTo,
	polygonVertices, 
	polygonNormal)
{
	// polygon parameter
	var p = polygonVertices; // as arbitrary point
	var pn = polygonNormal;

	// ray from, ray to
	var a = rayFrom;
	var b = rayTo;

	// pa, pb vector
	var pa = Adp.Vec3.create( a[0] - p[0], a[1] - p[1], a[2] - p[2] );
	var pb = Adp.Vec3.create( b[0] - p[0], b[1] - p[1], b[2] - p[2] );

	// pa, pb vector inner product to plane normal vector
	var dot_pa = pa[0] * pn[0] + pa[1] * pn[1] + pa[2] * pn[2];
	var dot_pb = pb[0] * pn[0] + pb[1] * pn[1] + pb[2] * pn[2];
	// console.log(dot_pa, dot_pb)

	// intersect detection
	if ( dot_pa * dot_pb <= 0.0 ) {

	} else {
		return false;
	}

	// calculate intersection point
	var ab = Adp.Vec3.create( b[0] - a[0], b[1] - a[1], b[2] - a[2] );
	var hiritu = Math.abs(dot_pa) / ( Math.abs(dot_pa) + Math.abs(dot_pb) );
	out[0] = a[0] + (ab[0] * hiritu);
	out[1] = a[1] + (ab[1] * hiritu);
	out[2] = a[2] + (ab[2] * hiritu);

	return polygonVertices.length == 3 * 3 ? 
			this.existPointInPolygon3(polygonVertices, out) : this.existPointInPolygon4(polygonVertices, out);
}
///
/// intersect polygon and point
///
Intersect.existPointInPolygon3 = function existPointInPolygon3(
	polygonVertices,
	point)
{
	// polygon position
	var position = Util.convertArraySingle2Vec3(polygonVertices);
	// store a cross result
	var c1 = Adp.Vec3.create();
	var c2 = Adp.Vec3.create();
	var c3 = Adp.Vec3.create();
	// store a vector
	var a = position[0];
	var b = position[1];
	var c = position[2];
	var p = point;
	var ac = Adp.Vec3.create();
	var cp = Adp.Vec3.create();
	var cb = Adp.Vec3.create();
	var bp = Adp.Vec3.create();
	var ba = Adp.Vec3.create();
	var ap = Adp.Vec3.create();

	Adp.Vec3.subtract(ac, c, a);
	Adp.Vec3.subtract(cp, p, c);
	Adp.Vec3.subtract(cb, b, c);
	Adp.Vec3.subtract(bp, p, b);
	Adp.Vec3.subtract(ba, a, b);
	Adp.Vec3.subtract(ap, p, a);
	Adp.Vec3.cross(c1, ac, cp);
	Adp.Vec3.cross(c2, cb, bp);
	Adp.Vec3.cross(c3, ba, ap);
	var d1 = Adp.Vec3.dot(c1, c2);
	var d2 = Adp.Vec3.dot(c2, c3);
	return d1 > 0 && d2 > 0;
}
///
/// intersect polygon 4vector and point
///
Intersect.existPointInPolygon4 = function existPointInPolygon4(
	polygonVertices,
	point)
{
	// polygon position
	var position = Util.convertArraySingle2Vec3(polygonVertices);
	// store a cross result
	var c1 = Adp.Vec3.create();
	var c2 = Adp.Vec3.create();
	var c3 = Adp.Vec3.create();
	var c4 = Adp.Vec3.create();
	// store a vector
	var a = position[0];
	var b = position[1];
	var c = position[2];
	var d = position[3];
	var p = point;
	var ac = Adp.Vec3.create();
	var cp = Adp.Vec3.create();
	var cb = Adp.Vec3.create();
	var bp = Adp.Vec3.create();
	var ba = Adp.Vec3.create();
	var ap = Adp.Vec3.create();
	// 4
	var bd = Adp.Vec3.create();
	var dp = Adp.Vec3.create();
	var dc = Adp.Vec3.create();

	Adp.Vec3.subtract(ac, c, a);
	Adp.Vec3.subtract(cp, p, c);
	Adp.Vec3.subtract(cb, b, c);
	Adp.Vec3.subtract(bp, p, b);
	Adp.Vec3.subtract(ba, a, b);
	Adp.Vec3.subtract(ap, p, a);
	Adp.Vec3.subtract(bd, d, b);
	Adp.Vec3.subtract(dp, p, d);
	Adp.Vec3.subtract(dc, c, d);
	// once
	Adp.Vec3.cross(c1, ac, cp);
	Adp.Vec3.cross(c2, cb, bp);
	Adp.Vec3.cross(c3, ba, ap);
	var d1 = Adp.Vec3.dot(c1, c2);
	var d2 = Adp.Vec3.dot(c2, c3);
	if (d1 > 0 && d2 > 0) {
		return true;
	}
	// // second
	Adp.Vec3.cross(c1, dc, cp);
	// Adp.Vec3.cross(c2, cb, bp);
	Adp.Vec3.cross(c3, bd, dp);
	var d1 = Adp.Vec3.dot(c1, c2);
	var d2 = Adp.Vec3.dot(c2, c3);
	if (d1 > 0 && d2 > 0) {
		return true;
	}

	return false
}
///
/// calculate near point on plane
///
Intersect.nearPointOnPlane = function nearPointOnPlane(
	out,
	point,
	plainPoint,
	plainNormal)
{
	// plain's arbitrary point to target point
    var pa = Adp.Vec3.create(
    	point[0] - plainPoint[0],
    	point[1] - plainPoint[1],
    	point[2] - plainPoint[2]);
    
    // calculate dot product of plain's normal and pa
    // exists a target point in forward direction, d > 0
    // or reverse direction, d < 0
    var d = Adp.Vec3.dot(pa, plainNormal);

    // calculate near point on plain
    out[0] = point[0] - ( plainNormal[0] * d );
    out[1] = point[1] - ( plainNormal[1] * d );
    out[2] = point[2] - ( plainNormal[2] * d );
    return out;
}