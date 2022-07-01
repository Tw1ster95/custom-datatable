<?php
    // Change Here

    $qColumns = [ "id", "name", "email" ];
    $qFrom = "test_table";
    $qJoin = "";
    $qWhere = "";

    // Stop changing here

    $config = include_once 'config.php';
    $conn = new mysqli($config['host'], $config['name'], $config['pass'], $config['db']);
    if(!$conn) exit;

    $page = $conn->real_escape_string($_POST['page'] ?? 0);
    $limit = $conn->real_escape_string($_POST['limit'] ?? 20);
    $orderby = $conn->real_escape_string($_POST['orderby'] ?? 0);
    $order_direction = $conn->real_escape_string($_POST['order_direction'] ?? 'ASC');
    $offset = $limit * $page;

    $qLimit = "LIMIT $offset, $limit;";
    $qSelect = implode(', ', $qColumns);
    $qCountRows = "(SELECT COUNT(*) FROM $qFrom $qWhere) as total_rows";
    $qOrderBy = "ORDER BY {$qColumns[$orderby]} $order_direction";

    $result = $conn->query("SELECT $qSelect, $qCountRows FROM $qFrom $qJoin $qWhere $qOrderBy $qLimit");

    $rData = $result->fetch_all(MYSQLI_BOTH);

    $output = array();
    for($a = 0; $a < count($rData); $a++) {
        $row = array();
        for($i = 0; $i < count($qColumns); $i++)
            array_push($row, $rData[$a][$i]);
        array_push($output, $row);
    }

    echo json_encode(array([
        'data' => $output,
        'total_rows' => ($rData[0]['total_rows'] ?? 0)
    ]));
    exit;