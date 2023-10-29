document.addEventListener('DOMContentLoaded', async function () {
    async function get_stations() {
        const response = fetch('./stations.json?nocache=123');
        return (await response).json();
    }
    async function get_lines() {
        const response = fetch('./lines.json?nocache=123');
        return (await response).json();
    }

    var raw_stations = await get_stations();
    console.log(raw_stations)
    var lines = await get_lines();
    console.log(lines);
	var cy = window.cy = cytoscape({
		container: document.getElementById('cy'),

		style: [
            {
                selector: '.50',
                style: {
                    'line-color': '#298e37'
                }
            },
            {
                selector: '.51',
                style: {
                    'line-color': '#f7981d'
                }
            },
            {
                selector: '.52',
                style: {
                    'line-color': '#00a1e3'
                }
            },
            {
                selector: '.53',
                style: {
                    'line-color': '#cd0d40'
                }
            },
            {
                selector: '.54',
                style: {
                    'line-color': '#e5c103'
                }
            },
			{
				selector: 'core',
				style: {
					'active-bg-opacity': 0
				}
			},
			{
				selector: 'node',
				style: {
					'content': 'data(s_name)',
                    'shape': 'square',
					'background-color': 'white',
                    'border-color': 'black',
                    'border-width': 1,
					'width': 28,
					'height': 28,
                    'text-halign': 'left',
                    'font-size': 36,
                    'color': 'white'
				}
			},
			{
				selector: 'edge',
				style: {
                    'label': 'data(label)',
                    'color': 'white',
                    'font-size': 24,
                    'width': 7,
                    'control-point-step-size': 20,
					'curve-style': 'bezier'
				}
			},
		],

		elements: {
			nodes: raw_stations
		},

		layout: {
			name: 'preset'
		}
	});

    cy.on('tap', 'node', function (evt) {
         console.log(evt.target.id())
    });

	var i = 0;
    for (var line of lines) {
        var stations = [];
        var current_station;
        var next_station;
        for (var i = 0; i < line.stations.length-1; i++) {
            stations = line.stations;
            current_station = stations[i];
            next_station = stations[i+1];
           if ((i == line.stations.length-2) | (i == 0)) {
                cy.add({
                    data: {
                        id: line.l_name + current_station + next_station,
                        source: current_station,
                        target: next_station,
                        label: line.l_name
                    },
                    classes: line.l_name
                });
            } else {
                cy.add({
                    data: {
                        id: line.l_name + current_station + next_station,
                        source: current_station,
                        target: next_station,
                        label: ''
                    },
                    classes: line.l_name
            })
     
            }
        }
    }

    var right_nodes = [
        "[s_name = 'Nieuwmarkt']", "[s_name = 'Waterlooplein']",
        "[s_name = 'Weesperplein']", "[s_name = 'Wibautstraat']",
        "[s_name = 'Amsterdam Amstel']", "[s_name = 'Spaklerweg']",
        "[s_name = 'Station Holendrecht']", "[s_name = 'Reigersbos']",
        "[s_name = 'Gein']"
    ]
    for (var n_selector of right_nodes) {
        var n = cy.elements(n_selector)
        n.style('text-halign', 'right')
    }
    var bottom_nodes = [
        "[s_name = 'Station RAI']", "[s_name = 'Overamstel']",
        "[s_name = 'Van der Madeweg']", "[s_name = 'Amstelveenseweg']",
        "[s_name = 'Duivendrecht']", "[s_name = 'Strandvliet']",
        "[s_name = 'Bijlmer ArenA']",  "[s_name = 'Bullewijk']"
    ]
    for (var n_selector of bottom_nodes) {
        var n = cy.elements(n_selector)
        console.log(n)
        n.style('text-halign', 'left')
        n.style('text-valign', 'bottom')
    }
});
