define(["backbone", "underscore", "d3"], function(Backbone, _, d3) {

    return Backbone.View.extend({
        id: 'vis',
        initialize: function () {
            var self = this;

            self.vis = d3.select(this.el);
            self.servicesCollection = self.options.services;
            self.servicesData = self.servicesCollection.models;
            self.modulesCollection = self.collection;
            self.modulesData = self.modulesCollection.models;
            self.linksCollection = self.options.links;
            self.linksDataC = self.linksCollection.models;

            console.log(self.servicesCollection.length);

            self.config = {
                w: 960,
                h: 600,
                fill: d3.scale.category10()
            };

console.log("1-1-1");
self.linksData = new Array();
var loop = 0;
self.linksDataC.forEach(function(conn) {
if (self.servicesCollection.where({ id: conn.attributes.source })[0] != undefined && self.servicesCollection.where({ id: conn.attributes.target })[0] != undefined) {
self.linksData.push({
                source: self.servicesCollection.where({
                    id: conn.attributes.source
                })[0],
                target: self.servicesCollection.where({
                    id: conn.attributes.target
                })[0]
	});
}
});
console.log(self.linksData);
//self.linksData = new Array();
//self.linksData.push(asdf);
//console.log(self.linksData[0].source);
//console.log(self.linksData[0].target);
/*
            self.linksData =
            [{
                source: self.modulesCollection.where({
                    name: "Login"
                })[0],
                target: self.servicesCollection.where({
                    name: "getUsage"
                })[0]
            }];
console.log(self.linksData);
*/


            self.monitor = self.vis.append("svg:svg")
                .attr("width", self.config.w)
                .attr("height", self.config.h);
 // 		.append("svg:g")
//	   .attr("transform", "translate(" + self.config.w / 4 + "," + self.config.h / 3 + ")");



            self.force = d3.layout.force()
                .nodes(_.union(self.modulesData, self.servicesData))
    .gravity(0.06)
    .charge(-150)
    .linkDistance(40)

//                .links([{source: 0, target: 3}])
//                .gravity(.01)
//                .distance(5)
                .size([self.config.w, self.config.h])
//                .charge(-10)





            window.force = self.force;


        },
//        getModulePositionX: function(d) {
//          return d.get("id") * 100;
//        },
//        getModulePositionY: function(d) {
//            return d.get("id") * 100;
//        },
        getName: function(d) {
            return d.get("name")
        },
        renderServices: function() {

            var self = this;

            console.log(self.servicesData);
            self.services = self.monitor.selectAll(".service")
                .data(self.servicesData)
                .enter()
                .append("g")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", 50)
                .call(self.force.drag);


            self.services
                .append("rect")
                .attr("class", "service")
                .attr("width", 20)
                .attr("height", 10)
//                .attr("y", function(d, i) { return (i+1) * 5 })
                .style("fill", "white")
                .style("stroke", "blue")
                .style("stroke-width", 5);

            self.services
                .append("text")
//                .attr("y", function(d, i) { return (i+1) * 5 + 25 })
                .text(function(d){ return d.get("name")})


        },
        renderModules: function() {

            var self = this;



            self.modules = self.monitor.selectAll(".node")
                .data(self.modulesData)
                .enter().append("g")
                .attr("class", "node")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", 150)
                .call(self.force.drag);



            self.modules
                .append("svg:circle")
                .attr("class", "node")
                .attr("r", 50)
                .style("fill", function(d, i) { return self.config.fill(i & 3); })
                .style("stroke", function(d, i) { return d3.rgb(self.config.fill(i & 3)).darker(2); })
                .style("stroke-width", 1.5);

            self.modules
                .append("text")
                .text(function(d) {return d.get("name");})


            self.modules
                .on("mouseover", function(e) {
                    self.monitor.selectAll("circle")
                        .attr("opacity", 0.5)
                        .select(function(d) {
                           return d.index === e.index ? this : null;
                        })
                        .attr("opacity", 1)
                        .transition()
                        .duration(200)
//                        .attr("r", 150)
                        .style("stroke-width", 3);

                    self.services
                        .select(function(d) {
                            return d.name === e.service ? this : null;
                        })
                        .transition()
                        .duration(500)
                        .attr("r", 200);


                })
                .on("mouseout", function(e) {
                    self.monitor.selectAll("circle")
                        .attr("opacity", 1)
                        .select(function(d) {
                            return d.index === e.index ? this : null;
                        })
                        .transition()
                        .duration(200)
                        .style("stroke-width", 1.5);
                });

            self.monitor.style("opacity", 1e-6)
                .transition()
                .duration(1000)
                .style("opacity", 1);


        },
        render: function() {
            var self = this;



            self.renderServices();
            self.renderModules();
            self.links = self.monitor.selectAll("line")
                .data(self.linksData, function(d) { return d.target.id; })
    .enter().append("svg:line");

//                .data(self.linksData, function(d) { return d.target.id; });
/*
  self.links.enter().insert("svg:line", ".node")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
*/

  // Exit any old links.
//  self.links.exit().remove();

            self.force
//                .links(self.linksData)
//                .linkStrength(0)
                .start();


/*
            self.links = self.monitor.selectAll("line")
                .data(self.linksData)
                .enter().append("line")
                .attr("fill", "#000000")
                .attr("x1", function(d) { console.log(d.source.x); return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) {  console.log(d.target.x);return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
*/
//
            self.force.on("tick", function(e) {
                self.modules.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                self.services.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  self.links.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

            });

            d3.select("body").on("click", function() {
                self.modules.forEach(function(o, i) {
                    o.x += (Math.random() - .5) * 40;
                    o.y += (Math.random() - .5) * 40;
                });
                self.force.resume();
            });

        }
    });

});
