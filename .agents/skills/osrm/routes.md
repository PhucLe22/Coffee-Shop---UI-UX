# OSRM Route API

Fetches real driving directions from the OSRM API

## Route Service

Finds the fastest route between coordinates in the supplied order.

**Endpoint:**
`GET /route/v1/{profile}/{coordinates}?alternatives={true|false|number}&steps={true|false}&geometries={polyline|polyline6|geojson}&overview={full|simplified|false}&annotations={true|false}`

### Service Options

In addition to the general options, the following options are supported for this service:

| Option | Values | Description |
| :--- | :--- | :--- |
| **alternatives** | true, false (default), or Number | Search for alternative routes. Passing a number `alternatives=n` searches for up to `n` alternative routes. |
| **steps** | true, false (default) | Returned route steps for each route leg. |
| **annotations** | true, false (default), nodes, distance, duration, datasources, weight, speed | Returns additional metadata for each coordinate along the route geometry. |
| **geometries** | polyline (default), polyline6, geojson | Returned route geometry format (influences overview and per step). |
| **overview** | simplified (default), full, false, by_legs | Add overview geometry either full, simplified according to highest zoom level it could be displayed on, not at all, or split by leg. |
| **continue_straight** | default (default), true, false | Forces the route to keep going straight at waypoints, constraining u-turns there even if it would be faster. Default value depends on the profile. |
| **waypoints** | {index};{index};{index}... | Treats input coordinates indicated by given indices as waypoints in returned Match object. Default is to treat all input coordinates as waypoints. |

> Please note that even if alternative routes are requested, a result cannot be guaranteed.

## Response

- **code**: If the request was successful, `Ok`; otherwise, see the service-dependent and general status codes.
- **waypoints**: Array of Waypoint objects representing all waypoints in order.
- **routes**: An array of Route objects, ordered by descending recommendation rank.

### Error Codes

In case of error, the following codes are supported in addition to the general ones:

| Type | Description |
| :--- | :--- |
| **NoRoute** | No route found. |

All other properties might be undefined.
