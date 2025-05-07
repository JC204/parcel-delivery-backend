import { Parcel } from './types';

export const demoParcels: Parcel[] = [
  {
    "tracking_number": "TRKDEMO001",
    "sender": {
      "name": "Clark Kent",
      "email": "clark.kent@example.com",
      "phone": "555-6174",
      "address": "934 Hero Lane"
    },
    "recipient": {
      "name": "Lois Lane",
      "email": "lois.lane@example.com",
      "phone": "555-5144",
      "address": "493 Justice Ave"
    },
    "courier_id": "CR620",
    "courier_name": "Courier 1",
    "status": "delivered",
    "estimated_delivery": "2025-05-12T14:40:30.904502",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-05T14:40:30.904526",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO002",
    "sender": {
      "name": "Peter Parker",
      "email": "peter.parker@example.com",
      "phone": "555-4525",
      "address": "342 Hero Lane"
    },
    "recipient": {
      "name": "Mary Jane Watson",
      "email": "mary.jane.watson@example.com",
      "phone": "555-2459",
      "address": "985 Justice Ave"
    },
    "courier_id": "CR956",
    "courier_name": "Courier 6",
    "status": "in transit",
    "estimated_delivery": "2025-05-09T14:40:30.904546",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904550",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO003",
    "sender": {
      "name": "Bruce Wayne",
      "email": "bruce.wayne@example.com",
      "phone": "555-3766",
      "address": "756 Hero Lane"
    },
    "recipient": {
      "name": "Selina Kyle",
      "email": "selina.kyle@example.com",
      "phone": "555-3304",
      "address": "973 Justice Ave"
    },
    "courier_id": "CR668",
    "courier_name": "Courier 7",
    "status": "shipped",
    "estimated_delivery": "2025-05-11T14:40:30.904561",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-05T14:40:30.904564",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO004",
    "sender": {
      "name": "Tony Stark",
      "email": "tony.stark@example.com",
      "phone": "555-1566",
      "address": "238 Hero Lane"
    },
    "recipient": {
      "name": "Pepper Potts",
      "email": "pepper.potts@example.com",
      "phone": "555-7591",
      "address": "678 Justice Ave"
    },
    "courier_id": "CR395",
    "courier_name": "Courier 7",
    "status": "in transit",
    "estimated_delivery": "2025-05-09T14:40:30.904576",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904581",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO005",
    "sender": {
      "name": "Steve Rogers",
      "email": "steve.rogers@example.com",
      "phone": "555-9875",
      "address": "191 Hero Lane"
    },
    "recipient": {
      "name": "Sharon Carter",
      "email": "sharon.carter@example.com",
      "phone": "555-9485",
      "address": "404 Justice Ave"
    },
    "courier_id": "CR316",
    "courier_name": "Courier 3",
    "status": "delivered",
    "estimated_delivery": "2025-05-09T14:40:30.904599",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904604",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO006",
    "sender": {
      "name": "Diana Prince",
      "email": "diana.prince@example.com",
      "phone": "555-3453",
      "address": "759 Hero Lane"
    },
    "recipient": {
      "name": "Steve Trevor",
      "email": "steve.trevor@example.com",
      "phone": "555-8742",
      "address": "419 Justice Ave"
    },
    "courier_id": "CR881",
    "courier_name": "Courier 10",
    "status": "shipped",
    "estimated_delivery": "2025-05-11T14:40:30.904621",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904626",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO007",
    "sender": {
      "name": "Barry Allen",
      "email": "barry.allen@example.com",
      "phone": "555-3258",
      "address": "671 Hero Lane"
    },
    "recipient": {
      "name": "Iris West",
      "email": "iris.west@example.com",
      "phone": "555-1489",
      "address": "114 Justice Ave"
    },
    "courier_id": "CR558",
    "courier_name": "Courier 10",
    "status": "in transit",
    "estimated_delivery": "2025-05-12T14:40:30.904641",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-05T14:40:30.904647",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO008",
    "sender": {
      "name": "Arthur Curry",
      "email": "arthur.curry@example.com",
      "phone": "555-7993",
      "address": "786 Hero Lane"
    },
    "recipient": {
      "name": "Mera",
      "email": "mera@example.com",
      "phone": "555-1846",
      "address": "113 Justice Ave"
    },
    "courier_id": "CR833",
    "courier_name": "Courier 5",
    "status": "delivered",
    "estimated_delivery": "2025-05-12T14:40:30.904665",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-05T14:40:30.904669",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO009",
    "sender": {
      "name": "Scott Lang",
      "email": "scott.lang@example.com",
      "phone": "555-5845",
      "address": "158 Hero Lane"
    },
    "recipient": {
      "name": "Hope Van Dyne",
      "email": "hope.van.dyne@example.com",
      "phone": "555-6294",
      "address": "286 Justice Ave"
    },
    "courier_id": "CR419",
    "courier_name": "Courier 5",
    "status": "in transit",
    "estimated_delivery": "2025-05-12T14:40:30.904681",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904685",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO010",
    "sender": {
      "name": "T'Challa",
      "email": "t'challa@example.com",
      "phone": "555-6235",
      "address": "315 Hero Lane"
    },
    "recipient": {
      "name": "Nakia",
      "email": "nakia@example.com",
      "phone": "555-1898",
      "address": "639 Justice Ave"
    },
    "courier_id": "CR119",
    "courier_name": "Courier 10",
    "status": "shipped",
    "estimated_delivery": "2025-05-09T14:40:30.904695",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904698",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO011",
    "sender": {
      "name": "Wanda Maximoff",
      "email": "wanda.maximoff@example.com",
      "phone": "555-2306",
      "address": "620 Hero Lane"
    },
    "recipient": {
      "name": "Vision",
      "email": "vision@example.com",
      "phone": "555-5631",
      "address": "742 Justice Ave"
    },
    "courier_id": "CR834",
    "courier_name": "Courier 1",
    "status": "in transit",
    "estimated_delivery": "2025-05-11T14:40:30.904712",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904721",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO012",
    "sender": {
      "name": "Stephen Strange",
      "email": "stephen.strange@example.com",
      "phone": "555-8396",
      "address": "562 Hero Lane"
    },
    "recipient": {
      "name": "Christine Palmer",
      "email": "christine.palmer@example.com",
      "phone": "555-5885",
      "address": "456 Justice Ave"
    },
    "courier_id": "CR939",
    "courier_name": "Courier 6",
    "status": "delivered",
    "estimated_delivery": "2025-05-12T14:40:30.904735",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904738",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO013",
    "sender": {
      "name": "Natasha Romanoff",
      "email": "natasha.romanoff@example.com",
      "phone": "555-6477",
      "address": "528 Hero Lane"
    },
    "recipient": {
      "name": "Yelena Belova",
      "email": "yelena.belova@example.com",
      "phone": "555-9754",
      "address": "502 Justice Ave"
    },
    "courier_id": "CR107",
    "courier_name": "Courier 2",
    "status": "delivered",
    "estimated_delivery": "2025-05-11T14:40:30.904749",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904752",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO014",
    "sender": {
      "name": "Matt Murdock",
      "email": "matt.murdock@example.com",
      "phone": "555-2481",
      "address": "724 Hero Lane"
    },
    "recipient": {
      "name": "Karen Page",
      "email": "karen.page@example.com",
      "phone": "555-5992",
      "address": "421 Justice Ave"
    },
    "courier_id": "CR435",
    "courier_name": "Courier 10",
    "status": "delivered",
    "estimated_delivery": "2025-05-08T14:40:30.904761",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904764",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO015",
    "sender": {
      "name": "Wade Wilson",
      "email": "wade.wilson@example.com",
      "phone": "555-9494",
      "address": "836 Hero Lane"
    },
    "recipient": {
      "name": "Vanessa Carlysle",
      "email": "vanessa.carlysle@example.com",
      "phone": "555-5540",
      "address": "237 Justice Ave"
    },
    "courier_id": "CR461",
    "courier_name": "Courier 4",
    "status": "shipped",
    "estimated_delivery": "2025-05-09T14:40:30.904773",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904776",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO016",
    "sender": {
      "name": "Logan",
      "email": "logan@example.com",
      "phone": "555-1390",
      "address": "644 Hero Lane"
    },
    "recipient": {
      "name": "Jean Grey",
      "email": "jean.grey@example.com",
      "phone": "555-7026",
      "address": "889 Justice Ave"
    },
    "courier_id": "CR361",
    "courier_name": "Courier 10",
    "status": "shipped",
    "estimated_delivery": "2025-05-08T14:40:30.904787",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904790",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO017",
    "sender": {
      "name": "Charles Xavier",
      "email": "charles.xavier@example.com",
      "phone": "555-1342",
      "address": "985 Hero Lane"
    },
    "recipient": {
      "name": "Moira MacTaggert",
      "email": "moira.mactaggert@example.com",
      "phone": "555-5671",
      "address": "181 Justice Ave"
    },
    "courier_id": "CR606",
    "courier_name": "Courier 10",
    "status": "in transit",
    "estimated_delivery": "2025-05-11T14:40:30.904799",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-04T14:40:30.904802",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO018",
    "sender": {
      "name": "Erik Lehnsherr",
      "email": "erik.lehnsherr@example.com",
      "phone": "555-8166",
      "address": "453 Hero Lane"
    },
    "recipient": {
      "name": "Raven Darkh\u00f6lme",
      "email": "raven.darkh\u00f6lme@example.com",
      "phone": "555-1904",
      "address": "142 Justice Ave"
    },
    "courier_id": "CR851",
    "courier_name": "Courier 9",
    "status": "in transit",
    "estimated_delivery": "2025-05-10T14:40:30.904816",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-05T14:40:30.904820",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO019",
    "sender": {
      "name": "Hank Pym",
      "email": "hank.pym@example.com",
      "phone": "555-9899",
      "address": "619 Hero Lane"
    },
    "recipient": {
      "name": "Janet Van Dyne",
      "email": "janet.van.dyne@example.com",
      "phone": "555-7691",
      "address": "374 Justice Ave"
    },
    "courier_id": "CR767",
    "courier_name": "Courier 9",
    "status": "in transit",
    "estimated_delivery": "2025-05-10T14:40:30.904837",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904842",
        "description": "Parcel has been shipped"
      }
    ]
  },
  {
    "tracking_number": "TRKDEMO020",
    "sender": {
      "name": "Reed Richards",
      "email": "reed.richards@example.com",
      "phone": "555-8386",
      "address": "725 Hero Lane"
    },
    "recipient": {
      "name": "Sue Storm",
      "email": "sue.storm@example.com",
      "phone": "555-8640",
      "address": "468 Justice Ave"
    },
    "courier_id": "CR501",
    "courier_name": "Courier 4",
    "status": "delivered",
    "estimated_delivery": "2025-05-12T14:40:30.904855",
    "tracking_history": [
      {
        "status": "shipped",
        "location": "Origin Facility",
        "timestamp": "2025-05-06T14:40:30.904858",
        "description": "Parcel has been shipped"
      }
    ]
  }
];