var response = {"parse": [["show", {"s1": "", "v": {"f": {"arg": [{"s1": "", "v": {"a": [{"s1": "", "v": {"f": {"arg": [{"s1": "", "v": {"f": {"arg": [], "name": "x"}}, "s2": ""}, {"s1": "", "v": {"f": {"arg": [], "name": "y"}}, "s2": ""}, {"s1": "", "v": {"o": [["title", {"s1": "", "v": {"tag": "Pstring", "contents": "MesNotes"}, "s2": ""}], ["color", {"s1": "", "v": {"tag": "Pstring", "contents": "blue"}, "s2": ""}]]}, "s2": ""}], "name": "plotLine"}}, "s2": ""}, {"s1": "", "v": {"f": {"arg": [{"s1": "", "v": {"a": [{"s1": "", "v": {"f": {"arg": [], "name": "x"}}, "s2": ""}, {"s1": "", "v": {"f": {"arg": [], "name": "y"}}, "s2": ""}]}, "s2": ""}, {"s1": "", "v": {"o": [["col", {"s1": "", "v": {"a": [{"s1": "", "v": {"tag": "Pstring", "contents": "X"}, "s2": ""}, {"s1": "", "v": {"tag": "Pstring", "contents": "Note"}, "s2": ""}]}, "s2": ""}]]}, "s2": ""}], "name": "table"}}, "s2": ""}]}, "s2": ""}], "name": "show"}}, "s2": "\n"}], ["moyenne", {"s1": "", "v": {"a": [{"s1": "", "v": {"a": [{"s1": "", "v": {"f": {"arg": [{"s1": "", "v": {"f": {"arg": [], "name": "y"}}, "s2": ""}], "name": "mean"}}, "s2": ""}]}, "s2": ""}]}, "s2": "\n"}], ["x", {"s1": "", "v": {"a": [{"s1": "", "v": {"tag": "Pnum", "contents": 1}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 2}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 3}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 4}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 5}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 6}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 7}, "s2": ""}]}, "s2": "\n"}], ["y", {"s1": "", "v": {"a": [{"s1": "", "v": {"tag": "Pnum", "contents": 0.25}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 0.72}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 0.82}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 0.53}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 0.75}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 0.8}, "s2": ""}, {"s1": "", "v": {"tag": "Pnum", "contents": 0.85}, "s2": ""}]}, "s2": ""}]], "eval": {"statut": "ok", "res": [{"type": "graph", "x": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0], "y": [0.25, 0.72, 0.82, 0.53, 0.75, 0.8, 0.85], "p": {"title": "MesNotes", "color": "blue"}}, {"type": "table", "data": [[1.0, 0.25], [2.0, 0.72], [3.0, 0.82], [4.0, 0.53], [5.0, 0.75], [6.0, 0.8], [7.0, 0.85]], "p": {"col": ["X", "Note"]}}], "stack": ["Equation \"show\"", "Array Open", "Equation \"x\"", "Array Open", "Equation \"y\"", "Array Open", "Array Open", "Array Open", "Array Open", "Array Open"]}};
$.mockjax({
  url: 'getCalcResult/*',
  responseTime: 1,
  responseText: {
    status: 'success',
    data: response
  },
});