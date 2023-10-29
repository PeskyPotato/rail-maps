document.addEventListener('DOMContentLoaded', async function () {
    async function get_stations() {
        const response = fetch('./stations.json');
        return (await response).json();
    }
    async function get_lines() {
        const response = fetch('./lines.json');
        return (await response).json();
    }

    var raw_stations = await get_stations();
    var lines = await get_lines();
    console.log(lines);
	var cy = window.cy = cytoscape({
		container: document.getElementById('cy'),

		style: [
            {
                selector: '.ETCS',
                style: {
                    'line-color': 'red'
                }
            },
            {
                selector: '.TPWS',
                style: {
                    'line-color': 'green'
                }
            },
            {
                selector: '.CBTC',
                style: {
                    'line-color': 'orange',
                    'text-rotation': 1,
                    'text-halign': 'left'
                }
            },
            {
                selector: "[s_name = 'Paddington']",
                style: {
                    'text-halign': 'left',
                    'text-rotation': 1
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
					'background-color': 'white',
                    'border-color': 'black',
                    'border-width': 1,
					'width': 7,
					'height': 7,
                    'text-rotation': -1,
                    'text-halign': 'right',
                    'font-size': 8
				}
			},
			{
				selector: 'edge',
				style: {
                    'width': 5,
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

    var bottom_nodes = [
        "[s_name = 'Custom House']", "[s_name = 'Canary Wharf']",
        "[s_name = 'Heathrow Terminal 5']", "[s_name = 'Heathrow Terminal 4']"
    ]
    for (var n_selector of bottom_nodes) {
        var n = cy.elements(n_selector)
        n.style('text-halign', 'left')
        n.style('text-valign', 'bottom')
    }
    var center_nodes = [
        "[s_name = 'Heathrow Terminals 2 & 3']"
    ]
    for (var n_selector of center_nodes) {
        var n = cy.elements(n_selector)
        n.style('text-rotation', 0)
        n.style('text-halign', 'right')
    }
});
