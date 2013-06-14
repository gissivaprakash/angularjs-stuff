'use strict';

var gasvizApp = angular.module('gasvizApp');

gasvizApp.controller('MainCtrl', function ($scope) {

    var loadingFiles = 5;
    $scope.year = '';
    $scope.value = '';

    $scope.options = {
        co2: true,
        nox: true,
        met: true,
        other: true,
        detail: true,
        iso2: 'ES',
        year_min: 1980,
        year_max: 2009
    };

    $scope.source = {
        co2: [],
        nox: [],
        met: [],
        other: [],
        iso2: []
    };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.setData = function (data) {
        $scope.data = data;
    };

    $scope.processData = function () {
        console.log('processing...');
        var tmp = {};
        var data = [];
        var parseDate = function (d) {
            var date = '' + d + '0101';
            return d3.time.format("%Y%m%d").parse(date);
        };

        for (var i = $scope.options.year_min; i <= $scope.options.year_max; i++) {
            tmp[i] = {};
        }

        //co2 data
        if ($scope.options.co2) {
            $scope.source.co2.forEach(function (element) {
                var iso2 = element['?iso2_str'];
                var age = element['?age'];
                if (iso2 === $scope.options.iso2 && age >= $scope.options.year_min && age <= $scope.options.year_max) {
                    var value = element['?val_str'];
                    value = parseFloat(value).toFixed(2);
                    if (value != undefined) {
                        tmp[age].co2 = value;
                    }
                }
            });
            console.log('tmp-co2');
        }

        //nox data
        if ($scope.options.nox) {
            $scope.source.nox.forEach(function (element) {
                var iso2 = element['?iso2_str'];
                var age = element['?age'];
                if (iso2 === $scope.options.iso2 && age >= $scope.options.year_min && age <= $scope.options.year_max) {
                    var value = element['?val_str'];
                    value = parseFloat(value).toFixed(2);
                    if (value != undefined) {
                        tmp[age].nox = value;
                    }
                }
            });
            console.log('tmp-nox');
        }

        //met data
        if ($scope.options.met) {
            $scope.source.met.forEach(function (element) {
                var iso2 = element['?iso2_str'];
                var age = element['?age'];
                if (iso2 === $scope.options.iso2 && age >= $scope.options.year_min && age <= $scope.options.year_max) {
                    var value = element['?val_str'];
                    value = parseFloat(value).toFixed(2);
                    if (value != undefined) {
                        tmp[age].met = value;
                    }
                }
            });
            console.log('tmp-met');
        }

        //other data
        if ($scope.options.other) {
            $scope.source.other.forEach(function (element) {
                var iso2 = element['?iso2_str'];
                var age = element['?age'];
                if (iso2 === $scope.options.iso2 && age >= $scope.options.year_min && age <= $scope.options.year_max) {
                    var value = element['?val_str'];
                    value = parseFloat(value).toFixed(2);
                    if (value != undefined) {
                        tmp[age].other = value;
                    }
                }
            });
            console.log('tmp-other');
        }



        //mix gas data
        //        console.log(tmp);
        for (var i = $scope.options.year_min; i <= $scope.options.year_max; i++) {
            var o = {
                year: parseDate(i),
                co2: tmp[i].co2,
                nox: tmp[i].nox,
                met: tmp[i].met,
                other: tmp[i].other
            };

            if (o != {
                year: i
            }) {
                data.push(o);
            }
        }

        $scope.safeApply(function () {
            $scope.setData(data);
        });
        console.log('data', $scope.data);
    }


    var loadCo2 = function () {
        console.log('flag co2 %s', $scope.options.co2);
        d3.tsv("co2.tsv", function (error, data) {
            if (error) {
                data = [];
                console.error('Error co2 : %o', data);
            }
            $scope.source.co2 = data;
            console.log('co2 %o', $scope.source.co2);
            --loadingFiles;
            if (loadingFiles <= 0) {
                $scope.processData();
            }
        });
    };


    var loadNox = function () {
        console.log('flag nox %s', $scope.options.nox);
        d3.tsv("nox.tsv", function (error, data) {
            if (error) {
                data = [];
                console.error('Error nox : %o', data);
            }
            $scope.source.nox = data;
            console.log('nox %o', $scope.source.nox);
            --loadingFiles;
            if (loadingFiles <= 0) {
                $scope.processData();
            }
        });
    };

    var loadMet = function () {
        console.log('flag met %s', $scope.options.met);
        d3.tsv("met.tsv", function (error, data) {
            if (error) {
                data = [];
                console.error('Error met : %o', data);
            }
            $scope.source.met = data;
            console.log('met %o', $scope.source.met);
            --loadingFiles;
            if (loadingFiles <= 0) {
                $scope.processData();
            }
        });
    };

    var loadOther = function () {
        console.log('flag other %s', $scope.options.other);
        d3.tsv("other.tsv", function (error, data) {
            if (error) {
                data = [];
                console.error('Error other : %o', data);
            }
            $scope.source.other = data;
            console.log('other %o', $scope.source.other);
            --loadingFiles;
            if (loadingFiles <= 0) {
                $scope.processData();
            }
        });
    };

    var loadIso2 = function () {
        d3.tsv("iso2.tsv", function (error, data) {
            if (error) {
                data = [];
                console.error('Error iso2 : %o', data);
            }
            console.log(data[23]);

            var aux = data.map(function (element) {
                return element['iso2_str'];
            }).sort();

            $scope.source.iso2 = aux;
            console.log('iso2 %o', $scope.source.iso2);
            --loadingFiles;
            if (loadingFiles <= 0) {
                $scope.processData();
            }
        });
    };

    loadCo2();
    loadIso2();
    loadNox();
    loadMet();
    loadOther();
});

