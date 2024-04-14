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
                selector: '.RE13',
                style: {
                    'line-color': 'red'
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
                    'text-rotation': 0,
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
});
