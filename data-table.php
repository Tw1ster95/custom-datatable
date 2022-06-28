<?php
    $conn = new mysqli('localhost','root', '', 'dbname');
    if(!$conn) exit;

    $page = $conn->real_escape_string($_POST['page'] ?? 0);
    $limit = $conn->real_escape_string($_POST['limit'] ?? 20);
    $sort = $conn->real_escape_string($_POST['sort'] ?? NULL);
    $offset = $limit * $page;

    $qColumns = [ "cmod.cmodel_id", "cmod.cmodel_name", "cmake.cmake_name" ];
    $qFrom = "car_models as cmod";
    $qJoin = "INNER JOIN car_makes as cmake ON cmake.cmake_id = cmod.cmodel_make_id";
    $qWhere = "";
    $qLimit = "LIMIT $offset, $limit;";
    $qSelect = implode(', ', $qColumns);
    $qCountRows = "(SELECT COUNT(*) FROM $qFrom $qWhere) as total_rows";

    $result = $conn->query("SELECT $qSelect, $qCountRows FROM $qFrom $qJoin $qWhere $qLimit");

    $rData = $result->fetch_all(MYSQLI_BOTH);

    $output = array();
    for($a = 0; $a < count($rData); $a++) {
        $row = array();
        for($i = 0; $i < count($qColumns); $i++) {
            if($qColumns[$i] == "expo_users_ID") {
                array_push($row, "<div color='red'>{$rData[$a][$i]}</div>");
            }
            else {
                array_push($row, $rData[$a][$i]);
            }
        }
        array_push($output, $row);
    }

    echo json_encode(array([
        'data' => $output,
        'total_rows' => $rData[0]['total_rows']
    ]));
    exit;