gasvizApp.directive('ghVisualization', function () {
    var createSVG, updateGraph, visualization;

    var margin = {
        top: 30,
        right: 100,
        bottom: 40,
        left: 70
    },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");

    var line = d3.svg.line().interpolate("monotone").x(function (d) {
        return x(d.year);
    }).y(function (d) {
        return y(d.value);
    });

    createSVG = function (scope, element) {
        if (!(scope.svg != null)) {
            return scope.svg = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }
    };

    updateGraph = function (newVal, oldVal, scope) {
        console.log('new %o', newVal);
        console.log('old %o', oldVal);

        visualization.selectAll('*').remove();

        if (newVal === oldVal) {
            return;
        }

        color.domain(d3.keys(newVal[0]).filter(function (key) {
            return key !== "year";
        }));

        var gases = [];
        color.domain().forEach(function (name) {
            var gas = {};
            gas.name = name;
            gas.values = [];

            newVal.forEach(function (element) {
                var emission = {
                    year: element.year,
                    value: +element[name]
                };
                if (element[name] != undefined) {
                    gas.values.push(emission);
                } else {
                    console.log('undef');
                }
            });


            if (gas.values.length != 0) {
                gases.push(gas);
            }
            console.log('gas vacío');
        });

        console.log('gases %o', gases);

        x.domain(d3.extent(newVal, function (d) {
            return d.year;
        }));

        y.domain([d3.min(gases, function (c) {
                var last = Number.MAX_VALUE;
                return d3.min(c.values, function (v) {
                    if (v.value === undefined) {
                        return last;
                    } else {
                        last = v.value;
                        return v.value;
                    }
                });
            }),
            d3.max(gases, function (c) {
                var last = Number.MIN_VALUE;
                return d3.max(c.values, function (v) {
                    if (v.value === undefined) {
                        return last;
                    } else {
                        last = v.value;
                        return v.value;
                    }
                });
            })
        ]);

        scope.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        scope.svg.append("g").attr("class", "y axis").call(yAxis).append("text")
            .attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em")
            .style("text-anchor", "end").text("Emisiones (kt)");

        var gas = scope.svg.selectAll(".gas").data(gases).enter().append("g").attr("class", "gas");

        gas.append("path").attr("class", "line").attr("d", function (d) {
            return line(d.values);
        }).style("stroke", function (d) {
            return color(d.name);
        });

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        gases.forEach(function (element) {
            var points = scope.svg.selectAll(".point")
                .data(element.values)
                .enter().append("svg:circle")
                .attr("stroke", "black")
                .attr("fill", function (d, i) {
                return "white"
            }).attr("cx", function (d, i) {
                //                console.log(d);
                //                console.log(i);
                return x(d.year)
            }).attr("cy", function (d, i) {
                //                console.log(d);
                //                console.log(i);
                return y(d.value)
            }).attr("r", function (d, i) {
                return 3
            }).style("opacity", 2).on("mouseover", onmouseover)
                .on("mouseout", onmouseout);
        });

        gas.append("text").datum(function (d) {
            var aux = {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
            return aux;
        }).attr("transform", function (d) {
            return "translate(" + x(d.value.year) + "," + y(d.value.value) + ")";
        }).attr("x", 3)
            .attr("dy", ".35em")
            .text(function (d) {
            return d.name;
        });

        var formatTime = d3.time.format("%Y");

        function onmouseover(d, i) {
            //            console.log(d);
            //            console.log(i);
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(formatTime(d.year) + "<br/>" + d.value + ' kt')
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }

        function onmouseout(d, i) {
            //            console.log(d);
            //            console.log(i);
            div.transition()
                .duration(500)
                .style("opacity", 0);
        }

    };
    ///////////////////////////

    return {
        restrict: 'E',
        scope: {
            val: '='
        },
        link: function (scope, element, attrs) {
            visualization = createSVG(scope, element);
            return scope.$watch('val', updateGraph, true);
        }
    };
});