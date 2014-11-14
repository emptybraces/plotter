//
// Polygon constructor
//
function Polygon(vertices, normal)
{
	Util.assert(vertices.length == 3 * 3 
		   || vertices.length == 3 * 4, "vertices is not three or four.");
	this.vertices = vertices;
	this.normal = typeof normal !== 'undefined' ? normal : Util.calculateNormal(vertices);
	this.vertexCount = vertices.length == 3 * 3 ? 3 : 4;
}
//
// methods
//
Polygon.prototype.getVertices = function getVertices()
{
	return this.vertices;
}
Polygon.prototype.getNormal = function getNormal()
{
	return this.normal;
}
Polygon.prototype.getVertexCount = function getVertexCount()
{
	return this.vertexCount;
}
