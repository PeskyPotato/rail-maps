import json
import argparse
import os

def iterate_ids(line_file, name, start, end):
    lines = []
    name = name
    stations = []

    for s_id in range (start, end+1):
        stations.append(f'{s_id:05d}')


    lines.append({
        "l_name": name,
        "stations": stations
    })
    print(stations)
    with open(os.path.join(line_file, "lines.json"), "w") as f:
        json.dump(lines, f)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("name")
    parser.add_argument("location")
    parser.add_argument("start", type=int)
    parser.add_argument("end", type=int)
    args = parser.parse_args()

    name = args.name
    location = os.path.abspath(args.location)
    start = args.start
    end = args.end

    iterate_ids(location, name, start, end)
